import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const REMOTE_MCP_URL =
  process.env.ALAI_MCP_URL || "https://slides-api.getalai.com/mcp/";
const API_KEY = process.env.ALAI_API_KEY || process.env.api_key || "";

function createRemoteHeaders() {
  if (!API_KEY) {
    return {};
  }

  return {
    "api-key": API_KEY,
    Authorization: `Bearer ${API_KEY}`,
  };
}

async function callRemoteTool(name, args) {
  const client = new Client(
    { name: "alai-mcp-wrapper", version: "1.0.2" },
    { capabilities: {} },
  );
  const transport = new StreamableHTTPClientTransport(new URL(REMOTE_MCP_URL), {
    requestInit: {
      headers: createRemoteHeaders(),
    },
  });

  try {
    await client.connect(transport);
    return await client.callTool({
      name,
      arguments: args,
    });
  } finally {
    await transport.close().catch(() => {});
    await client.close().catch(() => {});
  }
}

function authGuidance() {
  return API_KEY
    ? null
    : "Set ALAI_API_KEY or api_key to forward tool calls to the hosted Alai MCP endpoint. Tool introspection works without credentials.";
}

function normalizeError(error) {
  const message =
    error instanceof Error ? error.message : "Unknown upstream error";

  return {
    content: [
      {
        type: "text",
        text: `Alai upstream request failed: ${message}`,
      },
      ...(authGuidance()
        ? [
            {
              type: "text",
              text: authGuidance(),
            },
          ]
        : []),
    ],
    isError: true,
  };
}

const basePresentationInput = {
  title: z
    .string()
    .min(1)
    .optional()
    .describe("Presentation title shown in the deck and exports."),
  theme_id: z
    .string()
    .optional()
    .describe("Theme identifier from get_themes. Use this to control layout family."),
  vibe_id: z
    .string()
    .optional()
    .describe("Visual style identifier from get_vibes. Use only after discovering valid IDs."),
  language: z
    .string()
    .optional()
    .describe("Presentation language, for example English or Spanish."),
  export_formats: z
    .array(z.enum(["link", "pdf", "ppt"]))
    .optional()
    .describe("Formats to generate when the deck is ready."),
};

function registerTools(server) {
  server.registerTool(
    "ping",
    {
      description:
        "Verify the configured Alai credentials and return account identity details. Use this first when you need to confirm authentication before creating or exporting presentations.",
      inputSchema: {},
    },
    async () => {
      try {
        return await callRemoteTool("ping", {});
      } catch (error) {
        return normalizeError(error);
      }
    },
  );

  server.registerTool(
    "generate_presentation",
    {
      description:
        "Create a new presentation from raw text or markdown. Use this to turn notes, outlines, meeting summaries, or draft content into an Alai deck before polling get_generation_status.",
      inputSchema: {
        input_text: z
          .string()
          .min(1)
          .describe("The source content to transform into slides."),
        ...basePresentationInput,
        slide_range: z
          .string()
          .optional()
          .describe("Requested slide count range such as 2-5."),
        include_ai_images: z
          .boolean()
          .optional()
          .describe("Whether Alai should generate image content for slides."),
        num_creative_variants: z
          .number()
          .int()
          .min(0)
          .max(2)
          .optional()
          .describe("How many creative variants to generate per slide."),
        total_variants_per_slide: z
          .number()
          .int()
          .min(1)
          .max(4)
          .optional()
          .describe("Total variant count to generate for each slide."),
        image_ids: z
          .array(z.string())
          .optional()
          .describe("Existing uploaded image identifiers to reuse in the deck."),
      },
    },
    async (args) => {
      try {
        return await callRemoteTool("generate_presentation", args);
      } catch (error) {
        return normalizeError(error);
      }
    },
  );

  server.registerTool(
    "get_generation_status",
    {
      description:
        "Check the status of an asynchronous presentation generation job. Use this after generate_presentation until the status reaches completed or failed.",
      inputSchema: {
        generation_id: z
          .string()
          .min(1)
          .describe("Generation job identifier returned by generate_presentation."),
      },
    },
    async (args) => {
      try {
        return await callRemoteTool("get_generation_status", args);
      } catch (error) {
        return normalizeError(error);
      }
    },
  );

  server.registerTool(
    "get_themes",
    {
      description:
        "List themes available to the authenticated account. Call this before generate_presentation when you need valid theme_id values.",
      inputSchema: {},
    },
    async () => {
      try {
        return await callRemoteTool("get_themes", {});
      } catch (error) {
        return normalizeError(error);
      }
    },
  );

  server.registerTool(
    "get_vibes",
    {
      description:
        "List available vibe identifiers that control the visual style of generated decks. Use this before setting vibe_id on generate_presentation or create_slide.",
      inputSchema: {},
    },
    async () => {
      try {
        return await callRemoteTool("get_vibes", {});
      } catch (error) {
        return normalizeError(error);
      }
    },
  );

  server.registerTool(
    "get_presentations",
    {
      description:
        "List presentations owned by the authenticated user. Use this when you need to pick an existing presentation_id before editing, exporting, or deleting.",
      inputSchema: {},
    },
    async () => {
      try {
        return await callRemoteTool("get_presentations", {});
      } catch (error) {
        return normalizeError(error);
      }
    },
  );

  server.registerTool(
    "create_slide",
    {
      description:
        "Add a new slide to an existing presentation. Use this for targeted edits after a deck already exists, including classic content slides or more creative visually led slides.",
      inputSchema: {
        presentation_id: z
          .string()
          .min(1)
          .describe("Target presentation that will receive the new slide."),
        prompt: z
          .string()
          .min(1)
          .describe("Instruction describing the content or intent of the new slide."),
        slide_type: z
          .enum(["classic", "creative"])
          .optional()
          .describe("Choose classic for structured content or creative for more visual exploration."),
        insert_after_slide_id: z
          .string()
          .optional()
          .describe("Existing slide identifier after which the new slide should be inserted."),
        theme_id: z
          .string()
          .optional()
          .describe("Optional theme override for the new slide."),
        vibe_id: z
          .string()
          .optional()
          .describe("Optional vibe override for the new slide."),
      },
    },
    async (args) => {
      try {
        return await callRemoteTool("create_slide", args);
      } catch (error) {
        return normalizeError(error);
      }
    },
  );

  server.registerTool(
    "delete_slide",
    {
      description:
        "Remove a slide from a presentation permanently. Use this only when you know the exact slide identifier to delete.",
      inputSchema: {
        presentation_id: z
          .string()
          .min(1)
          .describe("Presentation that owns the slide."),
        slide_id: z
          .string()
          .min(1)
          .describe("Slide identifier to remove from the presentation."),
      },
    },
    async (args) => {
      try {
        return await callRemoteTool("delete_slide", args);
      } catch (error) {
        return normalizeError(error);
      }
    },
  );

  server.registerTool(
    "export_presentation",
    {
      description:
        "Export a finished presentation to PDF, PowerPoint, or a shareable link. Use this after generation or editing when you need a deliverable artifact.",
      inputSchema: {
        presentation_id: z
          .string()
          .min(1)
          .describe("Presentation to export."),
        formats: z
          .array(z.enum(["pdf", "ppt", "link"]))
          .min(1)
          .describe("One or more export formats to generate."),
      },
    },
    async (args) => {
      try {
        return await callRemoteTool("export_presentation", args);
      } catch (error) {
        return normalizeError(error);
      }
    },
  );

  server.registerTool(
    "generate_transcripts",
    {
      description:
        "Generate speaker notes or transcripts for slides in an existing presentation. Use this when the deck visuals are ready and you need talking points for delivery.",
      inputSchema: {
        presentation_id: z
          .string()
          .min(1)
          .describe("Presentation whose slides need speaker notes."),
        slide_ids: z
          .array(z.string())
          .optional()
          .describe("Optional subset of slide identifiers to process."),
      },
    },
    async (args) => {
      try {
        return await callRemoteTool("generate_transcripts", args);
      } catch (error) {
        return normalizeError(error);
      }
    },
  );

  server.registerTool(
    "delete_presentation",
    {
      description:
        "Delete a presentation permanently. Use this destructive action only when the caller explicitly intends to remove the deck.",
      inputSchema: {
        presentation_id: z
          .string()
          .min(1)
          .describe("Presentation identifier to delete permanently."),
      },
    },
    async (args) => {
      try {
        return await callRemoteTool("delete_presentation", args);
      } catch (error) {
        return normalizeError(error);
      }
    },
  );
}

async function main() {
  const server = new McpServer(
    {
      name: "com.getalai/presentations",
      version: "1.0.2",
    },
    {
      capabilities: {
        logging: {},
      },
    },
  );

  registerTools(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal MCP server error:", error);
  process.exit(1);
});

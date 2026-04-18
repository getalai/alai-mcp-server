# Alai - AI Presentation Maker MCP Server

[![Alai MCP server](https://glama.ai/mcp/servers/getalai/Alai/badges/card.svg)](https://glama.ai/mcp/servers/getalai/Alai)

AI presentation maker and slide generator for Claude, Cursor, and MCP clients. Create designer-level presentations, pitch decks, and slides from text. Export to PowerPoint (PPTX) and PDF.

## What is Alai?

Alai is an **AI presentation maker** and the fastest way to create high-quality, beautiful slides without design skills.

- **Generate slides from text** - Turn notes, markdown, URLs, or documents into polished presentations
- **Beautify existing slides** - Restyle and improve your PowerPoint presentations with AI
- **Export anywhere** - Download as PowerPoint (PPTX), PDF, or shareable link
- **Professional themes** - Designer-level templates for any occasion
- **Speaker notes** - AI-generated talking points for each slide
- **Nano Banana Pro Image Slides** - Theme-aware image slide generation that matches your deck's visual style
- **Edit and iterate** - Make targeted changes to text, icons, and images on existing slides

## Use Cases

- **Pitch decks** - Create investor-ready presentations from your notes
- **Sales presentations** - Generate compelling slides for prospects
- **Meeting notes to slides** - Transform your notes into shareable decks
- **PowerPoint beautification** - Restyle existing slides with professional themes
- **Marketing presentations** - Build product and campaign decks quickly

## Features

- Generate designer-level presentations from text, markdown, or meeting notes
- AI-powered slide beautification and restyling
- Export to PowerPoint (PPTX) or PDF
- Professional pitch deck themes
- Add and remove slides from existing presentations
- Edit and iterate on existing slides with targeted prompts
- Generate speaker notes automatically

## Server URL

```
https://slides-api.getalai.com/mcp/
```

## Authentication

The server accepts either a static API key or an OAuth 2.1 bearer token on the same endpoint.

### API Key

Get a key from [getalai.com](https://getalai.com) and pass it in one of these headers:

- `api-key: sk_your_key`
- `Authorization: Bearer sk_your_key`

### OAuth 2.1 with Dynamic Client Registration

The server implements RFC 9728 Protected Resource Metadata and delegates authorization to Supabase, which supports RFC 7591 Dynamic Client Registration and PKCE (S256). Spec-compliant MCP clients (e.g. Claude Desktop, MCP Inspector) can auto-discover the flow:

```
GET https://slides-api.getalai.com/.well-known/oauth-protected-resource
```

The response's `authorization_servers` entry points at the Supabase authorization server, whose `/.well-known/oauth-authorization-server` document advertises the `registration_endpoint`, `authorization_endpoint`, and `token_endpoint`. After the authorization code + PKCE flow, the client sends `Authorization: Bearer <jwt>` to the MCP endpoint.

## Available Tools

| Tool | Description |
|------|-------------|
| `ping` | Verify your API key and return your user ID |
| `generate_presentation` | Create a presentation from text content |
| `get_generation_status` | Check async operation status |
| `get_themes` | List themes available to the authenticated user |
| `get_vibes` | List vibes (visual styles) available to the authenticated user |
| `get_presentations` | List all your presentations |
| `create_slide` | Add a slide (classic or creative) to an existing presentation |
| `delete_slide` | Remove a slide from a presentation |
| `export_presentation` | Export to PDF, PPTX, or shareable link |
| `generate_transcripts` | Generate speaker notes for slides |
| `delete_presentation` | Permanently delete a presentation |

## Workflow

1. Call `generate_presentation` with your content
2. Poll `get_generation_status` every 2-5 seconds until status is `completed`
3. Use the returned `presentation_id` for further operations

## Example Usage

### Generate a Presentation

Call `get_themes` and `get_vibes` first to discover the IDs available to your account, then pass them in:

```json
{
  "input_text": "Benefits of AI in the workplace: increased productivity, enhanced creativity, improved efficiency",
  "title": "AI in the Workplace",
  "theme_id": "<id from get_themes>",
  "vibe_id": "<id from get_vibes>",
  "slide_range": "2-5",
  "include_ai_images": true,
  "num_creative_variants": 1,
  "total_variants_per_slide": 1,
  "image_ids": [],
  "export_formats": ["link"],
  "language": "English"
}
```

Only `input_text` is required. `num_creative_variants` must be 0–2 (set to ≥1 when using `vibe_id`). `total_variants_per_slide` must be 1–4. `export_formats` accepts `"link"`, `"pdf"`, `"ppt"`.

### Check Generation Status

```json
{
  "generation_id": "abc123-def456"
}
```

### Export Presentation

```json
{
  "presentation_id": "xyz789",
  "formats": ["pdf", "link"]
}
```

## Available Themes

Call `get_themes` to discover the themes available to your account (returns theme IDs and display names). A handful of built-in legacy theme names you can pass directly as `theme_id`:

- `AURORA_FLUX`
- `MIDNIGHT_EMBER`
- `EMERALD_FOREST`
- `DESERT_BLOOM`
- `DONUT`
- `OAK`
- `PRISMATICA`
- `SIMPLE_LIGHT`
- `SIMPLE_DARK`
- `CYBERPUNK`

## Configuration

### For Claude Desktop / MCP Clients

```json
{
  "mcpServers": {
    "alai-presentations": {
      "url": "https://slides-api.getalai.com/mcp/",
      "transport": "streamable-http",
      "headers": {
        "api-key": "sk_your_api_key"
      }
    }
  }
}
```

## Links

- [Website](https://getalai.com)
- [Get API Key](https://app.getalai.com)
- [API Documentation](https://docs.getalai.com/api)

## License

MIT License - See [LICENSE](LICENSE) file for details.

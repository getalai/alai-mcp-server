# Alai Presentations MCP Server

AI-powered presentation generation API. Create beautiful presentations from text, manage slides, and export to multiple formats.

## Server URL

```
https://slides-api.getalai.com/mcp/
```

## Authentication

Requires an API key from [getalai.com](https://getalai.com).

Pass via header:
- `api-key: sk_your_key`
- `Authorization: Bearer sk_your_key`

## Features

- Generate presentations from text, markdown, or notes
- Add and remove slides from existing presentations
- Export to PDF, PPTX, or shareable link
- Generate speaker notes automatically
- 12 professional themes to choose from

## Available Tools

| Tool | Description |
|------|-------------|
| `ping` | Verify your API key and return your user ID |
| `generate_presentation` | Create a presentation from text content |
| `get_generation_status` | Check async operation status |
| `get_presentations` | List all your presentations |
| `create_slide` | Add a slide to an existing presentation |
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

```json
{
  "input_text": "Benefits of AI in the workplace: increased productivity, enhanced creativity, improved efficiency",
  "title": "AI in the Workplace",
  "theme_id": "NEBULA_DARK",
  "slide_range": "2-5"
}
```

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

- AMETHYST_LIGHT
- NEBULA_DARK
- FLAT_WHITE
- DESERT_BLOOM
- LAPIS_DAWN
- EMERALD_FOREST
- COSMIC_THREAD
- DONUT
- OAK
- OBSIDIAN_FLOW
- MIDNIGHT_EMBER
- AURORA_FLUX

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

Proprietary - See [getalai.com](https://getalai.com) for terms of service.

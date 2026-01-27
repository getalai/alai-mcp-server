# Alai - AI Presentation Maker MCP Server

AI presentation maker and slide generator for Claude, Cursor, and MCP clients. Create designer-level presentations, pitch decks, and slides from text. Export to PowerPoint (PPTX) and PDF.

## What is Alai?

Alai is an **AI presentation maker** trained on 1000+ pitch decks and professional presentations. It's the fastest way to create beautiful slides without design skills.

- **Generate slides from text** - Turn notes, markdown, URLs, or documents into polished presentations
- **Beautify existing slides** - Restyle and improve your PowerPoint presentations with AI
- **Export anywhere** - Download as PowerPoint (PPTX), PDF, or shareable link
- **12 professional themes** - Designer-level templates for any occasion
- **Speaker notes** - AI-generated talking points for each slide

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
- Generate speaker notes automatically

## Server URL

```
https://slides-api.getalai.com/mcp/
```

## Authentication

Requires an API key from [getalai.com](https://getalai.com).

Pass via header:
- `api-key: sk_your_key`
- `Authorization: Bearer sk_your_key`

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

MIT License - See [LICENSE](LICENSE) file for details.

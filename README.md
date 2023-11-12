# Parrot 🦜 - Version 0.1

## Overview
**Parrot** is a Chrome extension that streamlines the note-taking process during work calls. It captures audio, transcribes it using OpenAI's Whisper model, and uses GPT-3 to generate concise notes, which are then uploaded to a specified Notion page.

---

## Installation

### Steps:
1. **Download**: Get Parrot (version 0.1) from the Chrome Web Store or the provided source.
2. **Unzip**: Extract the downloaded file.
3. **Load in Chrome**:
    - Navigate to `chrome://extensions/`.
    - Enable "Developer mode" in the top-right corner.
    - Click "Load unpacked" and select the unzipped extension folder.

---

## Configuration

### Creating the Configuration File
Create a `config.json` file in the extension's root directory.

```json
{
    "notionSecret": "<Your Notion Secret>",
    "existingPageId": "<Notion Page ID>",
    "openAIKey": "<Your OpenAI API Key>",
    "gptPrompt": "<Custom GPT Prompt (optional)>"
}
```

### Generating an OpenAI Key
1. Visit [OpenAI API website](https://beta.openai.com/signup/).
2. Navigate to the API section and create a new API key.
3. Copy this key and paste it into your `config.json` file for the `openAIKey` field.

### Generating a Notion Key
1. Log in to [Notion](https://www.notion.so/).
2. Access "Settings & Members" > "Integrations".
3. Create a new integration and copy the token.
4. Paste this token into your `config.json` as the `notionSecret`.

---

## Usage

- **Start Recording**: Click the Parrot icon in your browser when you're on a call.
- **Stop and Upload**: Click again to stop the recording and upload the notes to Notion.

---

## Feedback and Support

For any feedback, issues, or support, please [contact us](mailto:support@parrot-extension.com) or visit our [GitHub repository](https://github.com/Parrot-Extension).

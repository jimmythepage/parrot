Parrot - Version 0.1 🦜
Description 📝
Parrot is a Chrome extension designed to streamline your note-taking process during work calls. It captures audio from a Chrome tab, transcribes it using OpenAI's Whisper model, and then employs GPT-3 to generate concise notes. These notes, along with the transcriptions, are then conveniently uploaded to a specified page in Notion. Parrot is ideal for professionals who need to maintain accurate records of meetings and calls while focusing on the conversation.

How to Use 🚀
Installation
plaintext
Copy code
1. Download Parrot (version 0.1) from the Chrome Web Store or the provided source.
2. Unzip the downloaded file.
3. In Chrome, navigate to `chrome://extensions/`.
4. Enable "Developer mode" in the top-right corner.
5. Click "Load unpacked" and select the unzipped extension folder.
Creating the Configuration File
Create a config.json file in the extension's root directory:

json
Copy code
{
    "notionSecret": "<Your Notion Secret>",
    "existingPageId": "<Notion Page ID>",
    "openAIKey": "<Your OpenAI API Key>",
    "gptPrompt": "<Custom GPT Prompt (optional)>"
}
Generating an OpenAI Key
Follow these steps to generate your OpenAI API key:

Go to the OpenAI API website.
Navigate to the API section and create a new API key.
Copy this key and paste it into config.json.
Generating a Notion Key
Steps to generate a Notion integration token:

Log in to Notion.
Go to "Settings & Members" > "Integrations".
Create a new integration and copy the token.
Using Parrot
Start Recording: Click the Parrot icon in your browser when you're on a call.
Stop and Upload: Click again to stop and upload the notes to Notion.

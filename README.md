Parrot - Version 0.1
Description
Parrot is a Chrome extension designed to streamline your note-taking process during work calls. It captures audio from a Chrome tab, transcribes it using OpenAI's Whisper model, and then employs GPT-3 to generate concise notes. These notes, along with the transcriptions, are then conveniently uploaded to a specified page in Notion. Parrot is ideal for professionals who need to maintain accurate records of meetings and calls while focusing on the conversation.

How to Use Parrot
Installation
Download Parrot (version 0.1) from the Chrome Web Store or the provided source.
Unzip the downloaded file.
In Chrome, navigate to chrome://extensions/.
Enable "Developer mode" in the top-right corner.
Click "Load unpacked" and select the unzipped extension folder.
Creating the Configuration File
Before using Parrot, create a config.json file in the extension's root directory with the following structure:

json
Copy code
{
    "notionSecret": "<Your Notion Secret>",
    "existingPageId": "<Notion Page ID where you want to save notes>",
    "openAIKey": "<Your OpenAI API Key>",
    "gptPrompt": "<Custom GPT Prompt for note generation (optional)>"
}
Replace the placeholders with your actual information.

Generating an OpenAI Key
Go to the OpenAI API website and sign up or log in.
Navigate to the API section and create a new API key.
Copy this key and paste it into your config.json file for the openAIKey field.
Generating a Notion Key
Log in to Notion.
Go to "Settings & Members" and select "Integrations".
Create a new integration and copy the internal integration token.
Paste this token in your config.json file as the notionSecret.
Adding Connections to the Needed Notion Page
Find the ID of the Notion page where you want to store your notes and transcriptions.
To find a page's ID, open the page in Notion and look at the URL; the ID is the string after 'notion.so/' and before the next '/'. It should look something like 2f06e839d71e4500b31a792f95310623.
Place this ID in the config.json file as existingPageId.
Using Parrot
With Parrot installed and configured, navigate to a Chrome tab where you'll have an audio call.
Click on the Parrot icon in your browser to start recording.
Once the call is finished, stop the recording through the extension. Parrot will transcribe the audio, generate notes using GPT-3, and upload both to the specified Notion page.

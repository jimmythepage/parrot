// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.target === 'offscreen') {
    switch (message.type) {
      case 'start-recording':
        startRecording(message.data);
        break;
      case 'stop-recording':
        stopRecording();
        break;
      default:
        throw new Error('Unrecognized message:', message.type);
    }
  }
});

let recorder;
let data = [];

const notionSecret = 'secret';
const existingPageId = 'pageid';
const OPENAI_KEY="sk-secretkey"
const GPT_PROMPT="Please read this transcript from a work call and generate a brief recap and extract action points. Do not write anything else, no introductions, no greetings, just the recap and the action points."

async function startRecording(streamId) {
  const currentDate = new Date().toLocaleString('en-US', { timeZone: 'UTC' });
  const transcript_title="Transcript "+ currentDate;
  if (recorder?.state === 'recording') {
    throw new Error('Called startRecording while recording is in progress.');
  }

  const media = await navigator.mediaDevices.getUserMedia({
    audio: {
      mandatory: {
        chromeMediaSource: 'tab',
        chromeMediaSourceId: streamId
      }
    }
  });

  // Continue to play the captured audio to the user.
  const output = new AudioContext();
  const source = output.createMediaStreamSource(media);
  source.connect(output.destination);

  // Start recording.
  recorder = new MediaRecorder(media, { mimeType: 'audio/webm' });
  recorder.ondataavailable = (event) => data.push(event.data);
  recorder.onstop = () => {
    const blob = new Blob(data, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
  
    // Create a new anchor element
    const a = document.createElement('a');
    
    // Set the href and download attributes for the anchor element
    a.href = url;
    a.download = transcript_title+'.webm'; // You can name the file here
    
    // Append the anchor to the document
    document.body.appendChild(a);
    
    // Trigger a click on the anchor to start download
    a.click();
    
    // Clean up by removing the anchor element and revoking the blob URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("Audio blob saved");

    // Step 1: Convert Blob to File
    const audioFile = new File([blob], "audio.webm", { type: 'audio/webm' });

    console.log("Audio file prepared");

    // Step 2: Prepare FormData
    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("model","whisper-1");
    formData.append("language","en");

    console.log("Form data prepared");

    // Step 3: Set up HTTP Request
    const whisperAPIEndpoint = "https://api.openai.com/v1/audio/transcriptions";
    fetch(whisperAPIEndpoint, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + OPENAI_KEY
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Step 4: Handle Response
        console.log("Transcription: ", data.text); // Display or process the transcription
        askGPTRecap(transcript_title,data.text);
    })
    .catch(error => {
        console.error("Error: ", error);
    });


    // Clear state ready for next recording
    recorder = undefined;
    data = [];
  };
  recorder.start();

  // Record the current state in the URL. This provides a very low-bandwidth
  // way of communicating with the service worker (the service worker can check
  // the URL of the document and see the current recording state). We can't
  // store that directly in the service worker as it may be terminated while
  // recording is in progress. We could write it to storage but that slightly
  // increases the risk of things getting out of sync.
  window.location.hash = 'recording';
}

async function stopRecording() {
  recorder.stop();

  // Stopping the tracks makes sure the recording icon in the tab is removed.
  recorder.stream.getTracks().forEach((t) => t.stop());

  // Update current state in URL
  window.location.hash = '';

  // Note: In a real extension, you would want to write the recording to a more
  // permanent location (e.g IndexedDB) and then close the offscreen document,
  // to avoid keeping a document around unnecessarily. Here we avoid that to
  // make sure the browser keeps the Object URL we create (see above) and to
  // keep the sample fairly simple to follow.
}

async function askGPTRecap(transcript_title,transcript)
{
  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ OPENAI_KEY
    },
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "system",
          "content": GPT_PROMPT
        },
        {
          "role": "user",
          "content": transcript
        }
      ]
    })
  })
  .then(response => response.json())
  .then(data => 
    {
      console.log(data);
      let notes = data.choices[0].message.content;
      pushToNotion(transcript_title,transcript,notes);
    })
  .catch(error => console.error('Error:', error));
}

async function pushToNotion(transcript_title,transcript,notes) {

  // Example of creating a new page in Notion
  fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${notionSecret}`,
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({ 
      "parent": { "page_id": existingPageId},
      "properties": {
        "title": {
          "title": [{ "type": "text", "text": { "content": transcript_title } }]
        }
      },
      "children": [
        {
          "object": "block",
          "type": "heading_1",
          "heading_1": {
            "rich_text": [{ "type": "text", "text": { "content": "Transcript" } }]
          }
        },
        {
          "object": "block",
          "type": "paragraph",
          "paragraph": {
            "rich_text": [{ "type": "text", "text": { "content": transcript } }]
          }
        },
        {
          "object": "block",
          "type": "heading_1",
          "heading_1": {
            "rich_text": [{ "type": "text", "text": { "content": "Notes" } }]
          }
        },
        {
          "object": "block",
          "type": "paragraph",
          "paragraph": {
            "rich_text": [{ "type": "text", "text": { "content": notes } }]
          }
        }
      ]
    })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
}



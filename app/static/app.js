const submitTextBtn = document.getElementById('submitTextBtn');
const recordBtn = document.getElementById('recordBtn');
const manualInput = document.getElementById('manualInput');
const actionItemsText = document.getElementById('actionItemsText');
const audioUpload = document.getElementById('audioUpload');

// --- 0. THE UPLOAD AUDIO BUTTON LOGIC ---
audioUpload.addEventListener('change', async () => {
    const file = audioUpload.files[0];
    if (!file) return;

    actionItemsText.innerText = "🎧 Transcribing your audio... Please wait...";

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.text && data.text.startsWith("Transcription Error")) {
            actionItemsText.innerText = data.text;
            return;
        }

        manualInput.value = data.text; // show the transcript in the textbox too
        sendToBackend(data.text);
    } catch (error) {
        actionItemsText.innerText = "Connection error while transcribing. Ensure your server is running.";
    }
});

// --- 1. THE TEXT BUTTON LOGIC ---
submitTextBtn.addEventListener('click', () => {
    const text = manualInput.value.trim();
    if (text) {
        sendToBackend(text);
    }
});

// --- 2. THE SPEAK NOW BUTTON LOGIC ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Perfectly tuned for Indian English accents!

    recognition.onstart = () => {
        recordBtn.innerHTML = "🔴 Listening...";
        // Turns red to let you know it's recording
        recordBtn.style.background = "linear-gradient(135deg, #ef4444, #f87171)";
    };

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        manualInput.value = text; // Automatically drops your spoken words into the box!
        sendToBackend(text);
    };

    recognition.onerror = () => resetMicButton();
    recognition.onend = () => resetMicButton();
}

recordBtn.addEventListener('click', () => {
    if (recognition) {
        try {
            recognition.start();
        } catch (e) {
            console.log("Already listening.");
        }
    } else {
        alert("Your browser doesn't support the mic. Please type your notes!");
    }
});

function resetMicButton() {
    recordBtn.innerHTML = "🎙️ Speak Now";
    // Resets back to the beautiful purple color
    recordBtn.style.background = "linear-gradient(135deg, #a78bfa, #818cf8)"; 
}

// --- 3. THE BACKEND CONNECTION ---
async function sendToBackend(text) {
    actionItemsText.innerText = "🧠 Organizing your schedule... Please wait...";
    
    try {
        const response = await fetch('/api/organize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });
        
        const data = await response.json();
        // Displays the AI response perfectly
        actionItemsText.innerHTML = data.action_items.replace(/\n/g, '<br>');
    } catch (error) {
        actionItemsText.innerText = "Connection error. Ensure your Python server is running.";
    }
}
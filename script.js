// List of sound files present in the "sounds" directory.
const soundFiles = [
  { name: "applause", file: "sounds/applause.mp3" },
  { name: "boo", file: "sounds/boo.mp3" },
  { name: "gasp",  file: "sounds/gasp.mp3" },
  { name: "ta-da", file: "sounds/tada.mp3" },
  { name: "victory", file: "sounds/victory.mp3" },
  { name: "wrong", file: "sounds/wrong.mp3" }
];

// Variable to hold the currently playing Audio object.
let currentAudio = null;

/**
 * Stops the currently playing audio and removes it from the DOM.
 */
function stopAll() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    
    // FIX: Remove the element from the DOM
    currentAudio.remove(); 
    
    currentAudio = null;
  }
}

/**
 * Plays a specific sound file, stopping any current playback first.
 * @param {string} file - The path to the audio file.
 */
function playSound(file) {
  stopAll(); // Stop any currently playing sound

  // Create a new Audio object for the selected file
  currentAudio = new Audio(file);
  currentAudio.volume = 1.0;

  // FIX: Append the audio element to the DOM so testing tools (like Cypress) can find it.
  currentAudio.classList.add('playing-audio-element');
  document.body.appendChild(currentAudio);

  currentAudio.addEventListener("ended", () => {
    // FIX: Cleanup by removing the element from the DOM when finished
    if (currentAudio) {
      currentAudio.remove();
      currentAudio = null;
    }
  });

  // Start playback
  currentAudio.play().catch((err) => {
    console.error("Playback failed:", err);
  });
}

/**
 * Dynamically creates the sound buttons and attaches click listeners.
 */
function initButtons() {
  const container = document.getElementById("buttons");
  if (!container) return;

  // Create a button for each sound
  soundFiles.forEach((s) => {
    if (!s.file) return;

    const btn = document.createElement("button");
    // Instruction requirement: class name as 'btn'
    btn.className = "btn";
    // Capitalize the first letter for better display
    btn.textContent = s.name.charAt(0).toUpperCase() + s.name.slice(1); 
    btn.dataset.sound = s.file;

    // Attach click handler
    btn.addEventListener("click", () => playSound(s.file));
    container.appendChild(btn);
  });
}

/**
 * Wires up the click event for the dedicated Stop button.
 */
function initStopButton() {
  const stopBtn = document.getElementById("stopBtn");
  if (stopBtn) {
    stopBtn.addEventListener("click", stopAll);
  }
}

// Initialize everything after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  initButtons();
  initStopButton();
});
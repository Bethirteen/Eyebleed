const hoverSound = new Audio("Assets/audio/fnafgroan.mp3");
const bgMusic = new Audio("Assets/audio/bgaudio.mp3");

hoverSound.preload = "auto";
bgMusic.preload = "auto";
bgMusic.loop = true;

const continueButton = document.getElementById("continue");
const landingView = document.getElementById("landing-view");
const mainView = document.getElementById("main-view");

const musicToggle = document.getElementById("music-toggle");
const gifIcon = document.getElementById("gif-icon");

// Hover Tracking Mechanisms
continueButton.addEventListener("mouseenter", () => {
  hoverSound.loop = true;
  hoverSound.currentTime = 0;
  hoverSound.play().catch(() => {});
});

continueButton.addEventListener("mouseleave", () => {
  hoverSound.loop = false;
  hoverSound.pause();
  hoverSound.currentTime = 0;
});

// Click Event Transition Execution Switch
continueButton.addEventListener("click", () => {
  hoverSound.loop = false;
  hoverSound.pause();
  hoverSound.currentTime = 0;

  landingView.classList.add("hidden");
  mainView.classList.remove("hidden");

  bgMusic.play().catch((err) => console.error("Audio playback failure:", err));
});

// Runtime Audio Switch Event Handler
musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play().catch((err) => console.error("Audio resume failure:", err));
    gifIcon.classList.remove("music-muted");
  } else {
    bgMusic.pause();
    gifIcon.classList.add("music-muted");
  }
});
// SCROLL BOUNDARY ENGINE: Seamlessly pins the skeleton controller above the About section
window.addEventListener('scroll', () => {
  const mainView = document.getElementById('main-view');
  const musicController = document.getElementById('music-toggle');
  const aboutSection = document.getElementById('about');
  
  // Safety check: Exit immediately if the main view is still hidden
  if (!mainView || mainView.classList.contains('hidden') || !musicController || !aboutSection) return;

  const aboutRect = aboutSection.getBoundingClientRect();
  const isTablet = window.innerWidth <= 1024;
  const offset = isTablet ? 20 : 30;
  
  // FIX: Use explicit style heights if the browser returns 0 before fully rendering the asset
  const controllerHeight = musicController.offsetHeight || (isTablet ? 65 : 120);

  // Trigger the exact frame the About section edge enters the bottom threshold of the viewport
  if (aboutRect.top <= window.innerHeight) {
    musicController.style.position = 'absolute';
    
    // Calculates the precise absolute document coordinate to eliminate any layout snapping
    const aboutTopOnPage = window.scrollY + aboutRect.top;
    musicController.style.top = `${aboutTopOnPage - offset - controllerHeight}px`;
    musicController.style.bottom = 'auto';
  } else {
    // Seamlessly restores default fixed viewport-tracking when scrolling back up
    musicController.style.position = 'fixed';
    musicController.style.top = 'auto';
    musicController.style.bottom = `${offset}px`;
  }
});
const customCursor = document.getElementById('custom-cursor');
let mouseX = 0;
let mouseY = 0;
let isUpdating = false;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (!isUpdating) {
    isUpdating = true;
    requestAnimationFrame(updateCursorPosition);
  }
});

function updateCursorPosition() {
  if (customCursor) {
    customCursor.style.left = `${mouseX}px`;
    customCursor.style.top = `${mouseY}px`;
  }
  isUpdating = false;
}
// ==========================================================================
// WITNESS ODOMETER ENGINE (Path 3: Unique Device Tracking Gate - Fixed)
// ==========================================================================
async function initializeOdometer() {
  const counterContainer = document.getElementById('witness-counter');
  if (!counterContainer) return;

  // Selects only the 6 numeric digit slots
  const digitImages = counterContainer.querySelectorAll('img:not(:first-child)');

  const namespace = 'eyebleed_net';
  const counterName = 'witnesses';
  let apiUrl = '';

  // Gatekeeper: Determine whether to increment a new visit or read passively
  if (!localStorage.getItem('eyebleed_witness_marked')) {
    // No mark found: Direct path to increment route
    apiUrl = `https://api.counterapi.dev/v1/${namespace}/${counterName}/up`;
    localStorage.setItem('eyebleed_witness_marked', 'true');
  } else {
    // Mark found: Rigid V1 architecture requires a trailing slash for passive lookup
    apiUrl = `https://api.counterapi.dev/v1/${namespace}/${counterName}/`;
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    let count = data.count;
    if (count === undefined) count = 1;

    // Pad the number string out to your flat 6-digit layout (e.g., 1 -> "000001")
    const countString = String(count).padStart(6, '0');
    
    // Mapping array for your asset filenames
    const digitWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

    // Dynamically update the visual graphic track
    digitImages.forEach((img, index) => {
      if (index < countString.length) {
        const digitChar = countString[index];
        const digitValue = parseInt(digitChar, 10);
        
        if (!isNaN(digitValue)) {
          const word = digitWords[digitValue];
          img.src = `Assets/Numbers/${word}.png`; // Target folder path
          img.alt = digitChar;
        }
      }
    });

  } catch (error) {
    console.error("Witness ledger connection drop. Preserving canvas baseline.", error);
  }
}

// Fire the engine immediately on background load
document.addEventListener('DOMContentLoaded', initializeOdometer);
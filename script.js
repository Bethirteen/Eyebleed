const hoverSound = new Audio("Assets/fnafgroan.mp3");
const bgMusic = new Audio("Assets/bgaudio.mp3");

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
const hoverSound = new Audio("Assets/audio/fnafgroan.mp3"); //
const bgMusic = new Audio("Assets/audio/bgaudio.mp3"); //
// NEW: Define the path to your notebook selection sound asset
const notebookClickSound = new Audio("Assets/audio/creak.mp3"); 

hoverSound.preload = "auto"; //
bgMusic.preload = "auto"; //
bgMusic.loop = true; //
// NEW: Preload the click sound so it triggers instantly without lagging the layout shift
notebookClickSound.preload = "auto"

// NEW: Calibrate the audio output level (0.3 = 30% volume baseline)
notebookClickSound.volume = 0.8;

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
// ==========================================================================
// NOTEBOOK ARCHIVE DISPLAY INTERFACE ENGINE
// ==========================================================================

// Catalog Ledger: Map out your individual scanned sketch file paths here
const notebookCatalog = {
  "00": [
    { title: "Page_01: Structural Bone Realism", img: "Assets/Notebook_00/page1.jpeg" },
    { title: "Page_02: Internal Discomfort Study", img: "Assets/Notebook_00/page2.png" },
    { title: "Page_03: Fragmented Outline Study", img: "Assets/Notebook_00/page3.png" }
  ],
  "01": [
    { title: "Page_01: Visceral Ink Pass", img: "Assets/Notebook_01/page1.png" },
    { title: "Page_02: Observed Reality Deficit", img: "Assets/Notebook_01/page2.png" }
  ],
  "02": [], // Add entry dictionaries here as you expand your digital archives
  "03": [],
  "04": [],
  "05": []
};

document.addEventListener("DOMContentLoaded", () => {
  const mainView = document.getElementById("main-view");
  const archiveStage = document.getElementById("notebook-archive-stage");
  const pagesArrayContainer = document.getElementById("notebook-pages-array");
  const closeBtn = document.getElementById("close-archive-btn");
  const globalCursorElement = document.getElementById("custom-cursor");
  const mainHeaderImg = document.getElementById("notebooks-main-header");

  if (!mainView || !archiveStage || !pagesArrayContainer || !closeBtn || !globalCursorElement || !mainHeaderImg) return;

// 1. VOLUME LINK ENGAGEMENT PROCESSOR
  document.querySelectorAll(".volume-trigger").forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault(); // Stop native anchor viewport snapping
      
      // NEW: Snap the audio playback timeline back to 0 and fire the sound immediately
      notebookClickSound.currentTime = 0;
      notebookClickSound.play().catch((err) => console.error("Audio playback blocked:", err));

      const volId = trigger.getAttribute("data-volume"); // Pulls "00", "01", etc.
      const pages = notebookCatalog[volId] || []; //
      
      // DYNAMIC GRAPHIC MUTATION: Swap header text banner
      mainHeaderImg.src = `Assets/Notebook${volId}.png`;
      mainHeaderImg.alt = `Notebook ${volId} Header`;
 
      // Clear out the previous index array entries from the tray
      pagesArrayContainer.innerHTML = "";

      if (pages.length === 0) {
        pagesArrayContainer.innerHTML = "<p style='color:#1a1a1a; font-style:italic;'>Notebook currently vacant...</p>";
      } else {
        // Build out the minimalist text line structure
        pages.forEach(page => {
          const pageLink = document.createElement("a");
          pageLink.href = "#";
          pageLink.textContent = page.title;
          
          // CURSOR TRANSFORMATION MODE (Option 1): Projected specimen slide overrides pointer
          pageLink.addEventListener("mouseenter", () => {
            globalCursorElement.style.backgroundImage = `url("${page.img}")`;
            globalCursorElement.classList.add("thumbnail-active");
          });
          
          // RECOVERY ROUTINE: Return standard animated cursor tracking to space
          pageLink.addEventListener("mouseleave", () => {
            globalCursorElement.style.backgroundImage = 'url("Assets/gifs/cursor.gif")'; //
            globalCursorElement.classList.remove("thumbnail-active");
          });

          // Block clicking jumps on active text lists
          pageLink.addEventListener("click", (el) => el.preventDefault());

          pagesArrayContainer.appendChild(pageLink);
        });
      }

      // Lock morphing animation states into action
      mainView.classList.add("archive-engaged");
      archiveStage.classList.remove("hidden");
    });
  });

  // 2. BACK BUTTON RESET MECHANISM: Retract views and restore baseline gallery flow
  closeBtn.addEventListener("click", () => {
    mainView.classList.remove("archive-engaged");
    archiveStage.classList.add("hidden");
    
    // RESTORE LAYOUT HEADLINE: Slide standard global heading graphic back into position
    mainHeaderImg.src = "Assets/Notebooks.png";
    mainHeaderImg.alt = "Notebooks header";
    
    // Safety drop-off reset to guarantee cursor design parameters clear safely
    globalCursorElement.style.backgroundImage = 'url("Assets/gifs/cursor.gif")'; //
    globalCursorElement.classList.remove("thumbnail-active");
  });
});
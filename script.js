const hoverSound = new Audio("Assets/audio/fnafgroan.mp3"); //
const bgMusic = new Audio("Assets/audio/bgaudio.mp3"); //
// NEW: Define the path to your notebook selection sound asset
const notebookClickSound = new Audio("Assets/audio/creak.mp3");
// UPDATED: Core structural click path updated to point to your asset name
const UIButtonClickSound = new Audio("Assets/audio/click.mp3");

hoverSound.preload = "auto"; //
bgMusic.preload = "auto"; //
bgMusic.loop = true; //
// NEW: Preload the click sound so it triggers instantly without lagging the layout shift
notebookClickSound.preload = "auto";
// Preload and calibrate the updated UI audio clip
UIButtonClickSound.preload = "auto";
UIButtonClickSound.volume = 0.3;

// NEW: Calibrate the audio output level (0.3 = 30% volume baseline)
notebookClickSound.volume = 0.2;
bgMusic.volume = 0.1; // Adjust the background music volume to a comfortable level

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
  UIButtonClickSound.currentTime = 0;
  UIButtonClickSound.play().catch(() => {});
});

// Runtime Audio Switch Event Handler
musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play().catch((err) => console.error("Audio resume failure:", err));
    gifIcon.classList.remove("music-muted");
  } else {
    bgMusic.pause();
    gifIcon.classList.add("music-muted");
    UIButtonClickSound.currentTime = 0;
    UIButtonClickSound.play().catch(() => {});
  }
});
// SCROLL BOUNDARY ENGINE: Seamlessly pins the skeleton controller above the About section
window.addEventListener("scroll", () => {
  const mainView = document.getElementById("main-view");
  const musicController = document.getElementById("music-toggle");
  const aboutSection = document.getElementById("about");

  // Safety check: Exit immediately if the main view is still hidden
  if (
    !mainView ||
    mainView.classList.contains("hidden") ||
    !musicController ||
    !aboutSection
  )
    return;

  const aboutRect = aboutSection.getBoundingClientRect();
  const isTablet = window.innerWidth <= 1024;
  const offset = isTablet ? 20 : 30;

  // FIX: Use explicit style heights if the browser returns 0 before fully rendering the asset
  const controllerHeight =
    musicController.offsetHeight || (isTablet ? 65 : 120);

  // Trigger the exact frame the About section edge enters the bottom threshold of the viewport
  if (aboutRect.top <= window.innerHeight) {
    musicController.style.position = "absolute";

    // Calculates the precise absolute document coordinate to eliminate any layout snapping
    const aboutTopOnPage = window.scrollY + aboutRect.top;
    musicController.style.top = `${aboutTopOnPage - offset - controllerHeight}px`;
    musicController.style.bottom = "auto";
  } else {
    // Seamlessly restores default fixed viewport-tracking when scrolling back up
    musicController.style.position = "fixed";
    musicController.style.top = "auto";
    musicController.style.bottom = `${offset}px`;
  }
});
const customCursor = document.getElementById("custom-cursor");
let mouseX = 0;
let mouseY = 0;
let isUpdating = false;

window.addEventListener("mousemove", (e) => {
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
  const counterContainer = document.getElementById("witness-counter");
  if (!counterContainer) return;

  // Selects only the 6 numeric digit slots
  const digitImages = counterContainer.querySelectorAll(
    "img:not(:first-child)",
  );

  const namespace = "eyebleed_net";
  const counterName = "witnesses";
  let apiUrl = "";

  // Gatekeeper: Determine whether to increment a new visit or read passively
  if (!localStorage.getItem("eyebleed_witness_marked")) {
    // No mark found: Direct path to increment route
    apiUrl = `https://api.counterapi.dev/v1/${namespace}/${counterName}/up`;
    localStorage.setItem("eyebleed_witness_marked", "true");
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
    const countString = String(count).padStart(6, "0");

    // Mapping array for your asset filenames
    const digitWords = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ];

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
    console.error(
      "Witness ledger connection drop. Preserving canvas baseline.",
      error,
    );
  }
}

// Fire the engine immediately on background load
document.addEventListener("DOMContentLoaded", initializeOdometer);

// ==========================================================================
// NOTEBOOK ARCHIVE DISPLAY INTERFACE ENGINE
// ==========================================================================

// Catalog Ledger: Map out your individual scanned sketch file paths here
const notebookCatalog = {
  "00": [
    { title: "Page 01: Night Prince", 
      img: "Assets/Notebook_00/page1.jpeg" ,
      associated: ["Page 02", "Page 05", "Page 12"] // Explicitly curated connections
    },
    { title: "Page 02: Intimacy", 
      img: "Assets/Notebook_00/page2.png" ,
      associated: ["Page 05", "Page 07", "Page 10"]
    },
    {
      title: "Page 03: BeautyHaunts",
      img: "Assets/Notebook_00/page3.png",
    },
    {
      title: "Page 05: Decay Manifestation",
      img: "Assets/Notebook_00/page5.png",
    },
    {
      title: "Page 06: Solitude Specimen",
      img: "Assets/Notebook_00/page6.png",
    },
    {
      title: "Page 07: Observation Trauma",
      img: "Assets/Notebook_00/page7.png",
    },
    {
      title: "Page 08: Final Notebook Core",
      img: "Assets/Notebook_00/page8.png",
    },
    {
      title: "Page 09: Striated Muscle Tension",
      img: "Assets/Notebook_00/page9.png",
    },
    {
      title: "Page 10: Mid-Century Fracture Reference",
      img: "Assets/Notebook_00/page10.png",
    },
    {
      title: "Page 11: Cellular Distortion Phase",
      img: "Assets/Notebook_00/page11.png",
    },
    {
      title: "Page 12: Dissected Void Map",
      img: "Assets/Notebook_00/page12.png",
    },
    {
      title: "Page 13: Corrupted Tissue Outline",
      img: "Assets/Notebook_00/page13.png",
    },
    {
      title: "Page 14: Cognitive Bleed Analysis",
      img: "Assets/Notebook_00/page14.png",
    },
    {
      title: "Page_15: Fossilized Sinew Sketch",
      img: "Assets/Notebook_00/page15.png",
    },
    {
      title: "Page_16: Subdermal Texture Index",
      img: "Assets/Notebook_00/page16.png",
    },
    {
      title: "Page_17: Abdominal Cavity Shadow",
      img: "Assets/Notebook_00/page17.png",
    },
    {
      title: "Page_18: Post-Mortem Geometry",
      img: "Assets/Notebook_00/page18.png",
    },
    {
      title: "Page_19: Respiratory Tracing Glitch",
      img: "Assets/Notebook_00/page19.png",
    },
    {
      title: "Page_20: Absolute Reality Severance",
      img: "Assets/Notebook_00/page20.png",
    },
  ],
  "01": [
    {
      title: "Page_01: Visceral Ink Pass",
      img: "Assets/Notebook_01/page1.png",
    },
    {
      title: "Page_02: Observed Reality Deficit",
      img: "Assets/Notebook_01/page2.png",
    },
  ],
  "02": [], // Add entry dictionaries here as you expand your digital archives
  "03": [],
  "04": [],
  "05": [],
};

document.addEventListener("DOMContentLoaded", () => {
  const mainView = document.getElementById("main-view");
  const archiveStage = document.getElementById("notebook-archive-stage");
  const pagesArrayContainer = document.getElementById("notebook-pages-array");
  const closeBtn = document.getElementById("close-archive-btn");
  const globalCursorElement = document.getElementById("custom-cursor");
  const mainHeaderImg = document.getElementById("notebooks-main-header");
  // IMAGE VIEWER INTERFACE SELECTORS
  const imageViewerStage = document.getElementById("image-viewer-stage");
  const viewerPageTitle = document.getElementById("viewer-page-title");
  const viewerMainImage = document.getElementById("viewer-main-image");
  const viewerAssociatedLinks = document.getElementById(
    "viewer-associated-links",
  );
  const closeViewerBtn = document.getElementById("close-viewer-btn");
  // UNIVERSAL NAVBAR CLICK AUDIO COUPLING
  document.querySelectorAll("nav a").forEach((navLink) => {
    navLink.addEventListener("click", () => {
      UIButtonClickSound.currentTime = 0;
      UIButtonClickSound.play().catch((err) =>
        console.error("Nav audio ignition blocked:", err),
      );
    });
  });

  if (
    !mainView ||
    !archiveStage ||
    !pagesArrayContainer ||
    !closeBtn ||
    !globalCursorElement ||
    !mainHeaderImg
  )
    return;

  // 1. VOLUME LINK ENGAGEMENT PROCESSOR
  document.querySelectorAll(".volume-trigger").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault(); // Stop native anchor viewport snapping

      notebookClickSound.currentTime = 0; //
      notebookClickSound
        .play()
        .catch((err) => console.error("Audio playback blocked:", err)); //

      const volId = trigger.getAttribute("data-volume"); // Pulls "00", "01", etc.
      const pages = notebookCatalog[volId] || []; //

      // DYNAMIC GRAPHIC MUTATION: Swap header text banner
      mainHeaderImg.src = `Assets/Notebook${volId}.png`; //
      mainHeaderImg.alt = `Notebook ${volId} Header`; //

      // Clear out the previous index array entries from the tray
      pagesArrayContainer.innerHTML = ""; //

      if (pages.length === 0) {
        //
        pagesArrayContainer.innerHTML =
          "<p style='color:#1a1a1a; font-style:italic;'>Volume details currently vacant...</p>"; //
      } else {
        // Build out the minimalist text line structure
        pages.forEach((page) => {
          //
          const pageLink = document.createElement("a"); //
          pageLink.href = "#"; //
          pageLink.textContent = page.title; //

          // CURSOR TRANSFORMATION MODE (Option 1)
          pageLink.addEventListener("mouseenter", () => {
            //
            globalCursorElement.style.backgroundImage = `url("${page.img}")`; //
            globalCursorElement.classList.add("thumbnail-active"); //
          });

          pageLink.addEventListener("mouseleave", () => {
            //
            globalCursorElement.style.backgroundImage =
              'url("Assets/gifs/cursor.gif")'; //
            globalCursorElement.classList.remove("thumbnail-active"); //
          });

          // TRIGGER: Step inside the image viewing interface when a link is clicked
          pageLink.addEventListener("click", (el) => {
            el.preventDefault();

            // Strike the tactile interface snap sound
            notebookClickSound.currentTime = 0;
            notebookClickSound.play().catch(() => {});

            // Pass this active item and the whole parent array into the viewing deck
            openImageViewer(page, pages);
          });

          pagesArrayContainer.appendChild(pageLink); //
        });
      }

      // Lock morphing animation states into action
      mainView.classList.add("archive-engaged"); //
      archiveStage.classList.remove("hidden"); //

      // CALIBRATED VIEWPORT ALIGNMENT: Match the exact 1.75s timing of your CSS transition
      syncScrollToTop(1750);
    });
  });

  // 2. BACK BUTTON RESET MECHANISM: Retract views and restore baseline gallery flow
  closeBtn.addEventListener("click", () => {
    mainView.classList.remove("archive-engaged");
    archiveStage.classList.add("hidden");

    UIButtonClickSound.currentTime = 0;
    UIButtonClickSound.play().catch(() => {});
    // RESTORE LAYOUT HEADLINE: Slide standard global heading graphic back into position
    mainHeaderImg.src = "Assets/Notebooks.png";
    mainHeaderImg.alt = "Notebooks header";

    // Safety drop-off reset to guarantee cursor design parameters clear safely
    globalCursorElement.style.backgroundImage = 'url("Assets/gifs/cursor.gif")'; //
    globalCursorElement.classList.remove("thumbnail-active");
  });
  // ==========================================================================
  // CORE IMAGE VIEWPORT MANAGEMENT ENGINE (With Fluid Container Morphing)
  // ==========================================================================
  function openImageViewer(activePage, allPages) {
    // Target the main notebook paper element to animate its frame
    const notebookContainer = document.querySelector(".Notebooks");

    // 1. Capture the exact starting height in pixels before changing anything
    const startHeight = notebookContainer.getBoundingClientRect().height;
    notebookContainer.style.height = `${startHeight}px`; // Lock it to a hard pixel baseline

    // 2. Populate text headers and main image sources
    viewerPageTitle.textContent = activePage.title;
    viewerMainImage.src = activePage.img;
    viewerMainImage.alt = activePage.title;

    /*(3. Clear and reconstruct the associated links tray
    viewerAssociatedLinks.innerHTML = "";
    allPages.forEach((p) => {
      if (p.title !== activePage.title) {
        const assocLink = document.createElement("a");
        assocLink.href = "#";
        assocLink.textContent = p.title.split(":")[0];
        assocLink.addEventListener("click", (e) => {
          e.preventDefault();
          UIButtonClickSound.currentTime = 0;
          UIButtonClickSound.play().catch(() => {});
          openImageViewer(p, allPages);
        });
        viewerAssociatedLinks.appendChild(assocLink);
      }
    });*/
    // 3. Dynamically construct clean, curated jump anchors based on your data ledger
    viewerAssociatedLinks.innerHTML = "";
    
    // Check if the active page has an explicit 'associated' array defined
    if (activePage.associated && activePage.associated.length > 0) {
      allPages.forEach(p => {
        // Extract the short name baseline (e.g., "Page_02") from the full title
        const shortTitle = p.title.split(":")[0].trim(); 
        
        // Only build a link if this page is explicitly listed as a connection
        if (activePage.associated.includes(shortTitle)) {
          const assocLink = document.createElement("a");
          assocLink.href = "#";
          assocLink.textContent = shortTitle; 
          
          assocLink.addEventListener("click", (e) => {
            e.preventDefault();
            notebookClickSound.currentTime = 0;
            notebookClickSound.play().catch(() => {});
            openImageViewer(p, allPages);
          });
          
          viewerAssociatedLinks.appendChild(assocLink);
        }
      });
    } else {
      // Fallback display if you leave a page's associated array empty
      viewerAssociatedLinks.innerHTML = "";
    }

    // 4. Swap display visibility states
    archiveStage.classList.add("hidden");
    imageViewerStage.classList.remove("hidden");
    mainView.classList.add("viewer-engaged"); // Activates 100% 100% background stretching

    // 5. Temporarily unlock the height to measure how tall the new content wants to be
    notebookContainer.style.height = "auto";
    const targetHeight = notebookContainer.getBoundingClientRect().height;

    // 6. Snap back to the original height instantly, flush the browser cache loop,
    // then smoothly execute the 1.75s CSS height transition
    notebookContainer.style.height = `${startHeight}px`;
    notebookContainer.offsetHeight; // Forces a structural layout reflow
    notebookContainer.style.height = `${targetHeight}px`;

    // Stabilize global camera tracking line
    syncScrollToTop(600);
  }

  // CLOSE VIEWING INTERFACE TRIGGER (With Reverse Fluid Morphing)
  if (closeViewerBtn) {
    closeViewerBtn.addEventListener("click", () => {
      UIButtonClickSound.currentTime = 0;
      UIButtonClickSound.play().catch(() => {});

      const notebookContainer = document.querySelector(".Notebooks");

      // 1. Lock current expanded height to prevent visual snapping
      const currentHeight = notebookContainer.getBoundingClientRect().height;
      notebookContainer.style.height = `${currentHeight}px`;
      notebookContainer.offsetHeight; // Flush browser state

      // 2. Hide the drawing deck, recall the scrolling index grid
      mainView.classList.remove("viewer-engaged");
      imageViewerStage.classList.add("hidden");
      archiveStage.classList.remove("hidden");

      // 3. Fluidly glide the container height back down to its standard 85vh baseline
      notebookContainer.style.height = "85vh";

      syncScrollToTop(600);
    });
  }
});
// ==========================================================================
// KINETIC SCROLL ENGINE (Synchronized Layout Alignment)
// ==========================================================================
function syncScrollToTop(duration) {
  const startPos = window.scrollY;
  const targetPos = 0; // Glides the view to the top where the active archive sits
  const distance = targetPos - startPos;
  let startTime = null;

  // If the user is already at the top, don't trigger the engine
  if (distance === 0) return;

  function animationLoop(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;

    // Normalize progress between 0 and 1
    const progress = Math.min(timeElapsed / duration, 1);

    // KINETIC EASING CURVE: Mimics the heavy deceleration tail of cubic-bezier(0.16, 1, 0.3, 1)
    const easeOutExponential =
      progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

    // Move the viewport coordinate tracking line
    window.scrollTo(0, startPos + distance * easeOutExponential);

    // Keep spinning the loop until the 1.75s timeline is completely filled
    if (timeElapsed < duration) {
      requestAnimationFrame(animationLoop);
    }
  }

  requestAnimationFrame(animationLoop);
}

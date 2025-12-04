const roomImage = document.getElementById('roomImage');
const objectName = document.getElementById('objectName');
const optionsContainer = document.getElementById('optionsContainer');
const imageContainer = document.querySelector('.image-wrapper');
const compareLine = document.getElementById('compareLine');

const currentWallEl = document.getElementById('currentWall');
const currentFloorEl = document.getElementById('currentFloor');
const currentPillarsEl = document.getElementById('currentPillars');

const BASE_IMAGE = 'assets/washroom.png'; // Single base image
const API_ENDPOINT = '/api/apply-sheet'; // Backend API endpoint (dummy for now)

// 🟢 Define hotspot coordinates
const hotspots = [
    { name: 'Wall', x: 0.95, y: 0.15 },
    { name: 'Pillars', x: 0.8, y: 0.60 },
    { name: 'Floor', x: 0.40, y: 0.82 }
];

// 📦 Store the current overlay image from backend (only one at a time)
let currentOverlayImage = null;

// 📊 Track last selection made
let lastSelection = {
    hotspotName: null,
    sheetName: null
};

// Available sheets (dynamically loaded from assets/sheets)
let availableSheets = [];

async function loadAvailableSheets() {
    // In a real scenario, you might fetch this from the server
    availableSheets = [
        { id: 1, name: 'Wall Sheet 1', path: 'assets/sheets/wall1.png', type: 'wall' },
        { id: 2, name: 'Wall Sheet 2', path: 'assets/sheets/wall2.png', type: 'wall' },
        { id: 3, name: 'Wall Sheet 3', path: 'assets/sheets/wall3.png', type: 'wall' },
        { id: 4, name: 'Floor Sheet 1', path: 'assets/sheets/bed1.png', type: 'floor' },
        { id: 5, name: 'Floor Sheet 2', path: 'assets/sheets/bed2.png', type: 'floor' },
        { id: 6, name: 'Floor Sheet 3', path: 'assets/sheets/bed3.png', type: 'floor' },
        { id: 7, name: 'Pillar Sheet 1', path: 'assets/sheets/pillar1.png', type: 'pillar' },
        { id: 8, name: 'Pillar Sheet 2', path: 'assets/sheets/pillar2.png', type: 'pillar' },
        { id: 9, name: 'Pillar Sheet 3', path: 'assets/sheets/pillar3.png', type: 'pillar' },
    ];
}


function updateSelectionDisplay() {
    // Reset all to 'None'
    currentWallEl.textContent = 'None';
    currentFloorEl.textContent = 'None';
    currentPillarsEl.textContent = 'None';

    // Update only the last selected hotspot
    if (lastSelection.hotspotName && lastSelection.sheetName) {
        if (lastSelection.hotspotName === 'Wall') {
            currentWallEl.textContent = lastSelection.sheetName;
        } else if (lastSelection.hotspotName === 'Floor') {
            currentFloorEl.textContent = lastSelection.sheetName;
        } else if (lastSelection.hotspotName === 'Pillars') {
            currentPillarsEl.textContent = lastSelection.sheetName;
        }
    }
}

// Add markers on the base image
function drawHotspots() {
    document.querySelectorAll('.hotspot-marker').forEach(el => el.remove());

    hotspots.forEach(h => {
        const marker = document.createElement('div');
        marker.className = 'hotspot-marker';
        marker.style.left = (h.x * 100) + '%';
        marker.style.top = (h.y * 100) + '%';
        marker.title = `Click to customize ${h.name}`;
        marker.onclick = () => openModal(h.name);
        imageContainer.appendChild(marker);
    });
}

// Open modal and show all available sheets
function openModal(hotspotName) {
    objectName.textContent = `Select ${hotspotName} Sheet`;
    optionsContainer.innerHTML = "";

    // Show all sheets in the modal 
    availableSheets.forEach(sheet => {
        const optionCard = document.createElement('div');
        optionCard.className = 'option-card';
        optionCard.onclick = () => {
            applySheet(hotspotName, sheet);
            // Close modal after selection
            const modalEl = document.getElementById('configModal');
            const bsModal = bootstrap.Modal.getInstance(modalEl);
            bsModal.hide();
        };

        const img = document.createElement('img');
        img.src = sheet.path;
        img.alt = sheet.name;
        img.className = 'option-img';

        const label = document.createElement('div');
        label.className = 'option-label';
        label.textContent = sheet.name;

        optionCard.appendChild(img);
        optionCard.appendChild(label);
        optionsContainer.appendChild(optionCard);
    });

    const modalEl = document.getElementById('configModal');
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
}

// Apply selected sheet - Make API call (currently using dummy data)
async function applySheet(hotspotName, selectedSheet) {
    console.log('🎯 API Call (Dummy Data):');
    console.log('Base Image:', BASE_IMAGE);
    console.log('Hotspot Name:', hotspotName);
    console.log('Selected Sheet:', selectedSheet);

    // Prepare API request data
    const requestData = {
        baseImage: BASE_IMAGE,
        hotspotName: hotspotName,
        selectedSheet: {
            id: selectedSheet.id,
            name: selectedSheet.name,
            path: selectedSheet.path
        }
    };

    console.log('📤 Request Data:', JSON.stringify(requestData, null, 2));

    // Replace this with actual API call

    // const response = await fetch(API_ENDPOINT, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(requestData)
    // });
    // const data = await response.json();
    // const overlayImageUrl = data.overlayImageUrl;

    // For now, simulate API response with dummy overlay image
    // In real implementation, backend will return the complete composite image

    const overlayImageUrl = "assets/washroomtheme2.png";

    currentOverlayImage = overlayImageUrl;
    lastSelection = {
        hotspotName: hotspotName,
        sheetName: selectedSheet.name
    };

    // Render the overlay on the base image
    renderOverlay();

    updateSelectionDisplay();

    console.log('✅ Overlay applied for:', hotspotName);
}

//  Render the overlay on top of the base image
function renderOverlay() {
    // Remove existing overlay element
    const existingOverlay = document.querySelector('.overlay-image');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    // Add the new overlay image if it exists
    if (currentOverlayImage) {
        const overlayImg = document.createElement('img');
        overlayImg.src = currentOverlayImage;
        overlayImg.className = 'overlay-image';
        overlayImg.alt = 'Overlay image';
        overlayImg.style.position = 'absolute';
        overlayImg.style.top = '0';
        overlayImg.style.left = '0';
        overlayImg.style.width = '100%';
        overlayImg.style.height = '100%';
        overlayImg.style.objectFit = 'fill';
        overlayImg.style.pointerEvents = 'none';
        overlayImg.style.zIndex = '5';
        overlayImg.style.borderRadius = '10px';

        imageContainer.appendChild(overlayImg);

        // Initialize comparison slider logic
        initComparison();
    }

    // Redraw hotspots on top
    drawHotspots();
}

// 🖱️ Drag and Drop Logic for Comparison Slider
let isDragging = false;

function initComparison() {
    compareLine.style.display = 'block';
    updateSlider(0); // Start at 0% (full overlay visible)

    // Mouse events
    compareLine.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', stopDrag);

    // Touch events
    compareLine.addEventListener('touchstart', startDrag);
    window.addEventListener('touchmove', drag);
    window.addEventListener('touchend', stopDrag);
}

function startDrag(e) {
    isDragging = true;
    e.preventDefault(); // Prevent text selection
}

function stopDrag() {
    isDragging = false;
}

function drag(e) {
    if (!isDragging) return;

    let clientX;
    if (e.type.startsWith('touch')) {
        clientX = e.touches[0].clientX;
    } else {
        clientX = e.clientX;
    }

    const rect = imageContainer.getBoundingClientRect();
    let x = clientX - rect.left;

    // Clamp x
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = (x / rect.width) * 100;
    updateSlider(percentage);
}

// 🎚️ Update slider position and overlay clip
function updateSlider(val) {
    const overlayImg = document.querySelector('.overlay-image');
    if (overlayImg) {
        overlayImg.style.clipPath = `inset(0 0 0 ${val}%)`;
        compareLine.style.left = `${val}%`;
    }
}

// 🟢 Initialize the application
async function initializeApp() {
    // Load available sheets
    await loadAvailableSheets();

    // Set the base image
    roomImage.src = BASE_IMAGE;

    // When base image loads, draw hotspots
    roomImage.onload = function () {
        drawHotspots();
        updateSelectionDisplay();
    };

    roomImage.onerror = function () {
        console.error('Failed to load base image:', BASE_IMAGE);
    };
}

// Start the application
initializeApp();

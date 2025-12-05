// API Configuration
const API_BASE_URL = 'http://localhost:3000/api'; // Update this to your backend URL
const ROOMS_ENDPOINT = `${API_BASE_URL}/rooms`;

/**
 * Fetch rooms from backend API
 */
async function fetchRooms() {
    try {
        console.log('🔄 Fetching rooms from API...');
        const response = await fetch(ROOMS_ENDPOINT);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const rooms = data.rooms || data; // Support both formats

        console.log('✅ Rooms fetched successfully:', rooms);
        displayRooms(rooms);

    } catch (error) {
        console.error('❌ Error fetching rooms:', error);
        showError('Failed to load rooms from server. Using demo data.');
        // Fallback to demo data
        useDemoData();
    }
}

/**
 * Display rooms as cards
 */
function displayRooms(rooms) {
    const container = document.getElementById('roomsContainer');

    if (!container) {
        console.error('roomsContainer not found!');
        return;
    }

    // Clear loading spinner
    container.innerHTML = '';

    // Create card for each room
    rooms.forEach(room => {
        const card = createRoomCard(room);
        container.appendChild(card);
    });
}

/**
 * Create a room card element
 */
function createRoomCard(room) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';

    // Determine icon based on room type
    const icons = {
        'bedroom': 'fa-bed',
        'office': 'fa-laptop',
        'living': 'fa-couch',
        'kitchen': 'fa-utensils',
        'bathroom': 'fa-bath'
    };
    const icon = icons[room.type?.toLowerCase()] || 'fa-home';

    col.innerHTML = `
        <div class="card room-card" style="cursor: pointer;">
            <img src="${room.image || room.baseImage || room.thumbnail}" 
                 class="card-img-top" 
                 alt="${room.name}"
                 onerror="this.src='assets/washroom.png'">
            <div class="card-body">
                <h3 class="card-title">
                    <i class="fas ${icon} me-2"></i>${room.name}
                </h3>
                <p class="card-text">${room.description}</p>
                <button class="btn btn-primary w-100 customize-btn">
                    Customize This Room
                </button>
            </div>
        </div>
    `;

    // Add click event to open studio with this room's image
    const card = col.querySelector('.room-card');
    const button = col.querySelector('.customize-btn');

    const openStudio = (e) => {
        e.preventDefault();
        const imageUrl = room.image || room.baseImage || room.thumbnail;

        // Store room data for studio page
        sessionStorage.setItem('selectedRoomImage', imageUrl);
        sessionStorage.setItem('selectedRoomName', room.name);
        sessionStorage.setItem('selectedRoomId', room.id);

        // Navigate to studio with image URL as parameter
        window.location.href = `studio.html?image=${encodeURIComponent(imageUrl)}&name=${encodeURIComponent(room.name)}`;
    };

    card.addEventListener('click', openStudio);
    button.addEventListener('click', openStudio);

    return col;
}

/**
 * Show error message
 */
function showError(message) {
    const container = document.getElementById('roomsContainer');
    if (container) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    ${message}
                </div>
            </div>
        `;
    }
}

/**
 * Use demo data as fallback
 */
function useDemoData() {
    const demoRooms = [
        {
            id: 1,
            name: 'Bedroom',
            type: 'bedroom',
            description: 'Design your perfect sanctuary for rest and relaxation. Personalize your bed, storage, lighting, and color scheme for the ultimate comfort.',
            image: 'assets/washroom.png'
        },
        {
            id: 2,
            name: 'Home Office',
            type: 'office',
            description: 'Build a productive and inspiring workspace. Customize your desk, chair, storage solutions, and lighting to boost your focus and creativity.',
            image: 'assets/washroom.png'
        },
        {
            id: 3,
            name: 'Living Room',
            type: 'living',
            description: 'Create a cozy and inviting living space perfect for relaxation and entertainment. Customize furniture, wall colors, and decor to match your style.',
            image: 'assets/washroom.png'
        }
    ];

    displayRooms(demoRooms);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing room gallery...');
    fetchRooms();
});

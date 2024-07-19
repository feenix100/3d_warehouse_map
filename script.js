// Basic setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

// Add axes helper with thicker lines
const axesHelper = new THREE.AxesHelper(20); // Length of axes lines
axesHelper.material.linewidth = 7; // Adjust line thickness
axesHelper.position.set(0, 10, 0); // Move axes helper up along the y-axis
scene.add(axesHelper);

// Raycaster for detecting clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Shelf dimensions
const shelfHeight = 1;
const shelfDepth = 3;

// Define dimensions for shelves
const shelfDimensions = {
    regular: { width: 10, length: 1 },
    rotated: { width: 10, length: 1 },
    extraLong: { width: 30, length: 5 } // Custom width and length for extra-long shelves
};

// Numbers for boxes - machine part numbers how to display so many numbers efficiently
// numbers on for parts on shelves will be between 4 and 6 digits long
// will need to display about 3000 different numbers
// numbers for parts on shelves should be searchable

const numbers = [
    [1, 2, 3, 4, 5],    // Shelf 1
    [6, 7, 8, 9, 10],   // Shelf 2
    [11, 12, 13, 14, 15],  // Shelf 3
    [16, 17, 18, 19, 20],  // Shelf 4
    [21, 22, 23, 24, 25]   // Shelf 5
];

let shelfSets = []; // Array to hold groups of shelves

const shelfSetNames = [
    "1stRow_Midsection",   // Shelf Set 1
    "2ndRow_Midsection",        // Shelf Set 2
    "3rdRow_Midsection",   // Shelf Set 3
    "4thRow_Midsection",   // Shelf Set 4
    "5thRow_Midsection",   // Shelf Set 5
    "6thRow_Midsection",   // Shelf Set 6
    "7thRow_Midsection",   // Shelf Set 7
    
    // Add more names as needed
];

// Function to create shelves
function createShelves(positions, shelfSetNames) {
    const spaceBetweenSets = 2; // Reduced space between each set
    const spaceBetweenShelves = 5; // Space between each shelf in a set

    positions.forEach((position, i) => {
        const { startX, startZ, shelfType } = position;
        const shelfGroup = new THREE.Group();
        shelfGroup.position.set(startX, 0, startZ); // Set initial position

        for (let j = 0; j < numbers.length; j++) {
            let shelfWidth, shelfLength;

            if (shelfType === 'rotated') {
                shelfWidth = shelfDimensions.rotated.width;
                shelfLength = shelfDimensions.rotated.length;
            } else if (shelfType === 'extraLong') {
                shelfWidth = shelfDimensions.extraLong.width;
                shelfLength = shelfDimensions.extraLong.length;
            } else if (shelfType === 'extraLong_Rotated') {
                shelfWidth = shelfDimensions.extraLong.width;
                shelfLength = shelfDimensions.extraLong.length;
                shelfGroup.rotation.set(0, Math.PI / 2, 0);
            } else {
                shelfWidth = shelfDimensions.regular.width;
                shelfLength = shelfDimensions.regular.length;
            }

            const geometry = new THREE.BoxGeometry(shelfWidth, shelfHeight, shelfDepth);
            const material = new THREE.MeshStandardMaterial({ color: 0x8AC });
            const shelf = new THREE.Mesh(geometry, material);

            if (shelfType === 'rotated') {
                shelf.rotation.y = Math.PI / 2; // Rotate shelf 90 degrees if it's rotated
            }

            const startY = j * (shelfHeight + spaceBetweenShelves);
            shelf.position.set(0, startY, 0);

            // Assign a unique name to each shelf in the format 'shelf-setIndex-shelfIndex'
            shelf.name = `shelf-${i}-${j}`;

            console.log(`Created shelf with name: ${shelf.name}`); // Debug logging

            shelfGroup.add(shelf);
        }

        let label = shelfSetNames[i];
        if (shelfType === 'extraLong') {
            label += ' (Extra Long)';
        } else if (shelfType === 'rotated') {
            label += ' (Rotated)';
        }
        createShelfLabel(shelfGroup, label, numbers.length * (shelfHeight + spaceBetweenShelves) + 2);
        scene.add(shelfGroup);
        shelfSets.push(shelfGroup); // Add group to array
    });
}



// Function to create labels for shelf sets
function createShelfLabel(group, text, yPosition) {
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 0.5,
            height: 0.1,
        });

        // Calculate text size for background plane
        const textSize = new THREE.Box3().setFromObject(new THREE.Mesh(textGeometry)).getSize(new THREE.Vector3());

        const backgroundGeometry = new THREE.PlaneGeometry(textSize.x + 0.2, textSize.y + 0.2); // Adjust padding
        const backgroundMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White background
        const backgroundPlane = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        backgroundPlane.position.set(0, yPosition + 0.3, 0); // Position behind the text
        group.add(backgroundPlane);

        const textMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black text
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textMesh.position.set(-(textSize.x + 0.2) / 2, yPosition, 0); // Center text on background plane
        textMesh.rotation.set(0, 0, 0); // Ensure text faces the camera

        group.add(textMesh);
    });
}

// Initialize empty array
// Shelf positions for regular, rotated, and extra-long shelves 
const positions = [];

// Create 7 regular shelves 'rotated' 'regular' 'extraLong' 'extraLong_Rotated'
for (let i = 0; i < 7; i++) {
    positions.push({ startX: -30, startZ: -60 + 10 * i, shelfType: 'regular' });
}

// Create 5 regular shelves
for (let i = 0; i < 5; i++) {
    positions.push({ startX: 50, startZ: 50 + 10 * i, shelfType: 'regular' });
}

// Create 4 regular shelves
for (let i = 0; i < 4; i++) {
    positions.push({ startX: -10, startZ: -60 + 10 * i, shelfType: 'regular' });
}

// Additional Individual shelves add here  'rotated' 'regular' 'extraLong' 'extraLong_Rotated' 
positions.push({ startX: -70, startZ: -40, shelfType: 'extraLong' });
positions.push({ startX: -80, startZ: -40, shelfType: 'extraLong' });
positions.push({ startX: -80, startZ: 50, shelfType: 'extraLong_Rotated' });
// console.log(positions);

// Function to create the desk
function createDesk() {
    // Desk geometry and material
    const deskWidth = 20;
    const deskHeight = 2;
    const deskDepth = 10;

    const deskGeometry = new THREE.BoxGeometry(deskWidth, deskHeight, deskDepth);
    const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown color

    const desk = new THREE.Mesh(deskGeometry, deskMaterial);

    // Position the desk appropriately
    desk.position.set(90, deskHeight / 2, -10); // Adjust as needed
    desk.rotation.set(0, Math.PI / 2, 0);

    scene.add(desk);
}

// Create shelves with custom dimensions
createShelves(positions, shelfSetNames);

createDesk();

// Add floor
const floorGeometry = new THREE.PlaneGeometry(200, 200);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide }); // White color
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI / 2; // Rotate to lie flat
floor.position.y = -1; // Move floor down
scene.add(floor);

// Add grid with coordinates
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

// Function to add coordinates to grid
function addGridCoordinates(size, divisions) {
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const step = size / divisions;
        const halfSize = size / 2;

        for (let i = 0; i <= divisions; i++) {
            const position = -halfSize + (i * step);

            const textGeometryX = new THREE.TextGeometry(position.toString(), {
                font: font,
                size: 0.5,
                height: 0.1,
            });

            const textMaterialX = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black color
            const textMeshX = new THREE.Mesh(textGeometryX, textMaterialX);

            textMeshX.position.set(position, 0, halfSize + 2); // Adjust position
            textMeshX.rotation.x = -Math.PI / 2; // Rotate text to lie flat on the ground

            scene.add(textMeshX);

            const textGeometryZ = new THREE.TextGeometry(position.toString(), {
                font: font,
                size: 0.5,
                height: 0.1,
            });

            const textMaterialZ = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black color
            const textMeshZ = new THREE.Mesh(textGeometryZ, textMaterialZ);

            textMeshZ.position.set(halfSize + 2, 0, position); // Adjust position
            textMeshZ.rotation.x = -Math.PI / 2; // Rotate text to lie flat on the ground
            textMeshZ.rotation.z = Math.PI / 2; // Rotate text to face correct direction

            scene.add(textMeshZ);
        }
    });
}

addGridCoordinates(200, 50);

// Camera positioning
camera.position.set(0, 50, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Rendering function
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Updated numbers data structure
// Define numbers for each shelf set
const shelfSetsNumbers = [
    // Shelf Set 1
    [
        [1, 2, 3, 4, 5],    // Shelf 1
        [6, 7, 8, 9, 10],   // Shelf 2
        [11, 12, 13, 14, 15],  // Shelf 3
        [16, 17, 18, 19, 20],  // Shelf 4
        [21, 22, 23, 24, 25]   // Shelf 5
    ],
    // Shelf Set 2
    [
        [26, 27, 28, 29, 30],    // Shelf 1
        [31, 32, 33, 34, 35],    // Shelf 2
        [36, 37, 38, 39, 40],    // Shelf 3
        [41, 42, 43, 44, 45],    // Shelf 4
        [46, 47, 48, 49, 50]     // Shelf 5
    ],
    // Shelf Set 3 and so on...
];

// Event listener for mouse click
window.addEventListener('click', (event) => {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const name = intersectedObject.name;

        console.log('Clicked on object with name:', name); // Debug logging

        // Use regular expression to extract setIndex and shelfIndex
        const regex = /^shelf-(\d+)-(\d+)$/; // Matches 'shelf-<digits>-<digits>'
        const match = name.match(regex);

        if (match) {
            const setIndex = parseInt(match[1]); // Convert to integer
            const shelfIndex = parseInt(match[2]); // Convert to integer

            console.log('Clicked on shelf:', setIndex, shelfIndex);

            if (!isNaN(setIndex) && !isNaN(shelfIndex) && shelfSetsNumbers[setIndex] && shelfSetsNumbers[setIndex][shelfIndex]) {
                const numbers = shelfSetsNumbers[setIndex][shelfIndex];

                // Display numbers (example: update a DOM element)
                const infoBox = document.getElementById('infoBox');
                infoBox.innerHTML = `Numbers on ${name}: ${numbers.join(', ')}`;
                infoBox.style.display = 'block';
                infoBox.style.left = `${event.clientX}px`;
                infoBox.style.top = `${event.clientY}px`;
            } else {
                console.error('Invalid indices:', setIndex, shelfIndex);
            }
        } else {
            console.error('Invalid name format:', name);
        }
    }
});









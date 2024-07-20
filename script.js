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
    extraLong: { width: 30, length: 10 } // Custom width and length for extra-long shelves
};

// Numbers for boxes - machine part numbers how to display so many numbers efficiently
const numbers = [
    [1, 2, 3, 4, 5],    // Shelf 1
    [6, 7, 8, 9, 10],   // Shelf 2
    [11, 12, 13, 14, 15],  // Shelf 3
    [16, 17, 18, 19, 20],  // Shelf 4
    [21, 22, 23, 24, 25]   // Shelf 5
];

let shelfSets = []; // Array to hold groups of shelves

// Arrays for different shelf set names
const midsectionNames = [];
const topSectionNames = [];
const fuelSectionNames = [];
const extraLongShelfNames = [
    "East_Shelf", 
    "South Shelf", 
    "heater_Rod_Shelf_South_Corner"
];

// Midsection names
for (let i = 1; i <= 7; i++) {
    midsectionNames.push(`${i}stRow_Midsection`);
}

// Top section names
for (let i = 1; i <= 4; i++) {
    topSectionNames.push(`${i}stRow_Top_Section`);
}

// Fuel section names
for (let i = 1; i <= 5; i++) {
    fuelSectionNames.push(`${i}stRow_Fuel_Section`);
}

// Function to create shelves
function createShelves(positions) {
    const spaceBetweenSets = 2; // Reduced space between each set
    const spaceBetweenShelves = 5; // Space between each shelf in a set

    positions.forEach((position, i) => {
        const { startX, startZ, shelfType, shelfSetName } = position;
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

        let label = shelfSetName;
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

// Create positions for Midsections
for (let i = 0; i < midsectionNames.length; i++) {
    positions.push({ startX: -30, startZ: -60 + 10 * i, shelfType: 'regular', shelfSetName: midsectionNames[i] });
}

// Create positions for Top Sections
for (let i = 0; i < topSectionNames.length; i++) {
    positions.push({ startX: -10, startZ: -60 + 10 * i, shelfType: 'regular', shelfSetName: topSectionNames[i] });
}

// Create positions for Fuel Sections
for (let i = 0; i < fuelSectionNames.length; i++) {
    positions.push({ startX: -50, startZ: 50 + 10 * i, shelfType: 'regular', shelfSetName: fuelSectionNames[i] });
}

// Additional positions for Extra Long Shelves
//for (let i = 0; i < extraLongShelfNames.length; i++) {
  //  positions.push({ startX: -50 + 30 * i, startZ: -80 + 20 * i, shelfType: 'extraLong', shelfSetName: extraLongShelfNames[i] });
//}

// Function to create the desk
function createDesk() {
    // Desk geometry and material
    const deskWidth = 20;
    const deskHeight = 0.5;
    const deskDepth = 10;

    const deskGeometry = new THREE.BoxGeometry(deskWidth, deskHeight, deskDepth);
    const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x8A8 });
    const desk = new THREE.Mesh(deskGeometry, deskMaterial);
    desk.position.set(0, -deskHeight / 2, 0); // Set the position so the desk is on the ground (y = 0).

    // Add desk to the scene
    scene.add(desk);
}

// Function to create the floor
function createFloor() {
    // Floor plane
    const floorGeometry = new THREE.PlaneGeometry(200, 200); // Large plane
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White floor
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    floor.position.y = -0.1; // Position slightly below origin to ensure it's visible
    scene.add(floor);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(200, 20); // Size and divisions of the grid
    gridHelper.position.y = -0.1; // Position same as floor to overlay
    scene.add(gridHelper);
}

// Call the functions
createFloor();
createDesk();
createShelves(positions);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

// Function to close the info div
function closeInfoDiv() {
    infoDiv.style.display = 'none';
}

// Event listener for mouse clicks
window.addEventListener('click', onMouseClick, false);

// Get reference to the info div
const infoDiv = document.getElementById('infoBox');

// Converts 3D coordinates to 2D
function toScreenPosition(obj, camera, renderer) {
    const vector = new THREE.Vector3();
    const widthHalf = 0.5 * renderer.domElement.width;
    const heightHalf = 0.5 * renderer.domElement.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = (vector.x * widthHalf) + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;

    return {
        x: vector.x,
        y: vector.y
    };
}

// Handle mouse click
function onMouseClick(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        console.log('Clicked Object Name:', clickedObject.name); // Debug log to check the object name

        if (clickedObject.name.startsWith('shelf-')) {
            const { x, y } = toScreenPosition(clickedObject, camera, renderer);

            const [ , setIndex, shelfIndex ] = clickedObject.name.split('-').map(Number);
            const numbersOnShelf = numbers[setIndex] || [];

            infoDiv.innerHTML = `<strong>Shelf ${clickedObject.name + numbers}</strong><br>${numbersOnShelf.join('<br>')}`;
            infoDiv.style.display = 'block';
            infoDiv.style.left = `${x}px`;
            infoDiv.style.top = `${y}px`;
            infoDiv.style.transform = 'translate(-50%, -100%)'; // Center the info box above the shelf
        }
    }
}

// Initial camera position
camera.position.set(0, 20, 100);

// Start the animation loop
animate();

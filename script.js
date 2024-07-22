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

// Numbers for machine parts on shelf sets
const part_numbers = [
    [1, 2, 3, 4, 5],    // Mid section Shelf 1
    [6, 7, 8, 9, 10],   // Mid section Shelf 2
    [11, 12, 13, 14, 15],  // Mid section Shelf 3
    [16, 17, 18, 19, 20],  // Mid section Shelf 4
    [1, 2, 3, 4, 5],    // Mid section Shelf 5
    [6, 7, 8, 9, 10],   // Mid section Shelf 6
    [11, 12, 13, 14, 15],  // Mid section Shelf 7

    [16, 17, 18, 19, 20],  // Top Shelf 1
    [1, 2, 3, 4, 5],    // Top Shelf 2
    [6, 7, 8, 9, 10],   // Top Shelf 3
    [11, 12, 13, 14, 15],  // Top Shelf 4

    [2007, 2008, 2018, 2028, 2032, 2030, 2640, 2641, 3545, 3549, 3556, 5135, 5156, 5207, 5280, 5283, 5356, 5385, 5395, 5912, 5920, 5936, 5940, 6699, 6700, 6709, 6710, 6713, 6717, 8508, 8511, 8512, 9243, 9244, 9421, 9422],  // Row 1 fuel section
    [11268, 9199, 20583, 20584, 9900, 9901, 9424, 9484, 9485, 9486, 10003, 10843, 11235, 11236, 11263, 11258, 12043, 12044, 12046, 12048, 12509, 13132, 15113, 15114, 15535, 15536, 16806, 16416, 17549, 17550, 17551, 17552, 18515, 20466, 20905, 21979, 22597, 22806, 22807, 22910, 23149, 23944, 23945, 23991, 23992, 24286, 29368, 29690, 30389, 31557, 31652, 26927],  // Row 2 fuel section
    [33709, 38808, 34480, 41349, 43322, 43587, 46559, 45940, 46888, 49196, 51328, 54513, 53258, 55060, 57789, 57552, 58214, 58256, 58632, 61335, 61336, 61338, 57646, 65244, 67884, 61832, 63710, 66369, 66370, 68531, 69888],  // Row 3 fuel section
    [67235, 67712, 69128, 71244, 75197, 76072, 79104, 82091, 85896, 92547, 93198, 100431, 103874, 104479, 110088, 34479, 36327, 36328, 36329, 36331, 36767, 88295],  // Row 4 fuel section
    [12500, 99324, 99325, 99323, 99885, 103103, 34730]  // Row 5 fuel section
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
for (let i = 0; i < 7; i++) {
    midsectionNames.push(`${i + 1}stRow_Midsection`);
}

// Top section names
for (let i = 0; i < 4; i++) {
    topSectionNames.push(`${i + 1}stRow_Top_Section`);
}

// Fuel section names
for (let i = 0; i < 5; i++) {
    fuelSectionNames.push(`${i + 1}stRow_Fuel_Section`);
}

// Function to create shelves
function createShelves(positions) {
    const spaceBetweenSets = 2; // Reduced space between each set
    const spaceBetweenShelves = 5; // Space between each shelf in a set

    positions.forEach((position, i) => {
        const { startX, startZ, shelfType, shelfSetName, setIndex } = position;
        const shelfGroup = new THREE.Group();
        shelfGroup.position.set(startX, 0, startZ); // Set initial position
        const shelf_set_Height_Max = 5; // Set the max height of each shelf set

        for (let j = 0; j < shelf_set_Height_Max; j++) {
            let shelfWidth, shelfLength;

            if (shelfType === 'rotated') {
                shelfWidth = shelfDimensions.rotated.width;
                shelfLength = shelfDimensions.rotated.length;
                shelfGroup.rotation.y = Math.PI / 2; // Rotate shelf 90 degrees if it's rotated
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

            const startY = j * (shelfHeight + spaceBetweenShelves);
            shelf.position.set(0, startY, 0);

            // Assign a unique name to each shelf in the format 'shelf-setIndex-shelfIndex'
            shelf.name = `shelf-${setIndex}-${j}`;

            // Attach part numbers to shelf user data
            const partNumbers = (shelfSetPartNumbers[setIndex] || [])[j] || [];
            shelf.userData.partNumbers = partNumbers;

            shelfGroup.add(shelf);
        }

        // Create a label for the shelf set
        let label = `${shelfSetName}`;
        if (shelfType === 'rotated') {
            label += ' (Rotated)';
        }
        createShelfLabel(shelfGroup, label, shelf_set_Height_Max * (shelfHeight + spaceBetweenShelves) + 2);
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

// Define the mapping of part numbers to each shelf set
const shelfSetPartNumbers = {
    0: part_numbers.slice(0, 6), // Midsection Shelves
    1: part_numbers.slice(7, 11), // Top Section Shelves
    2: part_numbers.slice(12, 16), // Fuel Sections Shelves
    3: part_numbers.slice(16) // Additional Sections (e.g., Extra-long shelves)
};

// Create positions for Midsections
for (let i = 0; i < midsectionNames.length; i++) {
    positions.push({ startX: -30, startZ: -60 + 10 * i, shelfType: 'regular', shelfSetName: midsectionNames[i], setIndex: 0 });
}

// Create positions for Top Sections
for (let i = 0; i < topSectionNames.length; i++) {
    positions.push({ startX: -10, startZ: -60 + 10 * i, shelfType: 'regular', shelfSetName: topSectionNames[i], setIndex: 1 });
}

// Create positions for Fuel Sections
for (let i = 0; i < fuelSectionNames.length; i++) {
    positions.push({ startX: -50, startZ: 50 + 10 * i, shelfType: 'regular', shelfSetName: fuelSectionNames[i], setIndex: 2 });
}

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

    // Convert mouse coordinates to normalized device coordinates (NDC)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster with the mouse coordinates
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with objects in the scene
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        if (clickedObject.name.startsWith('shelf-')) {
            // Extract the set index from the shelf name
            const [ , setIndex ] = clickedObject.name.split('-').map(Number);

            // Retrieve part numbers for the entire set based on the set index
            const partNumbersForSet = shelfSetPartNumbers[setIndex] || [];

            // Flatten the part numbers for the entire set into a single list
            const allPartNumbers = partNumbersForSet.flat();

            // Update infoDiv content
            infoDiv.innerHTML = `<strong>Shelf Set ${setIndex + 1}</strong><br>${allPartNumbers.join('<br>')}`;
            infoDiv.style.display = 'block';

            //trying to get the part_numbers array to display correctly when clicking on a set of shelves
            //one array should display for each shelf set

            // Position infoDiv
            const { x, y } = toScreenPosition(clickedObject, camera, renderer);
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

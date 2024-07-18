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

// Function to create shelves
// Function to create shelves
function createShelves(positions) {
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
            shelfGroup.add(shelf);
        }

        // Create label above the shelf set
        let label = `Shelf ${i + 1}`;
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


// Shelf positions for regular, rotated, and extra-long shelves
const positions = [
    { startX: -20, startZ: 0, shelfType: 'regular' }, // First set of regular shelves
    { startX: 0, startZ: 0, shelfType: 'rotated' },  // Second set of rotated shelves
    { startX: 20, startZ: 0, shelfType: 'extraLong' }  // Third set of extra-long shelves
];

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
    desk.position.set(0, deskHeight / 2, -20); // Adjust as needed

    scene.add(desk);
}

// Create shelves with custom dimensions
createShelves(positions);

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

// Event listener for mouse click
window.addEventListener('click', (event) => {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        console.log(intersectedObject.name); // Log the name of the clicked object
    }
});

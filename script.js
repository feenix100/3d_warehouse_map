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

// Raycaster for detecting clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Shelf dimensions
const shelfWidth = 10;
const shelfHeight = 1;
const shelfDepth = 3;

// Box dimensions
const boxHeight = 1;
const boxDepth = 1;

// Numbers for boxes (adjust numbers as needed)
const numbers = [
    [1, 2, 3, 4, 5],    // Shelf 1
    [6, 7, 8, 9, 10],   // Shelf 2
    [11, 12, 13, 14, 15],  // Shelf 3
    [16, 17, 18, 19, 20],  // Shelf 4
    [21, 22, 23, 24, 25]   // Shelf 5
];

let shelfSets = []; // Array to hold groups of shelves

// Function to create boxes with text
function createBoxAndText(group, x, y, z, number, alternateColor) {
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new THREE.TextGeometry(number.toString(), {
            font: font,
            size: 0.2, // Reduced font size
            height: 0.05,
        });
        textGeometry.computeBoundingBox();
        const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;

        const boxWidth = textWidth + 0.5; // Adding some padding
        const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        let boxMaterial;

        if (alternateColor) {
            boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red color
        } else {
            boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Green color
        }

        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(x, y, z);
        group.add(box);

        const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(x - textWidth / 2, y - 0.5, z + boxDepth / 2); // Positioning text directly in front of the box
        text.rotation.set(0, 0, 0); // Ensure text faces the camera
        group.add(text);

        box.userData = { number }; // Store the box number for reference

        // Add event listener for box click
        box.onClick = function () {
            onBoxClick(box);
        };
    }, undefined, function (err) {
        console.error('An error happened while loading the font:', err);
    });
}

// Function to handle box click
function onBoxClick(box) {
    const dropdown = document.getElementById('dropdown');
    const dropdownSelect = document.getElementById('dropdownSelect');

    // Get box position in screen coordinates
    const vector = new THREE.Vector3();
    box.updateMatrixWorld();
    vector.setFromMatrixPosition(box.matrixWorld);
    vector.project(camera);

    const x = Math.round((0.5 + vector.x / 2) * (window.innerWidth));
    const y = Math.round((0.5 - vector.y / 2) * (window.innerHeight));

    // Position and display the dropdown menu
    dropdown.style.left = `${x}px`;
    dropdown.style.top = `${y}px`;
    dropdown.style.display = 'block';

    // Clear previous options
    dropdownSelect.innerHTML = '';

    // Add options for numbers
    numbers[box.userData.number - 1].forEach(number => {
        const option = document.createElement('option');
        option.value = number;
        option.text = number;
        dropdownSelect.appendChild(option);
    });

    // Add event listener to dropdown menu to handle selection
    dropdownSelect.onchange = function () {
        console.log(`Selected value for box ${box.userData.number}: ${this.value}`);
        dropdown.style.display = 'none'; // Hide dropdown menu after selection
    };
}

// Function to create labels for shelf sets
function createShelfLabel(group, text, yPosition) {
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 1, // Font size for the shelf label
            height: 0.1,
        });
        const textMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black color
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        const labelBackgroundGeometry = new THREE.PlaneGeometry(10, 2);
        const labelBackgroundMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const labelBackground = new THREE.Mesh(labelBackgroundGeometry, labelBackgroundMaterial);

        labelBackground.position.set(0, yPosition, 5); // Positioning above the shelf and in front of it on the z-axis
        labelBackground.rotation.set(0, 0, 0); // Ensure label faces the z-axis
        group.add(labelBackground);

        textMesh.position.set(-5, yPosition, 5.1); // Adjusted position to be on top of the background
        textMesh.rotation.set(0, 0, 0); // Ensure text faces the z-axis
        group.add(textMesh);
    });
}

// Function to create shelves
function createShelves(positions) {
    const spaceBetweenSets = 2; // Reduced space between each set
    const spaceBetweenShelves = 5; // Space between each shelf in a set

    positions.forEach((position, i) => {
        const { startX, startZ } = position;
        const shelfGroup = new THREE.Group();
        shelfGroup.position.set(startX, 0, startZ); // Set initial position

        for (let j = 0; j < numbers.length; j++) {
            const geometry = new THREE.BoxGeometry(shelfWidth, shelfHeight, shelfDepth);
            const material = new THREE.MeshStandardMaterial({ color: 0x8AC });
            const shelf = new THREE.Mesh(geometry, material);

            const startY = j * (shelfHeight + spaceBetweenShelves);
            shelf.position.set(0, startY, 0);
            shelfGroup.add(shelf);

            // Create boxes with numbers on each shelf
            for (let k = 0; k < numbers[j].length; k++) {
                const boxX = (k * (shelfWidth / numbers[j].length)) - (shelfWidth / 2) + (shelfWidth / numbers[j].length) / 2;
                const alternateColor = k % 2 === 0; // Alternate colors based on even or odd index
                createBoxAndText(shelfGroup, boxX, startY + 1, 0, numbers[j][k], alternateColor);
            }
        }

        // Create label above the shelf set
        createShelfLabel(shelfGroup, `Shelf ${i + 1}`, numbers.length * (shelfHeight + spaceBetweenShelves) + 2);
        scene.add(shelfGroup);
        shelfSets.push(shelfGroup); // Add group to array
    });
}

// Function to create the floor
function createFloor(size) {
    const floorGeometry = new THREE.BoxGeometry(size, 1, size); // Made the floor bigger
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White color
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -1;
    scene.add(floor);
}

// Function to create grid with coordinates
function createGrid(size, divisions) {
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        for (let i = -divisions / 2; i <= divisions / 2; i++) {
            for (let j = -divisions / 2; j <= divisions / 2; j++) {
                const textGeometry = new THREE.TextGeometry(`(${i},${j})`, {
                    font: font,
                    size: 1, // Increased font size
                    height: 0.05,
                });
                const textMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue color
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                textMesh.position.set(i * (size / divisions), 0, j * (size / divisions));
                textMesh.rotation.x = -Math.PI / 2;
                scene.add(textMesh);
            }
        }
    });
}

// Function to create GUI for adding new shelves
const gui = new dat.GUI();
const controlsObj = {
    addShelfSet: function() {
        addShelfSet();
    }
};
gui.add(controlsObj, 'addShelfSet').name('Add Shelf Set');

// Function to add a new shelf set
function addShelfSet() {
    const positions = [
        { startX: Math.random() * 100 - 50, startZ: Math.random() * 100 - 50 }
    ];
    createShelves(positions);
}

// Position camera
camera.position.z = 100;
camera.position.y = 100;
camera.lookAt(0, 0, 0);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Handle box clicks
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.userData.number !== undefined) {
            onBoxClick(intersectedObject);
        }
    }
});

// Call the function to create initial shelves, floor, and grid
const initialPositions = [
    { startX: -30, startZ: -30 },
    { startX: 0, startZ: 0 },
    { startX: 30, startZ: 30 },
    { startX: -30, startZ: 30 },
    { startX: 30, startZ: -30 },
    { startX: -30, startZ: 0 },
    { startX: 0, startZ: 30 },
];
createShelves(initialPositions); // Initialize with 7 sets of shelves at specific positions
createFloor(200);
createGrid(200, 20);

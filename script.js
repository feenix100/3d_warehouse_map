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
const shelfWidth = 10;
const shelfHeight = 1;
const shelfDepth = 3;

// Extra-long shelf dimensions
const extraLongShelfWidth = 30;

// Box dimensions
const boxHeight = 1;
const boxDepth = 1;

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

// Function to create boxes with text

function createBoxAndText(group, x, y, z, number, alternateColor, isExtraLong = false) {
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new THREE.TextGeometry(number.toString(), {
            font: font,
            size: 0.2, // Reduced font size
            height: 0.05,
        });
        textGeometry.computeBoundingBox();
        const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;

        let boxWidth, boxDepth;
        if (isExtraLong) {
            boxWidth = boxDepth = textWidth + 0.5; // Box width and depth are the same for extra-long shelves
        } else {
            boxWidth = textWidth + 0.5;
            boxDepth = 1; // Default depth for regular shelves
        }

        const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        let boxMaterial;

        if (alternateColor) {
            boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red color
        } else {
            boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Green color
        }

        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        
        // Adjust box position based on shelf type
        if (isExtraLong) {
            box.position.set(x, y, z + boxDepth / 2); // Position box along the z-axis
            box.rotation.y = Math.PI / 2; // Rotate box 90 degrees if it's on an extra-long shelf to face x-axis
        } else {
            box.position.set(x, y, z);
        }

        group.add(box);

        const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const text = new THREE.Mesh(textGeometry, textMaterial);

        // Adjust text position based on shelf type
        if (isExtraLong) {
            text.position.set(x + 0.5, y - 0.5, z + boxDepth / 2); // Position text along the z-axis
            text.rotation.set(0, -Math.PI / 2, 0); // Ensure text faces the camera
        } else {
            text.position.set(x - textWidth / 2, y - 0.5, z + boxDepth / 2); // Position text directly in front of the box
            text.rotation.set(0, 0, 0); // Ensure text faces the camera
        }

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


// Function to create shelves
function createShelves(positions, isExtraLong = false) {
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

            if (isExtraLong) {
                shelf.rotation.y = Math.PI / 2; // Rotate shelf 90 degrees if it's extra-long
            }

            const startY = j * (shelfHeight + spaceBetweenShelves);
            shelf.position.set(0, startY, 0);
            shelfGroup.add(shelf);

            // Create boxes with numbers on each shelf
            for (let k = 0; k < numbers[j].length; k++) {
                const boxZ = (k * (shelfDepth / numbers[j].length)) - (shelfDepth / 2) + (shelfDepth / numbers[j].length) / 2;
                const alternateColor = k % 2 === 0; // Alternate colors based on even or odd index
                createBoxAndText(shelfGroup, 0, startY + 1, boxZ, numbers[j][k], alternateColor, isExtraLong);
            }
        }

        // Create label above the shelf set
        createShelfLabel(shelfGroup, `Shelf ${i + 1}${isExtraLong ? ' (Extra Long)' : ''}`, numbers.length * (shelfHeight + spaceBetweenShelves) + 2);
        scene.add(shelfGroup);
        shelfSets.push(shelfGroup); // Add group to array
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


// Function to create the floor
function createFloor(size) {
    const floorGeometry = new THREE.PlaneGeometry(size, size);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xDDDDDD, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);
}

// Function to create a grid
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
    { startX: -60, startZ: -5 }, //shelf 1
    { startX: -60, startZ: 5 }, //shelf 2
    { startX: -60, startZ: 15 }, //shelf 3
    { startX: -60, startZ: 25 }, //shelf 4
    { startX: -60, startZ: 35 }, //shelf 5
    { startX: -60, startZ: 45 }, //shelf 6
    { startX: -60, startZ: 55 }, //shelf 7

    { startX: -40, startZ: -5 }, //shelf 8
    { startX: -40, startZ: 5 }, //shelf 9
    { startX: -40, startZ: 15 }, //shelf 10
    { startX: -40, startZ: 25 }, //shelf 11

    { startX: 30, startZ: 35 }, //shelf 12
    { startX: 30, startZ: -70 }, //shelf 13
    { startX: 30, startZ: -75 }, //shelf 14
    { startX: 45, startZ: -80 }, //shelf 15
    { startX: 50, startZ: -85 }, //shelf 16
    { startX: 55, startZ: -90 }, //shelf 17
    { startX: 60, startZ: -95 }, //shelf 18
    { startX: 65, startZ: -100 }, //shelf 19
    { startX: 70, startZ: -105}, //shelf 20
    { startX: 75, startZ: -110 }, //shelf 21
    { startX: 80, startZ: -115}, //shelf 22
    { startX: 85, startZ: -120}, //shelf 23
];
createShelves(initialPositions); // Initialize with 20 sets of shelves at specific positions

// Create extra-long shelves
const extraLongPositions = [
    { startX: -100, startZ: 0 },
    { startX: 0, startZ: -100 },
    { startX: 100, startZ: 0 }
];
createShelves(extraLongPositions, true);

createFloor(200);
createGrid(200, 20);

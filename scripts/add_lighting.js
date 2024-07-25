// lighting options


// add background and lighting 

function createGradientTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 256;

    const context = canvas.getContext('2d');

    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#1e4877'); // Top color
    gradient.addColorStop(1, '#4584b4'); // Bottom color

    context.fillStyle = gradient;
    context.fillRect(0, 0, 1, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
}

function addLighting() {
    // Ambient light to provide basic illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3); // Slightly higher intensity for better overall lighting
    scene.add(ambientLight);

    // Hemisphere light for a more natural look
    const hemisphereLight = new THREE.HemisphereLight(0xddddff, 0x555555, 0.5); // Sky color, ground color, and intensity
    scene.add(hemisphereLight);

    // Sunlight simulation with a strong directional light
    const sunlight = new THREE.DirectionalLight(0xffffff, 1.5); // White color and higher intensity
    sunlight.position.set(30, 60, 30); // Position it to cast light from a high angle
    sunlight.castShadow = true;

    // Shadow properties
    sunlight.shadow.camera.near = 1;
    sunlight.shadow.camera.far = 200;
    sunlight.shadow.camera.left = -50;
    sunlight.shadow.camera.right = 50;
    sunlight.shadow.camera.top = 50;
    sunlight.shadow.camera.bottom = -50;

    // Higher resolution shadow map for better quality shadows
    sunlight.shadow.mapSize.width = 4096;
    sunlight.shadow.mapSize.height = 4096;
    sunlight.shadow.bias = -0.005; // Reduced bias for better shadow quality

    scene.add(sunlight);

    // Point light for additional illumination in specific areas
    const pointLight = new THREE.PointLight(0xffffff, 0.5, 100); // White color, intensity, and distance
    pointLight.position.set(10, 30, 10); // Position it at a specific point
    scene.add(pointLight);
}


//single color background

function addLighting() {
    // Set background color
    scene.background = new THREE.Color(0x87ceeb); // Light blue color

    // Ambient light to provide basic illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3); // Slightly higher intensity for better overall lighting
    scene.add(ambientLight);

    // Hemisphere light for a more natural look
    const hemisphereLight = new THREE.HemisphereLight(0xddddff, 0x555555, 0.5); // Sky color, ground color, and intensity
    scene.add(hemisphereLight);

    // Sunlight simulation with a strong directional light
    const sunlight = new THREE.DirectionalLight(0xffffff, 1.5); // White color and higher intensity
    sunlight.position.set(30, 60, 30); // Position it to cast light from a high angle
    sunlight.castShadow = true;

    // Shadow properties
    sunlight.shadow.camera.near = 1;
    sunlight.shadow.camera.far = 200;
    sunlight.shadow.camera.left = -50;
    sunlight.shadow.camera.right = 50;
    sunlight.shadow.camera.top = 50;
    sunlight.shadow.camera.bottom = -50;

    // Higher resolution shadow map for better quality shadows
    sunlight.shadow.mapSize.width = 4096;
    sunlight.shadow.mapSize.height = 4096;
    sunlight.shadow.bias = -0.005; // Reduced bias for better shadow quality

    scene.add(sunlight);

    // Point light for additional illumination in specific areas
    const pointLight = new THREE.PointLight(0xffffff, 0.5, 100); // White color, intensity, and distance
    pointLight.position.set(10, 30, 10); // Position it at a specific point
    scene.add(pointLight);
}

//bright harsh light

function addLighting() {
    // Create gradient background
    const gradientTexture = createGradientTexture();
    scene.background = gradientTexture;

    // Ambient light to provide basic illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3); // Slightly higher intensity for better overall lighting
    scene.add(ambientLight);

    // Hemisphere light for a more natural look
    const hemisphereLight = new THREE.HemisphereLight(0xddddff, 0x555555, 0.5); // Sky color, ground color, and intensity
    scene.add(hemisphereLight);

    // Sunlight simulation with a strong directional light
    const sunlight = new THREE.DirectionalLight(0xffffff, 1.5); // White color and higher intensity
    sunlight.position.set(30, 60, 30); // Position it to cast light from a high angle
    sunlight.castShadow = true;

    // Shadow properties
    sunlight.shadow.camera.near = 1;
    sunlight.shadow.camera.far = 200;
    sunlight.shadow.camera.left = -50;
    sunlight.shadow.camera.right = 50;
    sunlight.shadow.camera.top = 50;
    sunlight.shadow.camera.bottom = -50;

    // Higher resolution shadow map for better quality shadows
    sunlight.shadow.mapSize.width = 4096;
    sunlight.shadow.mapSize.height = 4096;
    sunlight.shadow.bias = -0.005; // Reduced bias for better shadow quality

    scene.add(sunlight);

    // Point light for additional illumination in specific areas
    const pointLight = new THREE.PointLight(0xffffff, 0.5, 100); // White color, intensity, and distance
    pointLight.position.set(10, 30, 10); // Position it at a specific point
    scene.add(pointLight);
}


//softer lighting
function addLighting() {
    // Create starry night gradient background
    const starryNightTexture = createStarryNightTexture();
    scene.background = starryNightTexture;

    // Ambient light with lower intensity
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2); // Reduced intensity for a darker scene
    scene.add(ambientLight);

    // Hemisphere light with lower intensity
    const hemisphereLight = new THREE.HemisphereLight(0x333366, 0x111111, 0.3); // Dim sky and ground colors with lower intensity
    scene.add(hemisphereLight);

    // Sunlight simulation with reduced intensity
    const sunlight = new THREE.DirectionalLight(0xffffff, 1.0); // Lower intensity
    sunlight.position.set(50, 100, 50); // Position it to cast light from a high angle
    sunlight.castShadow = true;

    // Shadow properties for deeper shadows
    sunlight.shadow.camera.near = 1;
    sunlight.shadow.camera.far = 150;
    sunlight.shadow.camera.left = -100;
    sunlight.shadow.camera.right = 100;
    sunlight.shadow.camera.top = 100;
    sunlight.shadow.camera.bottom = -100;
    sunlight.shadow.mapSize.width = 8192; // Higher resolution shadow map
    sunlight.shadow.mapSize.height = 8192;
    sunlight.shadow.bias = -0.01; // Fine-tuned bias for better shadow quality

    scene.add(sunlight);

    // Point light with lower intensity
    const pointLight = new THREE.PointLight(0xffa500, 0.3, 50); // Reduced intensity for a subtler effect
    pointLight.position.set(-30, 40, 30); // Position it to highlight specific areas
    scene.add(pointLight);

    // Spot light with adjusted settings for more dramatic shadows
    const spotLight = new THREE.SpotLight(0xffffff, 0.5); // Reduced intensity
    spotLight.position.set(0, 50, 0); // Position it from above
    spotLight.angle = Math.PI / 6; // Narrower cone for more focused light
    spotLight.penumbra = 0.3; // Slightly softer edges
    spotLight.decay = 2; // How light fades over distance
    spotLight.distance = 100;
    spotLight.castShadow = true;

    // Shadow properties for the spot light
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 150;
    spotLight.shadow.camera.fov = 40; // Field of view of the shadow camera
    spotLight.shadow.mapSize.width = 4096; // Shadow map size
    spotLight.shadow.mapSize.height = 4096;
    scene.add(spotLight);
}
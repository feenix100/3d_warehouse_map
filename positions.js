// Initialize empty array
// Shelf positions for regular, rotated, and extra-long shelves 
const positions = [];

// Create 7 regular shelves 'rotated' 'regular' 'extraLong' 'extraLong_Rotated'
for (let i = 0; i < 7; i++) {
    positions.push({ startX: -10, startZ: -5 + 10 * i, shelfType: 'regular' });
}

// Create 5 regular shelves
for (let i = 0; i < 5; i++) {
    positions.push({ startX: 10, startZ: 25 + 10 * i, shelfType: 'regular' });
}

// Create 4 regular shelves
for (let i = 0; i < 4; i++) {
    positions.push({ startX: 30, startZ: 15 + 10 * i, shelfType: 'regular' });
}

// Additional Individual shelves add here  'rotated' 'regular' 'extraLong' 'extraLong_Rotated' 
positions.push({ startX: -10, startZ: -40, shelfType: 'extraLong' });
positions.push({ startX: -50, startZ: -40, shelfType: 'extraLong' });
positions.push({ startX: -50, startZ: 50, shelfType: 'extraLong_Rotated' });

// console.log(positions);

// desk.position.set(90, deskHeight / 2, -10); // Adjust as needed
// desk.rotation.set(0, Math.PI / 2, 0);
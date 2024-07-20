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

const shelfSetNames = [
    "1stRow_Midsection",   // Shelf Set 1
    "2ndRow_Midsection",   // Shelf Set 2
    "3rdRow_Midsection",   // Shelf Set 3
    "4thRow_Midsection",   // Shelf Set 4
    "5thRow_Midsection",   // Shelf Set 5
    "6thRow_Midsection",   // Shelf Set 6
    "7thRow_Midsection",   // Shelf Set 7

    "1stRow_Top_Section",   // Top section 1
    "2ndRow_Top_Section",   // Top section 2
    "3rdRow_Top_Section",   // Top section 3
    "4thRow_Top_Section",   // Top section 4
    
    "1stRow_Fuel_Section",   // Fuel Section 1st row
    "2ndRow_Fuel_Section",   // Fuel Section 2nd row
    "3rdRow_Fuel_Section",   // Fuel Section 3rd row
    "4thRow_Fuel_Section",   // Fuel Section 4th row
    "5thRow_Fuel_Section",   // Fuel Section 5th row
    
    "East_Shelf",   // extra Long shelf
    "South Shelf",  // extra Long shelf
    "heater_Rod_Shelf_South_Corner",   // extra Long shelf
    // Add more names as needed
];

// Initialize empty array
// Shelf positions for regular, rotated, and extra-long shelves 
const positions = [];

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

// create positions for extra long shelves  shelf types extraLong_Rotated, regular, rotated, extraLong
positions.push({ startX: -80, startZ: 50, shelfType: 'extraLongRotated', shelfSetName: extraLongShelfNames [0], setIndex: 3 });

// create positions for extra long shelves  shelf types extraLong_Rotated, regular, rotated, extraLong
positions.push({ startX: 0, startZ: -50, shelfType: 'extraLong', shelfSetName: extraLongShelfNames [1], setIndex: 3 });

// create positions for extra long shelves  shelf types extraLong_Rotated, regular, rotated, extraLong
positions.push({ startX: 0, startZ: -70, shelfType: 'extraLong', shelfSetName: extraLongShelfNames [2], setIndex: 3 });

// console.log(positions);

// desk.position.set(90, deskHeight / 2, -10); // Adjust as needed
// desk.rotation.set(0, Math.PI / 2, 0);

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
    midsectionNames.push(`Row_${i + 1}_Midsection`);
}

// Top section names
for (let i = 0; i < 4; i++) {
    topSectionNames.push(`Row_${i + 1}_Top_Section`);
}

// Fuel section names
for (let i = 0; i < 5; i++) {
    fuelSectionNames.push(`Row_${i + 1}_Fuel_Section`);
}

/*
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
*/
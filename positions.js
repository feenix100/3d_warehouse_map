// shelfPositions.js

// Initial positions for regular shelves
export const initialPositions = [
    { startX: -20, startZ: 0, shelfType: 'regular' }, // First set of regular shelves
    { startX: -10, startZ: -5, shelfType: 'regular' }, //shelf 1
    { startX: -10, startZ: 5, shelfType: 'regular' }, //shelf 2
    { startX: -10, startZ: 15, shelfType: 'regular' }, //shelf 3
    { startX: -10, startZ: 25, shelfType: 'regular' }, //shelf 4
    { startX: -10, startZ: 35, shelfType: 'regular' }, //shelf 5
    { startX: -10, startZ: 45, shelfType: 'regular' }, //shelf 6
    { startX: -10, startZ: 55, shelfType: 'regular' }, //shelf 7

    { startX: 10, startZ: 25, shelfType: 'regular' }, //shelf 8
    { startX: 10, startZ: 35, shelfType: 'regular' }, //shelf 9
    { startX: 10, startZ: 45, shelfType: 'regular' }, //shelf 10
    { startX: 10, startZ: 55, shelfType: 'regular' }, //shelf 11

    { startX: 70, startZ: 70, shelfType: 'regular' }, //shelf 8
    { startX: 70, startZ: 75, shelfType: 'regular' }, //shelf 9
    { startX: 70, startZ: 80, shelfType: 'regular' }, //shelf 10
    { startX: 70, startZ: 85, shelfType: 'regular' }, //shelf 11
    { startX: 70, startZ: 90, shelfType: 'regular' }, //shelf 11

    { startX: -90, startZ: 0, shelfType: 'rotated' },  // Second set of rotated shelves


    { startX: 20, startZ: 0, shelfType: 'extraLong' }  // Third set of extra-long shelves
];

// Positions for extra-long shelves
export const extraLongPositions = [
    { startX: -100, startZ: 0 },
    { startX: 0, startZ: -100 },
    { startX: 100, startZ: 0 }
];
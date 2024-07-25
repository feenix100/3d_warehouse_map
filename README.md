# 3D Map for a Machine Parts Distribution Warehouse

### Overview

This project utilizes [three.js](https://threejs.org/), a powerful JavaScript 3D library, to create an interactive and immersive map of a machine parts distribution warehouse.

### Getting Started

- **View the Project**: Open `index.html` in a browser. Click and drag the cursor to change the view.
- **GUI Interaction**: `gui_sliders.html` demonstrates how to use the dat-gui JavaScript library to interact with 3D objects via three.js.

### Development Branch

- **Current Branch**: `warehouse2300` is the active development branch for this project.

### Project Description

This project aims to create a three-dimensional map of the shelves in a machine parts distribution warehouse. The warehouse comprises approximately 20 rows of shelves.

#### Key Features:
- **Part Number Display**: Each shelf is filled with parts labeled and organized by numbers, four to six digits in length (e.g., 8421, 100201). There are about 3000 different parts in the warehouse.
- **Data Management**: Part numbers are stored in an Excel spreadsheet. These will be exported to a CSV file and then imported into the JavaScript code to populate the numbers on the shelves.
- **Portability**: All code will be written in one file to enhance portability between systems. While splitting the code into multiple files could make it cleaner, it may also complicate other aspects.

### Display and Interaction

#### Display Options:
I am exploring various methods to display numbers on each shelf, such as drop boxes or text objects. The chosen method should allow for easy editing of values and positions.

#### Search Functionality:
Numbers should be searchable, and when a number is found, it should be highlighted on the corresponding shelf.

### Technical Specifications

- **Groups of Shelves**:
  - **Top Section**: 4 rows of shelves.
  - **Middle Section**: 7 rows of shelves.
  - **Fuel Section**: 5 rows of shelves.
  - **Extra-Long Shelves**: 3 extra-long shelves along the warehouse walls.

- **Shelf Details**:
  - Each row of shelves contains machine parts, each with a unique number between 4 and 6 digits.
  - The code should accurately represent each shelf in the warehouse.
  - Shelves should be capable of rotating on the y-axis and moving forward/backward left/right on the x and z axes.

### Code Structure

To keep things simple and maintain local usage, the code will be organized into one or two files:
- `index.html`
- `script.js`

### Visualization and Usability

This project provides a visual representation of the shelves in a physical warehouse, using JavaScript to display the shelves and the floor. The shelves house machine parts that are awaiting distribution to technicians.

### Next Steps

1. **Open `index.html`**: Open the file in a browser to start exploring the 3D map.
2. **Experiment with GUI**: Use `gui_sliders.html` to interact with 3D objects and see the potential of the dat-gui library.
3. **Optimize Display**: Determine the most efficient way to display and edit numbers on the shelves.
4. **Implement Search**: Ensure numbers are searchable and highlight them on the shelves when found.

By following these steps and utilizing the features of three.js and dat-gui, this project aims to create a functional, easy-to-use, and visually appealing 3D map of a machine parts distribution warehouse.

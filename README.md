# 3D Map for a Machine Parts Distribution Warehouse 

### This project will use [three.js](https://threejs.org/), a JavaScript 3D library.

This is a work in progress. Open `index.html` in a browser. Click and drag the cursor to change the view.

`gui_sliders.html` is an example of how to use the dat-gui JavaScript library to interact with 3D objects using the three.js library.

`warehouse2300` is the development branch.

I am creating a three-dimensional map of the shelves in a machine parts distribution warehouse. There are about 20 rows of shelves in the warehouse.

I am still trying to decide how to display the numbers on each shelf. Should I use a drop box, text objects, or something else? I need to be able to easily edit the values and positions of the numbers on the shelves.

Each shelf is filled with parts that are labeled and organized using numbers, four to six digits in length. Example: 8421, 100201. There are about 3000 different parts in the warehouse.

I have the part numbers in an Excel spreadsheet. I will export them to a CSV file, then import them into the JavaScript code to fill in the numbers on the shelves.

The goal is to use code to create an easy-to-update and edit, three-dimensional map that can be run fast and easily on multiple computer systems.

I will write all the code in one file to increase portability between systems. Splitting the code into multiple files could make it cleaner, but more complicated in other ways.

I will attempt to use the three.js JavaScript library to accomplish this.

This is a representation of the shelves in a physical warehouse, using JavaScript to display the shelves and floor. The shelves in the warehouse hold machine parts waiting to be distributed to technicians.

To use, open `index.html` in a browser. `index.html` and `app.js` should be in the same directory.

I plan on using this locally. I will attempt to keep the code in one or two files (`index.html` and `app.js`) to keep things simple.

### Specifications for the 3D Shelf Map:

- **Shelves**:
  - There are four groups (of rows) of shelves in the warehouse:
    - One group has 4 rows of shelves (top section).
    - One group has 7 rows of shelves (middle section).
    - One group has 5 rows of shelves (fuel section).
  - There are 3 extra-long shelves along the walls of the warehouse.
  - Each row of shelves is full of machine parts. Each part has a different number between 4 and 6 digits.

- **Code Requirements**:
  - The code should represent each shelf in the warehouse.
  - Each shelf should be able to rotate on the y-axis and move forward/backward left/right on the x and z axes.

### Displaying Numbers:
- How to display numbers? Inside a 2D div, is there an efficient way to display dozens of 3D numbers?
- Numbers should be searchable.
- When a number is searched for and found, it should be highlighted on the shelf.


# 3d Map for a Machine Parts Distribution Warehouse 

### This project will use [three.js](https://threejs.org/), a javascript 3d library

This is a work in progress, open index.html in a browser. Click and drag the cursor to change the view.

gui_sliders.html is an example of how to use the dat-gui javascript library to interact with 3d objects using the three.js library

warehouse2300 is the development branch.

I am creating a three dimensional map of the shelves in a machine parts distribution warehouse. There are about 20 rows of shelves in the warehouse. 

I am still trying to decide how to display the numbers on each shelf, should I use a drop box, or text objects or something else?
I need to be able to easily edit the values and positions of the numbers on the shelves.

Each shelf is filled with parts that are labeled and organized using numbers, four to six digits in length. Example 8421, 100201. There are about 3000 different parts in the warehouse.

I have the part numbers in an excel spreadsheet, I will export them to csv file, then import them into the javascript code to fill in the numbers on the shelves.

The goal is to use code to create an easy to update and edit, 3-dimensional map that can be run fast and easy on multiple computer systems.

I will write all the code in one file to increase portability between systems. Splitting the code into multiple files could make it cleaner, but more complicated in other ways.

I will attempt to use the three.js javascript library to accomplish this.

This is a representation of the shelves in a physical warehouse, using javascript to display the shelves and floor.
The shelves in the warehouse hold machine parts waiting to be distributed to technicians.

To use, open index.html in a browser. index.html and script.js should be in the same directory.

I plan on using this locally, I will attempt to keep the code in one or two files.
index.html and script.js, to keep things simple.

specifications for 3-dimensional shelf map:

There are four groups (of rows) of shelves in the warehouse
one group has 4 rows of shelves, top section, 
one group has 7 rows of shelves, middle section
one group has 5 rows shelves, fuel section

there are 3 extra long shelves along the walls of the warehouse 


each row of shelves is full of machine parts
each part has a different number between 4 and 6 digits

The code should represent each shelf in the warehouse 

each shelf should be able to rotate on y axis, and move forward/backward left/right on x and z axis


how to display numbers? inside a 2D div, is there an efficient way to display dozens of 3d numbers?
numbers should be searchable
when a number is searched for and found it should be highlighted on the shelf


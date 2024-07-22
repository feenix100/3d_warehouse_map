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

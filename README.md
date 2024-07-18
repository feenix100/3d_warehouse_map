# 3d Map for a Machine Parts Distribution Warehouse 
# Using three.js, a javascript 3d library

This is a work in progress, open index.html in a browser. Click and drag the cursor to change the view.

warehouse2300 is the development branch.

I am creating a three dimensional map of the shelves in a machine parts distribution warehouse. There are about 20 rows of shelves in the warehouse. 

I am still trying to decide how to display the numbers on each shelf, should I use a drop box, or text objects or something else?
I need to be able to easily edit the values and positions of the numbers on the shelves.

Each shelf is filled with parts that are labeled and organized using numbers, four to six digits in length. Example 8421, 100201. There are about 3000 different parts in the warehouse.

I have the part numbers in an excel spreadsheet, I will export them to csv file, then import them into the javascript code to fill in the numbers on the shelves.

The goal is to use code to create an easy to update and edit, 3-dimensional map that can be run fast and easy on multiple computer systems.


I will attempt to use three.js to accomplish this.

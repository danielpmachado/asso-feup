## Theme: Case-Study - SimpleDraw

## Installing and Running

First run `npm install`
then run `npm run broswer`
You should open in a browser the index.html file that contains the simpledraw commands executed.

## Developer Documentation

When you run from npm the main is `script.ts` this script will draw a circle and two rectangles.
To start developing first start editing this script.

## Final Result

![UML](https://github.com/dolfander/asso-feup/blob/master/simple_draw.png)

## Approach

#### Simple Draw

SimpleDraw is a very simple  graphical editor to draw basic geometric objects, manipulate and persist them. In order to implement this graphical editor we should look at some considerations:

* Use HTML-related technologies (SVG and Canvas)
* All client-side (running in the browser)
* Typescript instead of pure javascript 
* Zero-dependencies for the engine (i.e. d3)
* Libraries for non-engine stuff only (i.e. sass, bootstrap)
 
#### Implementation Details

During our classes we have already some functionalities implemented, such as:

* SimpleDraw is based on the notion of documents;
* Documents are rendered either in SVG or HTMLCanvas;
* Multiple views of the same model;
* Two interaction modes: point-n-click and REPLs.
* Support persistence in multiple formats (TXT, XML, BIN);
* Extendible with different objects (triangles, arrows…);
* Extendible with new tools (rotate, translate, grid…);
* Support (un)limited Undo / Redo of all operations;


So, for **our project** we intend to do the following ones:

* Drag to select multiple objects
* Viewport tools (translate, zoom)
* Different view styles per viewport (wireframe, color)
* Two interaction modes: point-n-click and REPLs
* Add Identifiers to the shapes
* Extract the logic of the Undo/Redo to a generic UndoManager
* Support groups and selections based on: (a) programmatic references, or (b) a bounding box
* Document layers ('n' layers, where the visibility of 'n+1' is always 'on top' of 'n')
* Viewports transformation (for example, by specifying the bounding box of a Render)
* Play around with new shapes, tools, styles and other stuff

## Group Members
* Daniel Machado
* Gonçalo Moreno
* Sofia Alves


# Implementation Details

During the coding of SimpleDraw we consired the following points important for understading of the project and its implementation.

## Features Done

* Shapes drawing in Canvas and SVG
* Possible shapes : rectangle, circle, triangle, polygon
* Different layers view 
* Adds new shapes in different layers 
* New shapes are created in the console
* Undo/Redo tool for all actions
* Move and rotate objects both in console and toolbox
* Zoom of both scenes (Canvas and SVG)
* Wireframe tool 
* Color tool
* Exports file both in TXT and XML
* Imports file 


## Design patterns

### Architectural

#### MVC

The basis of SimpleDraw is a MVC (Model View Controller), the view is done on render.ts, the model are the layers and shapes and (layer.ts and shape.ts) and the controller is the document, document.ts

![UML](https://github.com/sofia-bahamonde/feup-asso/blob/master/MVC.jpg)


### Behavioral & Structural

#### Bridge

In order to render the shapes into the canvas we used the bridge design pattern.
Each canvas has a renderer, that contains methods for zoom and drawing, drawing on ther other hand is done by APIs each representing a different view style.

![UML](https://github.com/sofia-bahamonde/feup-asso/blob/master/bridge.jpg)

#### Interpreter

For the commands written in the command line we used the Interpretator pattern. A pattern that specifies how to evaluate sentences in a language. The basic idea is to have a class for each symbol (terminal or nonterminal) in a specialized computer language and make it simpler for the user to interact with the program. This pattern also allowed us to easily implement the Import functionality since we only needed to build an interface between the strutured file inforamtion and our Interpreter.

#### State

Each tool requires to have its own internal state, more specifically the inital object to edit, at each click of the canvas the document object sends the selected tool the position, the tool does it updates to itself and also the shapes.

#### Strategy

For the FileIO, exporting in different formats we used the strategy pattern, the different exporters/importers can be changed at runtime.

![UML](https://github.com/sofia-bahamonde/feup-asso/blob/master/strategy.jpg)


#### Template method

Template method has a recurrent apperance, used in the definition of the various polygons, tools and also rendereres.

As for the undo and redo operations we based our solution in the partialy implement project that was provided to us.




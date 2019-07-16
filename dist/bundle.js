(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shape_1 = require("./shape");
class ZoomAction {
    constructor(doc, renders, factor) {
        this.doc = doc;
        this.renders = renders;
        this.factor = factor;
    }
    do() {
        for (var r of this.renders) {
            r.zoom(this.factor, true);
        }
    }
    undo() {
        for (var r of this.renders) {
            r.zoom(this.factor, false);
        }
    }
}
exports.ZoomAction = ZoomAction;
class CreateShapeAction {
    constructor(doc, shape) {
        this.doc = doc;
        this.shape = shape;
    }
    do() {
        this.doc.add(this.shape);
        return this.shape;
    }
    undo() {
        this.doc.remove(this.shape);
    }
}
class CreateCircleAction extends CreateShapeAction {
    constructor(doc, points, radius) {
        super(doc, new shape_1.Circle(points, radius));
        this.points = points;
        this.radius = radius;
    }
}
exports.CreateCircleAction = CreateCircleAction;
class CreatePolygonAction extends CreateShapeAction {
    constructor(doc, points) {
        super(doc, new shape_1.Polygon(points));
        this.points = points;
    }
}
exports.CreatePolygonAction = CreatePolygonAction;
class CreateRectangleAction extends CreateShapeAction {
    constructor(doc, points, width, height) {
        super(doc, new shape_1.Rectangle(points, width, height));
        this.points = points;
        this.width = width;
        this.height = height;
    }
}
exports.CreateRectangleAction = CreateRectangleAction;
class TranslateAction {
    constructor(doc, shape, xd, yd) {
        this.doc = doc;
        this.shape = shape;
        this.xd = xd;
        this.yd = yd;
    }
    do() {
        this.shape.translate(this.xd, this.yd);
    }
    undo() {
        this.shape.translate(-this.xd, -this.yd);
    }
}
exports.TranslateAction = TranslateAction;
class RotationAction {
    constructor(doc, shape, angle) {
        this.doc = doc;
        this.shape = shape;
        this.angle = angle;
    }
    do() {
        this.shape.rotate(this.angle);
    }
    undo() {
        this.shape.rotate(-this.angle);
    }
}
exports.RotationAction = RotationAction;

},{"./shape":8}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("./actions");
const undo_1 = require("./undo");
const layer_1 = require("./layer");
const toolbox_1 = require("./toolbox");
class SimpleDrawDocument {
    constructor(update_call) {
        this.objects = new Array();
        this.undoManager = new undo_1.UndoManager();
        this.shapeDropbox = document.getElementById("shape-dropdown");
        this.uielems = new Array();
        this.update = update_call;
    }
    undo() {
        this.undoManager.undo();
    }
    redo() {
        this.undoManager.redo();
    }
    drawUI(uiRender) {
        uiRender.draw(...this.uielems);
        this.setToolListeners();
    }
    draw(render) {
        // this.objects.forEach(o => o.draw(ctx))
        render.draw(this.getElemsToDraw());
    }
    selectShape(shape_id) {
        for (var shape of this.getElemsToDraw()) {
            if (shape.getID() == shape_id) {
                shape.setHighlight(true);
            }
            else {
                shape.setHighlight(false);
            }
        }
    }
    getSelLayer() {
        var e = document.getElementById("layers");
        var str_value = e.getElementsByClassName("active")[0].children[0].innerHTML;
        return parseInt(str_value, 10);
    }
    zoom(renders, factor) {
        this.do(new actions_1.ZoomAction(this, renders, factor));
    }
    add(r) {
        var option = document.createElement("OPTION");
        option.setAttribute("value", r.getID());
        option.innerHTML = r.getID();
        this.shapeDropbox.appendChild(option);
        this.getLayers().addShape(r, this.getSelLayer());
        //this.objects.push(r)
    }
    remove(shape) {
        var children = this.shapeDropbox.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.getAttribute("value") == shape.getID()) {
                child.remove();
            }
        }
        this.getLayers().removeObject(shape);
    }
    do(a) {
        this.undoManager.onActionDone(a);
        const action_return = a.do();
        this.update();
        return action_return;
    }
    createRectangle(points, width, height) {
        return this.do(new actions_1.CreateRectangleAction(this, points, width, height));
    }
    createCircle(points, radius) {
        return this.do(new actions_1.CreateCircleAction(this, points, radius));
    }
    createPolygon(points) {
        return this.do(new actions_1.CreatePolygonAction(this, points));
    }
    translate(id, xd, yd) {
        return this.do(new actions_1.TranslateAction(this, this.getShape(id), xd, yd));
    }
    rotate(id, angle) {
        return this.do(new actions_1.RotationAction(this, this.getShape(id), angle));
    }
    getShape(id) {
        let shapes = this.getElemsToDraw();
        for (var i = 0; i < shapes.length; i++) {
            if (shapes[i].getID() == id) {
                return shapes[i];
            }
        }
        return null;
    }
    addUIElem(elem) {
        var found = Boolean(false);
        this.uielems.forEach(element => {
            if (element === elem) {
                found = true;
                element = elem;
            }
        });
        if (found == false) {
            this.uielems.push(elem);
        }
    }
    getElemsToDraw() {
        //Figure out if the concept of layers exists, if not just return objects vector
        let shapes_draw = null;
        this.uielems.forEach(element => {
            if (element instanceof layer_1.Layers) {
                shapes_draw = element.getSortedShapes();
            }
        });
        return shapes_draw;
    }
    export(fileio) {
        fileio.export(this.getElemsToDraw());
    }
    import(fileio) {
        this.uielems.forEach(element => {
            if (element instanceof layer_1.Layers) {
                var layers = new layer_1.Layers();
                var new_layer = new layer_1.Layer(0, true);
                new_layer.addShapes(fileio.import("FILE"));
                layers.addLayer(new_layer);
                element = layers;
            }
        });
    }
    getToolbox() {
        let f_tb = null;
        this.uielems.forEach(element => {
            if (element instanceof toolbox_1.ToolBox) {
                f_tb = element;
            }
        });
        return f_tb;
    }
    getLayers() {
        let f_layers = null;
        this.uielems.forEach(element => {
            if (element instanceof layer_1.Layers) {
                f_layers = element;
            }
        });
        return f_layers;
    }
    canvasNotification(x, y) {
        console.log("X: " + x.toString() + "Y: " + y.toString());
        this.uielems.forEach(element => {
            if (element instanceof toolbox_1.ToolBox) {
                const tool = element.getSelTool();
                if (tool != null) {
                    //todo detect if a shape was clicked
                    if (tool.sendInput(x, y, null) == true) {
                        element.unSelectTool();
                    }
                    return;
                }
            }
        });
        this.update();
    }
    getSelShape() {
        var sel_box = this.shapeDropbox;
        var shape_id = sel_box.options[sel_box.selectedIndex].value;
        let f_shape = null;
        this.getElemsToDraw().forEach(shape => {
            if (shape.getID() == shape_id) {
                f_shape = shape;
            }
        });
        return f_shape;
    }
    clicked_tool(tool_name) {
        this.getToolbox().clicked_tool(tool_name, this.getSelShape());
    }
    nextLayer() {
        let current_sel = this.getSelLayer();
        let html_layers = document.getElementById("layers");
        let active = html_layers.getElementsByClassName("active")[0];
        active.className = active.className.replace(/(?:^|\s)active(?!\S)/g, '');
        html_layers.children[((current_sel + 1) % this.getLayers().getLayers().length) + 1].className += " active";
    }
    prevLayer() {
        let current_sel = this.getSelLayer();
        let html_layers = document.getElementById("layers");
        let active = html_layers.getElementsByClassName("active")[0];
        active.className = active.className.replace(/(?:^|\s)active(?!\S)/g, '');
        html_layers.children[((current_sel - 1) % this.getLayers().getLayers().length) + 1].className += " active";
    }
    setLayersListeners() {
        let doc = this;
        document.getElementById("nextlayer").addEventListener("click", function () {
            doc.nextLayer();
        });
        document.getElementById("prevlayer").addEventListener("click", function () {
            doc.prevLayer();
        });
    }
    setToolListeners() {
        var tools = document.getElementById("tools");
        let doc = this;
        for (let child_i = 0; child_i < tools.children.length; child_i++) {
            const tool = tools.children[child_i];
            tool.addEventListener("click", function () {
                const tool_p = tool.children[0];
                doc.clicked_tool(tool_p.innerText);
                doc.update();
            });
        }
        this.setLayersListeners();
    }
}
exports.SimpleDrawDocument = SimpleDrawDocument;

},{"./actions":1,"./layer":5,"./toolbox":10,"./undo":11}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shape_1 = require("./shape");
class TXT {
    constructor(sizex, sizey) {
        console.log("Init of BMP FileIO");
    }
    import(fileloc) {
        // var file = document.getElementById("fileForUpload").files[0];
        // if (file) {
        //     var reader = new FileReader();
        //     reader.readAsText(file, "UTF-8");
        //     reader.onload = function (evt) {
        //         document.getElementById("fileContents").innerHTML = evt.target.result;
        //     }
        //     reader.onerror = function (evt) {
        //         document.getElementById("fileContents").innerHTML = "error reading file";
        //     }
        // }
        return Array();
    }
    export(shapes) {
        var fileData = '';
        for (var shape in shapes) {
            var shapeName = '';
            if (shapes[shape] instanceof shape_1.Rectangle)
                shapeName = "Rectangle";
            else if (shapes[shape] instanceof shape_1.Circle)
                shapeName = "Circle";
            else if (shapes[shape] instanceof shape_1.Polygon)
                shapeName = "Polygon";
            fileData += shapes[shape].getID() + ' ' + shapes[shape].color + ' ' + shapeName + ' ' + shapes[shape].points + shapes[shape].getUnique() + '\n';
        }
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileData));
        element.setAttribute('download', 'save.txt');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        return true;
    }
}
exports.TXT = TXT;
class XML {
    constructor() {
        this.doc = document.implementation.createDocument('', '', null);
        console.log("Init of XML FileIO");
    }
    import(fileloc) {
        console.log("Importing from XML");
        return Array();
    }
    export(shapes) {
        let xmlData = this.doc.createElement('objects');
        for (var shape in shapes) {
            var shapeName = '';
            if (shapes[shape] instanceof shape_1.Rectangle) {
                var e = this.doc.createElement('rect');
                shapeName = "Rectangle";
            }
            if (shapes[shape] instanceof shape_1.Circle) {
                var e = this.doc.createElement('circ');
                shapeName = "Circle";
            }
            if (shapes[shape] instanceof shape_1.Polygon) {
                var e = this.doc.createElement('poly');
                shapeName = "Polygon";
            }
            e.setAttribute('id', shapes[shape].getID());
            e.setAttribute('color', shapes[shape].color.toString());
            e.setAttribute('name', shapeName.toString());
            e.setAttribute('points', shapes[shape].points.toString());
            e.setAttribute('unique', shapes[shape].getUnique());
            xmlData.appendChild(e);
        }
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(xmlData)));
        element.setAttribute('download', 'save.xml');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        return true;
    }
}
exports.XML = XML;

},{"./shape":8}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Interpreter;
(function (Interpreter) {
    class Context {
        constructor(doc, can, svg, commands) {
            this.document = doc;
            this.canvas = can;
            this.svg = svg;
            this.command = commands.split(" ");
        }
    }
    Interpreter.Context = Context;
    class CommandExpression {
        constructor(cmd) {
            this.command = cmd;
        }
        interpret(context) {
            switch (context.command[0]) {
                case 'draw':
                    let objectExpression = new ShapeExpression(context.command[1]);
                    objectExpression.interpret(context);
                    break;
                case 'translate':
                    let translateExpression = new TranslateExpression(context.command);
                    translateExpression.interpret(context);
                    break;
                case 'rotate':
                    let rotateExpression = new RotateExpression(context.command);
                    rotateExpression.interpret(context);
                    break;
                case 'zoom':
                    let zoomExpression = new ZoomExpression(context.command[1]);
                    zoomExpression.interpret(context);
                case 'fill':
                    let fillExpression = new FillExpression(context.command);
                    fillExpression.interpret(context);
                default:
                    break;
            }
            context.document.draw(context.canvas);
            context.document.draw(context.svg);
        }
    }
    Interpreter.CommandExpression = CommandExpression;
    class ShapeExpression {
        constructor(shape) {
            this.shape = shape;
        }
        interpret(context) {
            switch (this.shape) {
                case 'rectangle':
                    let rectangleExpression = new RectangleExpression(context.command[2], context.command[3], context.command[4], context.command[5]);
                    rectangleExpression.interpret(context);
                    break;
                case 'circle':
                    let circleExpression = new CircleExpression(context.command[2], context.command[3], context.command[4]);
                    circleExpression.interpret(context);
                    break;
                case 'triangle':
                    let triangleExpression = new PolygonExpression(context.command);
                    triangleExpression.interpret(context);
                    break;
                case 'polygon':
                    let polygonExpression = new PolygonExpression(context.command);
                    polygonExpression.interpret(context);
                    break;
                default:
                    break;
            }
        }
    }
    class RectangleExpression {
        constructor(x, y, width, height) {
            this.x = parseInt(x);
            this.y = parseInt(y);
            this.width = parseInt(width);
            this.height = parseInt(height);
        }
        interpret(context) {
            context.document.createRectangle([this.x, this.y], this.width, this.height);
        }
    }
    class CircleExpression {
        constructor(x, y, radius) {
            this.x = parseInt(x);
            this.y = parseInt(y);
            this.radius = parseInt(radius);
        }
        interpret(context) {
            context.document.createCircle([this.x, this.y], this.radius);
        }
    }
    class PolygonExpression {
        constructor(command) {
            this.points = [];
            for (var i = 2; i < command.length; i++) {
                this.points.push(parseInt(command[i]));
            }
            console.log(this.points);
        }
        interpret(context) {
            context.document.createPolygon(this.points);
        }
    }
    class TranslateExpression {
        constructor(command) {
            this.shape_id = command[1];
            this.x = parseInt(command[2]);
            this.y = parseInt(command[3]);
        }
        interpret(context) {
            context.document.translate(this.shape_id, this.x, this.y);
        }
    }
    class RotateExpression {
        constructor(command) {
            this.shape_id = command[1];
            this.angle = parseInt(command[2]);
        }
        interpret(context) {
            context.document.rotate(this.shape_id, this.angle);
        }
    }
    class ZoomExpression {
        constructor(factor_str) {
            this.factor = parseInt(factor_str);
        }
        interpret(context) {
            context.document.zoom([context.svg, context.canvas], this.factor);
        }
    }
    class FillExpression {
        constructor(command) {
            this.color = command[2];
            this.shape_id = command[3];
        }
        interpret(context) {
        }
    }
})(Interpreter = exports.Interpreter || (exports.Interpreter = {}));

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Layer {
    constructor(pos, visible) {
        this.pos = pos;
        this.visible = visible;
        this.objects = new Array();
    }
    addShape(sh) {
        this.objects.push(sh);
    }
    getShapes() {
        return this.objects;
    }
    removeShape(i) {
        this.objects.splice(i, 1);
    }
    addShapes(shapes) {
        shapes.forEach(element => {
            this.addShape(element);
        });
    }
}
exports.Layer = Layer;
class Layers {
    constructor() {
        this.layers = new Array();
    }
    addLayer(layer) {
        layer.pos = this.layers.length;
        this.layers.push(layer);
    }
    addLayernew() {
        this.layers.push(new Layer(this.layers.length, true));
    }
    addShape(sh, layer_id) {
        if (layer_id >= this.layers.length) {
            console.log("Invalid Layer");
            return false;
        }
        this.layers[layer_id].addShape(sh);
        return true;
    }
    getLayers() {
        return this.layers;
    }
    removeObject(shape) {
        console.log("remove object");
        for (let l of this.layers) {
            let objects = l.getShapes();
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].getID() == shape.getID()) {
                    l.removeShape(i);
                    break;
                }
            }
        }
    }
    getSortedShapes() {
        let objs = Array();
        for (let layer_it = this.layers.length - 1; layer_it >= 0; layer_it--) {
            console.log("Getting Sorted Shapes: " + this.layers[layer_it].getShapes());
            this.layers[layer_it].getShapes().forEach(obj => {
                objs.push(obj);
            });
        }
        //console.log("Getting Sorted Shapes: " + this.layers[1].getShapes())
        return objs;
    }
}
exports.Layers = Layers;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shape_1 = require("./shape");
const toolbox_1 = require("./toolbox");
const layer_1 = require("./layer");
class InterfaceRender {
    draw(...elems) {
        console.log("Interface Rendering");
        for (const elem of elems) {
            if (elem instanceof toolbox_1.ToolBox) {
                console.log("Drawing ToolBox");
                var toolbox_html = document.getElementById('tools');
                let tb_html = "";
                elem.getTools().forEach(tool => {
                    // tb_html += "<div onclick=\"clicked_tool('" + tool.name +"')\" > <p> " + tool.name + " </p> </div>"
                    tb_html += "<div > <button class='btn btn-outline-primary' style='width:-webkit-fill-available; margin-bottom:1em;'> " + tool.name + " </button> </div>";
                });
                toolbox_html.innerHTML = tb_html;
            }
            else if (elem instanceof layer_1.Layers) {
                console.log("Drawing Layers");
                var layers_elem = document.getElementById('layers');
                let layers_html = "<li id=\"nextlayer\" class=\"page-item\"> <a class=\"page-link\" href=\"#\">&raquo;</a> </li>";
                let active_numb = 1;
                for (let layer_it = 0; layer_it < elem.getLayers().length; layer_it++) {
                    if (layer_it == active_numb)
                        layers_html += "<li class=\"page-item active\"> <a class=\"page-link\" href=\"#\"> " + elem.getLayers()[layer_it].pos + " </a> </li>";
                    else
                        layers_html += "<li class=\"page-item\"> <a class=\"page-link\" href=\"#\"> " + elem.getLayers()[layer_it].pos + " </a> </li>";
                }
                layers_elem.innerHTML = layers_html; //+ " <li id=\"prevlayer\" class=\"page-item\"> <a class=\"page-link\" href=\"#\">&raquo;</a> </li> "
            }
        }
    }
}
exports.InterfaceRender = InterfaceRender;
class Render {
    constructor(drawAPI) {
        this.drawAPI = drawAPI;
    }
    draw(objs) {
        this.drawAPI.draw(...objs);
    }
    zoom(factor, positive) {
        this.drawAPI.zoom(factor, positive);
    }
    setDrawAPI(dapi) {
        this.drawAPI = dapi;
    }
    getDrawAPI() {
        return this.drawAPI;
    }
}
exports.Render = Render;
class SVGAPI {
    constructor() {
        this.factor = 400;
    }
    draw(...objs) {
        var svg = document.getElementById('svgcanvas');
        var xmlns = "http://www.w3.org/2000/svg";
        var svgElem = document.createElementNS(xmlns, "svg");
        svgElem.setAttributeNS(null, "id", "svgcanvas");
        svgElem.setAttributeNS(null, "width", '400');
        svgElem.setAttributeNS(null, "height", '400');
        svgElem.setAttributeNS(null, "style", "border: 2px solid black; border-radius: 5px 5px 5px 5px/25px 25px 25px 5px;");
        svgElem.setAttributeNS(null, "viewBox", "0 0 " + this.factor + " " + this.factor);
        svg.remove();
        document.getElementById("all_canvas").appendChild(svgElem);
        svg = document.getElementById('svgcanvas');
        for (const shape of objs) {
            if (shape instanceof shape_1.Circle) {
                const circle = document.createElementNS(xmlns, "circle");
                this.setStyle(shape, circle);
                circle.setAttribute("cx", shape.points[0].toString());
                circle.setAttribute("cy", shape.points[1].toString());
                circle.setAttribute("r", shape.radius.toString());
                svg.appendChild(circle);
            }
            else if (shape instanceof shape_1.Polygon || shape instanceof shape_1.Rectangle) {
                const polygon = document.createElementNS(xmlns, "polygon");
                this.setStyle(shape, polygon);
                var textPoints = '';
                for (var item = 0; item < shape.points.length - 1; item += 2)
                    textPoints += shape.points[item] + ',' + shape.points[item + 1] + ' ';
                polygon.setAttribute('points', textPoints);
                svg.appendChild(polygon);
            }
        }
    }
    zoom(factor, positive) {
        if (positive)
            this.factor = 400 / factor;
        else
            this.factor = this.factor * factor;
    }
}
class SVGWireframeAPI extends SVGAPI {
    setStyle(shape, element) {
        if (shape.hightlighted)
            element.setAttribute('style', 'stroke: ' + shape.color + '; stroke-width: 0.8%; fill: white');
        else
            element.setAttribute('style', 'stroke: ' + shape.color + '; fill: white');
    }
}
exports.SVGWireframeAPI = SVGWireframeAPI;
class SVGFillAPI extends SVGAPI {
    setStyle(shape, element) {
        if (shape.hightlighted)
            element.setAttribute('style', 'stroke: red; stroke-width: 0.8%; fill:  ' + shape.color);
        else
            element.setAttribute('style', 'stroke: ' + shape.color + '; fill:  ' + shape.color);
    }
}
exports.SVGFillAPI = SVGFillAPI;
class CanvasAPI {
    draw(...objs) {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const shape of objs) {
            if (shape instanceof shape_1.Circle) {
                this.ctx.beginPath();
                this.ctx.arc(shape.points[0], shape.points[1], shape.radius, 0, 2 * Math.PI);
                this.ctx.closePath();
            }
            else if (shape instanceof shape_1.Polygon || shape instanceof shape_1.Rectangle) {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.points[0], shape.points[1]);
                for (var item = 2; item < shape.points.length - 1; item += 2) {
                    this.ctx.lineTo(shape.points[item], shape.points[item + 1]);
                }
                this.ctx.closePath();
            }
            this.drawShape(shape);
        }
    }
    zoom(factor, positive) {
        if (positive) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.scale(1 / this.factor, 1 / this.factor);
            this.ctx.scale(factor, factor);
        }
        else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.scale(1 / factor, 1 / factor);
        }
        this.factor = factor;
    }
}
class CanvasWireframeAPI extends CanvasAPI {
    drawShape(shape) {
        this.ctx.strokeStyle = shape.color;
        if (shape.hightlighted) {
            this.ctx.lineWidth = 3;
        }
        else {
            this.ctx.lineWidth = 1;
        }
        this.ctx.stroke();
    }
}
exports.CanvasWireframeAPI = CanvasWireframeAPI;
class CanvasFillAPI extends CanvasAPI {
    drawShape(shape) {
        this.ctx.fillStyle = shape.color;
        this.ctx.fill();
        if (shape.hightlighted) {
            this.ctx.lineWidth = 3;
            this.ctx.strokeStyle = "red";
            this.ctx.stroke();
        }
    }
}
exports.CanvasFillAPI = CanvasFillAPI;

},{"./layer":5,"./shape":8,"./toolbox":10}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const document_1 = require("./document");
const render_1 = require("./render");
const interperter_1 = require("./interperter");
const toolbox_1 = require("./toolbox");
const tool_1 = require("./tool");
const layer_1 = require("./layer");
const fileio_1 = require("./fileio");
const sdd = new document_1.SimpleDrawDocument(update);
const canvasrender = new render_1.Render(new render_1.CanvasWireframeAPI());
const svgrender = new render_1.Render(new render_1.SVGWireframeAPI());
const uirender = new render_1.InterfaceRender();
function update() {
    sdd.draw(canvasrender);
    sdd.draw(svgrender);
    sdd.drawUI(uirender);
}
var toolbox = new toolbox_1.ToolBox();
const movetool = new tool_1.MoveTool("Move Tool", sdd);
const painttool = new tool_1.PaintTool("Red", sdd);
toolbox.add(movetool);
toolbox.add(painttool);
sdd.addUIElem(toolbox);
const layerui = new layer_1.Layers();
layerui.addLayernew();
layerui.addLayernew();
layerui.addLayernew();
sdd.addUIElem(layerui);
var consoleBtn = document.getElementById("submit");
var input = document.getElementById("console-input");
consoleBtn.addEventListener("click", () => {
    let command = input.value;
    let context = new interperter_1.Interpreter.Context(sdd, canvasrender, svgrender, command);
    let expression = new interperter_1.Interpreter.CommandExpression(command[0]);
    expression.interpret(context);
});
var undoBtn = document.getElementById("undo");
var redoBtn = document.getElementById("redo");
undoBtn.addEventListener("click", () => {
    sdd.undo();
    update();
});
redoBtn.addEventListener("click", () => {
    sdd.redo();
    update();
});
var zoomPlusBtn = document.getElementById("zoom-plus");
var zoomMinusBtn = document.getElementById("zoom-minus");
var zoomFactor = document.getElementById("zoom-factor");
zoomPlusBtn.addEventListener("click", () => {
    var factor = parseFloat(zoomFactor.innerHTML);
    factor = Math.round((factor + 0.2) * 10) / 10;
    sdd.zoom([svgrender, canvasrender], factor);
    zoomFactor.innerHTML = factor.toString();
    update();
});
zoomMinusBtn.addEventListener("click", () => {
    var factor = parseFloat(zoomFactor.innerHTML);
    factor = Math.round((factor - 0.2) * 10) / 10;
    if (factor > 0) {
        sdd.zoom([svgrender, canvasrender], factor);
        zoomFactor.innerHTML = factor.toString();
        update();
    }
});
const shapes = document.getElementById("shape-dropdown");
shapes.addEventListener("change", () => {
    sdd.selectShape(shapes.value);
    update();
});
const views = document.getElementById("views-dropdown");
views.addEventListener("change", () => {
    if (canvasrender.getDrawAPI() instanceof render_1.CanvasWireframeAPI) {
        canvasrender.setDrawAPI(new render_1.CanvasFillAPI());
        svgrender.setDrawAPI(new render_1.SVGFillAPI());
    }
    else if (canvasrender.getDrawAPI() instanceof render_1.CanvasFillAPI) {
        canvasrender.setDrawAPI(new render_1.CanvasWireframeAPI());
        svgrender.setDrawAPI(new render_1.SVGWireframeAPI());
    }
    update();
});
var importbtn = document.getElementById("import");
var exportbtn = document.getElementById("export");
var format_box = document.getElementById("format-dropbox");
var TXTexp = new fileio_1.TXT(100, 100);
var XMLexp = new fileio_1.XML();
var option = document.createElement("OPTION");
option.setAttribute("value", "TXT");
option.innerHTML = "TXT";
format_box.appendChild(option);
var option = document.createElement("OPTION");
option.setAttribute("value", "XML");
option.innerHTML = "XML";
format_box.appendChild(option);
function retFileIO(name) {
    if (name == "TXT")
        return TXTexp;
    else if (name == "XML")
        return XMLexp;
    return null;
}
importbtn.addEventListener("click", () => {
    sdd.import(retFileIO(format_box.value));
    update();
});
exportbtn.addEventListener("click", () => {
    sdd.export(retFileIO(format_box.value));
});
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
    return [x, y];
}
const canvas = document.querySelector('canvas');
canvas.addEventListener('mousedown', function (e) {
    const pos = getCursorPosition(canvas, e);
    sdd.canvasNotification(pos[0], pos[1]);
});
function clicked_tool(tool_name) {
    console.log("on script.ts clicked tool");
    sdd.clicked_tool(tool_name);
}
exports.clicked_tool = clicked_tool;
update();
sdd.setToolListeners();

},{"./document":2,"./fileio":3,"./interperter":4,"./layer":5,"./render":6,"./tool":9,"./toolbox":10}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Shape {
    constructor(points) {
        this.points = points;
        this.color = "black";
        this.hightlighted = false;
    }
    translate(xd, yd) {
        for (var item = 0; item < this.points.length - 1; item += 2) {
            this.points[item] += xd;
            this.points[item + 1] += yd;
        }
    }
    rotate(angle) {
        var xc = 0;
        var yc = 0;
        for (var i = 0; i < this.points.length - 1; i += 2) {
            xc += this.points[i];
            yc += this.points[i + 1];
        }
        xc /= this.points.length / 2;
        yc /= this.points.length / 2;
        for (var item = 0; item < this.points.length - 1; item += 2) {
            var xt = this.points[item] - xc;
            var yt = this.points[item + 1] - yc;
            var xr = xt * Math.cos(angle * Math.PI / 180) - yt * Math.sin(angle * Math.PI / 180);
            var yr = xt * Math.sin(angle * Math.PI / 180) + yt * Math.cos(angle * Math.PI / 180);
            this.points[item] = xr + xc;
            this.points[item + 1] = yr + yc;
        }
    }
    setHighlight(value) {
        this.hightlighted = value;
    }
}
exports.Shape = Shape;
class Rectangle extends Shape {
    constructor(points, width, height) {
        super(points);
        this.points = points;
        this.width = width;
        this.height = height;
        this.id = Circle.idCounter++;
        points.push(points[0]);
        points.push(points[1] + height);
        points.push(points[0] + width);
        points.push(points[1] + height);
        points.push(points[0] + width);
        points.push(points[1]);
    }
    getID() {
        return "rect_" + this.id;
    }
    getUnique() {
        return ' ' + this.width + ' ' + this.height;
    }
}
Rectangle.idCounter = 0;
exports.Rectangle = Rectangle;
class Circle extends Shape {
    constructor(points, radius) {
        super(points);
        this.points = points;
        this.radius = radius;
        this.id = Circle.idCounter++;
    }
    getID() {
        return "circle_" + this.id;
    }
    getUnique() {
        return ' ' + this.radius;
    }
}
Circle.idCounter = 0;
exports.Circle = Circle;
class Polygon extends Shape {
    constructor(points) {
        super(points);
        this.points = points;
        this.id = Circle.idCounter++;
    }
    getID() {
        return "polygon_" + this.id;
    }
    getUnique() {
        return ' ';
    }
}
Polygon.idCounter = 0;
exports.Polygon = Polygon;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
    Tool is going to be instanced using factory design pattern and each has the virtual method action()
    that takes a object argument that contains its parameters
*/
class ActionParam {
    constructor(points, objects_sel) {
        this.points = points;
        this.objects_sel = objects_sel;
    }
}
exports.ActionParam = ActionParam;
class Tool {
    constructor(name, sdd) {
        this.name = name;
        this.sdd = sdd;
        this.init_shape = null;
    }
    action(action_para) {
        return false;
    }
    initclick(sh) {
        this.init_shape = sh;
    }
    //return false if needs more input, true if it was finished doing its thing
    sendInput(x, y, sh) {
        return true;
    }
}
exports.Tool = Tool;
class MoveTool extends Tool {
    action(action_para) {
        console.log("On Move Tool");
        action_para.objects_sel.forEach(element => {
            try {
                for (let i = 0; i < element.points.length; i++) {
                    if (i % 2)
                        element.points[i] += action_para.points[action_para.points.length - 1][0];
                    else
                        element.points[i] += action_para.points[action_para.points.length - 1][1];
                }
            }
            catch (e) {
                console.log("Error on MoveTool");
                return false;
            }
        });
        return true;
    }
    sendInput(x, y, sh) {
        this.sdd.translate(this.init_shape.getID(), x - this.init_shape.points[0], y - this.init_shape.points[1]);
        return true;
    }
}
exports.MoveTool = MoveTool;
class PaintTool extends Tool {
    constructor() {
        super(...arguments);
        this.color = "blue";
    }
    action(action_para) {
        action_para.objects_sel.forEach(element => {
            try {
                element.color = this.color;
            }
            catch (e) {
                console.log("Error on PaintTool");
                return false;
            }
        });
        return true;
    }
    initclick(sh) {
        sh.color = this.color;
    }
}
exports.PaintTool = PaintTool;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ToolBox {
    constructor() {
        this.tools = new Array();
        this.sel_tool = null;
    }
    add(new_tool) {
        this.tools.push(new_tool);
    }
    getTools() {
        return this.tools;
    }
    setSel(tool) {
        this.tools.forEach(tl => {
            if (tool === tl) {
                this.sel_tool = tool;
                return;
            }
        });
    }
    unSelectTool() {
        this.sel_tool = null;
    }
    getSelTool() {
        return this.sel_tool;
    }
    clicked_tool(tool_name, getSelShape) {
        this.tools.forEach(tool => {
            if (tool.name == tool_name) {
                tool.initclick(getSelShape);
                this.sel_tool = tool;
            }
        });
    }
}
exports.ToolBox = ToolBox;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UndoManager {
    constructor() {
        this.doStack = new Array();
        this.undoStack = new Array();
    }
    undo() {
        if (this.doStack.length > 0) {
            const a1 = this.doStack.pop();
            a1.undo();
            this.undoStack.push(a1);
        }
    }
    redo() {
        if (this.undoStack.length > 0) {
            const a1 = this.undoStack.pop();
            a1.do();
            this.doStack.push(a1);
        }
    }
    onActionDone(a) {
        this.doStack.push(a);
        this.undoStack.length = 0;
    }
}
exports.UndoManager = UndoManager;

},{}]},{},[7]);

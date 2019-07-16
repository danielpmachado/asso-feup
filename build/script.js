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
//# sourceMappingURL=script.js.map
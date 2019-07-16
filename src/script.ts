import { SimpleDrawDocument } from './document'
import { InterfaceRender, CanvasFillAPI, CanvasWireframeAPI, Render , SVGWireframeAPI, SVGFillAPI} from './render';
import {Interpreter} from './interperter';
import { ToolBox } from './toolbox';
import { MoveTool, PaintTool } from './tool';
import { Layers } from './layer';
import { TXT, XML, FileIO } from './fileio';

const sdd = new SimpleDrawDocument(update)

const canvasrender = new Render(new CanvasWireframeAPI())
const svgrender = new Render(new SVGWireframeAPI())
const uirender = new InterfaceRender()

function update(){
    sdd.draw(canvasrender)
    sdd.draw(svgrender)
    sdd.drawUI(uirender)
}

var toolbox = new ToolBox()

const movetool = new MoveTool("Move Tool", sdd)
const painttool = new PaintTool("Red", sdd)

toolbox.add(movetool)
toolbox.add(painttool)

sdd.addUIElem(toolbox)

const layerui = new Layers()
layerui.addLayernew()
layerui.addLayernew()
layerui.addLayernew()

sdd.addUIElem(layerui)

var consoleBtn = <HTMLButtonElement> document.getElementById("submit");
var input = <HTMLInputElement> document.getElementById("console-input");

consoleBtn.addEventListener("click", () => {
    let command : string = input.value;
    let context :Interpreter.Context = new Interpreter.Context(sdd, canvasrender, svgrender, command); 
    let expression : Interpreter.CommandExpression = new Interpreter.CommandExpression(command[0]);
    expression.interpret(context)
});

var undoBtn = <HTMLButtonElement> document.getElementById("undo");
var redoBtn = <HTMLButtonElement> document.getElementById("redo");

undoBtn.addEventListener("click", () => {
    sdd.undo();
    update()
});

redoBtn.addEventListener("click", () => {
    sdd.redo();
    update()
});

var zoomPlusBtn = <HTMLButtonElement> document.getElementById("zoom-plus");
var zoomMinusBtn = <HTMLButtonElement> document.getElementById("zoom-minus")
var zoomFactor = <HTMLElement> document.getElementById("zoom-factor");

zoomPlusBtn.addEventListener("click", () =>{
    var factor = parseFloat(zoomFactor.innerHTML);
    factor = Math.round( (factor+0.2) * 10 ) / 10;

    sdd.zoom([svgrender, canvasrender], factor);

    zoomFactor.innerHTML = factor.toString();
    update()

});

zoomMinusBtn.addEventListener("click", () =>{
    var factor = parseFloat(zoomFactor.innerHTML);
    factor = Math.round( (factor-0.2) * 10 ) / 10;

    if(factor >0){
        sdd.zoom([svgrender, canvasrender], factor);

        zoomFactor.innerHTML = factor.toString();
        update()
    }

});

const shapes = <HTMLSelectElement> document.getElementById("shape-dropdown")

shapes.addEventListener("change", () =>{
 
    sdd.selectShape(shapes.value);
    
    update();
})

const views = <HTMLSelectElement> document.getElementById("views-dropdown")

views.addEventListener("change", () =>{

    if(canvasrender.getDrawAPI()  instanceof CanvasWireframeAPI ){
        canvasrender.setDrawAPI(new CanvasFillAPI());
        svgrender.setDrawAPI(new SVGFillAPI());
    }else if(canvasrender.getDrawAPI()  instanceof CanvasFillAPI ){
        canvasrender.setDrawAPI(new CanvasWireframeAPI());
        svgrender.setDrawAPI(new SVGWireframeAPI());
    }
    update();
})



var importbtn = <HTMLButtonElement> document.getElementById("import");
var exportbtn = <HTMLButtonElement> document.getElementById("export");
var format_box = <HTMLButtonElement> document.getElementById("format-dropbox");

var TXTexp = new TXT(100, 100)
var XMLexp = new XML()

var option = document.createElement("OPTION");
option.setAttribute("value","TXT");
option.innerHTML = "TXT";
format_box.appendChild(option);

var option = document.createElement("OPTION");
option.setAttribute("value","XML");
option.innerHTML = "XML";
format_box.appendChild(option);

function retFileIO(name:String): FileIO{
    
    if(name == "TXT")
        return TXTexp
    else if (name == "XML")
        return XMLexp
    
    return null
}

importbtn.addEventListener("click", () => {

    sdd.import(retFileIO(format_box.value));
    update()
});

exportbtn.addEventListener("click", () => {
    sdd.export(retFileIO(format_box.value));
});

function getCursorPosition(canvas:HTMLCanvasElement, event:MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log("x: " + x + " y: " + y)
    return [x,y]
}

const canvas = document.querySelector('canvas')
canvas.addEventListener('mousedown', function(e) {
    const pos = getCursorPosition(canvas, e)
    sdd.canvasNotification(pos[0], pos[1])
})

export function clicked_tool(tool_name:String){
    console.log("on script.ts clicked tool")
    sdd.clicked_tool(tool_name)
}


update()
sdd.setToolListeners()

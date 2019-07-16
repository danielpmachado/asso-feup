import { Shape } from './shape'
import { Action, CreateCircleAction, CreateRectangleAction, CreatePolygonAction, TranslateAction, RotationAction, ZoomAction } from './actions'
import { Render, InterfaceRender } from './render';
import { UndoManager } from "./undo";
import { InterfaceObj } from './interfaceobj';
import { Layers, Layer } from './layer';
import { FileIO } from './fileio';
import { ToolBox } from './toolbox';

export class SimpleDrawDocument {

  objects = new Array<Shape>()
  undoManager = new UndoManager();
  shapeDropbox = document.getElementById("shape-dropdown");

  uielems = new Array<InterfaceObj>();

  update: any;

  undo() {
    this.undoManager.undo();
  }

  redo() {
    this.undoManager.redo();
  }


  constructor(update_call: any) {
    this.update = update_call
  }


  drawUI(uiRender: InterfaceRender) {
    uiRender.draw(...this.uielems)
    this.setToolListeners()
  }

  draw(render: Render): void {
    // this.objects.forEach(o => o.draw(ctx))
    render.draw(this.getElemsToDraw())
  }

  selectShape(shape_id: string) {
    for(var shape of this.getElemsToDraw()){

      if(shape.getID() == shape_id){
        shape.setHighlight(true);
      }else{
        shape.setHighlight(false)
      }
    }
  }

  getSelLayer(): number{
    
    var e = document.getElementById("layers")
    var str_value = e.getElementsByClassName("active")[0].children[0].innerHTML
    return parseInt(str_value, 10)
  }

  zoom(renders: Array<Render>, factor: number){

  this.do(new ZoomAction(this, renders, factor));
  }

  add(r: Shape): void {
    var option = document.createElement("OPTION");
    option.setAttribute("value", r.getID());
    option.innerHTML = r.getID();
    this.shapeDropbox.appendChild(option);

    this.getLayers().addShape(r, this.getSelLayer())

    //this.objects.push(r)
  }

  remove(shape: Shape) {
    var children = this.shapeDropbox.children;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];

      if(child.getAttribute("value") == shape.getID()){
        child.remove();
      }
      
    }

    this.getLayers().removeObject(shape)
  }


  do<T>(a: Action<T>): T {
    this.undoManager.onActionDone(a);

    const action_return = a.do()

    this.update()

    return action_return;
  }

  createRectangle(points: Array<number>, width: number, height: number): Shape {
    return this.do(new CreateRectangleAction(this, points, width, height))
  }

  createCircle(points: Array<number>, radius: number): Shape {
    return this.do(new CreateCircleAction(this, points, radius))
  }

  createPolygon(points: Array<number>): Shape {
    return this.do(new CreatePolygonAction(this, points))
  }


  translate(id : string, xd: number, yd: number): void {
    return this.do(new TranslateAction(this, this.getShape(id), xd, yd))
  }

  rotate(id: string, angle: number): void {
    return this.do(new RotationAction(this, this.getShape(id), angle))
  }

  getShape(id : String){

    let shapes = this.getElemsToDraw()

    for(var i =0; i < shapes.length; i++){
      if(shapes[i].getID() == id){
        return shapes[i];
      }
    }

    return null;
  }


  addUIElem(elem: InterfaceObj) {


    var found = Boolean(false)

    this.uielems.forEach(element => {

      if (element === elem) {
        found = true
        element = elem
      }

    })

    if (found == false) {
      this.uielems.push(elem)
    }
  }


  getElemsToDraw(): Array<Shape> {

    //Figure out if the concept of layers exists, if not just return objects vector

    let shapes_draw:Array<Shape> = null 

    this.uielems.forEach(element => {

      if (element instanceof Layers) {
        shapes_draw = element.getSortedShapes()
      }
    })

    return shapes_draw

  }

  export(fileio: FileIO) {
    fileio.export(this.getElemsToDraw())
  }


  import(fileio: FileIO) {

    this.uielems.forEach(element => {

      if (element instanceof Layers) {

        var layers = new Layers()

        var new_layer = new Layer(0, true)
        new_layer.addShapes(fileio.import("FILE"))

        layers.addLayer(new_layer)

        element = layers

      }
    })

  }

  getToolbox(): ToolBox{

    let f_tb:ToolBox = null

    this.uielems.forEach(element => {

      if (element instanceof ToolBox) {
          f_tb = element
      }
    })
    return f_tb

  }


  getLayers(): Layers{

    let f_layers:Layers = null

    this.uielems.forEach(element => {

      if (element instanceof Layers) {
          f_layers = element

      }
    })

    return f_layers
  }

  canvasNotification(x:number, y:number){

    console.log("X: " + x.toString() + "Y: " + y.toString() )

    this.uielems.forEach(element => {

      if (element instanceof ToolBox) {
          const tool = element.getSelTool()

          if(tool != null){
            //todo detect if a shape was clicked
            if(tool.sendInput(x,y, null) == true){
              element.unSelectTool()
            }

            return
          }
      }
    })

    this.update()

  }

  getSelShape(): Shape{
  
    var sel_box = <HTMLSelectElement>this.shapeDropbox
    var shape_id = sel_box.options[sel_box.selectedIndex].value;

    let f_shape:Shape = null 

    this.getElemsToDraw().forEach(shape => {

      if(shape.getID() == shape_id){
        f_shape = shape
      }

    })
    return f_shape
  }


  clicked_tool(tool_name: String) {
    this.getToolbox().clicked_tool(tool_name, this.getSelShape())
}

  nextLayer():void{

    let current_sel = this.getSelLayer()

    let html_layers = document.getElementById("layers")
    let active = html_layers.getElementsByClassName("active")[0]
    active.className = active.className.replace( /(?:^|\s)active(?!\S)/g , '' )

    html_layers.children[((current_sel+1)%this.getLayers().getLayers().length)+1].className += " active";

  }


  prevLayer():void{

    let current_sel = this.getSelLayer()

    let html_layers = document.getElementById("layers")
    let active = html_layers.getElementsByClassName("active")[0]
    active.className = active.className.replace( /(?:^|\s)active(?!\S)/g , '' )

    html_layers.children[ ((current_sel-1)%this.getLayers().getLayers().length)+1].className += " active";

  }

  setLayersListeners(){

    let doc = this

    document.getElementById("nextlayer").addEventListener("click", function(){

      doc.nextLayer()
    }); 

    document.getElementById("prevlayer").addEventListener("click", function(){

      doc.prevLayer()
    }); 

  }
  

  setToolListeners(): void {

    var tools = document.getElementById("tools")
    let doc = this
    
    for (let child_i = 0; child_i < tools.children.length; child_i++) {

      const tool = tools.children[child_i];
      tool.addEventListener("click", function(){

        const tool_p = <HTMLParagraphElement> tool.children[0]
        
        
        doc.clicked_tool(tool_p.innerText)
        doc.update()
      }); 
      
    }

    this.setLayersListeners()
  }



  /*
  setToolBox(newtoolbox:ToolBox){

    var found = Boolean(false)

    this.uielems.forEach(element => {

        if(element instanceof ToolBox){
           found = true
            element = newtoolbox
        }

    })

    if(found == false){
      this.uielems.push(newtoolbox)
    }

  }
*/


}
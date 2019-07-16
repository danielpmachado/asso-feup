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
//# sourceMappingURL=document.js.map
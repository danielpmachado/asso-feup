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
//# sourceMappingURL=tool.js.map
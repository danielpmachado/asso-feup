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
//# sourceMappingURL=toolbox.js.map
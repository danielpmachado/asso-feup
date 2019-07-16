import { Tool } from "tool";
import { InterfaceObj } from "./interfaceobj"
import { Shape } from "./shape";

export class ToolBox implements InterfaceObj{

    private tools:Array<Tool>
    private sel_tool: Tool

    constructor() { 
     
          this.tools= new Array<Tool>()
          this.sel_tool = null
     }

    add(new_tool:Tool){
        this.tools.push(new_tool)
   }

   getTools(): Array<Tool>{

        return this.tools

   }

   setSel(tool:Tool): void {

     this.tools.forEach(tl => {
          if(tool === tl){
               this.sel_tool = tool
               return
          }
     });

   }

   unSelectTool():void{
        this.sel_tool = null
   }

   getSelTool() : Tool {
     return this.sel_tool
   }


   clicked_tool(tool_name: String, getSelShape: Shape) {

     this.tools.forEach(tool => {
          
          if(tool.name == tool_name){
               tool.initclick(getSelShape)
               this.sel_tool = tool
          }

     });
   }

}
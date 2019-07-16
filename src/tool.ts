import { Shape } from "shape";
import { SimpleDrawDocument } from "document";

/*
    Tool is going to be instanced using factory design pattern and each has the virtual method action()
    that takes a object argument that contains its parameters
*/

export class ActionParam{
    constructor(public points:Array<Array<number>>, public objects_sel: Array<Shape>){
    }

}

export abstract class Tool{

    protected init_shape:Shape

    constructor(public name:String, public sdd:SimpleDrawDocument ) {

        this.init_shape = null

    }

    action(action_para:ActionParam) : boolean{
        return false;
    }

    initclick(sh:Shape){
        this.init_shape = sh
    }

    //return false if needs more input, true if it was finished doing its thing
    sendInput(x:number, y:number, sh:Shape): boolean{
        return true

    }

}


export class MoveTool extends Tool{
    
    action(action_para:ActionParam) : boolean{
        
        console.log("On Move Tool")
        action_para.objects_sel.forEach(element => {

            try{

                for (let i = 0; i < element.points.length; i++) {
                    
                    if(i%2)
                        element.points[i] += action_para.points[action_para.points.length -1][0]
                    else
                        element.points[i] += action_para.points[action_para.points.length -1][1]
                }
            } catch(e){
                console.log("Error on MoveTool")
                return false;
            }
        });

        return true;
    }


    sendInput(x:number, y:number, sh:Shape): boolean{

        this.sdd.translate(this.init_shape.getID(), x - this.init_shape.points[0], y - this.init_shape.points[1]);
        return true
    }


}

export class PaintTool extends Tool{

    public color:string = "blue"

    action(action_para:ActionParam) : boolean{
        action_para.objects_sel.forEach(element => {

            try{
            element.color = this.color
            } catch(e){
                console.log("Error on PaintTool")
                return false;
            }
        });

        return true;
    }


    initclick(sh:Shape){
        sh.color = this.color
    }

}
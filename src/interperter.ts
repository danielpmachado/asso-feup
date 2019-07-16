import { SimpleDrawDocument } from './document'
import { Render } from './render';

export namespace Interpreter {

    export class Context {
        public document :  SimpleDrawDocument;
        public canvas : Render;
        public svg : Render
        public command : Array<string>;
        
        constructor(doc : SimpleDrawDocument, can : Render, svg : Render, commands : string){
            this.document = doc;
            this.canvas = can;
            this.svg = svg;
            this.command = commands.split(" ");
        }
          
    }
    
    interface Expression {
        interpret(context: Context): void;
    }

    export class CommandExpression implements Expression{
        private command : String;

        constructor(cmd : String) { 
            this.command = cmd;
        }

        public interpret(context: Context): void {
            switch (context.command[0]) {
                case 'draw':  
                    let objectExpression = new ShapeExpression(context.command[1])
                    objectExpression.interpret(context)
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
                    fillExpression.interpret(context)
                default:
                    break;
            }

            context.document.draw(context.canvas);
            context.document.draw(context.svg);
        }

        
    }

    class ShapeExpression implements Expression{
        private shape : String;

        constructor(shape : String) { 
            this.shape = shape;
        }

        public interpret(context: Context): void {
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

    class RectangleExpression implements Expression{

        private x : number;
        private y : number;
        private width : number;
        private height : number;

        constructor(x: string, y: string, width: string, height: string){
            this.x = parseInt(x);
            this.y = parseInt(y);
            this.width = parseInt(width);
            this.height = parseInt(height);
        }

        public interpret(context: Context): void {

            context.document.createRectangle([this.x, this.y], this.width, this.height)
 
        }
    }

    class CircleExpression implements Expression{
        private x : number;
        private y : number;
        private radius : number;

        constructor(x: string, y: string, radius : string){
            this.x = parseInt(x);
            this.y = parseInt(y);
            this.radius = parseInt (radius);
        }

        public interpret(context: Context): void{
            context.document.createCircle([this.x, this.y], this.radius);
        }
    }

    class PolygonExpression implements Expression{

        private points : Array<number>;

        constructor(command : Array<string>){
            this.points = [];

            for(var i = 2; i < command.length; i++){
                this.points.push(parseInt(command[i]));
            }

            console.log(this.points);
        }

        public interpret(context: Context): void {

            context.document.createPolygon(this.points);
 
        }
    }

    class TranslateExpression implements Expression{
        private shape_id : string;
        private x: number;
        private y: number;

        constructor(command : Array<string>){
            this.shape_id = command[1];
            this.x = parseInt(command[2]);
            this.y = parseInt(command[3]);
        }

        public interpret(context: Context) : void{

            context.document.translate(this.shape_id,this.x,this.y);

        }
    }

    class RotateExpression implements Expression{
        private shape_id : string;
        private angle: number;

        constructor(command : Array<string>){
            this.shape_id = command[1];
            this.angle = parseInt(command[2]);
        }

        public interpret(context: Context) : void{

            context.document.rotate(this.shape_id,this.angle);

        }
    }

    class ZoomExpression implements Expression{

        private factor : number;

        constructor(factor_str : string){
            this.factor = parseInt(factor_str);
        }

        public interpret(context: Context): void{
            
            context.document.zoom([context.svg, context.canvas], this.factor);
        }
    }

    class FillExpression implements Expression{
        private color: string;
        private shape_id : string;
        
        constructor(command: Array<string>){
            this.color = command[2];
            this.shape_id = command[3];
        }

        interpret(context : Context){
            
        }
    }


}

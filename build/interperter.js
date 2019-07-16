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
//# sourceMappingURL=interperter.js.map
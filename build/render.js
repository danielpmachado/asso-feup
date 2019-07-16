"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shape_1 = require("./shape");
const toolbox_1 = require("./toolbox");
const layer_1 = require("./layer");
class InterfaceRender {
    draw(...elems) {
        console.log("Interface Rendering");
        for (const elem of elems) {
            if (elem instanceof toolbox_1.ToolBox) {
                console.log("Drawing ToolBox");
                var toolbox_html = document.getElementById('tools');
                let tb_html = "";
                elem.getTools().forEach(tool => {
                    // tb_html += "<div onclick=\"clicked_tool('" + tool.name +"')\" > <p> " + tool.name + " </p> </div>"
                    tb_html += "<div > <button class='btn btn-outline-primary' style='width:-webkit-fill-available; margin-bottom:1em;'> " + tool.name + " </button> </div>";
                });
                toolbox_html.innerHTML = tb_html;
            }
            else if (elem instanceof layer_1.Layers) {
                console.log("Drawing Layers");
                var layers_elem = document.getElementById('layers');
                let layers_html = "<li id=\"nextlayer\" class=\"page-item\"> <a class=\"page-link\" href=\"#\">&raquo;</a> </li>";
                let active_numb = 1;
                for (let layer_it = 0; layer_it < elem.getLayers().length; layer_it++) {
                    if (layer_it == active_numb)
                        layers_html += "<li class=\"page-item active\"> <a class=\"page-link\" href=\"#\"> " + elem.getLayers()[layer_it].pos + " </a> </li>";
                    else
                        layers_html += "<li class=\"page-item\"> <a class=\"page-link\" href=\"#\"> " + elem.getLayers()[layer_it].pos + " </a> </li>";
                }
                layers_elem.innerHTML = layers_html; //+ " <li id=\"prevlayer\" class=\"page-item\"> <a class=\"page-link\" href=\"#\">&raquo;</a> </li> "
            }
        }
    }
}
exports.InterfaceRender = InterfaceRender;
class Render {
    constructor(drawAPI) {
        this.drawAPI = drawAPI;
    }
    draw(objs) {
        this.drawAPI.draw(...objs);
    }
    zoom(factor, positive) {
        this.drawAPI.zoom(factor, positive);
    }
    setDrawAPI(dapi) {
        this.drawAPI = dapi;
    }
    getDrawAPI() {
        return this.drawAPI;
    }
}
exports.Render = Render;
class SVGAPI {
    constructor() {
        this.factor = 400;
    }
    draw(...objs) {
        var svg = document.getElementById('svgcanvas');
        var xmlns = "http://www.w3.org/2000/svg";
        var svgElem = document.createElementNS(xmlns, "svg");
        svgElem.setAttributeNS(null, "id", "svgcanvas");
        svgElem.setAttributeNS(null, "width", '400');
        svgElem.setAttributeNS(null, "height", '400');
        svgElem.setAttributeNS(null, "style", "border: 2px solid black; border-radius: 5px 5px 5px 5px/25px 25px 25px 5px;");
        svgElem.setAttributeNS(null, "viewBox", "0 0 " + this.factor + " " + this.factor);
        svg.remove();
        document.getElementById("all_canvas").appendChild(svgElem);
        svg = document.getElementById('svgcanvas');
        for (const shape of objs) {
            if (shape instanceof shape_1.Circle) {
                const circle = document.createElementNS(xmlns, "circle");
                this.setStyle(shape, circle);
                circle.setAttribute("cx", shape.points[0].toString());
                circle.setAttribute("cy", shape.points[1].toString());
                circle.setAttribute("r", shape.radius.toString());
                svg.appendChild(circle);
            }
            else if (shape instanceof shape_1.Polygon || shape instanceof shape_1.Rectangle) {
                const polygon = document.createElementNS(xmlns, "polygon");
                this.setStyle(shape, polygon);
                var textPoints = '';
                for (var item = 0; item < shape.points.length - 1; item += 2)
                    textPoints += shape.points[item] + ',' + shape.points[item + 1] + ' ';
                polygon.setAttribute('points', textPoints);
                svg.appendChild(polygon);
            }
        }
    }
    zoom(factor, positive) {
        if (positive)
            this.factor = 400 / factor;
        else
            this.factor = this.factor * factor;
    }
}
class SVGWireframeAPI extends SVGAPI {
    setStyle(shape, element) {
        if (shape.hightlighted)
            element.setAttribute('style', 'stroke: ' + shape.color + '; stroke-width: 0.8%; fill: white');
        else
            element.setAttribute('style', 'stroke: ' + shape.color + '; fill: white');
    }
}
exports.SVGWireframeAPI = SVGWireframeAPI;
class SVGFillAPI extends SVGAPI {
    setStyle(shape, element) {
        if (shape.hightlighted)
            element.setAttribute('style', 'stroke: red; stroke-width: 0.8%; fill:  ' + shape.color);
        else
            element.setAttribute('style', 'stroke: ' + shape.color + '; fill:  ' + shape.color);
    }
}
exports.SVGFillAPI = SVGFillAPI;
class CanvasAPI {
    draw(...objs) {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const shape of objs) {
            if (shape instanceof shape_1.Circle) {
                this.ctx.beginPath();
                this.ctx.arc(shape.points[0], shape.points[1], shape.radius, 0, 2 * Math.PI);
                this.ctx.closePath();
            }
            else if (shape instanceof shape_1.Polygon || shape instanceof shape_1.Rectangle) {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.points[0], shape.points[1]);
                for (var item = 2; item < shape.points.length - 1; item += 2) {
                    this.ctx.lineTo(shape.points[item], shape.points[item + 1]);
                }
                this.ctx.closePath();
            }
            this.drawShape(shape);
        }
    }
    zoom(factor, positive) {
        if (positive) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.scale(1 / this.factor, 1 / this.factor);
            this.ctx.scale(factor, factor);
        }
        else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.scale(1 / factor, 1 / factor);
        }
        this.factor = factor;
    }
}
class CanvasWireframeAPI extends CanvasAPI {
    drawShape(shape) {
        this.ctx.strokeStyle = shape.color;
        if (shape.hightlighted) {
            this.ctx.lineWidth = 3;
        }
        else {
            this.ctx.lineWidth = 1;
        }
        this.ctx.stroke();
    }
}
exports.CanvasWireframeAPI = CanvasWireframeAPI;
class CanvasFillAPI extends CanvasAPI {
    drawShape(shape) {
        this.ctx.fillStyle = shape.color;
        this.ctx.fill();
        if (shape.hightlighted) {
            this.ctx.lineWidth = 3;
            this.ctx.strokeStyle = "red";
            this.ctx.stroke();
        }
    }
}
exports.CanvasFillAPI = CanvasFillAPI;
//# sourceMappingURL=render.js.map
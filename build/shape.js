"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Shape {
    constructor(points) {
        this.points = points;
        this.color = "black";
        this.hightlighted = false;
    }
    translate(xd, yd) {
        for (var item = 0; item < this.points.length - 1; item += 2) {
            this.points[item] += xd;
            this.points[item + 1] += yd;
        }
    }
    rotate(angle) {
        var xc = 0;
        var yc = 0;
        for (var i = 0; i < this.points.length - 1; i += 2) {
            xc += this.points[i];
            yc += this.points[i + 1];
        }
        xc /= this.points.length / 2;
        yc /= this.points.length / 2;
        for (var item = 0; item < this.points.length - 1; item += 2) {
            var xt = this.points[item] - xc;
            var yt = this.points[item + 1] - yc;
            var xr = xt * Math.cos(angle * Math.PI / 180) - yt * Math.sin(angle * Math.PI / 180);
            var yr = xt * Math.sin(angle * Math.PI / 180) + yt * Math.cos(angle * Math.PI / 180);
            this.points[item] = xr + xc;
            this.points[item + 1] = yr + yc;
        }
    }
    setHighlight(value) {
        this.hightlighted = value;
    }
}
exports.Shape = Shape;
class Rectangle extends Shape {
    constructor(points, width, height) {
        super(points);
        this.points = points;
        this.width = width;
        this.height = height;
        this.id = Circle.idCounter++;
        points.push(points[0]);
        points.push(points[1] + height);
        points.push(points[0] + width);
        points.push(points[1] + height);
        points.push(points[0] + width);
        points.push(points[1]);
    }
    getID() {
        return "rect_" + this.id;
    }
    getUnique() {
        return ' ' + this.width + ' ' + this.height;
    }
}
Rectangle.idCounter = 0;
exports.Rectangle = Rectangle;
class Circle extends Shape {
    constructor(points, radius) {
        super(points);
        this.points = points;
        this.radius = radius;
        this.id = Circle.idCounter++;
    }
    getID() {
        return "circle_" + this.id;
    }
    getUnique() {
        return ' ' + this.radius;
    }
}
Circle.idCounter = 0;
exports.Circle = Circle;
class Polygon extends Shape {
    constructor(points) {
        super(points);
        this.points = points;
        this.id = Circle.idCounter++;
    }
    getID() {
        return "polygon_" + this.id;
    }
    getUnique() {
        return ' ';
    }
}
Polygon.idCounter = 0;
exports.Polygon = Polygon;
//# sourceMappingURL=shape.js.map
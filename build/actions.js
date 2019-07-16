"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shape_1 = require("./shape");
class ZoomAction {
    constructor(doc, renders, factor) {
        this.doc = doc;
        this.renders = renders;
        this.factor = factor;
    }
    do() {
        for (var r of this.renders) {
            r.zoom(this.factor, true);
        }
    }
    undo() {
        for (var r of this.renders) {
            r.zoom(this.factor, false);
        }
    }
}
exports.ZoomAction = ZoomAction;
class CreateShapeAction {
    constructor(doc, shape) {
        this.doc = doc;
        this.shape = shape;
    }
    do() {
        this.doc.add(this.shape);
        return this.shape;
    }
    undo() {
        this.doc.remove(this.shape);
    }
}
class CreateCircleAction extends CreateShapeAction {
    constructor(doc, points, radius) {
        super(doc, new shape_1.Circle(points, radius));
        this.points = points;
        this.radius = radius;
    }
}
exports.CreateCircleAction = CreateCircleAction;
class CreatePolygonAction extends CreateShapeAction {
    constructor(doc, points) {
        super(doc, new shape_1.Polygon(points));
        this.points = points;
    }
}
exports.CreatePolygonAction = CreatePolygonAction;
class CreateRectangleAction extends CreateShapeAction {
    constructor(doc, points, width, height) {
        super(doc, new shape_1.Rectangle(points, width, height));
        this.points = points;
        this.width = width;
        this.height = height;
    }
}
exports.CreateRectangleAction = CreateRectangleAction;
class TranslateAction {
    constructor(doc, shape, xd, yd) {
        this.doc = doc;
        this.shape = shape;
        this.xd = xd;
        this.yd = yd;
    }
    do() {
        this.shape.translate(this.xd, this.yd);
    }
    undo() {
        this.shape.translate(-this.xd, -this.yd);
    }
}
exports.TranslateAction = TranslateAction;
class RotationAction {
    constructor(doc, shape, angle) {
        this.doc = doc;
        this.shape = shape;
        this.angle = angle;
    }
    do() {
        this.shape.rotate(this.angle);
    }
    undo() {
        this.shape.rotate(-this.angle);
    }
}
exports.RotationAction = RotationAction;
//# sourceMappingURL=actions.js.map
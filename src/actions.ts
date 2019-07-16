import { Shape, Circle, Rectangle, Polygon } from './shape'
import { Render } from './render';
import { SimpleDrawDocument } from './document'

export interface Action<T> {
    do(): T
    undo(): void
}


export class ZoomAction implements Action<void>{

    constructor(private doc: SimpleDrawDocument, private renders: Array<Render>, private factor: number) { }

    do(): void{
        for(var r of this.renders){
            r.zoom(this.factor, true)
        }
            
    }    
    
    undo(): void {
        for(var r of this.renders){
            r.zoom(this.factor, false)
        }
    }


}

abstract class CreateShapeAction<S extends Shape> implements Action<S> {
    constructor(private doc: SimpleDrawDocument, public readonly shape: S) { }

    do(): S {
        this.doc.add(this.shape)
        return this.shape
    }

    undo() {
        this.doc.remove(this.shape);
    }
}

export class CreateCircleAction extends CreateShapeAction<Circle> {
    constructor(doc: SimpleDrawDocument, private  points: Array<number>, private radius: number) {
        super(doc, new Circle(points, radius))
    }
}

export class CreatePolygonAction extends CreateShapeAction<Polygon> {
    constructor(doc: SimpleDrawDocument, private points: Array<number>) {
        super(doc, new Polygon(points))
    }
}

export class CreateRectangleAction extends CreateShapeAction<Rectangle> {
    constructor(doc: SimpleDrawDocument, private  points: Array<number>, private width: number, private height: number) {
        super(doc, new Rectangle(points,width, height))
    }
}

export class TranslateAction implements Action<void> {

    constructor(private doc: SimpleDrawDocument, public shape: Shape, private xd: number, private yd: number) { }
   
    do(): void {
        this.shape.translate(this.xd, this.yd)
    }

    undo() {
       this.shape.translate(-this.xd, -this.yd)
    }
}

export class RotationAction implements Action<void> {

    constructor(private doc: SimpleDrawDocument, public shape: Shape, private angle: number) { }
 
    do(): void {
        this.shape.rotate(this.angle)
    }

    undo() {
       this.shape.rotate(-this.angle)
    }
}


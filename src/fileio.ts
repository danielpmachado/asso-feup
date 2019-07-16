import { Shape, Rectangle, Polygon, Circle } from "./shape";

export interface FileIO{

    import(fileloc:String) : Array<Shape>
    export(shapes:Array<Shape>) : boolean
    

}

export class TXT implements FileIO {


    constructor(sizex:number, sizey:number){
        console.log("Init of BMP FileIO")
    
    }


    import(fileloc: String): Shape[] {
        // var file = document.getElementById("fileForUpload").files[0];
        // if (file) {
        //     var reader = new FileReader();
        //     reader.readAsText(file, "UTF-8");
        //     reader.onload = function (evt) {
        //         document.getElementById("fileContents").innerHTML = evt.target.result;
        //     }
        //     reader.onerror = function (evt) {
        //         document.getElementById("fileContents").innerHTML = "error reading file";
        //     }
        // }
        
        return Array<Shape>()
    }
    export(shapes:Array<Shape>): boolean {

        var fileData = ''

        for(var shape in shapes){
            
            var shapeName = ''
            if(shapes[shape] instanceof Rectangle)
            shapeName = "Rectangle"
            else if(shapes[shape] instanceof Circle)
            shapeName = "Circle"            
            else if(shapes[shape] instanceof Polygon)
            shapeName = "Polygon"

            fileData += shapes[shape].getID() + ' ' + shapes[shape].color + ' ' + shapeName + ' ' + shapes[shape].points + shapes[shape].getUnique() + '\n'
        
        }
        
        var element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileData))
        element.setAttribute('download', 'save.txt')

        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)


        return true
    }

}

export class XML implements FileIO {
    
    doc: XMLDocument = document.implementation.createDocument('', '', null)

    constructor(){
        console.log("Init of XML FileIO")
        
    }

    import(fileloc: String): Shape[] {
        console.log("Importing from XML")
        return Array<Shape>()
    }
    export(shapes:Array<Shape>): boolean {
       
        let xmlData = this.doc.createElement('objects')
        
        for(var shape in shapes){
            var shapeName = ''
            if(shapes[shape] instanceof Rectangle){
                var e: Element = this.doc.createElement('rect')
                shapeName = "Rectangle"
            }
            if(shapes[shape] instanceof Circle){
                var e: Element = this.doc.createElement('circ')
                shapeName = "Circle"
            }
            if(shapes[shape] instanceof Polygon){
                var e: Element = this.doc.createElement('poly')
                shapeName = "Polygon"
            }

            e.setAttribute('id', shapes[shape].getID())
            e.setAttribute('color', shapes[shape].color.toString())
            e.setAttribute('name', shapeName.toString())
            e.setAttribute('points', shapes[shape].points.toString())
            e.setAttribute('unique', shapes[shape].getUnique())
            xmlData.appendChild(e)
     
        }

        var element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(xmlData)))
        element.setAttribute('download', 'save.xml')

        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
        return true
    }

}
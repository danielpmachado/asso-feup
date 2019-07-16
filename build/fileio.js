"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shape_1 = require("./shape");
class TXT {
    constructor(sizex, sizey) {
        console.log("Init of BMP FileIO");
    }
    import(fileloc) {
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
        return Array();
    }
    export(shapes) {
        var fileData = '';
        for (var shape in shapes) {
            var shapeName = '';
            if (shapes[shape] instanceof shape_1.Rectangle)
                shapeName = "Rectangle";
            else if (shapes[shape] instanceof shape_1.Circle)
                shapeName = "Circle";
            else if (shapes[shape] instanceof shape_1.Polygon)
                shapeName = "Polygon";
            fileData += shapes[shape].getID() + ' ' + shapes[shape].color + ' ' + shapeName + ' ' + shapes[shape].points + shapes[shape].getUnique() + '\n';
        }
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileData));
        element.setAttribute('download', 'save.txt');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        return true;
    }
}
exports.TXT = TXT;
class XML {
    constructor() {
        this.doc = document.implementation.createDocument('', '', null);
        console.log("Init of XML FileIO");
    }
    import(fileloc) {
        console.log("Importing from XML");
        return Array();
    }
    export(shapes) {
        let xmlData = this.doc.createElement('objects');
        for (var shape in shapes) {
            var shapeName = '';
            if (shapes[shape] instanceof shape_1.Rectangle) {
                var e = this.doc.createElement('rect');
                shapeName = "Rectangle";
            }
            if (shapes[shape] instanceof shape_1.Circle) {
                var e = this.doc.createElement('circ');
                shapeName = "Circle";
            }
            if (shapes[shape] instanceof shape_1.Polygon) {
                var e = this.doc.createElement('poly');
                shapeName = "Polygon";
            }
            e.setAttribute('id', shapes[shape].getID());
            e.setAttribute('color', shapes[shape].color.toString());
            e.setAttribute('name', shapeName.toString());
            e.setAttribute('points', shapes[shape].points.toString());
            e.setAttribute('unique', shapes[shape].getUnique());
            xmlData.appendChild(e);
        }
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(xmlData)));
        element.setAttribute('download', 'save.xml');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        return true;
    }
}
exports.XML = XML;
//# sourceMappingURL=fileio.js.map
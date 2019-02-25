function drawSquare(x,y,side) {

  ctx.moveTo(x,y);
  ctx.lineTo(x + side, y);
  ctx.moveTo(x+side,y);
  ctx.lineTo(x+side,y+side);
  ctx.moveTo(x+side,y+side);
  ctx.lineTo(x,y+side);
  ctx.moveTo(x,y+side);
  ctx.lineTo(x,y);
  
  ctx.stroke();
}


function drawRectangle(x,y,x_size,y_size) {

  ctx.moveTo(x,y);
  ctx.lineTo(x + x_size, y);
  ctx.moveTo(x+x_size,y);
  ctx.lineTo(x+x_size,y+y_size);
  ctx.moveTo(x+x_size,y+y_size);
  ctx.lineTo(x,y+y_size);
  ctx.moveTo(x,y+y_size);
  ctx.lineTo(x,y);
  
  ctx.stroke();
}


var c  : any = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

drawSquare( 10,10,100);
drawRectangle( 50,50,100, 20);

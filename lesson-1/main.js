(function() {
   window.addEventListener("load", function(event) {
       new Canvas();
   });
   
   var Canvas = function() {
     var ctx;
     var ship;
     var canvas = document.getElementById("canvas");
     ctx = canvas.getContext("2d");
     ctx.fillStyle = "white";
     ctx.strokeStyle = "white";
     ctx.lineWidth = 3;
     ctx.translate(canvas.width/2, canvas.height/2);
     ship = new Ship(ctx);
   };
   
   var Ship = function(ctx) {
     ctx.beginPath();
     ctx.moveTo(20, 0);
     ctx.lineTo(-20, -10);
     ctx.moveTo(20, 0);
     ctx.lineTo(-20, 10);
     ctx.closePath();
     ctx.stroke();
   };
}())
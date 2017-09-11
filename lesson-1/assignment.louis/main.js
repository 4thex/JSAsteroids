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
        /*
            TODO: Move the ship to x=0, y=0 
        */
        /*
            TODO: Point the spacehip to the right
        */
        var loop = function() {
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ship.render();
            ctx.restore();
            window.requestAnimationFrame(loop);
        };
        window.requestAnimationFrame(loop);
        
        var animate = function() {
            /*
                TODO: Change the ships position here, so that flies to the right.
            */
            /*
                TODO: Make it start over from the left side, once it exits the canvas.
            */
            /*
                TODO: The canvas is not cleared correctly. Fix the bug.
            */
        };
        window.setInterval(animate, 1);
   };
   
   var Ship = function(ctx) {
     return {
       position: {
           x: 500,
           y: 500
       },
       direction: 0,
       render: function() {
         ctx.save();
         ctx.translate(this.position.x, this.position.y);
         ctx.rotate(2*Math.PI*this.direction/360);
         ctx.beginPath();
         ctx.moveTo(0, -20);
         ctx.lineTo(10, 20);
         ctx.moveTo(0, -20);
         ctx.lineTo(-10, 20);
         /*
            TODO: Finish drawing the spaceship
         */
         ctx.closePath();
         ctx.stroke();
         ctx.restore();
       }
     };
   };
}())
/* global performance */
var asteroids = asteroids || {};
asteroids.Canvas = function() {
    var ctx;
    var ship;
    var keys = [];
    var canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 3;
    ctx.translate(canvas.width/2, canvas.height/2);
    ship = new asteroids.Ship(ctx);

    var loop = function() {
        ctx.save();
        ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
        ship.render();
        ctx.restore();
        window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
    
    var lastAnimate = performance.now();
    var animate = function() {
        // ship.position.x++;
        var timestamp = performance.now();
        controlShip(timestamp - lastAnimate);
        lastAnimate = timestamp;
    };
    window.setInterval(animate, 5);
    
    var controlShip = function(duration) {
        // Calculate new position based on duration and thrust
        
        if(ship.position.x > canvas.width/2) {
            ship.position.x = -canvas.width/2
        }
        if(keys["ArrowRight"]) {
            ship.direction++;
        }
        if(keys["ArrowLeft"]) {
            ship.direction--;
        }
        ship.thrust = keys["ArrowUp"];
        ship.direction %= 360;
        if(ship.direction<0) {
            ship.direction = ship.direction+360;
        }
    };
    
    return {
      keys: keys  
    };
};

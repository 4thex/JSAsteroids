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
    // ctx.translate(canvas.width/2, canvas.height/2);
    ctx.transform(1, 0, 0, -1, canvas.width/2, canvas.height/2);
    ship = new asteroids.Ship(ctx);
    ship.direction = 0;
    ship.speed = 300;

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
        var timestamp = performance.now();
        controlShip(timestamp - lastAnimate);
        lastAnimate = timestamp;
    };
    window.setInterval(animate, 5);
    
    var controlShip = function(duration) {
        // Calculate new position based on duration, current speed, and direction
        var d = ship.speed * duration/1000;
        var dx = d * Math.cos((ship.direction-90).toRad());
        var dy = -d * Math.sin((ship.direction-90).toRad());
        // console.log("duration="+duration+"\nspeed="+ship.speed+"\ndx="+dx+"\ndy="+dy+"\nd="+d+"\ndirection="+ship.direction.toDeg());
        ship.position.x += dx;
        ship.position.y += dy;
        
        // Calculate 

        if(ship.position.x > canvas.width/2) {
            ship.position.x = -canvas.width/2
        }
        if(ship.position.x < -canvas.width/2) {
            ship.position.x = canvas.width/2
        }
        if(ship.position.y > canvas.height/2) {
            ship.position.y = -canvas.height/2
        }
        if(ship.position.y < -canvas.width/2) {
            ship.position.y = canvas.width/2
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

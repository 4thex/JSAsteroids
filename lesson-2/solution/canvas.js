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
    ship.direction = 45;
    ship.speed = 50;

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
        duration = duration / 1000;
        // console.log("direction="+ship.direction);
        ship.thrust = keys["ArrowUp"];
        // Calculate new position based on duration, current speed, and direction
        var d = ship.speed * duration;
        var dx = d * Math.cos((ship.direction).toRad());
        var dy = -d * Math.sin((ship.direction-90).toRad());
        // console.log("duration="+duration+"\nspeed="+ship.speed+"\ndx="+dx+"\ndy="+dy+"\nd="+d+"\ndirection="+ship.direction.toDeg());
        ship.position.x += dx;
        ship.position.y += dy;

        if(ship.thrust) {
            // Calculate thrust vector
            // Acceleration
            var acc = 1000; // units/ms^2
            // Thrust vector
            var b = (acc * Math.pow(duration, 2)) / 2;
            var bx = b * Math.cos((ship.orientation).toRad());
            var by = -b * Math.sin((ship.orientation-90).toRad());
            // console.log("b="+b+", bx="+bx+", by="+by);
            
            ship.position.x += bx;
            ship.position.y += by;
            
            // Calculate new direction
            var dir = Math.atan((dy+by)/(dx+bx));
            // console.log("New direction="+ship.direction);
            
            // Length of resulting vector
            var c = (dx+bx)/(Math.cos(dir));
            
            // Calculate new speed
            ship.speed = c / duration;
            ship.direction = dir.toDeg();
        }        

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
            ship.orientation++;
        }
        if(keys["ArrowLeft"]) {
            ship.orientation--;
        }
        
        ship.orientation %= 360;
        if(ship.orientation<0) {
            ship.orientation = ship.orientation+360;
        }
    };
    
    return {
      keys: keys  
    };
};

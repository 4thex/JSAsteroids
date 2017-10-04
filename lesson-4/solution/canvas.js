/* global performance */
var asteroids = asteroids || {};
asteroids.Canvas = function() {
    var ctx;
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
    var ship = new asteroids.Ship(ctx);
    ship.direction = 0;
    ship.orientation = 90;
    ship.speed = 0;
    ship.speedLimit = 1000;

    var asteroid = new asteroids.Asteroid(ctx);
    asteroid.position.x = 500;
    asteroid.position.y = 500;
    var loop = function() {
        ctx.save();
        ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
        ship.render();
        asteroid.render();
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
    
    var collision = new asteroids.Collision();
    var detectCollision = function(obj1, obj2) {
        // Convert into segments
        var parts1 = obj1.parts;
        var parts2 = obj2.parts;
        var convert = function(part) {
            var segments = [];
            part.forEach(function(point, index, it) {
                if(index == 0) return;
                point.forEach(segments.push);
                it[index-1].forEach(segments.push);
            }); 
        };
    };
    
    var controlShip = function(duration) {
        duration = duration / 1000;
        ship.thrust = keys["ArrowUp"];
        // Calculate new position based on duration, current speed, and direction
        var d = ship.speed * duration;
        var dx = d * Math.cos((ship.direction).toRad());
        var dy = d * Math.sin((ship.direction).toRad());
        ship.position.x += dx;
        ship.position.y += dy;

        if(ship.thrust) {
            // Calculate thrust vector
            // Acceleration
            var acc = 1000;
            // Thrust vector
            var b = (acc * Math.pow(duration, 2)) / 2;
            var bx = b * Math.cos((ship.orientation).toRad());
            var by = b * Math.sin((ship.orientation).toRad());
            ship.position.x += bx;
            ship.position.y += by;
            
            // Calculate new direction
            var dir = Math.atan((dy+by)/(dx+bx));

            // Length of resulting vector
            var c = (dx+bx)/(Math.cos(dir));
            
            // Calculate new speed
            ship.speed = c / duration;
            if(Math.abs(ship.speed)>ship.speedLimit) {
                ship.speed = Math.sign(ship.speed)*ship.speedLimit;
            }
            
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
            ship.orientation--;
        }
        if(keys["ArrowLeft"]) {
            ship.orientation++;
        }
        
        ship.orientation %= 360;
        if(ship.orientation<0) {
            ship.orientation = ship.orientation+360;
        }
        ship.direction %= 360;
        if(ship.direction<0) {
            ship.direction = ship.direction+360;
        }
    };
    
    return {
      keys: keys  
    };
};

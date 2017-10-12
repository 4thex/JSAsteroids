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

    var torpedos = [];

    var asteroidsCollection = [];
    
    var asteroid1 = new asteroids.Asteroid(ctx);
    asteroid1.position.x = 500;
    asteroid1.position.y = 500;
    
    var asteroid2 = new asteroids.Asteroid(ctx);
    asteroid2.position.x = -500;
    asteroid2.position.y = -500;
    
    asteroidsCollection.push(asteroid1);
    asteroidsCollection.push(asteroid2);
    
    var loop = function() {
        ctx.save();
        ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
        // Check if the ship collided with any of the asteroids
        ship.collided = asteroidsCollection.some(function(asteroid) {
            var collided = collision.detectObjects(ship, asteroid);
            if(collided) {
                asteroid.collided = true;
                window.setTimeout(function() {
                   asteroid.collided = false;
               }, 1000);
            }
            return collided;
        });
        ship.render();
        asteroidsCollection.forEach(function(asteroid) {
            asteroid.render();
        });
        
        // Remove expired torpedos
        torpedos = torpedos.filter(function(torpedo) {
            return !torpedo.expired;
        });
        
        // Render all torpedos
        torpedos.forEach(function(torpedo) {
            torpedo.render();
        });
        
        // Check if any torpedo collided with any asteroid
        asteroidsCollection.forEach(function(asteroid) {
           var collided = torpedos.some(function(torpedo) {
               return collision.detectObjects(asteroid, torpedo);
           }); 
           if(collided) {
               asteroid.collided = true;
               window.setTimeout(function() {
                   asteroid.collided = false;
               }, 1000);
           }
        });
        
        ctx.restore();
        window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
    
    var lastAnimate = performance.now();
    var animate = function() {
        var timestamp = performance.now();
        var duration = timestamp - lastAnimate;
        controlShip(duration);
        controlTorpedos(duration);
        lastAnimate = timestamp;
    };
    window.setInterval(animate, 1);
    
    var controlTorpedos = function(duration) {
        duration = duration / 1000;
        torpedos.forEach(function(torpedo) {
            var d = torpedo.speed * duration;
            var dx = d * Math.cos((torpedo.orientation).toRad());
            var dy = d * Math.sin((torpedo.orientation).toRad());
            torpedo.position.x += dx;
            torpedo.position.y += dy;
        });
        if(!asteroids.Torpedo.halted && keys[" "]) {
            var torpedo = new asteroids.Torpedo(ctx);
            torpedo.position.x = ship.position.x;
            torpedo.position.y = ship.position.y;
            torpedo.orientation = ship.orientation;
            torpedos.push(torpedo);
        }
    };
    
    var collision = new asteroids.Collision();

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

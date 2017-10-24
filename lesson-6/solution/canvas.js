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
    
    var createAsteroid = function(ctx) {
      var asteroid = new asteroids.Asteroid(ctx);
      // Random direction and distance from center
      // Get random angle between 0 and 360 degrees
      var angle = Math.random() * 360;
      // Get random distance between 500 and 1000
      var distance = Math.random() * (1000 - 500) + 500;
      asteroid.position.x = Math.cos(angle.toRad()) * distance;
      asteroid.position.y = Math.sin(angle.toRad()) * distance;
      
      // Random orientation between 0 and 360 degrees
      var orientation = Math.random() * 360;
      asteroid.orientation = orientation;
      
      // Random speed between 50 and 200
      var speed = Math.random() * (200 - 50) + 50;
      asteroid.speed = speed;
      
      // Random direction between 0 and 360 degrees
      var direction = Math.random() * 360;
      asteroid.direction = direction;
      
      // Random rotation speed between -100 and 100 per second
      var rotation = Math.random() * (100 - -100) + -100;
      asteroid.rotation = rotation;
      
      return asteroid;
    };
    
    var i;
    for(i = 0; i<10; i++) {
        var asteroid = createAsteroid(ctx);
        asteroidsCollection.push(asteroid);
    }
    
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
               var result = collision.detectObjects(asteroid, torpedo);
               if(result) {
                   torpedo.expired = true;
               }
               return result;
           }); 
           if(collided) {
               asteroid.collided = true;
           }
        });
        asteroidsCollection = asteroidsCollection.filter(function(asteroid) {
           return !asteroid.collided; 
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
        controlAsteroids(duration);
        lastAnimate = timestamp;
    };
    window.setInterval(animate, 1);
    
    var controlAsteroids = function(duration) {
        duration = duration / 1000;
        asteroidsCollection.forEach(function(asteroid) {
            var d = asteroid.speed * duration;
            var dx = d * Math.cos((asteroid.direction).toRad());
            var dy = d * Math.sin((asteroid.direction).toRad());
            asteroid.position.x += dx;
            asteroid.position.y += dy;
            if(asteroid.position.x > canvas.width/2) {
                asteroid.position.x = -canvas.width/2
            }
            if(asteroid.position.x < -canvas.width/2) {
                asteroid.position.x = canvas.width/2
            }
            if(asteroid.position.y > canvas.height/2) {
                asteroid.position.y = -canvas.height/2
            }
            if(asteroid.position.y < -canvas.width/2) {
                asteroid.position.y = canvas.width/2
            }
            
            var dr = asteroid.rotation * duration;
            asteroid.orientation += dr;
            asteroid.orientation %= 360;
        });
    };
    
    var controlTorpedos = function(duration) {
        duration = duration / 1000;
        torpedos.forEach(function(torpedo) {
            var d = torpedo.speed * duration;
            var dx = d * Math.cos((torpedo.orientation).toRad());
            var dy = d * Math.sin((torpedo.orientation).toRad());
            torpedo.position.x += dx;
            torpedo.position.y += dy;
            if(torpedo.position.x > canvas.width/2) {
                torpedo.position.x = -canvas.width/2
            }
            if(torpedo.position.x < -canvas.width/2) {
                torpedo.position.x = canvas.width/2
            }
            if(torpedo.position.y > canvas.height/2) {
                torpedo.position.y = -canvas.height/2
            }
            if(torpedo.position.y < -canvas.width/2) {
                torpedo.position.y = canvas.width/2
            }
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

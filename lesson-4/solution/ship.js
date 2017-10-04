var asteroids = asteroids || {};

asteroids.Ship = function(ctx) {
    var thrust = false;
    var flicker = false;
    window.setInterval(function() {
        flicker = !flicker;
    }, 50);
    
    return {
        thrust: thrust,
        position: {
           x: 0,
           y: 0
        },
        direction: 0,
        orientation: 0,
        speed: 0,
        speedLimit: 1000,
        parts: [
            [
                [-10, -20], [0, 20], [10, -20]
            ],
            [
                [7, -8], [-7, -8]
            ]
        ],
        render: function() {
         ctx.save();
         ctx.translate(this.position.x, this.position.y);
         ctx.rotate((this.orientation-90).toRad());
         ctx.beginPath();
         this.parts.forEach(function(part, index) {
            var first = true;
            part.forEach(function(segment, index) {
                var x = segment[0];
                var y = segment[1];
                if(first) {
                    ctx.moveTo(x, y);
                    first = false;
                } else {
                    ctx.lineTo(x, y);
                }
            });
         });
         if(this.thrust) {
             ctx.moveTo(-7, -8);
            if(flicker) {
                ctx.lineTo(0, -20);
            } else {
                ctx.lineTo(0, -30);
            }
            ctx.lineTo(7, -8);
         }
         ctx.stroke();
         ctx.restore();
        }
    };
};

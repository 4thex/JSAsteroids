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
        speed: 0,
        render: function() {
         ctx.save();
        //  ctx.scale(10, 10);
         ctx.translate(this.position.x, this.position.y);
         ctx.rotate(-this.direction.toRad());
         ctx.beginPath();
         ctx.moveTo(-10, -20);
         ctx.lineTo(0, 20);
         ctx.lineTo(10, -20);
         ctx.moveTo(7, -8);
         ctx.lineTo(-7, -8);
         if(this.thrust) {
            if(flicker) {
                ctx.lineTo(0, -20);
            } else {
                ctx.lineTo(0, -30);
            }
            ctx.lineTo(7, -8);
         }
         ctx.closePath();
         ctx.stroke();
         ctx.restore();
        }
    };
};

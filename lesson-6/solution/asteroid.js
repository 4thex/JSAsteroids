var asteroids = asteroids || {};

asteroids.Asteroid = function(ctx) {
    return {
        position: {
           x: 0,
           y: 0
        },
        orientation: 0,
        direction: 0,
        speed: 0,
        rotation: 0, // Degrees per second
        parts: [
            [
                [0, 100], [75, 100], [100, 0], [75, 25], [50, -100], [0, -100], [-25, -100], [-25, -50], [-100, 0], [0, 100]
            ]
        ],
        collided: false,
        render: function() {
            ctx.save();
            if(this.collided) {
                ctx.strokeStyle = 'red';
            }
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
            ctx.stroke();
            ctx.restore();
        }
    }
    
};
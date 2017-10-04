var asteroids = asteroids || {};

asteroids.Asteroid = function(ctx) {
    return {
        position: {
           x: 0,
           y: 0
        },
        parts: [
            [
                [0, 100], [100, 0], [0, -100], [-100, 0], [0, 100]
            ]
        ],
        render: function() {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
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
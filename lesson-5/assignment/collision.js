var asteroids = asteroids || {};
asteroids.Collision = function() {
   var overlap = function(segments) {
       var ax = segments[0][0];
       var ay = segments[0][1];
       var bx = segments[0][2];
       var by = segments[0][3];
       var cx = segments[1][0];
       var cy = segments[1][1];
       var dx = segments[1][2];
       var dy = segments[1][3];
       
       if(cy<ay && cy<by && dy<ay && dy<by) return false;
       if(cy>ay && cy>by && dy>ay && dy>by) return false;
       if(cx<ax && cx<bx && dx<ax && dx<bx) return false;
       if(cx>ax && cx>bx && dx>ax && dx>bx) return false;
       return true;
   };
   
   var ccw = function(coordinates) {
       var ax = coordinates[0];
       var ay = coordinates[1];
       var bx = coordinates[2];
       var by = coordinates[3];
       var cx = coordinates[4];
       var cy = coordinates[5];
       var abslope = (by-ay)/(bx-ax);
       var acslope = (cy-ay)/(cx-ax);

       var acccw;
       if((cx<ax && bx>=ax) || (cx>=ax && bx<ax)) {
           acccw = acslope < abslope;
       } else {
           acccw = acslope > abslope;
       }
       return acccw;
   };
   
   var it = {
       detect: function(segments) {
           if(!overlap(segments)) return false;
           var ax = segments[0][0];
           var ay = segments[0][1];
           var bx = segments[0][2];
           var by = segments[0][3];
           var cx = segments[1][0];
           var cy = segments[1][1];
           var dx = segments[1][2];
           var dy = segments[1][3];
           
           var acccw = ccw([ax, ay, bx, by, cx, cy]);
           var adccw = ccw([ax, ay, bx, by, dx, dy]);
           var caccw = ccw([cx, cy, dx, dy, ax, ay]);
           var cbccw = ccw([cx, cy, dx, dy, bx, by]);
           return acccw != adccw && caccw != cbccw;
       },
       detectObjects: function(obj1, obj2) {
            // Convert into segments
            var parts1 = obj1.parts;
            var parts2 = obj2.parts;
            var convert = function(part) {
                var segments = [];
                part.forEach(function(point, index, it) {
                    if(index == 0) return;
                    var segment = [];
                    point.forEach(function(a) {
                        segment.push(a);
                    });
                    it[index-1].forEach(function(a) {
                        segment.push(a);
                    });
                    segments.push(segment);
                });
                return segments;
            };
            var translate = function(segment, position, orientation) {
                var rotate = function(point, orientation) {
                    if(orientation === undefined) {
                        return point;
                    }
                    var rad = orientation.toRad();
                    var x = point[0];
                    var y = point[1];
                    var x1 = Math.cos(rad)*x+Math.sin(rad)*y;
                    var y1 = Math.sin(rad)*-x+Math.cos(rad)*y;
                    return [x1, y1];
                };
                var a = rotate([segment[0], segment[1]], orientation);               
                var b = rotate([segment[2], segment[3]], orientation);               
                return [
                    a[0]+position.x
                    , a[1]+position.y
                    , b[0]+position.x
                    , b[1]+position.y];
            };
            // Check all segments in each part agains all segments of all parts in other object
            var obj1Segments = obj1.parts.map(convert).reduce(function(a, b) {
                return a.concat(b);
            }, []);
            var obj2Segments = obj2.parts.map(convert).reduce(function(a, b) {
                return a.concat(b);
            }, []);
            var detected = obj1Segments.map(function(s) { 
                    return translate(s, obj1.position, obj1.orientation);
                }).some(function(s1) {
                    return obj2Segments.map(function(s) {
                        return translate(s, obj2.position, obj2.orientation);
                    }).some(function(s2) {
                        var hit = it.detect([s1, s2]);    
                        return hit;
                    });
                });
            return detected;           
       }
   };
   return it;
};

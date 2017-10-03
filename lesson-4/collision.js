var game;
(function() {
    window.addEventListener('load', function() {
       game = game || {};
       game.Collision = function() {
           var overlap = function(segments) {
               
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
               if(((cx-ax)<0 && (bx-ax)>=0) || ((cx-ax)>=0 && (bx-ax)<0)) {
                   acccw = acslope < abslope;
               } else {
                   acccw = acslope > abslope;
               }
               return acccw;
           };
           
           var it = {
               detect: function(segments) {
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
               }
           };
           return it;
       };
    });
}());
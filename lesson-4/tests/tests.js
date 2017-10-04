var game = game || {};
QUnit.test( "intersect", function( assert ) {
  var collision = new game.Collision();
  var testCases = [
          [[  0,   0,  10,  10], [  2,  -3,   3,  10]] // 
        , [[ 10,   2,  -2,   2], [ -3,   0,  10,  10]]
        , [[  0,   0,  10,  -2], [  1,   1,  10,  -3]]
        , [[ -1,  -1, -10, -10], [  0, -10, -10,  -3]]
        , [[  1,   1,   1,  10], [  0,   5,  10,   5]]
        , [[  1,   2,   3,   4], [  3,   2,  -5,   8]]
        , [[  0, -20,   0,  20], [-20,   0,  20,   0]]
        , [[  0, -20,   0,  20], [  1,  20,  -1, -20]]
  ];
  testCases.forEach(function(testCase) {
      var result = collision.detect(testCase);
      assert.ok(result == true, "Passed: "+testCase);
  });
});

QUnit.test('performance', function(assert) {
    var randomSegment = function() {
      var segment = [];
      var i;
      for(i=0; i<4; i++) {
          segment.push(Math.random() * 100 + -50);
      }
      return segment;
    }; 
    console.time("Executions");
    var collision = new game.Collision();
    var intersect = 0;
    var notIntersect = 0;
    var i;
    for(i = 0; i< 1000; i++) {
        var result = collision.detect([randomSegment(), randomSegment()]);
        if(result) {
            intersect++;
        } else {
            notIntersect++;
        }
    }
    console.timeEnd("Executions");
    assert.ok(true, "Passed: Intersect="+intersect+", Not Intersect="+notIntersect);    
});

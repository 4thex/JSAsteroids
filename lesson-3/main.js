/* global fetch */
var tutor;
(function(){
    window.addEventListener('load', function() {
        tutor = tutor || {};
        tutor.errorContainer = document.getElementById('errors');
        tutor.successContainer = document.getElementById('success');
        tutor.instructionsContainer = document.getElementById('instructions');
        tutor.assignments = [];
        fetch('assignments.json').then(function(response) {
           response.json().then(function(data) {
               tutor.assignments = data;
               var assignment = tutor.assignments.shift();
               tutor.render(assignment);
           }); 
        });

        tutor.render = function(assignment) {
            tutor.prepareContext(tutor.assignmentContext);
            tutor.prepareContext(tutor.solutionContext);
            tutor.instructionsContainer.innerHTML = assignment.description.join('\n');
            editor.innerHTML = assignment.template.join('\n');
            tutor.renderSolution = new Function("context", assignment.solution.join('\n'));
            tutor.renderSolution(tutor.solutionContext);
        };

        window.addEventListener('error', function(event) {
           tutor.errorContainer.innerHTML = event.error;
        });

        var editor = document.getElementById('editor');

        tutor.runBtn = document.getElementById('run-button');
        tutor.nextBtn = document.getElementById('next-button');
        tutor.runBtn.addEventListener('click', function(event) {
            tutor.errorContainer.innerHTML = '';
            tutor.successContainer.innerHTML = '';
            tutor.prepareContext(tutor.assignmentContext, 'Assignment');
            var renderAssignment = new Function('context', editor.innerHTML);
            renderAssignment(tutor.assignmentContext);
            if(!tutor.same(tutor.assignmentContext, tutor.solutionContext)) {
                tutor.errorContainer.innerHTML = 'That doesn\'t look like the solution';
            } else {
                tutor.successContainer.innerHTML = 'Yeah! You got it! Click the Next button to go to the next assignment.';
                tutor.nextBtn.disabled = false;
            }
        });
        
        tutor.nextBtn.addEventListener('click', function(event) {
            tutor.nextBtn.disabled = true;
            var assignment = tutor.assignments.shift();
            if(assignment) {
                tutor.render(assignment);
            } else {
                tutor.successContainer.innerHTML = 'Your are done! You successfully completed all the assignments';
            }
        });
        
        tutor.prepareContext = function(context) {
            var canvas = context.canvas;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.lineWidth = 5;  
        };

        tutor.same = function(one, other) {
            var oneData = one.getImageData(0, 0, one.canvas.width, one.canvas.height).data;
            var otherData = other.getImageData(0, 0, other.canvas.width, other.canvas.height).data;
            return oneData.every(function(element, index) {
               return element == otherData[index]; 
            });
        };
        
        var assignmentCanvas = document.getElementById('assignment');
        var solutionCanvas = document.getElementById('solution');
        tutor.solutionContext = solutionCanvas.getContext('2d');
        tutor.assignmentContext = assignmentCanvas.getContext('2d');
    });
})();


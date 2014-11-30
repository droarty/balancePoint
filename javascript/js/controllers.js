var bpControllers=angular.module('bpControllers',[]);

/* Get name of student, then fetch studentAnswer or create a new one */
bpControllers.controller('NameCtrl', ['$scope','$rootScope', '$location', '$http',
    function ($scope,$rootScope,$location, $http) {
        var rt=$rootScope;
        activateTab("#/name");
        $scope.msg="";
        $scope.btnMsg="Create New Student Record";
        window.setTimeout(function(){$("input[ng-model='name']").focus();},500);
        if(rt.sa) $scope.name=rt.sa.name;

        //watch for changes to name, check if it exists on backend...
        $scope.$watch('name',function(newval, oldval){
            //check for existing data on backend only if there is no existing .sa or the name is different...
            if(newval&&(!rt.sa||rt.sa.name!=newval)){
                $scope.btnMsg="Checking Name..."
                $http.post('data/getStudentAnswer.php',{"action":"fetch", "name":$scope.name})
                .success(
                    function(data) {
                        if(data.data){
                            //if data exist, indicate to student, add data to scope...
                            $scope.msg="Welcome Back "+$scope.name;
                            $scope.btnMsg="Continue";
                            $rootScope.sa=data.data;
                        }
                        else {
                            $scope.msg="";
                            $scope.btnMsg="Create New Student Record"
                        }
                        
                    }
                );
            }
        })
        
        //create or save record, move on to next page...
        $scope.start=function(){
            if(!$scope.name) $scope.msg="You need to enter a name to continue.";
            else {
                if(!rt.sa||rt.sa.name!=$scope.name) rt.sa={"name":$scope.name};
                //create or save record...
                $http.post('data/getStudentAnswer.php',{"action":"save", "name":$scope.name, "value":rt.sa})
                .success(
                    function(data) {
                        $location.path("/predict");
                    }
                );
            }
        }
        
        //provide  a way to clear all students from demo...
        $scope.clear=function(){
            $http.post('data/getStudentAnswer.php',{"action":"clearAll"})
            .success(
                function(data) {
                    alert("All Cleared");
                }
            );
        }
    }
]);

/* get student prediction and save it */
bpControllers.controller('PredictCtrl', ['$scope','$rootScope', '$location','$http',
    function ($scope,$rootScope,$location,$http) {
        var rt=$rootScope;
        activateTab("#/predict");
        //redirect to home page if we don't have a student answeo object...
        if(!rt.sa) $location.path("/name");
        //if we already have a prediction, draw it...
        if(rt.sa&&rt.sa.prediction) $("#fulcrum").attr("transform","translate("+(parseInt(rt.sa.prediction)+300)+",106)");
        //wired up to the svg element on mouse move to capture x coordinate...
        $scope.movePoint=function($event){
            //allowmove is set on click events on the fulcrum element, true on mousedown, false on mouse up or leave...
            if($scope.allowmove){
                var svg=$("#pointPicker");//this is the svg element with the drawing of the weights
                var x=svg.offset().left;//gets left edge of svg element
                if(!rt.sa) rt.sa={};
                //uses event x coordinate to calculate distance from center of drawing...
                rt.sa.prediction=$event.clientX-x-300;
                //changes posistion of the fulcrum...
                if(rt.sa.prediction!=undefined) $("#fulcrum").attr("transform","translate("+(parseInt(rt.sa.prediction)+300)+",106)");
            }
        }
        
        //create or save record, move on to next page...
        $scope.savePrediction=function(){
            if(!rt.sa){
                $location.path("/name");
            } 
            else {
                if(rt.sa.prediction==undefined) $scope.msg="Can't move forward yet... you need to make a prediction by sliding the triangle to where you think Ben should pick up the bar."
                else{
                    //create or save record...
                    $http.post('data/getStudentAnswer.php',{"action":"save", "name":rt.sa.name, "value":rt.sa})
                    .success(
                        function(data) {
                            $location.path("/comparePrediction");
                        }
                    );
                }
            }
        }
        
    }
]);

/* fetch all student answers and display */
bpControllers.controller('ComparePredictionCtrl', ['$scope','$rootScope', '$location','$http',
    function ($scope,$rootScope, $location,$http) {
        var rt=$rootScope;
        activateTab("#/comparePredictions");
        //redirect to home page if we don't have a student answeo object...
        if(!rt.sa) $location.path("/name");
        //redraw my  prediction...
        if(rt.sa&&rt.sa.prediction) $("#myFulcrum").attr("transform","translate("+(parseInt(rt.sa.prediction)+300)+",106)");
        //get all the other student's data...
        $http.post('data/getStudentAnswer.php',{"action":"fetchAll"})
        .success(
            function(data) {
                //create an array of fulcrum positions...
                //TO-DO  embellish so identical positions don't pile up on top of each other'
                $scope.fulcrumArray=[];
                for(var i=0;i<data.length;i++){
                    if(data[i].prediction!=undefined&&data[i].name!=rt.sa.name) $scope.fulcrumArray.push("translate("+(parseInt(data[i].prediction)+300)+",110)");
                }
                if($scope.fulcrumArray.length>1) $scope.prompt="Your answer is the red triangle below.  Your classmates are blue.  Did you get the same answer as other people?  With your group, try and decide on the best guess.";
                else if($scope.fulcrumArray.length>0) $scope.prompt="Your answer is the red triangle below.  One other classmate's is blue.  Refresh this page when more students have submitted their prediction, then decide on the best guess. "; 
                else $scope.prompt="Good job, your answer is the red triangle below.  None of your classmates have submitted thier prediction yet.  Refresh this page when more students have submitted their prediction, then decide on the best guess."; 
                
            }
        );
        $scope.prompt="Loading...";
        
    }
]);


/* allow student to choose information needed to solve */
bpControllers.controller('MoreInfoCtrl', ['$scope','$rootScope', '$location','$http',
    function ($scope,$rootScope, $location,$http) {
        activateTab("#/moreInfo");
    }
]);

/* Student documents and draws solution */
bpControllers.controller('SolveItCtrl', ['$scope','$rootScope', '$location','$http',
    function ($scope,$rootScope, $location,$http) {
        activateTab("#/solveIt");
    }
]);

/* fetch all student solutions and display */
bpControllers.controller('CompareSolutionCtrl', ['$scope','$rootScope', '$location','$http',
    function ($scope,$rootScope, $location,$http) {
        activateTab("#/compareSolution");
    }
]);

//sets active nav link in the top nav bar...
var activateTab=function(href){
    $("ul.nav li.active").removeClass("active");
    $("ul.nav a[href='"+href+"']").parent().addClass("active");
}
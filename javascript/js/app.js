var bpApp=angular.module("bpApp",["ngRoute","bpControllers", "DataServices"]);

bpApp.config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/name',{
                templateUrl:'partials/name.html',
                controller:'NameCtrl'
            }).
            when('/predict',{
                templateUrl:'partials/predict.html',
                controller:'PredictCtrl'
            }).
            when('/comparePrediction',{
                templateUrl:'partials/comparePrediction.html',
                controller:'ComparePredictionCtrl'
            }).
            when('/moreInfo',{
                templateUrl:'partials/moreInfo.html',
                controller:'MoreInfoCtrl'
            }).
            when('/solveIt',{
                templateUrl:'partials/solveIt.html',
                controller:'SolveItCtrl'
            }).
            when('/compareSolution',{
                templateUrl:'partials/compareSolution.html',
                controller:'CompareSolutionCtrl'
            }).
            otherwise({redirectTo:'/name'})
    }
])
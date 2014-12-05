var DataServices = angular.module('DataServices', ['ngResource']);

//create a single service for fetching and setting data.
DataServices.factory('DataSrc', ['$resource',
    function($resource){
        return $resource('data/getStudentAnswer.php',{},
            {
                'fetch':{method:'PUT',params:{"action":"fetch"}},
                'save':{method:'PUT',params:{"action":"save"}},
                'fetchAll':{method:'PUT',params:{"action":"fetchAll"}, "isArray":true},
                'clearAll':{method:'PUT',params:{"action":"clearAll"}}
            }
        )
    }
]);


'use strict';

/**
 * Defined a controller named 'ExampleController' that works with the view template
 * exampleTemplate.html.  We assume that cs142App has already been defined by
 * the main.js controller.  To access this view need to include the controller:
 *
 *  <script src='components/example/exampleController.js'></script>
 *
 * and its view template:
 *   <div ng-include=''components/example/exampleTemplate.html'' ng-controller='ExampleController'></div>
 */

efficApp.controller('VisualController', ['$scope', function($scope) {
    if ($scope.dashboard) {
        $scope.dashboard.title = 'Effic Visual';
    }

    $scope.url_data = window.efficmodels.visualModel().chrome_history_timespent_domain;
    $scope.str_time = function(msec) {
        var sec = Math.floor(msec/1000); //ms to s
        var day = Math.floor(sec/(3600*24));
        sec %= 3600*24;
        var hr = Math.floor(sec/3600);
        sec %= 3600;
        var min = Math.floor(sec/60);
        sec %= 60;
        var time_str = ''; 
        if(day) {
            time_str += day+' days ';
        }
        if(hr) {
            time_str += hr+' hours ';
        }
        if(min) {
            time_str += min+' minutes ';
        }
        if(sec) {
            time_str += sec+' seconds';
        }
        return time_str;
    };
}]);

"use strict";

/**
 * Create an angular module called 'cs142App' and assign it to a DOM property with the same name.
 * The [] argument specifies module is to be created and doesn't require any other module.
 */
var efficApp = angular.module('efficApp', ['ngRoute']);

/**
 * Create a controller named 'MainController'.  The array argument specifies the controller
 * function and what dependencies it has.  We specify the '$scope' service so we can have access
 * to the angular scope of view template.
 */
efficApp.controller('DashboardController', ['$scope', function($scope) {
    // We defined an object called 'main' with a single property 'title' that is used
    // by the html view template to get the page's title in the browser tab.
    // Main object allows child scopes to change parent variables
    $scope.dashboard = {};
    $scope.dashboard.title = 'Effic';
}]);

efficApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/visual', {
        templateUrl: 'components/visual/visualTemplate.html',
        controller: 'VisualController'
      }).
      when('/goal', {
        templateUrl: 'components/goal/goalTemplate.html',
        controller: 'GoalController'
      }).
      otherwise({
        redirectTo: '/visual'
      });
}]);
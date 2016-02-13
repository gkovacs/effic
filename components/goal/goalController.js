'use strict';

/**
 * Defined a controller named 'ExampleController' that works with the view template
 * exampleTemplate.html.  We assume that cs142App has already been defined by
 * the main.js controller.  To access this view need to include the controller:
 *
 *  <script src="components/example/exampleController.js"></script>
 *
 * and its view template:
 *   <div ng-include="'components/example/exampleTemplate.html'" ng-controller="ExampleController"></div>
 */

efficApp.controller('GoalController', ['$scope', function($scope) {
   if ($scope.dashboard) {
      $scope.dashboard.title = 'Effic Goals';
   }
}]);

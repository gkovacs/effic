'use strict';

angular.module('app').controller('efficCtrl',
    ['$scope', 'efficAuthService',
        function ($scope, efficAuthService) {

            $scope.dashboardClick = function() {
                console.log('clicked on dashboard');
            };

            $scope.usageClick = function() {
                console.log('clicked on usage');
            };

            $scope.trendsClick = function() {
                console.log('clicked on trends');
            };

            $scope.goalsClick = function() {
                console.log('clicked on goals');
            };

            $scope.settingsClick = function() {
                console.log('clicked on settings');
            };

        }
    ]);
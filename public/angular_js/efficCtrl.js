'use strict';

angular.module('app').controller('efficCtrl',
    ['$scope', 'efficAuthService', 'efficHistoryService', 'efficCrxService',
        function ($scope, efficAuthService, efficHistoryService, efficCrxService) {

            $scope.currentPage = 'dashboard';

            console.log('getting data');
            efficCrxService.getFieldsFromExtension(['chrome_history_timespent_domain_past_24_hours'], function(data) {
                console.log('got data');
                console.log(data);
            });

            $scope.loggedIn = true;

            $scope.dashboardClick = function() {
                console.log('clicked on dashboard');
                $scope.currentPage = 'dashboard';
            };

            $scope.usageClick = function() {
                console.log('clicked on usage');
                $scope.currentPage = 'usage';
            };

            $scope.trendsClick = function() {
                console.log('clicked on trends');
                $scope.currentPage = 'trends';
            };

            $scope.goalsClick = function() {
                console.log('clicked on goals');
                $scope.currentPage = 'goals';
            };

            $scope.settingsClick = function() {
                console.log('clicked on settings');
                $scope.currentPage = 'settings';
            };

            $scope.capitalizeFirstLetter = function (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }

        }
    ]);
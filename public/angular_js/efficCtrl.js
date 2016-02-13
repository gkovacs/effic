'use strict';

angular.module('app').controller('efficCtrl',
    ['$scope', 'efficAuthService', 'efficHistoryService', 'efficCrxService',
        function ($scope, efficAuthService, efficHistoryService, efficCrxService) {

            $scope.loggedIn = true;
            $scope.currentPage = 'dashboard';
            $scope.name = '';
            $scope.id = '';

            console.log('getting data');
            efficCrxService.getFieldsFromExtension(['facebook_fullname', 'facebook_id'], function(data) {
                console.log('got data');
                console.log(data);
                $scope.$apply(function() {
                    $scope.name = data.facebook_fullname;
                    $scope.id = data.facebook_id;
                });
            });

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
'use strict';

angular.module('app').controller('efficCtrl',
    ['$scope', '$interval', 'efficAuthService', 'efficHistoryService', 'efficCrxService',
        function ($scope, $interval, efficAuthService, efficHistoryService, efficCrxService) {

            $scope.facebookLoggedIn = false;
            $scope.checkedAccount = false;
            $scope.hasAccount = false;
            $scope.loggedIn = false;
            $scope.currentPage = 'dashboard';
            $scope.name = '';
            $scope.id = '';
            $scope.pictureUrl = '';

            var checkFBLogin = $interval(function() {
                efficCrxService.getFieldsFromExtension(['facebook_loggedin'], function(data){
                    console.log('checking if logged into FB');
                    if (data.facebook_loggedin) {
                        $scope.$apply(function() {
                            console.log('user is logged in to FB');
                            $scope.facebookLoggedIn = true;
                            $interval.cancel(checkFBLogin);
                            initFacebook(checkAccount)
                        });
                    }
                });
            }, 1000);

            var initFacebook =  function(callback) {
                console.log('getting fields data');
                efficCrxService.getFieldsFromExtension(['facebook_fullname', 'facebook_id', 'facebook_profilepic'], function(data) {
                    console.log('got fields data');
                    console.log(data);
                    $scope.$apply(function() {
                        $scope.name = data.facebook_fullname;
                        $scope.id = data.facebook_id;
                        $scope.pictureUrl = data.facebook_profilepic;
                    });
                    callback();
                });
            };

            var checkAccount = function() {
                console.log('checking if account exists in server');
                efficAuthService.checkAccount($scope.id, function(error, accountexists) {
                   if (!error) {
                       if (accountexists) {
                           console.log('account exists');
                           $scope.$apply(function() {
                               $scope.checkedAccout = true;
                               $scope.hasAccount = true;
                           });
                       } else {
                           console.log('account does not exist');
                           $scope.checkedAccount = true;
                           $scope.hasAccount = false;
                       }
                   } else {
                       console.log('error in checking account');
                   }
                });
            };

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
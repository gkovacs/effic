'use strict';

angular.module('app').controller('fbmessageCtrl',
    ['$scope', '$interval', '$timeout', 'TIME_STARTED', 'efficAuthService', 'efficHistoryService', 'efficCrxService',
        function ($scope, $interval, $timeout, TIME_STARTED, efficAuthService, efficHistoryService, efficCrxService) {

            $scope.start_time = TIME_STARTED;

        }
    ]);
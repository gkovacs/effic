angular.module('app').service('efficHistoryService',
    ['$rootScope', '$http',
        function ($rootScope, $http) {

            this.getHistory = function(userid, callback) {
                $http({method: 'POST', url: '/account/history/retrieve',
                    data: {user_id: userid}})
                    .success((function(data, status, headers, config) {
                        callback(null, data);
                    }).bind(this))
                    .error(function(data, status, headers, config) {
                        callback(true);
                    });
            };

            this.addData = function(userid, dataToAdd, callback) {
                $http({method: 'POST', url: '/account/history/add',
                    data: {user_id: userid, store: dataToAdd}})
                    .success((function(data, status, headers, config) {
                        callback(null, data);
                    }).bind(this))
                    .error(function(data, status, headers, config) {
                        callback(true);
                    });
            };

        }
    ]);
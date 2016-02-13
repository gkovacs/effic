angular.module('app').service('efficAuthService',
    ['$rootScope', '$http',
        function ($rootScope, $http) {

            this.createAccount = function(userid, callback) {
                $http({method: 'POST', url: '/account/new',
                    data: {user_id: userid}})
                    .success((function(data, status, headers,config) {
                        callback(null);
                    }).bind(this))
                    .error(function(data, status, headers, config) {
                        callback(true);
                    });
            };

            this.checkAccount = function(userid, callback) {
                $http({method: 'POST', url: '/account/check',
                    data: {user_id: userid}})
                    .success((function(data, status, headers,config) {
                        callback(null, data);
                    }).bind(this))
                    .error(function(data, status, headers, config) {
                        callback(true);
                    });
            };

        }
    ]);
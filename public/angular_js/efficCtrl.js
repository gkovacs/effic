'use strict';

angular.module('app').controller('efficCtrl',
    ['$scope', '$interval', '$timeout', 'efficAuthService', 'efficHistoryService', 'efficCrxService',
        function ($scope, $interval, $timeout, efficAuthService, efficHistoryService, efficCrxService) {

            $scope.hasPlugin = false;
            $scope.facebookLoggedIn = false;
            $scope.checkedAccount = false;
            $scope.hasAccount = false;
            $scope.loggedIn = false;
            $scope.currentPage = 'dashboard';
            $scope.name = '';
            $scope.id = '';
            $scope.pictureUrl = '';

            var checkCrxPlugin = function() {
                var extension_installed, installextension, out$ = typeof exports != 'undefined' && exports || this;
                extension_installed = false;
                once_available('#autosurvey_content_script_loaded', function(){
                    extension_installed = true;
                    console.log('plugin available');
                    $scope.$apply(function() {
                        $scope.hasPlugin = true;
                    });
                });
                setTimeout(function(){
                    if (!extension_installed) {
                        console.log('prompt to install');
                        return document.querySelector('body').style.display = '';
                    }
                }, 1000);
                $scope.installExtension = function(){
                    var url, successCallback;
                    if ((typeof chrome != 'undefined' && chrome !== null) && chrome.webstore != null && chrome.webstore.install != null) {
                        return chrome.webstore.install(url = 'https://chrome.google.com/webstore/detail/efeilbcfmofhibadbmabeffihohfngnf', successCallback = function(){
                            console.log('extension install finished');
                            return window.location.reload();
                        });
                    } else {
                        return window.open('https://chrome.google.com/webstore/detail/efeilbcfmofhibadbmabeffihohfngnf');
                    }
                };
            };

            checkCrxPlugin();

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

            $scope.init = function() {
                console.log('initializing app');
                if ($scope.hasAccount) {
                    $scope.loggedIn = true;
                } else {
                    efficAuthService.createAccount($scope.id, function(error) {
                        if (!error) {
                            console.log("successfully created account with id", $scope.id);
                            $scope.$apply(function() {
                                $scope.loggedIn = true;
                            })
                        } else {
                            console.log("error creating account with id", $scope.id);
                        }
                    })
                }
            };

            var checkAccount = function() {
                console.log('checking if account exists in server');
                efficAuthService.checkAccount($scope.id, function(error, accountexists) {
                   if (!error) {
                       if (accountexists) {
                           console.log('account exists');
                           $timeout(function() {
                               $scope.$apply(function() {
                                   $scope.checkedAccount = true;
                                   $scope.hasAccount = true;
                               });
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

            // creates array of url msec pairs, all urls spent less than 10 min on group in other
            function createDataArray(data, chromeCall) {
                var cutoff = 20;
                var arr = [];
                var other_msec = 0; 
                var url_data = data[chromeCall];
                for (var url in url_data) {
                    // if (url_data[url] < 10*60*1000) {
                    //     other_msec += url_data[url];
                    // } else {
                        arr.push({'url': url, 'msec': url_data[url]});
                    // }
                }
                arr.sort(function(a,b){return b.msec - a.msec});
                while (arr.length > cutoff) {
                    other_msec += arr.pop().msec;
                }
                arr.push({'url': 'Other', 'msec': other_msec});
                console.log(arr);
                return arr;
            }

            function str_time(msec) {
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

            //time: 0 daily, 1 weekly, 2 monthly, 3 all-time
            $scope.display_data = function(time) {
                var idChooser = ['daily', 'weekly', 'monthly', 'all'];
                var chromeChoose = ['_past_24_hours', '_past_week', '_past_month', ''];
                var chromeCall = 'chrome_history_timespent_domain'+chromeChoose[time];
                efficCrxService.getFieldsFromExtension([chromeCall], function(data) {
                    console.log(time);
                    console.log(data);
                    var url_data = createDataArray(data, chromeCall);
                    var max_url = '';
                    var max_msec = 0;
                    for (var i = 0; i < url_data.length; i++) {
                        if (url_data[i].msec > max_msec) {
                            max_url = url_data[i].url;
                            max_msec = url_data[i].msec;
                        }
                    }
                    var x = d3.scale.linear()
                        .domain([0, max_msec])
                        .range([0, 800]);
                    d3.select('#chart-'+idChooser[time])
                        .selectAll('div')
                            .data(url_data)
                        .enter().append('div')
                            .attr('class', 'tooltip')
                            .style('width', function(d) {return x(d.msec) + 'px'; })
                            .html(function(d) { return d.url+'<span>'+d.url+' ('+str_time(d.msec)+')</span>';});
                });
            };

            $scope.dashboardClick = function() {
                console.log('clicked on dashboard');
                $scope.currentPage = 'dashboard';
            };

            $scope.usageClick = function() {
                console.log('clicked on usage');
                $scope.display_data(0);
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
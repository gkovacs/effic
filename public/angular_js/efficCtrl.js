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
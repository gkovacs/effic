'use strict';

angular.module('app').controller('fbmessagelinksCtrl',
    ['$scope', '$interval', '$timeout', 'efficAuthService', 'efficHistoryService', 'efficCrxService',
        function ($scope, $interval, $timeout, TIME_STARTED, efficAuthService, efficHistoryService, efficCrxService) {

            var getFieldsFromExtension, getWorkSitesVisitedInPast24Hours;
            getFieldsFromExtension = function(fields_list, callback){
                return once_available('#autosurvey_content_script_loaded', function(){
                    return sendExtension('requestfields', {
                        fieldnames: fields_list,
                        pagename: 'something'
                    }, function(response){
                        return sendExtension('requestfields', {
                            fieldnames: fields_list,
                            pagename: 'something'
                        }, function(response){
                            return callback(response);
                        });
                    });
                });
            };
            getWorkSitesVisitedInPast24Hours = function(callback){
                return getFieldsFromExtension(['chrome_history_pages_past_24_hours'], function(data){
                    return $.get('/classifications.json', function(classifications){
                        var domain_matcher, urlToDomain, isWorkUrl, sites_visited, work_sites_visited, res$, i$, len$, x;
                        domain_matcher = new RegExp('://(.[^/]+)(.*)');
                        urlToDomain = function(url){
                            var domain_matches;
                            domain_matches = url.match(domain_matcher);
                            if (domain_matches == null || domain_matches.length < 2) {
                                return '';
                            }
                            return domain_matches[1];
                        };
                        isWorkUrl = function(url){
                            var domain;
                            domain = urlToDomain(url);
                            if (classifications[domain] == null) {
                                return false;
                            }
                            if (classifications[domain] === 'work') {
                                return true;
                            }
                            return false;
                        };
                        sites_visited = data['chrome_history_pages_past_24_hours'];
                        res$ = [];
                        for (i$ = 0, len$ = sites_visited.length; i$ < len$; ++i$) {
                            x = sites_visited[i$];
                            if (isWorkUrl(x.url)) {
                                res$.push(x);
                            }
                        }
                        work_sites_visited = res$;
                        work_sites_visited.sort(function(a, b){
                            return b.lastVisitTime - a.lastVisitTime;
                        });
                        return callback(work_sites_visited);
                    });
                });
            };

            getWorkSitesVisitedInPast24Hours(function(work_sites_visited){
                console.log(work_sites_visited);
                $scope.$apply(function() {
                    $scope.sites = work_sites_visited;
                });
            });

        }
    ]);
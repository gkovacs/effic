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
                            console.log('successfully created account with id', $scope.id);
                            $scope.$apply(function() {
                                $scope.loggedIn = true;
                            })
                        } else {
                            console.log('error creating account with id', $scope.id);
                        }
                    })
                }
                console.log('calling display data');
                display_data(0);
                display_data(1);
                display_data(2);
                display_data(3);
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
                    arr.push({'url': url, 'msec': url_data[url]});
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

            function getCategories() {
                return {'github.com':'work','www.w3schools.com':'work','stackoverflow.com':'work','piazza.com':'work','calendar.google.com':'work','web.stanford.edu':'work','docs.google.com':'work','www.tickld.com':'fun','slickdeals.net':'other','tamas.azurewebsites.net':'work','news.hiphopearly.com':'hobby','mcdonough.az1.qualtrics.com':'work','www.furaffinity.net':'fun','banking.chase.com':'work','\/C:':'other','store.playstation.com':'fun','dkr1.ssisurveys.com':'work','www.google.co.uk':'other','www.mturkgrind.com':'work','www.cymath.com':'work','forum.xda-developers.com':'hobby','www.babyblog.ru':'work','arstechnica.com':'hobby','play.google.com':'fun','oxfordanthropology.eu.qualtrics.com':'work','www.google.com.ua':'work','wustlpsych.az1.qualtrics.com':'work','www.imdb.com':'fun','enbdev.com':'work','novaposhta.ua':'other','greasyfork.org':'work','www.trymyui.com':'work','www.emuparadise.me':'fun','kellogg.qualtrics.com':'work','www.ravelry.com':'hobby','www.yahoo.com':'work','www.dpdough.com':'other','oaklandpsychology.az1.qualtrics.com':'fun','stocktwits.com':'work','www.gamersnexus.net':'hobby','rochester.craigslist.org':'hobby','www.zillow.com':'other','www.facebook.com':'fun', 'www.messenger.com': 'fun', 'www.collegefootballmetrics.com':'hobby','guestwifi.kingsborough.edu':'other','portland.craigslist.org':'other','korysno.pro':'hobby','www.yourpersonality.net':'fun','web.a.ebscohost.com.ezproxy.lib.utexas.edu':'work','marypyc.com':'hobby','harvard.az1.qualtrics.com':'work','www.papajohns.com':'other','www.wwtdd.com':'fun','www.sephora.com':'other','www.prepaidcodecenter.com':'work','ccpexpt.wustl.edu':'work','ambrosiaforheads.com':'hobby','wharton.qualtrics.com':'work','www.mturk.com':'work','www.giantbomb.com':'fun','www.southwest.com':'fun','www.blackhatworld.com':'work','mangadoom.co':'fun','www.ikea.com':'other','www.ign.com':'fun','www.walmart.com':'other','pensacola.craigslist.org':'fun','movietv.to':'fun','forums.nexusmods.com':'fun','my.ebay.com':'work','ob.dcecu.org':'work','www.pornhub.com':'fun','camfuze.com':'fun','secure3.surveynetwork.com':'work','www.netflix.com':'fun','unu.ai':'work','www.rotoworld.com':'hobby','ww3.unipark.de':'work','teacherready.studereducation.net':'work','mobile.craigslist.org':'fun','postimg.org':'fun','www.gamefaqs.com':'fun','www.picmonkey.com':'fun','www.abbywinters.com':'fun','support.amd.com':'other','www.ownedcore.com':'fun','www.dropbox.com':'other','www.nexusmods.com':'fun','saginaw.craigslist.org':'fun','chaseonline.chase.com':'work','www.chase.com':'other','cartwheel-secure.target.com':'hobby','broadcasthe.net':'fun','thepiratebay.gd':'fun','chicagobooth.az1.qualtrics.com':'work','www.nuklearpower.com':'fun','www.sherdog.com':'hobby','imymelvin.tumblr.com':'other','www.wineverygame.com':'work','www.wikiwand.com':'hobby','nyustern.az1.qualtrics.com':'work','mill.southwestern.edu:9191':'work','www.qualityhealth.com':'work','olx.ua':'other','perceptsconcepts.psych.indiana.edu':'hobby','nest.testbirds.com':'work','www.paypal.com':'fun','us-mg204.mail.yahoo.com':'work','e621.net':'fun','us-mg4.mail.yahoo.com':'work','www.tomshardware.com':'fun','www.crateandbarrel.com':'other','www.voprosnik.ru':'work','mail.google.com':'work','www.pcgamesn.com':'fun','www.playstation.com':'fun','scrabblewordfinder.org':'hobby','www.amzreviewtrader.com':'other','www.penny-arcade.com':'hobby','www.louisianaworks.net':'other','www.instagram.com':'fun','kinobody.com':'hobby','developer.android.com':'work','www.fyndly.com':'hobby','www.anonymox.net':'other','www.squarespace.com':'other','www.couchsurfing.com':'fun','www.zapals.com':'other','vimeo.com':'fun','universityofalabama.az1.qualtrics.com':'fun','www.looksharp.com':'work','soundcloud.com':'hobby','www.curse.com':'fun','www.victoriassecret.com':'other','dm.ugamsolutions.com':'other','mycourses.lsue.edu':'work','www.fantasyfootballmetrics.com':'hobby','www.just-eat.co.uk':'other','taking10.blogspot.com':'other','dragonage.wikia.com':'hobby','www.points2shop.com':'hobby','www.snagajob.com':'work','swfchan.com':'fun','denver.craigslist.org':'fun','www.soscisurvey.de':'work','funds.gofundme.com':'hobby','play.pocketcasts.com':'fun','survey-na.researchnow.com':'work','forum.kodi.tv':'fun','rozetka.com.ua':'other','www.barnesandnoble.com':'work','thepiratebay.mn':'fun','www.mrpen.co.uk':'hobby','rainmeter.deviantart.com':'other','questionablecontent.net':'fun','crystal-cure.com':'hobby','angelus2603.tumblr.com':'fun','online.bbvacompass.com':'work','1d4chan.org':'hobby','ets.az1.qualtrics.com':'work','wildcritters.ws':'fun','tikimovies.com':'fun','www.alternatehistory.com':'hobby','www.groupon.com':'other','store.steampowered.com':'fun','serbamf.tumblr.com':'fun','plus.google.com':'other','www.lolnexus.com':'fun','elab.business.colostate.edu':'work','www.mangatown.com':'fun','www.feralhosting.com':'fun','www.weartv.com':'fun','www.dailykos.com':'hobby','groceries.asda.com':'other','voicebunny.s3.amazonaws.com':'work','forums.daybreakgames.com':'hobby','www.eldorado.com.ua':'other','10.1.1.1':'other','gfycat.com':'fun','genius.com':'other','www.codecademy.com':'work','www.iheart.com':'fun','secure.ccbg.com':'work','www.documentingreality.com':'fun','www.linkedin.com':'work','www.indeed.com':'work','create.studiod.com':'work','www.pandora.com':'fun','www.mangahere.co':'fun','storytelling.azurewebsites.net':'fun','www.bestbuy.com':'fun','duckduckgo.com':'work','vulcun.com':'fun','kat.cr':'fun','www.otohits.net':'other','video.search.yahoo.com':'hobby','thepiratebay.vg':'other','crunchify.com':'other','silenthillcommunity.com':'hobby','www.wickedclothes.com':'fun','www.twitch.tv':'fun','www.ekomed.org.ua':'other','passthepopcorn.me':'fun','mturkforum.com':'hobby','www.neogaf.com':'fun','www.starzplay.com':'hobby','fit4brain.com':'hobby','notalwaysright.com':'fun','kdp.amazon.com':'work','www.forever21.com':'other','play.spotify.com':'fun','helen-colby.com':'work','uclinnovation.eu.qualtrics.com':'other','online.rccf.ua':'work','providence.taleo.net':'work','www.featuredrentals.com':'other','upload.xvideos.com':'other','edit.yahoo.com':'work','www.kallos.com':'fun','notalwaysfriendly.com':'fun','ssd.az1.qualtrics.com':'hobby','us-mg6.mail.yahoo.com':'work','www.sears.com':'fun','www.kmart.com':'other','thebot.net':'other','app.youeye.com':'work','www.scribd.com':'hobby','wingsoverrochester.foodtecsolutions.com':'other','www.pro-football-reference.com':'hobby','web.stevens.edu':'fun','silenthillforum.com':'hobby','saginaw.backpage.com':'fun','www.cbssports.com':'hobby','surveymyopinion.researchnow.com':'work','www.datpiff.com':'fun','klbibkeccnjlkjkiokjodocebajanakg':'other','forum.bodybuilding.com':'hobby','www.baby.ru':'hobby','secure.serve.com':'other','www.yelp.com':'hobby','www.etsy.com':'fun','surveys.qualtrics.com':'work','www.themuse.com':'fun','generalassemb.ly':'hobby','careers-healthresearch.icims.com':'work','web.b.ebscohost.com.ezproxy.lib.utexas.edu':'work','www.extrapetite.com':'hobby','www.target.com':'other','www.contestgirl.com':'hobby','uclacommunications.az1.qualtrics.com':'other','freebiesfrenzy.com':'hobby','www.thenorthface.com':'other','www.ulta.com':'other','www.theverge.com':'fun','sellercentral.amazon.com':'work','ru.wikipedia.org':'work','www.cnn.com':'fun','order.pizzahut.com':'fun','my.rochester.edu':'work','gyazo.com':'other','us.glock.com':'hobby','www.escambiaclerk.com':'hobby','www.usertesting.com':'work','tilburgss.co1.qualtrics.com':'fun','onexp.textstrukturen.uni-goettingen.de':'work','www.youpornmate.com':'fun','www.gofundme.com':'fun','tm.poly.edu':'work','hitgrabber.net':'work','www.pineconeresearch.com':'other','requester.mturk.com':'work','tools.usps.com':'other','www.youtube.com':'fun','www.reddit.com':'fun'};
            }

            //time: 0 daily, 1 weekly, 2 monthly, 3 all-time
            function display_data (time) {
                console.log(time);
                var idChooser = ['daily', 'weekly', 'monthly', 'all'];
                var chromeChoose = ['_past_24_hours', '_past_week', '_past_month', ''];
                var chromeCall = 'chrome_history_timespent_domain'+chromeChoose[time];
                efficCrxService.getFieldsFromExtension([chromeCall], function(data) {
                    // console.log(time);
                    // console.log(data);
                    var url_data = createDataArray(data, chromeCall);
                    var categories = getCategories();
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
                    var categoryColor = {'work':'green', 'hobby':'yellow', 'fun': 'red', 'other':'steelblue'};
                    d3.select('#chart-'+idChooser[time])
                        .selectAll('div')
                            .data(url_data)
                        .enter().append('div')
                            .attr('class', 'tooltip')
                            .style('width', function(d) {return x(d.msec) + 'px'; })
                            .style('background-color', function(d) {if (categoryColor[categories[d.url]]) {return categoryColor[categories[d.url]];} return 'steelblue'})
                            .html(function(d) { return d.url+'<span>'+d.url+' ('+str_time(d.msec)+')</span>';});
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
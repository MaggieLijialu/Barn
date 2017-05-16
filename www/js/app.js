// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','controllers','directives','services'])

    .run(function($ionicPlatform,$location,$ionicHistory,$ionicPopup,$rootScope,$timeout,$state) {
        $ionicPlatform.ready(function () {

            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            window.plugins.jPushPlugin.init();
            window.plugins.jPushPlugin.openNotificationInAndroidCallback=function(data){
                /* var json=data;

                if(typeof data === 'string'){
                    json=JSON.parse(data);
                }
                var id=json.extras['cn.jpush.android.EXTRA'].id;
                window.alert(id);
                var alert = json.extras['cn.jpush.android.ALERT'];*/

               /* alert(data.title);
                var keys="";
                for(var key in data.extras){
                    keys=keys+"--"+key;
                }

                alert(data.extras);
                alert(keys);*/
                var detail=data.alert;
                var alarmId;
                if(data.extras.alarm_id!=null){
                    alarmId=parseInt(data.extras.alarm_id);
                }else{
                    alarmId=1;
                }
                alert(alarmId+typeof alarmId);
                localStorage.alarmDetail=detail;
                localStorage.alarmFlag=0;
                localStorage.alarmId=alarmId;
                $state.go("tabs.confirmwarn",{detail:detail,flag:0,alarmId:alarmId});
            };
            window.plugins.jPushPlugin.setDebugMode(true);

            window.addEventListener('native.keyboardhide', function (e) {
                cordova.plugins.Keyboard.isVisible = true;
                $timeout(function () {
                    cordova.plugins.Keyboard.isVisible = false;
                }, 100);
            });
        });

        $ionicPlatform.registerBackButtonAction(function(e){
            e.preventDefault();
            function showConfirm(){
                var popup=$ionicPopup.show({
                    title: '提示',
                    subTitle: '确定要退出应用吗？',
                    scope: $rootScope,
                    buttons: [
                        {
                            text: '取消',
                            type: 'button-clear button-royal',
                            onTap: function(){
                                return 'cancel';
                            }

                        },
                        {
                            text: '确认',
                            type: 'button-clear button-royal border-left',
                            onTap: function(e){
                                return 'active';
                            }
                        }
                    ]
                });
                popup.then(function(res){
                    if (res == 'active') {
                        // 退出app
                        ionic.Platform.exitApp();
                    }
                });
            }

            if (cordova.plugins.Keyboard.isVisible) {
                cordova.plugins.Keyboard.close();
            }else {

                if ($location.path() == '/tab/home'
                    || $location.path() == '/tab/table'
                    || $location.path() == '/tab/risk'
                    || $location.path() == '/tab/person') {

                    showConfirm();

                } else if ($ionicHistory.backView()) {

                    if (cordova.plugins.Keyboard.isVisible) {
                        cordova.plugins.Keyboard.close();
                    }else if($ionicHistory.currentView().stateName == "tabs.confirmwarn"){
                        if ($ionicHistory.backView().stateName!="tabs.warn"){
                            $state.go("tabs.risk");
                        }else {
                            $ionicHistory.goBack();
                        }
                    } else {
                        $ionicHistory.goBack();
                    }

                } else {

                    showConfirm();
                }
            }

            return false;
        },101)

    })
    .config(function($ionicConfigProvider,$stateProvider,$urlRouterProvider){

        $ionicConfigProvider.tabs.position("bottom");
        $ionicConfigProvider.tabs.style("standard");
        $ionicConfigProvider.navBar.alignTitle("center");
        $ionicConfigProvider.backButton.text('').previousTitleText(false);

        $stateProvider
            .state('start', {
                url: "/start",
                templateUrl: "templates/start.html",
                controller: "StartCtrl"

            })
            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: "LoginCtrl"

            })
            .state('tabs', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            .state('tabs.home', {
                url: "/home",
                views: {
                    'home-tab': {
                        templateUrl: "templates/home.html",
                        controller: "HomeCtrl"
                    }
                }
            })
            .state('tabs.detail', {
                url: "/detail/:number:long:width:height:description",
                views: {
                    'home-tab': {
                        templateUrl: "templates/home-depository-detail.html",
                        controller: "DetailCtrl"
                    }
                }
            })
            .state('tabs.temperature', {
                url: "/temperature/:title:id",
                views: {
                    'home-tab': {
                        templateUrl: "templates/home-detail-temperature.html",
                        controller: "TemperatureCtrl"
                    }
                }
            })

            .state('tabs.table', {
                url: "/table",
                views: {
                    'table-tab': {
                        templateUrl: "templates/table.html"
                    }
                }
            })
            .state('tabs.risk', {
                url: "/risk",
                views: {
                    'risk-tab': {
                        templateUrl: "templates/risk.html",
                        controller: "RiskCtrl"
                    }
                }
            })
            .state('tabs.warn', {
                url: "/warn",
                views: {
                    'risk-tab': {
                        templateUrl: "templates/risk-warn.html",
                        controller: "WarnCtrl"
                    }
                }
            })
            .state('tabs.confirmwarn', {
                url: "/confirmwarn/:detail:flag:alarmId",
                views: {
                    'risk-tab': {
                        templateUrl: "templates/risk-warn-confirm.html",
                        controller: "WarnConfirmCtrl"
                    }
                }
            })
            .state('tabs.violation', {
                url: "/violation",
                views: {
                    'risk-tab': {
                        templateUrl: "templates/risk-violation.html"
                    }
                }
            })
            .state('tabs.statistic', {
                url: "/statistic",
                views: {
                    'risk-tab': {
                        templateUrl: "templates/risk-statistic.html",
                        controller: "StatisticCtrl"
                    }
                }
            })
            .state('tabs.person', {
                url: "/person",
                views: {
                    'person-tab': {
                        templateUrl: "templates/person.html",
                        controller: "PersonCtrl"
                    }
                }
            })
            .state('tabs.personinfo', {
                url: "/personinfo",
                views: {
                    'person-tab': {
                        templateUrl: "templates/person-information.html",
                        controller: "PersonInfoCtrl"
                    }
                }
            })
        // if(localStorage.getItem("start")==2){
        //     $urlRouterProvider.otherwise("/login");
        // }else{
        //     localStorage.setItem("start",2);
        //     $urlRouterProvider.otherwise("/start");
        // }

        $urlRouterProvider.otherwise("/login");
    })

'use strict';

// Declare app level module which depends on filters, and services
var appITModule = angular.module('appIT',[])
.config (function ($routeProvider, $locationProvider) {
    $routeProvider.when ('/home', {templateUrl:'partials/home.html', controller:homeCtrl})
                  .when ('/dashboard/client/:clientCode', {
                                templateUrl:'partials/dashboard.html', controller:dashboardCtrl
                            })
                  .when ('/reports/client/:clientCode', {
                                templateUrl:'partials/reps.html', controller:repsCtrl
                            })
                  .when ('/client/:clientCode/program/:programCode', {
                                templateUrl:'partials/program.html', controller:programCtrl
                            })
                  .when ('/databases/client/:clientCode/db/:dbCode', {
                                templateUrl:'partials/databases.html', controller:databasesCtrl
                            })
                  .when ('/reports/client/:clientCode', {
                                templateUrl:'partials/graph.html', controller:graphCtrl  
                            })
                  .otherwise ({redirectTo:'/home'});

//    $locationProvider.html5Mode(true);

});

appITModule.factory ('NavMenu', function (){
    return {
        menuItems : [
                {
                    name: 'Home',
                    target: '#home',
                    state: 'active'
                },
                // {
                //     name: 'Client',
                //     target: '#client/dot',
                //     state:''
                // },
                // {
                //     name: 'Reports',
                //     target: '#reports/client/dot',
                //     state:''
                // },
            ],
        partials : {
            home: 'partials/home.html',
            find: 'partials/find.html',
            albums: 'partials/albums.html'
            }
        };
    });
var app = angular.module('restCountries', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        // home state
        .state('home', {
            url: '/home',
            controller: 'homeCtrl',
            templateUrl: 'templates/home.html'
        })

        // countries state
        .state('countries', {
            url: '/countries',
            controller: 'countriesCtrl',
            templateUrl: 'templates/countries.html',
            resolve: {
                countries: function($http) {
                    var url = 'https://restcountries.eu/rest/v1/all';
                    NProgress.start();

                    return $http.get(url).then(function(response) {
                        NProgress.done();
                        return response.data;
                    });
                }
            }
        })

        // countries by capital state
        .state('capital', {
            url: '/capital/:name',
            controller: 'capitalCtrl',
            templateUrl: 'templates/capital.html',
            resolve: {
                country: function($http, $stateParams) {
                    var capital = $stateParams.name;
                    var url = 'https://restcountries.eu/rest/v1/capital/' + capital;
                    NProgress.start();

                    return $http.get(url).then(function(response) {
                        NProgress.done();
                        if (response.data.length) {
                            return response.data[0];
                        } else {
                            return {};
                        }
                    }, function(error) {
                        console.log(error);
                    });
                }
            }
        })

        // about state
        .state('about', {
            url: '/about',
            templateUrl: 'templates/about.html'
        });

    $urlRouterProvider.otherwise('/home');
});

app.controller('homeCtrl', function($scope, $http) {
    $scope.capitalCity = 'Tehran';
    $scope.countryInfo = undefined;

    $scope.getCapitalCity = function() {
        var city = $scope.capitalCity;
        if (city.length == 0) return false;

        var url = "https://restcountries.eu/rest/v1/capital/" + city;
        NProgress.start();
        $http.get(url).then(function(response) {
            NProgress.done();
            if (response.data && response.data.length) {
                var info = response.data[0];
                console.warn(info);

                $scope.countryInfo = info;
            }
        }, function(error) {
            NProgress.done();
            if (error.status == 404) {
                $scope.countryInfo = undefined;
                alert('Capital Not Found!');
            }
        });
    }
});

app.controller('countriesCtrl', function($scope, countries) {
    $scope.countries = countries;
    $scope.query = '';
});

app.controller('capitalCtrl', function($scope, country) {
    $scope.country = {};
    if (country !== undefined) {
        $scope.country = country;
    }
});
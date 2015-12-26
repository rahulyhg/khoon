// JavaScript Document
var firstapp = angular.module('firstapp', [
    'ngRoute',
    'phonecatControllers',
    'templateservicemod',
    'navigationservice'
]);

firstapp.config(
    function($routeProvider, uiSelectConfig, cfpLoadingBarProvider) {

        cfpLoadingBarProvider.includeSpinner = true;
        cfpLoadingBarProvider.spinnerTemplate = '<div class="loadingcfp"><div class="in-box"><div class="sk-fading-circle"><div class="sk-circle1 sk-circle"></div><div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div><div class="sk-circle4 sk-circle"></div><div class="sk-circle5 sk-circle"></div><div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div><div class="sk-circle8 sk-circle"></div><div class="sk-circle9 sk-circle"></div><div class="sk-circle10 sk-circle"></div><div class="sk-circle11 sk-circle"></div><div class="sk-circle12 sk-circle"></div></div></div></div>';
        cfpLoadingBarProvider.includeBar = false;
        //        uiSelectConfig.theme = 'bootstrap';
        //        uiSelectConfig.resetSearchInput = true;
        //        uiSelectConfig.appendToBody = true;


        $routeProvider.when('/login', {
                templateUrl: 'views/template.html',
                controller: 'login'
            }).when('/home', {
                templateUrl: 'views/template.html',
                controller: 'home'
            }).when('/donor', {
                templateUrl: 'views/template.html',
                controller: 'DonorCtrl'
            }).when('/createdonor', {
                templateUrl: 'views/template.html',
                controller: 'createDonorCtrl'
            }).when('/olddonor', {
                templateUrl: 'views/template.html',
                controller: 'oldDonorCtrl'
            }).when('/editdonor/:id', {
                templateUrl: 'views/template.html',
                controller: 'editDonorCtrl'
            }).when('/family', {
                templateUrl: 'views/template.html',
                controller: 'FamilyCtrl'
            }).when('/createfamily', {
                templateUrl: 'views/template.html',
                controller: 'createFamilyCtrl'
            }).when('/editfamily/:id', {
                templateUrl: 'views/template.html',
                controller: 'editFamilyCtrl'
            }).when('/camp', {
                templateUrl: 'views/template.html',
                controller: 'CampCtrl'
            }).when('/createcamp', {
                templateUrl: 'views/template.html',
                controller: 'createCampCtrl'
            }).when('/editcamp/:id', {
                templateUrl: 'views/template.html',
                controller: 'editCampCtrl'
            }).when('/slider', {
                templateUrl: 'views/template.html',
                controller: 'SliderCtrl'
            }).when('/createslider', {
                templateUrl: 'views/template.html',
                controller: 'createSliderCtrl'
            }).when('/editslider/:id', {
                templateUrl: 'views/template.html',
                controller: 'editSliderCtrl'
            }).when('/admin', {
                templateUrl: 'views/template.html',
                controller: 'AdminCtrl'
            }).when('/createadmin', {
                templateUrl: 'views/template.html',
                controller: 'createAdminCtrl'
            }).when('/editadmin/:id', {
                templateUrl: 'views/template.html',
                controller: 'editAdminCtrl'
            }).when('/sponsor', {
                templateUrl: 'views/template.html',
                controller: 'SponsorCtrl'
            }).when('/createsponsor', {
                templateUrl: 'views/template.html',
                controller: 'createSponsorCtrl'
            }).when('/editsponsor/:id', {
                templateUrl: 'views/template.html',
                controller: 'editSponsorCtrl'
            }).when('/gifttype', {
                templateUrl: 'views/template.html',
                controller: 'GiftTypeCtrl'
            }).when('/creategifttype', {
                templateUrl: 'views/template.html',
                controller: 'createGiftTypeCtrl'
            }).when('/editgifttype/:id', {
                templateUrl: 'views/template.html',
                controller: 'editGiftTypeCtrl'
            }).when('/hospital', {
                templateUrl: 'views/template.html',
                controller: 'HospitalCtrl'
            }).when('/createhospital', {
                templateUrl: 'views/template.html',
                controller: 'createHospitalCtrl'
            }).when('/edithospital/:id', {
                templateUrl: 'views/template.html',
                controller: 'editHospitalCtrl'
            }).when('/findentry', {
                templateUrl: 'views/template.html',
                controller: 'findEntryCtrl'
            }).when('/findverify', {
                templateUrl: 'views/template.html',
                controller: 'findVerifyCtrl'
            }).when('/findgift', {
                templateUrl: 'views/template.html',
                controller: 'findGiftCtrl'
            }).when('/campreport', {
                templateUrl: 'views/template.html',
                controller: 'campReportCtrl'
            }).when('/campreportusers/:campnumber/:camp/:accesslevel', {
                templateUrl: 'views/template.html',
                controller: 'campReportUsersCtrl'
            }).when('/campreporthospusers/:campnumber/:camp/:hospital', {
                templateUrl: 'views/template.html',
                controller: 'campReportHospUsersCtrl'
            }). //Add New Path

        otherwise({
            redirectTo: '/login'
        });
    });
firstapp.filter('uploadpath', function() {
    return function(input) {
        return adminurl + "uploadfile/getupload?file=" + input;
    };
});

firstapp.directive('array', function() {
    return {
        restrict: 'EA',
        scope: {
            GalleryStructure: "=objval",
            EditVal: "=editval",
            ModelObj: "=modelobj"
        },
        replace: false,
        templateUrl: "views/directive/array.html",
        link: function($scope, element, attr) {
            console.log($scope.EditVal);
            var GalleryStructure = $scope.GalleryStructure;
            var EditVal = $scope.EditVal;
            $scope.label = attr.label;
            $scope.GalleryStrucObj = {};
            $scope.GalleryStrucObj.keyOf = _.pluck(GalleryStructure, "name");
            $scope.GalleryStrucObj.structure = GalleryStructure;
            $scope.GalleryStrucObj.valuesOf = [];
            $scope.GalleryStrucObj.valuesOf = EditVal;
            $scope.GalleryStrucObj.nullObj = {};
            _.each($scope.GalleryStrucObj.keyOf, function(n, key) {
                $scope.GalleryStrucObj.nullObj[n] = "";
            });
            $scope.GalleryStrucObj.add = function() {
                $scope.GalleryStrucObj.valuesOf.push(_.clone($scope.GalleryStrucObj.nullObj, true));
            };
            $scope.GalleryStrucObj.remove = function(obj) {
                var objkey = _.remove($scope.GalleryStrucObj.valuesOf, obj);
            };
            $scope.EditVal = $scope.GalleryStrucObj.valuesOf;
        }
    }
});

firstapp.directive('createovalidation', function() {
    return {
        restrict: 'EA',
        replace: false,
        link: function($scope, element, attr) {
            $element = $(element);
            var validation = $scope[attr.createovalidation].structure[attr.objkey].validation;
            _.each(validation, function(n) {
                var m = n.split("=");
                if (!m[1]) {
                    m[1] = "";
                }
                $element.attr(m[0], m[1]);
            });
        }
    }
});


firstapp.directive('capitalizeFirst', function($parse) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                if (inputValue === undefined) {
                    inputValue = '';
                }
                // var capitalized = inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
                var capitalized = inputValue.toUpperCase();
                if (capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
                return capitalized;
            }
            modelCtrl.$parsers.push(capitalize);
            capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
        }
    };
});
firstapp.filter('touppercase', function() {
    return function(input) {
        if (input == "verify") {
            return "Acknowledge";
        } else {
            var firstletter = input.substr(0, 1);
            var remaining = input.substr(1);
            return firstletter.toUpperCase() + remaining;
        }
    };
});
firstapp.directive('onlyDigits', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

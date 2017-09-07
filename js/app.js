// JavaScript Document
var firstapp = angular.module('firstapp', [
    'ngRoute',
    'phonecatControllers',
    'templateservicemod',
    'navigationservice'
]);

firstapp.config(
    function ($routeProvider, uiSelectConfig, cfpLoadingBarProvider) {

        cfpLoadingBarProvider.includeSpinner = true;
        cfpLoadingBarProvider.spinnerTemplate = '<div class="loadingcfp"><div class="in-box"><div class="sk-fading-circle"><div class="sk-circle1 sk-circle"></div><div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div><div class="sk-circle4 sk-circle"></div><div class="sk-circle5 sk-circle"></div><div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div><div class="sk-circle8 sk-circle"></div><div class="sk-circle9 sk-circle"></div><div class="sk-circle10 sk-circle"></div><div class="sk-circle11 sk-circle"></div><div class="sk-circle12 sk-circle"></div></div>Please Wait...</div></div>';
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
        }).when('/sliderAppHome', {
            templateUrl: 'views/template.html',
            controller: 'SliderAppHomeCtrl'
        }).when('/createsliderAppHome', {
            templateUrl: 'views/template.html',
            controller: 'createSliderAppHomeCtrl'
        }).when('/editsliderAppHome/:id', {
            templateUrl: 'views/template.html',
            controller: 'editSliderAppHomeCtrl'
        }).when('/notification', {
            templateUrl: 'views/template.html',
            controller: 'NotificationCtrl'
        }).when('/createnotification', {
            templateUrl: 'views/template.html',
            controller: 'createNotificationCtrl'
        }).when('/editnotification/:id', {
            templateUrl: 'views/template.html',
            controller: 'editNotificationCtrl'
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
        }).when('/folder', {
            templateUrl: 'views/template.html',
            controller: 'FolderCtrl'
        }).when('/createfolder', {
            templateUrl: 'views/template.html',
            controller: 'createFolderCtrl'
        }).when('/editfolder/:id', {
            templateUrl: 'views/template.html',
            controller: 'editFolderCtrl'
        }).when('/request', {
            templateUrl: 'views/template.html',
            controller: 'RequestCtrl'
        }).when('/editrequest/:id', {
            templateUrl: 'views/template.html',
            controller: 'editRequestCtrl'
        }).when('/mobileBanner', {
            templateUrl: 'views/template.html',
            controller: 'viewMobileBannerCtrl'
        }).when('/createMobileBanner', {
            templateUrl: 'views/template.html',
            controller: 'createMobileBannerCtrl'
        }).when('/editMobileBanner/:id', {
            templateUrl: 'views/template.html',
            controller: 'editMobileBannerCtrl'
        }).when('/donationRequest', {
            templateUrl: 'views/template.html',
            controller: 'viewDonationRequestCtrl'
        }).when('/createDonationRequest', {
            templateUrl: 'views/template.html',
            controller: 'createDonationRequestCtrl'
        }).when('/editDonationRequest/:id', {
            templateUrl: 'views/template.html',
            controller: 'editDonationRequestCtrl'
        }).when('/merge', {
            templateUrl: 'views/template.html',
            controller: 'MergeCtrl'
        }).when('/download', {
            templateUrl: 'views/template.html',
            controller: 'DownloadCtrl'
        }).when('/sendsms', {
            templateUrl: 'views/template.html',
            controller: 'SendSMSCtrl'
        }).when('/searchBlood', {
            templateUrl: 'views/template.html',
            controller: 'searchBloodCtrl'
        }).when('/printing', {
            templateUrl: 'views/template.html',
            controller: 'printingCtrl'
        }).when('/score', {
            templateUrl: 'views/template.html',
            controller: 'ScoreCtrl'
        }). //Add New Path

        otherwise({
            redirectTo: '/login'
        });
    });
firstapp.filter('uploadpath', function () {
    return function (input) {
        return adminurl + "uploadfile/resize?file=" + input;
    };
});

firstapp.directive('array', function () {
    return {
        restrict: 'EA',
        scope: {
            GalleryStructure: "=objval",
            EditVal: "=editval",
            ModelObj: "=modelobj"
        },
        replace: false,
        templateUrl: "views/directive/array.html",
        link: function ($scope, element, attr) {
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
            _.each($scope.GalleryStrucObj.keyOf, function (n, key) {
                $scope.GalleryStrucObj.nullObj[n] = "";
            });
            $scope.GalleryStrucObj.add = function () {
                $scope.GalleryStrucObj.valuesOf.push(_.clone($scope.GalleryStrucObj.nullObj, true));
            };
            $scope.GalleryStrucObj.remove = function (obj) {
                var objkey = _.remove($scope.GalleryStrucObj.valuesOf, obj);
            };
            $scope.EditVal = $scope.GalleryStrucObj.valuesOf;
        }
    }
});

firstapp.directive('createovalidation', function () {
    return {
        restrict: 'EA',
        replace: false,
        link: function ($scope, element, attr) {
            $element = $(element);
            var validation = $scope[attr.createovalidation].structure[attr.objkey].validation;
            _.each(validation, function (n) {
                var m = n.split("=");
                if (!m[1]) {
                    m[1] = "";
                }
                $element.attr(m[0], m[1]);
            });
        }
    }
});

firstapp.directive('capitalizeFirst', function ($parse) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var capitalize = function (inputValue) {
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
firstapp.filter('touppercase', function () {
    return function (input) {
        if (input == "verify") {
            return "Acknowledge";
        } else if (input == "needblood") {
            return "Need Blood";
        } else {
            var firstletter = input.substr(0, 1);
            var remaining = input.substr(1);
            return firstletter.toUpperCase() + remaining;
        }
    };
});
firstapp.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
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
firstapp.directive('uploadImage', function ($http, $filter, $timeout) {
    return {
        templateUrl: 'views/directive/uploadFile.html',
        scope: {
            model: '=ngModel',
            type: "@type",
            callback: "&ngCallback"
        },
        link: function ($scope, element, attrs) {
            console.log($scope.model);
            $scope.showImage = function () {};
            $scope.check = true;
            if (!$scope.type) {
                $scope.type = "image";
            }
            $scope.isMultiple = false;
            $scope.inObject = false;
            if (attrs.multiple || attrs.multiple === "") {
                $scope.isMultiple = true;
                $("#inputImage").attr("multiple", "ADD");
            }
            if (attrs.noView || attrs.noView === "") {
                $scope.noShow = true;
            }
            // if (attrs.required) {
            //     $scope.required = true;
            // } else {
            //     $scope.required = false;
            // }

            $scope.$watch("image", function (newVal, oldVal) {
                console.log("Hello")
                console.log(newVal, oldVal);
                isArr = _.isArray(newVal);
                if (!isArr && newVal && newVal.file) {
                    $scope.uploadNow(newVal);
                } else if (isArr && newVal.length > 0 && newVal[0].file) {

                    $timeout(function () {
                        console.log(oldVal, newVal);
                        console.log(newVal.length);
                        _.each(newVal, function (newV, key) {
                            if (newV && newV.file) {
                                $scope.uploadNow(newV);
                            }
                        });
                    }, 100);

                }
            });

            if ($scope.model) {
                if (_.isArray($scope.model)) {
                    $scope.image = [];
                    _.each($scope.model, function (n) {
                        $scope.image.push({
                            url: n
                        });
                    });
                } else {
                    if (_.endsWith($scope.model, ".pdf")) {
                        $scope.type = "pdf";
                    }
                }

            }
            if (attrs.inobj || attrs.inobj === "") {
                $scope.inObject = true;
            }
            $scope.clearOld = function () {
                $scope.model = [];
            };
            $scope.uploadNow = function (image) {
                $scope.uploadStatus = "uploading";

                var Template = this;
                image.hide = true;
                var formData = new FormData();
                formData.append('file', image.file, image.name);
                $http.post(uploadurl, formData, {
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).then(function (data) {
                    data = data.data;
                    $scope.uploadStatus = "uploaded";
                    if ($scope.isMultiple) {
                        if ($scope.inObject) {
                            $scope.model.push({
                                "image": data.data[0]
                            });
                        } else {
                            if (!$scope.model) {
                                $scope.clearOld();
                            }
                            $scope.model.push(data.data[0]);
                        }
                    } else {
                        if (_.endsWith(data.data[0], ".pdf")) {
                            $scope.type = "pdf";
                        } else {
                            $scope.type = "image";
                        }
                        $scope.model = data.data[0];
                        console.log($scope.model, 'model means blob');

                    }
                    $timeout(function () {
                        $scope.callback();
                    }, 100);

                });
            };
        }
    };
});
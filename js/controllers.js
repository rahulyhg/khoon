var uploadres = [];
var selectedData = [];
var phonecatControllers = angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ngDialog', 'angularFileUpload', 'ui.select', 'ngSanitize', 'angular-loading-bar']);
window.uploadUrl = 'http://104.197.50.51/uploadfile/upload';
phonecatControllers.controller('home', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Dashboard");
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = "";
    TemplateService.content = "views/dashboard.html";
    TemplateService.list = 2;
    $scope.myhosp = "";
    $scope.hospital = "";
    $scope.access = $.jStorage.get("adminuser");
    if ($scope.access) {
        $scope.hospitalid = $scope.access.hospital;
    }
    $scope.navigation = NavigationService.getnav();

    NavigationService.countEntry($.jStorage.get("adminuser"), function(data, status) {
        $scope.user = data;
    });

    NavigationService.countVerified($.jStorage.get("adminuser"), function(data, status) {
        $scope.verified = data;
    });

    NavigationService.countGifted($.jStorage.get("adminuser"), function(data, status) {
        $scope.gifted = data;
    });

    NavigationService.getBlood(function(data, status) {
        if (data.value == false) {} else {
            $scope.blood = data;
        }
    });

    NavigationService.countUser(function(data, status) {
        $scope.allusers = data;
    });

    if ($.jStorage.get("adminuser").accesslevel != "admin") {
        if (!$.jStorage.get("adminuser").hospital) {
            NavigationService.findallHospital(function(data, status) {
                if (data.value != false) {
                    $scope.ngDialogData = data;
                    ngDialog.open({
                        template: 'views/selecthospital.html',
                        closeByEscape: false,
                        closeByDocument: false,
                        showClose: false,
                        data: $scope.ngDialogData
                    });
                } else {
                    $scope.hospital = [];
                }
            });
        }
    }

    NavigationService.findallHospital(function(data, status) {
        console.log(data);
        if (data.value != false) {
            $scope.hospitals = data;
        }
    });

    $scope.storeHospital = function(hospid) {
        // console.log(hospid);
        $scope.newdata = $.jStorage.get("adminuser");
        $scope.newdata.hospital = hospid;
        $.jStorage.set("adminuser", $scope.newdata);
        window.location.reload();
    }

    $scope.goToFindEntry = function() {
        $location.url("/findentry");
    }

    $scope.goToFindVerify = function() {
        $location.url("/findverify");
    }

    $scope.goToFindGift = function() {
        $location.url("/findgift");
    }

});
phonecatControllers.controller('closeDialog', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Hospital");
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = "";
    TemplateService.list = 2;
    $scope.myhosp = "";
    $scope.hospital = "";
    $scope.access = $.jStorage.get("adminuser");
    $scope.select = function() {
        if ($scope.myhosp != "") {
            $scope.newdata = $.jStorage.get("adminuser");
            $scope.newdata.hospital = $scope.myhosp;
            $.jStorage.set("adminuser", $scope.newdata);
            ngDialog.close();
            window.location.reload();
        }
    }
    $scope.adminOk = function() {
        ngDialog.close();
        $location.url('/createhospital');
    }
    $scope.navigation = NavigationService.getnav();
});
phonecatControllers.controller('login', function($scope, TemplateService, NavigationService, $routeParams, $location) {
    $scope.template = TemplateService;
    TemplateService.content = "views/login.html";
    TemplateService.list = 3;
    $scope.navigation = NavigationService.getnav();
    $.jStorage.flush();
    $scope.isValidLogin = 1;
    $scope.showtext = 1;
    $scope.login = {};
    $scope.camp = [];
    $scope.locations = [];
    $scope.locations = [{
        value: "Select Location"
    }];
    $scope.showDrop = true;

    NavigationService.getCamp(function(data, status) {
        if (data.value != false) {
            $scope.camp = data;
            // $scope.camp.unshift({
            //     campnumber: "All"
            // });
            $scope.camp.unshift({
                campnumber: "Select Camp Number"
            });
            $scope.login.campnumber = "Select Camp Number";
            $scope.login.camp = "Select Location";
        } else {
            $scope.camp = [];
            // $scope.camp.unshift({
            //     campnumber: "All"
            // });
            $scope.camp.unshift({
                campnumber: "Select Camp Number"
            });
            $scope.login.campnumber = "Select Camp Number";
            $scope.login.camp = "Select Location";
        }
    });
    $scope.changedrop = function() {
        if ($scope.login.accesslevel == "admin") {
            $scope.login.campnumber = "All";
            $scope.login.camp = "All";
            $scope.showDrop = false;
            // document.getElementById("mydrop").disabled = true;
            // document.getElementById("campdrop").disabled = true;
        } else {
            $scope.showDrop = true;
            $scope.login.camp = "";
            $scope.login.campnumber = "";
            $scope.changeloc();
            // document.getElementById("mydrop").disabled = false;
            // document.getElementById("campdrop").disabled = false;
        }

    }
    $scope.changeloc = function() {
        var foundIndex = _.findIndex($scope.camp, {
            'campnumber': $scope.login.campnumber
        });
        if (foundIndex != -1) {
            if ($scope.login.campnumber != 'All' && $scope.login.campnumber != '') {
                if ($scope.login.campnumber != "Select Camp Number") {
                    $scope.locations = $scope.camp[foundIndex].venues;
                    // $scope.locations.unshift({
                    //     value: "All"
                    // });
                    $scope.locations.unshift({
                        value: "Select Location"
                    });
                } else {
                    $scope.locations = [];
                    $scope.locations = [{
                        value: "Select Location"
                    }];
                    $scope.login.camp = "Select Location";
                }
            } else {
                if ($scope.login.campnumber == 'All') {
                    $scope.locations = [{
                        value: "Select Location"
                    }, {
                        value: "All"
                    }];
                    $scope.login.camp = "All";
                } else {
                    $scope.locations = [{
                        value: "Select Location"
                    }];
                    $scope.login.camp = "Select Location";
                }
            }
        } else {
            $scope.locations = [{
                value: "Select Location"
            }];
            $scope.login.camp = "Select Location";
            $scope.login.campnumber = "Select Camp Number";
        }
        $scope.locations = _.uniq($scope.locations, 'value');
    }
    $scope.verifylogin = function() {
        if ($scope.login.campnumber == "Select Camp Number") {
            $scope.login.campnumber = "";
        }
        if ($scope.login.camp == "Select Location") {
            $scope.login.camp = "";
        }
        console.log($scope.login);
        if ($scope.login.email != "" && $scope.login.password != "" && $scope.login.accesslevel != "" && $scope.login.camp != "" && $scope.login.campnumber != "") {
            NavigationService.adminLogin($scope.login, function(data, status) {
                if (data.value == false) {
                    $scope.login = {};
                    $scope.isValidLogin = 0;
                } else {
                    $scope.isValidLogin = 1;
                    $.jStorage.set("adminuser", data);
                    if (data.accesslevel == "admin") {
                        _.each($scope.navigation, function(n) {
                            n.visible = "yes";
                        });
                        locationcheck();
                    } else {
                        NavigationService.findallHospital(function(data, status) {
                            if (data.value == false) {
                                $scope.showtext = 0;
                            } else {
                                _.each($scope.navigation, function(n) {
                                    if (n.name == "Donor") {
                                        n.visible = "yes";
                                    } else {
                                        n.visible = "no";
                                    }
                                });
                                locationcheck();
                            }


                        });
                    }
                }

                function locationcheck() {
                    NavigationService.setnav($scope.navigation);
                    $location.url("/home");
                }
            });
        } else {
            $scope.login = {};
            console.log("blank login");
            $scope.isValidLogin = 0;
        }
    }
});
//Donor Controller
phonecatControllers.controller('DonorCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, cfpLoadingBar) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Donor');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    if ($.jStorage.get('adminuser').accesslevel == "admin" || $.jStorage.get('adminuser').accesslevel == "entry") {
        TemplateService.content = 'views/donor.html';
    } else {
        TemplateService.content = 'views/olddonor.html';
    }
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Donor = [];
    $scope.access = $.jStorage.get('adminuser');
    $scope.number = 100;
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.camp = '';
    $scope.pagedata.campnumber = '';
    $scope.pagedata.donorid = '';
    $scope.pagedata.name = '';
    $scope.pagedata.firstname = '';
    $scope.pagedata.middlename = '';
    $scope.pagedata.lastname = '';
    $scope.pagedata.pincode = '';
    $scope.pagedata.accesslevel = $scope.access.accesslevel;
    $scope.deleteReason = '';

    $scope.venues = [{
        value: 'All'
    }];

    $scope.reload = function() {
        cfpLoadingBar.start();
        NavigationService.findLimitedDonor($scope.pagedata, function(data, status) {
            // cfpLoadingBar.complete();
            $scope.donor = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if ($scope.pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }

    // $scope.reload();

    $scope.confDelete = function() {
        NavigationService.deleteDonor(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }

    $scope.deletefun = function(id) {
        $.jStorage.set('deletedonor', id);
        ngDialog.open({
            template: 'views/delete.html',
            controller: 'DonorCtrl',
            closeByDocument: false,
            scope: $scope
        });
    }

    NavigationService.getCamp(function(data) {
        console.log(data);
        $scope.camps = data;
        $scope.camps.unshift({
            campnumber: 'All',
            venues: [{
                value: "All"
            }]
        });
    })

    $scope.showVenues = function() {
        console.log($scope.pagedata.campnumber);
        var foundIndex = _.findIndex($scope.camps, {
            'campnumber': $scope.pagedata.campnumber
        });
        if (foundIndex != -1) {
            $scope.venues = $scope.camps[foundIndex].venues;
        }
        $scope.pagedata.camp = '';
        $scope.pagedata.page = 1;
        $scope.reload();
    }

    $scope.getFilterResults = function(val) {
        switch (val) {
            case 'id':
                {
                    $scope.pagedata.page = 1;
                    // $scope.pagedata.camp = '';
                    // $scope.pagedata.campnumber = '';
                    $scope.pagedata.name = '';
                    $scope.pagedata.firstname = '';
                    $scope.pagedata.middlename = '';
                    $scope.pagedata.lastname = '';
                    $scope.pagedata.pincode = '';

                    $scope.reload();
                    break;
                }
            case 'search':
                {
                    $scope.pagedata.page = 1;
                    $scope.pagedata.donorid = '';
                    $scope.reload();
                    break;
                }
            case 'venue':
                {
                    $scope.pagedata.page = 1;
                    $scope.reload();
                    break;
                }
            case 'limit':
                {
                    $scope.pagedata.page = 1;
                    $scope.reload();
                    break;
                }
            default:
                {
                    $scope.reload();
                    break;
                }
        }
    }

    $scope.changePage = function(pageno) {
            console.log(pageno);
            $scope.pagedata.page = pageno.pageno;
            $scope.reload();
        }
        //End Donor
});
//donor Controller
//createDonor Controller
phonecatControllers.controller('createDonorCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Donor');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createdonor.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.donor = {};
    $scope.bottleExist = 1;
    $scope.showfail = 1;
    $scope.showbottle = false;
    $scope.showSaved = false;

    $scope.calculate = function() {
        var birth = new Date($scope.donor.birthdate);
        var curr = new Date();
        var diff = curr.getTime() - birth.getTime();
        $scope.donor.age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }
    if ($.jStorage.get("adminuser").accesslevel == "admin") {
        $scope.showbottle = false;
    } else {
        $scope.showbottle = true;
    }
    $scope.savedonor = function() {
        console.log($scope.donor);
        if ($scope.donor.age >= 18 && $scope.donor.age <= 70 && $scope.donor.pincode.toString().length == 6) {
            if ($.jStorage.get("adminuser").accesslevel == "admin") {
                NavigationService.saveappDonor($scope.donor, function(data, status) {
                    if (data.value == false) {
                        $scope.showfail = 0;
                        $scope.showSaved = false;
                    } else {
                        $scope.showfail = 1;
                        $scope.showSaved = true;
                        // $location.url('/donor');
                        $scope.openPrintView();
                    }
                });
            } else {
                $scope.donor.hospital = $.jStorage.get("adminuser").hospital;
                $scope.donor.camp = $.jStorage.get("adminuser").camp;
                $scope.donor.campnumber = $.jStorage.get("adminuser").campnumber;
                NavigationService.saveDonor($scope.donor, function(data, status) {
                    if (data.value == true && data.comment == "Bottle already exists") {
                        $scope.bottleExist = 0;
                    } else if (data.value == false) {
                        $scope.showfail = 0;
                        $scope.showSaved = false;
                    } else {
                        $scope.showfail = 1;
                        $scope.bottleExist = 1;
                        $scope.showSaved = true;
                        // $location.url('/donor');
                        $scope.openPrintView();
                    }
                });
            }
        } else {
            if ($scope.donor.age < 18 || $scope.donor.age > 70) {
                $scope.showAgeError = true;
                $scope.showPinError = false;
            } else if ($scope.donor.pincode.toString().length != 6) {
                $scope.showAgeError = false;
                $scope.showPinError = true;
            }
        }
    };
    $scope.donor.village = [];
    $scope.ismatchVillage = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveVillage(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.donor.village = select.selected;
            }
        });
    }
    $scope.refreshVillage = function(search) {
        $scope.village = [];
        if (search) {
            NavigationService.findVillage(search, $scope.donor.village, function(data, status) {
                if (data.value != false) {
                    $scope.village = data;
                }
            });
        }
    };

    $scope.openPrintView = function() {
        NavigationService.getOneDonor($routeParams.id, function(data, status) {
            console.log(data);
            $scope.ngDialogData = data;
            ngDialog.open({
                template: 'views/donorprint.html',
                controller: 'createDonorCtrl',
                data: $scope.ngDialogData
            });
        });
    }

    $scope.closePrintModal = function() {
        ngDialog.closeAll();
        $location.url('/donor');
    }

    //createDonor
});
//createDonor Controller
//editDonor Controller
phonecatControllers.controller('editDonorCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Donor');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editdonor.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.access = $.jStorage.get("adminuser");
    $scope.donor = {};
    $scope.showbottle = false;
    $scope.showPrintBtn = false;
    $scope.showSaved = false;

    if ($.jStorage.get("adminuser").accesslevel == "admin") {
        $scope.showbottle = false;
    } else {
        $scope.showbottle = true;
    }

    $scope.calculate = function() {
        var birth = new Date($scope.donor.birthdate);
        var curr = new Date();
        var diff = curr.getTime() - birth.getTime();
        $scope.donor.age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }

    NavigationService.getOneDonor($routeParams.id, function(data, status) {
        console.log(data);
        $scope.donor = data;
        $scope.calculate(); //Add More Array
        if ($scope.access.accesslevel == 'entry') {
            if ($scope.donor.new) {
                document.getElementById("bottle").disabled = true;
            } else {
                document.getElementById("bottle").disabled = false;
            }
        }
        $scope.donor.birthdate = new Date($scope.donor.birthdate);
        $scope.donor.hospital = $.jStorage.get("adminuser").hospital;
        // console.log($scope.donor);
    });

    // NavigationService.findallHospital(function(data, status) {
    //     $scope.hospital = data;
    // });

    NavigationService.findallHospital(function(data, status) {
        console.log(data);
        if (data.value != false) {
            $scope.hospitals = data;
        }
    });

    $scope.goback = function() {
        $location.url('/donor');
    }

    $scope.savedonor = function() {
        console.log($scope.donor);
        if ($scope.donor.age >= 18 && $scope.donor.age <= 70 && $scope.donor.pincode.toString().length == 6) {
            $scope.showAgeError = false;
            if ($.jStorage.get("adminuser").accesslevel == "admin") {
                $scope.donor._id = $routeParams.id;
                NavigationService.saveappDonor($scope.donor, function(data, status) {
                    if (data.value == false) {
                        $scope.showfail = 1;
                        $scope.showSaved = false;
                    } else {
                        $scope.showfail = 0;
                        $scope.showPrintBtn = true;
                        $scope.showSaved = true;
                        $scope.openPrintView();
                        // $location.url('/donor');
                    }
                });
            } else {
                $scope.donor._id = $routeParams.id;
                $scope.donor.camp = $.jStorage.get("adminuser").camp;
                $scope.donor.campnumber = $.jStorage.get("adminuser").campnumber;
                NavigationService.saveDonor($scope.donor, function(data, status) {
                    if (data.value == true && data.comment == "Bottle already exists") {
                        $scope.bottleExist = 0;
                    } else if (data.value == false) {
                        $scope.showfail = 1;
                        $scope.showSaved = false;
                    } else {
                        $scope.showfail = 0;
                        $scope.bottleExist = 1;
                        $scope.showPrintBtn = true;
                        $scope.showSaved = true;
                        $scope.openPrintView();
                        // $location.url('/donor');
                    }
                });
            }
        } else {
            if ($scope.donor.age < 18 || $scope.donor.age > 70) {
                $scope.showAgeError = true;
                $scope.showPinError = false;
            } else if ($scope.donor.pincode.toString().length != 6) {
                $scope.showAgeError = false;
                $scope.showPinError = true;
            }
        }
    };
    $scope.donor.village = [];
    $scope.ismatchVillage = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveVillage(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.donor.village = select.selected;
            }
        });
    }
    $scope.refreshVillage = function(search) {
        $scope.village = [];
        if (search) {
            NavigationService.findVillage(search, $scope.donor.village, function(data, status) {
                if (data.value != false) {
                    $scope.village = data;
                }
            });
        }
    };

    $scope.openHistory = function() {
        $scope.ngDialogData = $scope.donor;
        ngDialog.open({
            template: 'views/history.html',
            controller: 'editDonorCtrl',
            data: $scope.ngDialogData
        });
    }

    $scope.openPrintView = function() {
        NavigationService.getOneDonor($routeParams.id, function(data, status) {
            console.log(data);
            $scope.ngDialogData = data;
            ngDialog.open({
                template: 'views/donorprint.html',
                controller: 'editDonorCtrl',
                data: $scope.ngDialogData
            });
        });
    }

    $scope.closePrintModal = function() {
        ngDialog.closeAll();
        $location.url('/donor');
    }

    //editDonor
});
//editDonor Controller
phonecatControllers.controller('oldDonorCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Donor');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/olddonor.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.donor = {};
    $scope.editdonor = {};
    $scope.searchdonor = {};
    $scope.access = $.jStorage.get('adminuser').accesslevel;
    $scope.isValidLogin = 2;
    $scope.showerror = 1;
    $scope.showerror2 = false;
    $scope.showtrue = false;
    $scope.editdonor.verified = false;
    $scope.editdonor.giftdone = false;

    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.donorid = '';
    $scope.pagedata.name = '';
    $scope.pagedata.firstname = '';
    $scope.pagedata.middlename = '';
    $scope.pagedata.lastname = '';
    $scope.pagedata.pincode = '';
    $scope.pagedata.camp = $.jStorage.get("adminuser").camp;
    $scope.pagedata.campnumber = $.jStorage.get("adminuser").campnumber;
    $scope.pagedata.accesslevel = $.jStorage.get("adminuser").accesslevel;
    $scope.pagedata.hospital = $.jStorage.get("adminuser").hospital;

    NavigationService.findallHospital(function(data, status) {
        console.log(data);
        if (data.value != false) {
            $scope.hospitals = data;
        }
    });

    $scope.reload1 = function() {
        NavigationService.findEntry($scope.pagedata, function(data, status) {
            console.log(data);
            if (data.value != false) {
                $scope.donorEntry = data;
                $scope.pages = [];
                var newclass = '';
                for (var i = 1; i <= data.totalpages; i++) {
                    if ($scope.pagedata.page == i) {
                        newclass = 'active';
                    } else {
                        newclass = '';
                    }
                    $scope.pages.push({
                        pageno: i,
                        class: newclass
                    });
                }
            } else {
                $scope.donorEntry = [];
            }
        });
    }

    $scope.reload1();

    $scope.getFilterResults1 = function(val) {
        switch (val) {
            case 'id':
                {
                    $scope.pagedata.page = 1;
                    $scope.pagedata.camp = '';
                    $scope.pagedata.campnumber = '';
                    $scope.pagedata.name = '';
                    $scope.pagedata.firstname = '';
                    $scope.pagedata.middlename = '';
                    $scope.pagedata.lastname = '';
                    $scope.pagedata.pincode = '';
                    $scope.reload1();
                    break;
                }
            case 'search':
                {
                    $scope.pagedata.page = 1;
                    $scope.pagedata.donorid = '';
                    $scope.reload1();
                    break;
                }
            case 'venue':
                {
                    $scope.pagedata.page = 1;
                    $scope.reload1();
                    break;
                }
            case 'limit':
                {
                    $scope.pagedata.page = 1;
                    $scope.reload1();
                    break;
                }
            default:
                {
                    $scope.reload1();
                    break;
                }
        }
    }

    $scope.changePage1 = function(pageno) {
        console.log(pageno);
        $scope.pagedata.page = pageno.pageno;
        $scope.reload1();
    }

    $scope.reload2 = function() {
        NavigationService.findVerified($scope.pagedata, function(data, status) {
            if (data.value != false) {
                $scope.donor = data;
                $scope.pages = [];
                var newclass = '';
                for (var i = 1; i <= data.totalpages; i++) {
                    if ($scope.pagedata.page == i) {
                        newclass = 'active';
                    } else {
                        newclass = '';
                    }
                    $scope.pages.push({
                        pageno: i,
                        class: newclass
                    });
                }
            }
        });
    }

    $scope.reload2();

    $scope.getFilterResults2 = function(val) {
        switch (val) {
            case 'id':
                {
                    $scope.pagedata.page = 1;
                    $scope.pagedata.camp = '';
                    $scope.pagedata.campnumber = '';
                    $scope.pagedata.name = '';
                    $scope.pagedata.firstname = '';
                    $scope.pagedata.middlename = '';
                    $scope.pagedata.lastname = '';
                    $scope.pagedata.pincode = '';
                    $scope.reload2();
                    break;
                }
            case 'search':
                {
                    $scope.pagedata.page = 1;
                    $scope.pagedata.donorid = '';
                    $scope.reload2();
                    break;
                }
            case 'venue':
                {
                    $scope.pagedata.page = 1;
                    $scope.reload2();
                    break;
                }
            case 'limit':
                {
                    $scope.pagedata.page = 1;
                    $scope.reload2();
                    break;
                }
            default:
                {
                    $scope.reload2();
                    break;
                }
        }
    }

    $scope.changePage2 = function(pageno) {
        console.log(pageno);
        $scope.pagedata.page = pageno.pageno;
        $scope.reload2();
    }

    $scope.openverify = function(value) {
        $scope.editdonor = value;
        $scope.editdonor.verified = false;
        $scope.isValidLogin = 1;
    }
    $scope.verify = function() {
        if ($scope.editdonor.verified == true) {
            $scope.showerror = 1;
            NavigationService.acksave($scope.editdonor, function(data, status) {
                if (data.value == false && data.comment == "No data found") {
                    $scope.showerror2 = true;
                    $timeout(function() {
                        $scope.showerror2 = false;
                    }, 2500);
                    $scope.editdonor = {};
                    $scope.donor = {};
                    $scope.searchdonor = {};
                    $scope.isValidLogin = 2;
                } else {
                    $scope.showtrue = true;
                    $timeout(function() {
                        $scope.showtrue = false;
                    }, 2500);
                    $scope.showerror2 = false;
                    $scope.editdonor = {};
                    $scope.donor = {};
                    $scope.searchdonor = {};
                    $scope.isValidLogin = 2;
                    $scope.reload1();
                }
            });
        } else {
            $scope.showerror = 0;
        }
    };
    $scope.opengift = function(value) {
        $scope.editdonor = value;
        $scope.editdonor.giftdone = false;
        $scope.isValidLogin = 1;
    }
    $scope.gift = function() {
        if ($scope.editdonor.giftdone == true) {
            $scope.showerror = 1;
            delete $scope.editdonor.donationcount;
            NavigationService.giftsave($scope.editdonor, function(data, status) {
                if (data.value == false && data.comment == "No data found") {
                    $scope.showerror2 = true;
                    $timeout(function() {
                        $scope.showerror2 = false;
                    }, 2500);
                    $scope.editdonor = {};
                    $scope.donor = {};
                    $scope.searchdonor = {};
                    $scope.isValidLogin = 2;
                } else {
                    $scope.showtrue = true;
                    $timeout(function() {
                        $scope.showtrue = false;
                    }, 2500);
                    $scope.showerror2 = false;
                    $scope.editdonor = {};
                    $scope.donor = {};
                    $scope.searchdonor = {};
                    $scope.isValidLogin = 2;
                    $scope.reload2();
                }
            });
        } else {
            $scope.showerror = 0;
        }
    };

    //editDonor
});
//editDonor Controller
//Family Controller
phonecatControllers.controller('FamilyCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Family');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/family.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Family = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedFamily($scope.pagedata, function(data, status) {
            $scope.family = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteFamily(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
        $.jStorage.set('deletefamily', id);
        ngDialog.open({
            template: 'views/delete.html',
            controller: 'FamilyCtrl',
            closeByDocument: false
        });
    }

    //End Family
});
//family Controller
//createFamily Controller
phonecatControllers.controller('createFamilyCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Family');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createfamily.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.family = {};
    $scope.submitForm = function() {
        NavigationService.saveFamily($scope.family, function(data, status) {
            $location.url('/family');
        });
    };
    $scope.family.donor = [];
    $scope.ismatchDonor = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveDonor(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.family.donor = select.selected;
            }
        });
    }
    $scope.refreshDonor = function(search) {
        $scope.donor = [];
        if (search) {
            NavigationService.findDonor(search, $scope.family.donor, function(data, status) {
                if (data.value != false) {
                    $scope.donor = data;
                }
            });
        }
    };
    //createFamily
});
//createFamily Controller
//editFamily Controller
phonecatControllers.controller('editFamilyCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Family');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editfamily.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.family = {};
    NavigationService.getOneFamily($routeParams.id, function(data, status) {
        $scope.family = data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.family._id = $routeParams.id;
        NavigationService.saveFamily($scope.family, function(data, status) {
            $location.url('/family');
        });
    };
    $scope.family.donor = [];
    $scope.ismatchDonor = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveDonor(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.family.donor = select.selected;
            }
        });
    }
    $scope.refreshDonor = function(search) {
        $scope.donor = [];
        if (search) {
            NavigationService.findDonor(search, $scope.family.donor, function(data, status) {
                if (data.value != false) {
                    $scope.donor = data;
                }
            });
        }
    };
    //editFamily
});
//editFamily Controller
//Camp Controller
phonecatControllers.controller('CampCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Camp');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/camp.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Camp = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedCamp($scope.pagedata, function(data, status) {
            $scope.camp = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteCamp(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletecamp', id);
            ngDialog.open({
                template: 'views/delete.html',
                controller: 'CampCtrl',
                closeByDocument: false
            });
        }
        //End Camp
});
//camp Controller
//createCamp Controller
phonecatControllers.controller('createCampCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Camp');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createcamp.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.camp = {};

    $scope.add = function(camp) {
        if (!camp.venues) {
            camp.venues = [{
                "value": "",
                "address": ""
            }];
        } else {
            camp.venues.push({
                "value": "",
                "address": ""
            });
        }
    };
    $scope.remove = function(i, dev) {
        dev.splice(i, 1);
    };

    $scope.submitForm = function() {
        // console.log($scope.camp);
        NavigationService.saveCamp($scope.camp, function(data, status) {
            $location.url('/camp');
        });
    };
    //createCamp
});
//createCamp Controller
//editCamp Controller
phonecatControllers.controller('editCampCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Camp');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editcamp.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.camp = {};
    $scope.disableCampClose = 'no';
    $scope.add = function(camp) {
        if (!camp.venues) {
            camp.venues = [{
                "value": "",
                "address": ""
            }];
        } else {
            camp.venues.push({
                "value": "",
                "address": ""
            });
        }
    };
    $scope.remove = function(i, dev) {
        dev.splice(i, 1);
    };
    NavigationService.getOneCamp($routeParams.id, function(data, status) {
        $scope.camp = data;
        $scope.camp.date = new Date($scope.camp.date);
        $scope.disableCampClose = $scope.camp.status;
        // if (!$scope.camp.donation) {
        //     $scope.camp.donation = [];
        // }
        // if (!$scope.camp.gift) {
        //     $scope.camp.gift = [];
        // }
        // if (!$scope.camp.bottle) {
        //     $scope.camp.bottle = [];
        // } //Add More Array
    });
    $scope.submitForm = function() {
        $scope.camp._id = $routeParams.id;
        NavigationService.saveCamp($scope.camp, function(data, status) {
            $location.url('/camp');
        });
    };
    // $scope.DonationStructure = [{
    //     "name": "user",
    //     "type": "text"
    // }, {
    //     "name": "timestamp",
    //     "type": "text"
    // }, {
    //     "name": "Bottleid",
    //     "type": "text"
    // }];
    // NavigationService.getSponsor(function(data, status) {
    //     $scope.sponsor = data;
    // });
    // $scope.GiftStructure = [{
    //     "name": "User",
    //     "type": "text"
    // }, {
    //     "name": "Type",
    //     "type": "text"
    // }];
    // $scope.BottleStructure = [{
    //     "name": "Status",
    //     "type": "text"
    // }, {
    //     "name": "user",
    //     "type": "text"
    // }, {
    //     "name": "hospital",
    //     "type": "text"
    // }];
    //editCamp
});
phonecatControllers.controller('AdminCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/admin.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.admin = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedAdmin($scope.pagedata, function(data, status) {
            $scope.admin = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteAdmin(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deleteadmin', id);
            ngDialog.open({
                template: 'views/delete.html',
                controller: 'AdminCtrl',
                closeByDocument: false
            });
        }
        //End Camp
});
//camp Controller
//createCamp Controller
phonecatControllers.controller('createAdminCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createadmin.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.admin = {};
    $scope.camp = [];
    NavigationService.getCamp(function(data, status) {
        console.log(data);
        if (data.value != false) {
            $scope.camp = data;
        } else {
            $scope.camp = [];
        }
    });
    $scope.submitForm = function() {
        NavigationService.saveAdmin($scope.admin, function(data, status) {
            $location.url('/admin');
        });
    };

    $scope.changeVenues = function(val) {
        console.log(val);
        var foundIndex = _.findIndex($scope.camp, {
            'campnumber': val
        });
        $scope.venues = $scope.camp[foundIndex].venues;
        $scope.venues = _.uniq($scope.venues, 'value');
    }

    //createCamp
});
//createCamp Controller
//editCamp Controller
phonecatControllers.controller('editAdminCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editadmin.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.admin = {};

    $scope.changeVenues = function(val) {
        console.log(val);
        var foundIndex = _.findIndex($scope.camp, {
            'campnumber': val
        });
        $scope.venues = $scope.camp[foundIndex].venues;
        $scope.venues = _.uniq($scope.venues, 'value');
    }
    NavigationService.getOneAdmin($routeParams.id, function(data, status) {
        $scope.admin = data;
        generateDrop();
        // if (!$scope.camp.donation) {
        //     $scope.camp.donation = [];
        // }
        // if (!$scope.camp.gift) {
        //     $scope.camp.gift = [];
        // }
        // if (!$scope.camp.bottle) {
        //     $scope.camp.bottle = [];
        // } //Add More Array
    });

    function generateDrop() {
        if ($scope.admin.accesslevel != 'admin') {
            NavigationService.getCamp(function(data, status) {
                if (data.value != false) {
                    $scope.camp = data;
                    var foundIndex = _.findIndex($scope.camp, {
                        'campnumber': $scope.admin.campnumber
                    });
                    $scope.venues = $scope.camp[foundIndex].venues;
                    $scope.venues = _.uniq($scope.venues, 'value');
                } else {
                    $scope.camp = [];
                }
            });
        }
    }

    $scope.submitForm = function() {
        $scope.admin._id = $routeParams.id;
        NavigationService.saveAdmin($scope.admin, function(data, status) {
            $location.url('/admin');
        });
    };
    // $scope.DonationStructure = [{
    //     "name": "user",
    //     "type": "text"
    // }, {
    //     "name": "timestamp",
    //     "type": "text"
    // }, {
    //     "name": "Bottleid",
    //     "type": "text"
    // }];
    // NavigationService.getSponsor(function(data, status) {
    //     $scope.sponsor = data;
    // });
    // $scope.GiftStructure = [{
    //     "name": "User",
    //     "type": "text"
    // }, {
    //     "name": "Type",
    //     "type": "text"
    // }];
    // $scope.BottleStructure = [{
    //     "name": "Status",
    //     "type": "text"
    // }, {
    //     "name": "user",
    //     "type": "text"
    // }, {
    //     "name": "hospital",
    //     "type": "text"
    // }];
    //editCamp
});
//editCamp Controller
//GiftType Controller
phonecatControllers.controller('GiftTypeCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('GiftType');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/gifttype.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.GiftType = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedGiftType($scope.pagedata, function(data, status) {
            $scope.gifttype = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteGiftType(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletegifttype', id);
            ngDialog.open({
                template: 'views/delete.html',
                controller: 'GiftTypeCtrl',
                closeByDocument: false
            });
        }
        //End GiftType
});
//gifttype Controller
//createGiftType Controller
phonecatControllers.controller('createGiftTypeCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('GiftType');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/creategifttype.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.gifttype = {};
    $scope.submitForm = function() {
        NavigationService.saveGiftType($scope.gifttype, function(data, status) {
            $location.url('/gifttype');
        });
    };
    //createGiftType
});
//createGiftType Controller
//editGiftType Controller
phonecatControllers.controller('editGiftTypeCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('GiftType');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editgifttype.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.gifttype = {};
    NavigationService.getOneGiftType($routeParams.id, function(data, status) {
        $scope.gifttype = data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.gifttype._id = $routeParams.id;
        NavigationService.saveGiftType($scope.gifttype, function(data, status) {
            $location.url('/gifttype');
        });
    };
    //editGiftType
});
//editGiftType Controller
//Hospital Controller
phonecatControllers.controller('HospitalCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Hospital');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/hospital.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Hospital = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedHospital($scope.pagedata, function(data, status) {
            $scope.hospital = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteHospital(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletehospital', id);
            ngDialog.open({
                template: 'views/delete.html',
                controller: 'HospitalCtrl',
                closeByDocument: false
            });
        }
        //End Hospital
});
//hospital Controller
//createHospital Controller
phonecatControllers.controller('createHospitalCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Hospital');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createhospital.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.hospital = {};
    $scope.submitForm = function() {
        NavigationService.saveHospital($scope.hospital, function(data, status) {
            $location.url('/hospital');
        });
    };
    //createHospital
});
//createHospital Controller
//editHospital Controller
phonecatControllers.controller('editHospitalCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Hospital');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/edithospital.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.hospital = {};
    NavigationService.getOneHospital($routeParams.id, function(data, status) {
        $scope.hospital = data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.hospital._id = $routeParams.id;
        NavigationService.saveHospital($scope.hospital, function(data, status) {
            $location.url('/hospital');
        });
    };
    //editHospital
});
//editHospital Controller
//Slider Controller
phonecatControllers.controller('SliderCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Slider');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/slider.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.slider = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedSlider($scope.pagedata, function(data, status) {
            $scope.slider = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteSlider(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deleteslider', id);
            ngDialog.open({
                template: 'views/delete.html',
                controller: 'SliderCtrl',
                closeByDocument: false
            });
        }
        //End Slider
});
//slider Controller
//createSlider Controller
phonecatControllers.controller('createSliderCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Slider');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createslider.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.slider = {};

    $scope.removeimage = function(i) {
        $scope.slider.image.splice(i, 1);
    };

    var imagejstupld = "";
    $scope.slider.image = [];
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function() {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function(index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function(index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function($files) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        console.log($files);
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = uploadres;
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                var loadFile = function(fileReader, index) {
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i);
            }
        }
    };

    $scope.start = function(index) {
        $scope.progress[index] = 0;
        $scope.errorMsg = null;
        console.log($scope.howToSend = 1);
        if ($scope.howToSend == 1) {
            $scope.upload[index] = $upload.upload({
                url: uploadUrl,
                method: $scope.httpMethod,
                headers: {
                    'Content-Type': 'Content-Type'
                },
                data: {
                    myModel: $scope.myModel
                },
                file: $scope.selectedFiles[index],
                fileFormDataName: 'file'
            });
            $scope.upload[index].then(function(response) {
                $timeout(function() {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.slider.image.push(imagejstupld.fileid);
                        console.log(imagejstupld.fileid);
                        console.log($scope.slider.image);
                        imagejstupld = "";
                    }
                });
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function(xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function(response) {
                    $scope.uploadResult.push(response.data);
                }, function(response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function($event) {
        var items = $event.dataTransfer.items;
        var hasFile = false;
        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].kind == 'file') {
                    hasFile = true;
                    break;
                }
            }
        } else {
            hasFile = true;
        }
        return hasFile ? "dragover" : "dragover-err";
    };

    $scope.submitForm = function() {
        NavigationService.saveSlider($scope.slider, function(data, status) {
            $location.url('/slider');
        });
    };
    //createSlider
});
//createSlider Controller
//editSlider Controller
phonecatControllers.controller('editSliderCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Slider');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editslider.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.slider = {};

    $scope.removeimage = function(i) {
        $scope.slider.image.splice(i, 1);
    };

    var imagejstupld = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function() {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function(index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function(index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function($files) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        console.log($files);
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = uploadres;
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                var loadFile = function(fileReader, index) {
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i);
            }
        }
    };

    $scope.start = function(index) {
        $scope.progress[index] = 0;
        $scope.errorMsg = null;
        console.log($scope.howToSend = 1);
        if ($scope.howToSend == 1) {
            $scope.upload[index] = $upload.upload({
                url: uploadUrl,
                method: $scope.httpMethod,
                headers: {
                    'Content-Type': 'Content-Type'
                },
                data: {
                    myModel: $scope.myModel
                },
                file: $scope.selectedFiles[index],
                fileFormDataName: 'file'
            });
            $scope.upload[index].then(function(response) {
                $timeout(function() {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.slider.image.push(imagejstupld.fileid);
                        imagejstupld = "";
                    }
                });
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function(xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function(response) {
                    $scope.uploadResult.push(response.data);
                }, function(response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function($event) {
        var items = $event.dataTransfer.items;
        var hasFile = false;
        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].kind == 'file') {
                    hasFile = true;
                    break;
                }
            }
        } else {
            hasFile = true;
        }
        return hasFile ? "dragover" : "dragover-err";
    };

    NavigationService.getOneSlider($routeParams.id, function(data, status) {
        $scope.slider = data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.slider._id = $routeParams.id;
        NavigationService.saveSlider($scope.slider, function(data, status) {
            $location.url('/slider');
        });
    };
    //editSlider
});
phonecatControllers.controller('SponsorCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Sponsor');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/sponsor.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.sponsor = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedSponsor($scope.pagedata, function(data, status) {
            $scope.sponsor = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteSponsor(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletesponsor', id);
            ngDialog.open({
                template: 'views/delete.html',
                controller: 'SponsorCtrl',
                closeByDocument: false
            });
        }
        //End Sponsors
});
//sponsors Controller
//createSponsors Controller
phonecatControllers.controller('createSponsorCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Sponsor');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createsponsor.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.sponsor = {};
    $scope.submitForm = function() {
        NavigationService.saveSponsor($scope.sponsor, function(data, status) {
            $location.url('/sponsor');
        });
    };
    //createSponsors
});
//createSponsors Controller
//editSponsors Controller
phonecatControllers.controller('editSponsorCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Sponsor');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editsponsor.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.sponsor = {};
    NavigationService.getOneSponsor($routeParams.id, function(data, status) {
        $scope.sponsor = data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.sponsor._id = $routeParams.id;
        NavigationService.saveSponsor($scope.sponsor, function(data, status) {
            $location.url('/sponsor');
        });
    };
    //editSponsors
});
phonecatControllers.controller('headerctrl', function($scope, TemplateService, $location, $routeParams, NavigationService, ngDialog) {
    $scope.template = TemplateService;
    $scope.navigation = NavigationService.getnav();
    $scope.showaccess = $.jStorage.get("adminuser");

    $scope.bottleCount = 0;

    if (!$.jStorage.get("adminuser")) {
        $location.url("/login");
    } else {
        if ($.jStorage.get("adminuser").accesslevel == "admin") {
            _.each($scope.navigation, function(n) {
                n.visible = "yes";
            });
        } else {
            _.each($scope.navigation, function(n) {
                if (n.name == "Donor" || n.name == "Dashboard") {
                    n.visible = "yes";
                } else {
                    n.visible = "no";
                }
            });
        }
        NavigationService.setnav($scope.navigation);

        if ($.jStorage.get("adminuser").hospital) {
            NavigationService.getLastBottleNumber($.jStorage.get("adminuser").hospital, function(data) {
                // console.log(data);
                if (data.value != false)
                    $scope.bottleCount = data.bottle;
                else
                    $scope.bottleCount = 0;
            })
        }
    }
});
//editSlider Controller
//findEntry Controller
phonecatControllers.controller('findEntryCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    // $scope.menutitle = NavigationService.makeactive('Donor');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/findentry.html';
    TemplateService.list = 2;

    $scope.navigation = NavigationService.getnav();
    $scope.Donor = [];
    $scope.access = $.jStorage.get('adminuser');
    $scope.number = 100;
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.camp = '';
    $scope.pagedata.campnumber = '';
    $scope.pagedata.donorid = '';
    $scope.pagedata.name = '';
    $scope.pagedata.firstname = '';
    $scope.pagedata.middlename = '';
    $scope.pagedata.lastname = '';
    $scope.pagedata.pincode = '';
    $scope.pagedata.accesslevel = $scope.access.accesslevel;
    $scope.pagedata.hospital = $scope.access.hospital;
    $scope.deleteReason = '';

    $scope.venues = [{
        value: 'All'
    }];

    NavigationService.findallHospital(function(data, status) {
        console.log(data);
        if (data.value != false) {
            $scope.hospitals = data;
        }
    });

    $scope.reload = function() {
        NavigationService.findEntry($scope.pagedata, function(data, status) {
            console.log(data);
            $scope.donor = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if ($scope.pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }

    $scope.reload();

    $scope.confDelete = function() {
        NavigationService.deleteDonor(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }

    $scope.confDeleteForEntry = function() {
        console.log($scope.deleteReason);
        NavigationService.deleteDonorReason($scope.deleteReason, function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }

    $scope.deletefun = function(id) {
        $.jStorage.set('deletedonor', id);
        if ($scope.access.accesslevel == 'entry') {
            ngDialog.open({
                template: 'views/deleteforentry.html',
                closeByDocument: false,
                showClose: false,
                controller: 'findEntryCtrl',
                scope: $scope
            });
        } else {
            ngDialog.open({
                template: 'views/delete.html',
                controller: 'findEntryCtrl',
                closeByDocument: false
            });
        }
    }

    NavigationService.getCamp(function(data) {
        console.log(data);
        $scope.camps = data;
        $scope.camps.unshift({
            campnumber: 'All',
            venues: [{
                value: "All"
            }]
        });
    })

    $scope.showVenues = function() {
        console.log($scope.pagedata.campnumber);
        var foundIndex = _.findIndex($scope.camps, {
            'campnumber': $scope.pagedata.campnumber
        });
        if (foundIndex != -1) {
            $scope.venues = $scope.camps[foundIndex].venues;
        }
        $scope.pagedata.camp = '';
        $scope.pagedata.page = 1;
        $scope.reload();
    }

    $scope.getFilterResults = function(val) {
        switch (val) {
            case 'id':
                {
                    $scope.pagedata.page = 1;
                    $scope.pagedata.camp = '';
                    $scope.pagedata.campnumber = '';
                    $scope.pagedata.name = '';
                    $scope.pagedata.firstname = '';
                    $scope.pagedata.middlename = '';
                    $scope.pagedata.lastname = '';
                    $scope.pagedata.pincode = '';

                    $scope.reload();
                    break;
                }
            case 'search':
                {
                    $scope.pagedata.page = 1;
                    $scope.pagedata.donorid = '';
                    $scope.reload();
                    break;
                }
            case 'venue':
                {
                    $scope.pagedata.page = 1;
                    $scope.reload();
                    break;
                }
            case 'limit':
                {
                    $scope.pagedata.page = 1;
                    $scope.reload();
                    break;
                }
            default:
                {
                    $scope.reload();
                    break;
                }
        }
    }

    $scope.changePage = function(pageno) {
        console.log(pageno);
        $scope.pagedata.page = pageno.pageno;
        $scope.reload();
    }

    //End Donor
});
//findEntry Controller
phonecatControllers.controller('findVerifyCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $timeout) {
    $scope.template = TemplateService;
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/findverify.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.donor = {};
    $scope.editdonor = {};
    $scope.searchdonor = {};
    $scope.access = $.jStorage.get('adminuser').accesslevel;
    $scope.isValidLogin = 2;
    $scope.showerror = 1;
    $scope.showerror2 = false;
    $scope.showtrue = false;
    $scope.editdonor.verified = false;
    $scope.editdonor.giftdone = false;

    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.donorid = '';
    $scope.pagedata.name = '';
    $scope.pagedata.firstname = '';
    $scope.pagedata.middlename = '';
    $scope.pagedata.lastname = '';
    $scope.pagedata.pincode = '';
    $scope.pagedata.camp = $.jStorage.get("adminuser").camp;
    $scope.pagedata.campnumber = $.jStorage.get("adminuser").campnumber;
    $scope.pagedata.accesslevel = $.jStorage.get("adminuser").accesslevel;
    $scope.pagedata.hospital = $.jStorage.get("adminuser").hospital;

    NavigationService.findallHospital(function(data, status) {
        console.log(data);
        if (data.value != false) {
            $scope.hospitals = data;
        }
    });

    $scope.reload1 = function() {
        NavigationService.findVerified($scope.pagedata, function(data, status) {
            console.log(data);
            if (data.value != false) {
                $scope.donor = data;
                $scope.pages = [];
                var newclass = '';
                for (var i = 1; i <= data.totalpages; i++) {
                    if ($scope.pagedata.page == i) {
                        newclass = 'active';
                    } else {
                        newclass = '';
                    }
                    $scope.pages.push({
                        pageno: i,
                        class: newclass
                    });
                }
            }
        });
    }

    $scope.reload1();

    $scope.getFilterResults1 = function(val) {
        switch (val) {
            case 'id':
                {
                    $scope.pagedata.page = 1;
                    $scope.pagedata.camp = '';
                    $scope.pagedata.campnumber = '';
                    $scope.pagedata.name = '';
                    $scope.pagedata.firstname = '';
                    $scope.pagedata.middlename = '';
                    $scope.pagedata.lastname = '';
                    $scope.pagedata.pincode = '';
                    $scope.reload1();
                    break;
                }
            case 'search':
                {
                    $scope.pagedata.page = 1;
                    $scope.pagedata.donorid = '';
                    $scope.reload1();
                    break;
                }
            case 'venue':
                {
                    $scope.pagedata.page = 1;
                    $scope.reload1();
                    break;
                }
            case 'limit':
                {
                    $scope.pagedata.page = 1;
                    $scope.reload1();
                    break;
                }
            default:
                {
                    $scope.reload1();
                    break;
                }
        }
    }

    $scope.changePage1 = function(pageno) {
        console.log(pageno);
        $scope.pagedata.page = pageno.pageno;
        $scope.reload1();
    }

    $scope.openverify = function(value) {
        $scope.editdonor = value;
        $scope.editdonor.verified = false;
        $scope.isValidLogin = 1;
    }
    $scope.verify = function() {
        if ($scope.editdonor.verified == true) {
            $scope.showerror = 1;
            NavigationService.acksave($scope.editdonor, function(data, status) {
                if (data.value == false && data.comment == "No data found") {
                    $scope.showerror2 = true;
                    $timeout(function() {
                        $scope.showerror2 = false;
                    }, 2500);
                    $scope.editdonor = {};
                    $scope.donor = {};
                    $scope.searchdonor = {};
                    $scope.isValidLogin = 2;
                } else {
                    $scope.showtrue = true;
                    $timeout(function() {
                        $scope.showtrue = false;
                    }, 2500);
                    $scope.showerror2 = false;
                    $scope.editdonor = {};
                    $scope.donor = {};
                    $scope.searchdonor = {};
                    $scope.isValidLogin = 2;
                    $scope.reload1();
                }
            });
        } else {
            $scope.showerror = 0;
        }
    };

});

phonecatControllers.controller('findGiftCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $timeout) {
    $scope.template = TemplateService;
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/findgift.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.donor = {};
    $scope.editdonor = {};
    $scope.searchdonor = {};
    $scope.access = $.jStorage.get('adminuser').accesslevel;
    $scope.isValidLogin = 2;
    $scope.showerror = 1;
    $scope.showerror2 = false;
    $scope.showtrue = false;
    $scope.editdonor.verified = false;
    $scope.editdonor.giftdone = false;

    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.donorid = '';
    $scope.pagedata.name = '';
    $scope.pagedata.firstname = '';
    $scope.pagedata.middlename = '';
    $scope.pagedata.lastname = '';
    $scope.pagedata.pincode = '';
    $scope.pagedata.camp = $.jStorage.get("adminuser").camp;
    $scope.pagedata.campnumber = $.jStorage.get("adminuser").campnumber;
    $scope.pagedata.accesslevel = $.jStorage.get("adminuser").accesslevel;
    $scope.pagedata.hospital = $.jStorage.get("adminuser").hospital;

    NavigationService.findallHospital(function(data, status) {
        console.log(data);
        if (data.value != false) {
            $scope.hospitals = data;
        }
    });

    $scope.reload2 = function() {
        NavigationService.findGifted($scope.pagedata, function(data, status) {
            if (data.value != false) {
                $scope.donor = data;
                $scope.pages = [];
                var newclass = '';
                for (var i = 1; i <= data.totalpages; i++) {
                    if ($scope.pagedata.page == i) {
                        newclass = 'active';
                    } else {
                        newclass = '';
                    }
                    $scope.pages.push({
                        pageno: i,
                        class: newclass
                    });
                }
            }
        });
    }

    $scope.reload2();

    $scope.getFilterResults2 = function(val) {
        switch (val) {
            case 'id':
                {
                    $scope.pagedata.page = 1;
                    $scope.pagedata.camp = '';
                    $scope.pagedata.campnumber = '';
                    $scope.pagedata.name = '';
                    $scope.pagedata.firstname = '';
                    $scope.pagedata.middlename = '';
                    $scope.pagedata.lastname = '';
                    $scope.pagedata.pincode = '';
                    $scope.reload2();
                    break;
                }
            case 'search':
                {
                    $scope.pagedata.page = 1;
                    $scope.pagedata.donorid = '';
                    $scope.reload2();
                    break;
                }
            case 'venue':
                {
                    $scope.pagedata.page = 1;
                    $scope.reload2();
                    break;
                }
            case 'limit':
                {
                    $scope.pagedata.page = 1;
                    $scope.reload2();
                    break;
                }
            default:
                {
                    $scope.reload2();
                    break;
                }
        }
    }

    $scope.changePage2 = function(pageno) {
        console.log(pageno);
        $scope.pagedata.page = pageno.pageno;
        $scope.reload2();
    }

    $scope.opengift = function(value) {
        $scope.editdonor = value;
        $scope.editdonor.giftdone = false;
        $scope.isValidLogin = 1;
    }
    $scope.gift = function() {
        if ($scope.editdonor.giftdone == true) {
            $scope.showerror = 1;
            delete $scope.editdonor.donationcount;
            NavigationService.giftsave($scope.editdonor, function(data, status) {
                if (data.value == false && data.comment == "No data found") {
                    $scope.showerror2 = true;
                    $timeout(function() {
                        $scope.showerror2 = false;
                    }, 2500);
                    $scope.editdonor = {};
                    $scope.donor = {};
                    $scope.searchdonor = {};
                    $scope.isValidLogin = 2;
                } else {
                    $scope.showtrue = true;
                    $timeout(function() {
                        $scope.showtrue = false;
                    }, 2500);
                    $scope.showerror2 = false;
                    $scope.editdonor = {};
                    $scope.donor = {};
                    $scope.searchdonor = {};
                    $scope.isValidLogin = 2;
                    $scope.reload2();
                }
            });
        } else {
            $scope.showerror = 0;
        }
    };

    //editDonor
});

phonecatControllers.controller('campReportCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $timeout, cfpLoadingBar) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Camp Report');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/campreport.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    cfpLoadingBar.start();
    $scope.report = {};

    NavigationService.getCamp(function(data) {
        console.log(data);
        $scope.camps = data;
        $scope.report.campnumber = $scope.camps[$scope.camps.length - 1].campnumber;
        $scope.venues = $scope.camps[$scope.camps.length - 1].venues;
        $scope.venues.unshift({
            value: 'All'
        });
        $scope.report.camp = 'All';
        getCounts();
    })

    $scope.changeVenues = function(val) {
        console.log(val);
        var foundIndex = _.findIndex($scope.camps, {
            'campnumber': val
        });
        $scope.venues = $scope.camps[foundIndex].venues;
        $scope.venues.unshift({
            value: 'All'
        });
        $scope.venues = _.uniq($scope.venues, 'value');
        $scope.report.camp = 'All';
        getCounts();
    }

    $scope.changeCounts = function() {
        getCounts();
    }

    NavigationService.countUser(function(data, status) {
        $scope.allusers = data;
    });

    function getCounts() {
        NavigationService.countLevels($scope.report, function(data) {
            console.log(data);
            $scope.levelCounts = data;
        });
        NavigationService.countHospital($scope.report, function(data) {
            console.log(data);
            $scope.hospitalCounts = _.chunk(data, 3);
        });
        NavigationService.countDeleted($scope.report, function(data) {
            console.log(data);
            $scope.donorDeleted = data;
        })
    }

    $scope.getDonorLevels = function(accesslevel) {
        $location.url("/campreportusers/" + $scope.report.campnumber + "/" + $scope.report.camp + "/" + accesslevel);
    }

    $scope.getHospUsers = function(hospid) {
        $location.url("/campreporthospusers/" + $scope.report.campnumber + "/" + $scope.report.camp + "/" + hospid);
    }

});

phonecatControllers.controller('campReportUsersCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $routeParams) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Camp Report');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/campreportusers.html';
    // TemplateService.content = 'views/olddonor.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Donor = [];
    // $scope.access = $.jStorage.get('adminuser');
    $scope.number = 100;
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.camp = $routeParams.camp;
    $scope.pagedata.campnumber = $routeParams.campnumber;
    $scope.pagedata.accesslevel = $routeParams.accesslevel;
    $scope.pagedata.name = '';
    $scope.pagedata.firstname = '';
    $scope.pagedata.middlename = '';
    $scope.pagedata.lastname = '';
    $scope.pagedata.donorid = '';
    $scope.pagedata.pincode = '';

    $scope.reload = function() {
        NavigationService.donorLevels($scope.pagedata, function(data, status) {
            console.log(data);
            $scope.donor = data;
            _.each(data.data, function(n) {
                if (n.oldbottle) {
                    NavigationService.getOneHospital(n.oldbottle.hospital, function(hosp) {
                        console.log(hosp);
                        n.oldbottle.hospitalname = hosp.name;
                    })
                }
            })
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if ($scope.pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }

    $scope.reload();

    $scope.getFilterResults = function(val) {
        switch (val) {
            case 'id':
                {
                    $scope.pagedata.page = 1;
                    $scope.pagedata.name = '';
                    $scope.pagedata.firstname = '';
                    $scope.pagedata.middlename = '';
                    $scope.pagedata.lastname = '';
                    $scope.pagedata.pincode = '';

                    $scope.reload();
                    break;
                }
            case 'search':
                {
                    $scope.pagedata.page = 1;
                    $scope.pagedata.donorid = '';
                    $scope.reload();
                    break;
                }
            case 'venue':
                {
                    $scope.pagedata.page = 1;
                    $scope.reload();
                    break;
                }
            case 'limit':
                {
                    $scope.pagedata.page = 1;
                    $scope.reload();
                    break;
                }
            default:
                {
                    $scope.reload();
                    break;
                }
        }
    }

    $scope.changePage = function(pageno) {
        console.log(pageno);
        $scope.pagedata.page = pageno.pageno;
        $scope.reload();
    }

    //End Donor
});
phonecatControllers.controller('campReportHospUsersCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $routeParams) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Camp Report');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/campreporthospusers.html';
    // TemplateService.content = 'views/olddonor.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Donor = [];
    // $scope.access = $.jStorage.get('adminuser');
    $scope.number = 100;
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.camp = $routeParams.camp;
    $scope.pagedata.campnumber = $routeParams.campnumber;
    $scope.pagedata.hospital = $routeParams.hospital;
    $scope.pagedata.donorid = '';
    $scope.pagedata.name = '';
    $scope.pagedata.firstname = '';
    $scope.pagedata.middlename = '';
    $scope.pagedata.lastname = '';
    $scope.pagedata.pincode = '';

    $scope.reload = function() {
        NavigationService.hospDonors($scope.pagedata, function(data, status) {
            console.log(data);
            $scope.donor = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if ($scope.pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }

    $scope.reload();

    $scope.getFilterResults = function(val) {
        switch (val) {
            case 'id':
                {
                    $scope.pagedata.page = 1;
                    $scope.pagedata.name = '';
                    $scope.pagedata.firstname = '';
                    $scope.pagedata.middlename = '';
                    $scope.pagedata.lastname = '';
                    $scope.pagedata.pincode = '';

                    $scope.reload();
                    break;
                }
            case 'search':
                {
                    $scope.pagedata.page = 1;
                    $scope.pagedata.donorid = '';
                    $scope.reload();
                    break;
                }
            case 'venue':
                {
                    $scope.pagedata.page = 1;
                    $scope.reload();
                    break;
                }
            case 'limit':
                {
                    $scope.pagedata.page = 1;
                    $scope.reload();
                    break;
                }
            default:
                {
                    $scope.reload();
                    break;
                }
        }
    }

    $scope.changePage = function(pageno) {
        console.log(pageno);
        $scope.pagedata.page = pageno.pageno;
        $scope.reload();
    }

    //End Donor
});
//Add New Controller

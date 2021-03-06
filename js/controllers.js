var uploadres = [];
var selectedData = [];
var phonecatControllers = angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ngDialog', 'angularFileUpload', 'ui.select', 'ngSanitize', 'angular-loading-bar', 'cfp.loadingBarInterceptor']);
window.uploadUrl = 'http://api.thetmm.org/uploadfile/upload';
window.uploadUrl2 = 'http://api.thetmm.org/uploadfile/upload2';
//window.uploadUrl2 = 'http://localhost:1337/uploadfile/upload2';
//window.uploadUrl = 'http://192.168.1.131:1337/uploadfile/upload';
 //window.uploadUrl = 'http://localhost:1337/uploadfile/upload';
phonecatControllers.controller('home', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
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
    NavigationService.countEntry($.jStorage.get("adminuser"), function (data, status) {
        $scope.user = data;
    });

    NavigationService.countVerified($.jStorage.get("adminuser"), function (data, status) {
        $scope.verified = data;
    });

    NavigationService.countGifted($.jStorage.get("adminuser"), function (data, status) {
        $scope.gifted = data;
    });
    if ($.jStorage.get("adminuser").hospital) {
        NavigationService.getBlood($.jStorage.get("adminuser").hospital, function (data, status) {
            if (data.value == false) {
                $scope.blood = [];
            } else {
                $scope.blood = data;
            }
        });
        83
    } else {
        $scope.blood = [];
    }

    NavigationService.countUser(function (data, status) {
        $scope.allusers = data;
    });

    if ($.jStorage.get("adminuser").accesslevel != "admin" && $.jStorage.get("adminuser").accesslevel != "gift") {
        if (!$.jStorage.get("adminuser").hospital) {
            NavigationService.findCampHospital($.jStorage.get("adminuser").campnumber, $.jStorage.get("adminuser").camp, function (data, status) {
                if (data.value != false) {
                    $scope.ngDialogData = data.hospital;
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
        NavigationService.findCampHospital($.jStorage.get("adminuser").campnumber, $.jStorage.get("adminuser").camp, function (data, status) {
            console.log(data);
            if (data.value != false) {
                $scope.hospitals = data.hospital;
            } else {
                $scope.hospitals = [];
            }
        });
    }

    $scope.storeHospital = function (hospid) {
        console.log(hospid);
        $scope.newdata = $.jStorage.get("adminuser");
        $scope.newdata.hospital = hospid;
        $.jStorage.set("adminuser", $scope.newdata);
        window.location.reload();
    }

    $scope.goToFindEntry = function () {
        $location.url("/findentry");
    }

    $scope.goToFindVerify = function () {
        $location.url("/findverify");
    }

    $scope.goToFindGift = function () {
        $location.url("/findgift");
    }

    if ($.jStorage.get("adminuser").accesslevel == "search") {
        $location.url("/searchBlood");
    }

});
phonecatControllers.controller('closeDialog', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Hospital");
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = "";
    TemplateService.list = 2;
    $scope.myhosp = "";
    $scope.hospital = "";
    $scope.access = $.jStorage.get("adminuser");
    $scope.select = function () {
        if ($scope.myhosp != "") {
            $scope.newdata = $.jStorage.get("adminuser");
            $scope.newdata.hospital = $scope.myhosp;
            $.jStorage.set("adminuser", $scope.newdata);
            ngDialog.close();
            window.location.reload();
        }
    }
    $scope.adminOk = function () {
        ngDialog.close();
        $location.url('/createhospital');
    }
    $scope.navigation = NavigationService.getnav();
});
phonecatControllers.controller('login', function ($scope, TemplateService, NavigationService, $routeParams, $location) {
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

    NavigationService.getCamp(function (data, status) {
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
    $scope.changedrop = function () {
        if ($scope.login.accesslevel == "admin") {
            $scope.login.campnumber = "All";
            $scope.login.camp = "All";
            $scope.showDrop = false;
        } else if ($scope.login.accesslevel == "needblood") {
            $scope.login.campnumber = "All";
            $scope.login.camp = "All";
            $scope.showDrop = false;
        } else if ($scope.login.accesslevel == "score") {
            $scope.login.campnumber = "All";
            $scope.login.camp = "All";
            $scope.showDrop = false;
        } else if ($scope.login.accesslevel == "search") {
            $scope.login.campnumber = "All";
            $scope.login.camp = "All";
            $scope.showDrop = false;
        } else {
            $scope.showDrop = true;
            $scope.login.camp = "";
            $scope.login.campnumber = "";
            $scope.changeloc();
        }
    }
    $scope.changeloc = function () {
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
    $scope.verifylogin = function () {
        if ($scope.login.campnumber == "Select Camp Number") {
            $scope.login.campnumber = "";
        }
        if ($scope.login.camp == "Select Location") {
            $scope.login.camp = "";
        }
        console.log($scope.login);
        if ($scope.login.email != "" && $scope.login.password != "" && $scope.login.accesslevel != "" && $scope.login.camp != "" && $scope.login.campnumber != "") {
            NavigationService.adminLogin($scope.login, function (data, status) {
                if (data.value == false) {
                    $scope.login = {};
                    $scope.isValidLogin = 0;
                } else {
                    $scope.isValidLogin = 1;
                    $.jStorage.set("adminuser", data);
                    if (data.accesslevel == "admin") {
                        _.each($scope.navigation, function (n) {
                            n.visible = "yes";
                        });
                        locationcheck();
                    } else if (data.accesslevel == "needblood") {
                        _.each($scope.navigation, function (n) {
                            if (n.name == "Need Blood") {
                                n.visible = "yes";
                            } else {
                                n.visible = "no";
                            }
                        });
                        locationcheck();
                    } else if (data.accesslevel == "score") {
                        _.each($scope.navigation, function (n) {
                            if (n.name == "Score Viewer") {
                                n.visible = "yes";
                            } else {
                                n.visible = "no";
                            }
                        });
                        locationcheck();
                    } else {
                        NavigationService.findallHospital(function (data, status) {
                            if (data.value == false) {
                                $scope.showtext = 0;
                            } else {
                                _.each($scope.navigation, function (n) {
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
                    if ($.jStorage.get("adminuser") && $.jStorage.get("adminuser").accesslevel == "needblood") {
                        $location.url("/request");
                    } else if ($.jStorage.get("adminuser") && $.jStorage.get("adminuser").accesslevel == "score") {
                        $location.url("/score");
                    } else {
                        $location.url("/home");
                    }
                }
            });
        } else {
            $scope.login = {};
            console.log("blank login");
            $scope.isValidLogin = 0;
        }
    }
});
//addDonorViewCtrl
phonecatControllers.controller('addDonorViewCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Add Donor');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    if ($.jStorage.get('adminuser').accesslevel == "admin" || $.jStorage.get('adminuser').accesslevel == "entry") {
        TemplateService.content = 'views/addDonorView.html';
    }
    //  else {
    //     TemplateService.content = 'views/olddonor.html';
    // }
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Donor = [];
    $scope.access = $.jStorage.get('adminuser');
    $scope.number = 100;
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '50';
    $scope.pagedata.camp = '';
    $scope.pagedata.campnumber = '';
    $scope.pagedata.donorid = '';
    $scope.pagedata.name = '';
    $scope.pagedata.firstname = '';
    $scope.pagedata.middlename = '';
    $scope.pagedata.lastname = '';
    $scope.pagedata.pincode = '';
    $scope.pagedata.mobile = '';
    $scope.pagedata.accesslevel = $scope.access.accesslevel;
    $scope.deleteReason = '';
    $scope.showNoResult = false;

    $scope.venues = [{
        value: 'All'
    }];

    $scope.reload = function () {
        console.log("%DE4frtgyhjui", $scope.pagedata);
        NavigationService.findLimitedDonor($scope.pagedata, function (data, status) {
            console.log(data);
            if (data.value != false) {
                $scope.showNoResult = false;
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
            } else {
                $scope.showNoResult = true;
            }
        });
    }

    // $scope.reload();

    $scope.confDelete = function () {
        NavigationService.deleteDonor(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }

    $scope.deletefun = function (id) {
        $.jStorage.set('deletedonor', id);
        ngDialog.open({
            template: 'views/delete.html',
            controller: 'DonorCtrl',
            closeByDocument: false,
            scope: $scope
        });

    }
    NavigationService.getCamp(function (data) {
        $scope.camps = data;
        $scope.camps.unshift({
            campnumber: 'All',
            venues: [{
                value: "All"
            }]
        });
    })

    $scope.showVenues = function () {
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

    $scope.getFilterResults = function (val) {
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
                    $scope.pagedata.mobile = '';
                    $scope.reload();
                    break;
                }
            case 'search':
                {
                    $scope.pagedata.page = 1;
                    $scope.pagedata.donorid = '';
                    // $scope.pagedata.pincode = '';
                    // $scope.pagedata.mobile = '121321515';
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

    $scope.changePage = function (pageno) {
        console.log(pageno);
        $scope.pagedata.page = pageno.pageno;
        $scope.reload();
    }
    //End Donor
});

//Donor Controller
phonecatControllers.controller('DonorCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
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
    $scope.pagedata.limit = '50';
    $scope.pagedata.camp = '';
    $scope.pagedata.campnumber = '';
    $scope.pagedata.donorid = '';
    $scope.pagedata.name = '';
    $scope.pagedata.firstname = '';
    $scope.pagedata.middlename = '';
    $scope.pagedata.lastname = '';
    $scope.pagedata.pincode = '';
    $scope.pagedata.mobile = '';
    $scope.pagedata.accesslevel = $scope.access.accesslevel;
    $scope.deleteReason = '';
    $scope.showNoResult = false;

    $scope.venues = [{
        value: 'All'
    }];

    $scope.reload = function () {
        console.log("%DE4frtgyhjui", $scope.pagedata);
        NavigationService.findLimitedDonor($scope.pagedata, function (data, status) {
            console.log(data);
            if (data.value != false) {
                $scope.showNoResult = false;
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
            } else {
                $scope.showNoResult = true;
            }
        });
    }

    // $scope.reload();

    $scope.confDelete = function () {
        NavigationService.deleteDonor(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }

    $scope.deletefun = function (id) {
        $.jStorage.set('deletedonor', id);
        ngDialog.open({
            template: 'views/delete.html',
            controller: 'DonorCtrl',
            closeByDocument: false,
            scope: $scope
        });
    }

    NavigationService.getCamp(function (data) {
        $scope.camps = data;
        $scope.camps.unshift({
            campnumber: 'All',
            venues: [{
                value: "All"
            }]
        });
    })

    $scope.showVenues = function () {
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

    $scope.getFilterResults = function (val) {
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
                    $scope.pagedata.mobile = '';
                    $scope.reload();
                    break;
                }
            case 'search':
                {
                    $scope.pagedata.page = 1;
                    $scope.pagedata.donorid = '';
                    // $scope.pagedata.pincode = '';
                    // $scope.pagedata.mobile = '121321515';
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

    $scope.changePage = function (pageno) {
        console.log(pageno);
        $scope.pagedata.page = pageno.pageno;
        $scope.reload();
    }
    //End Donor
});
//donor Controller
//createDonor Controller
phonecatControllers.controller('createDonorCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Donor');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createdonor.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.donor = {};
    $scope.donor.discontinued = 'no';
    $scope.bottleExist = 1;
    $scope.showfail = 1;
    $scope.showbottle = false;
    $scope.showSaved = false;
    $scope.showMobileErr = false;
    $scope.showWeightErr = false;

    $scope.calculate = function () {
        var birth = new Date($scope.donor.birthdate);
        var curr = new Date();
        var diff = curr.getTime() - birth.getTime();
        $scope.donor.age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }
    if ($.jStorage.get("adminuser").accesslevel == "admin") {
        $scope.showbottle = false;
    } else {
        $scope.showbottle = true;
        NavigationService.getLastBottleNumber($.jStorage.get("adminuser").hospital, function (data) {
            console.log(data);
            if (data.value != false)
                $scope.donor.bottle = parseInt(data.bottle) + 1;
        })
    }

    $scope.savedonor = function () {
        console.log($scope.donor);
        if ($scope.donor.age >= 18 && $scope.donor.age <= 70 && $scope.donor.pincode && $scope.donor.pincode.toString().length == 6 && $scope.donor.mobile && ($scope.donor.mobile.toString().length == 10 || $scope.donor.mobile.toString().length == 0) && $scope.donor.weight && $scope.donor.weight != "") {
            if ($.jStorage.get("adminuser").accesslevel == "admin") {
                NavigationService.saveappDonor($scope.donor, function (data, status) {
                    if (data.value == false) {
                        $scope.showfail = 0;
                        $scope.showSaved = false;
                    } else {
                        $scope.showfail = 1;
                        $scope.showSaved = true;
                        $location.url('/donor');
                        $scope.openPrintView(data.id);
                    }
                });
            } else {
                $scope.donor.hospital = $.jStorage.get("adminuser").hospital;
                $scope.donor.camp = $.jStorage.get("adminuser").camp;
                $scope.donor.campnumber = $.jStorage.get("adminuser").campnumber;
                NavigationService.saveDonor($scope.donor, function (data, status) {
                    if (data.value == true && data.comment == "Bottle already exists") {
                        $scope.bottleExist = 0;
                    } else if (data.value == false) {
                        $scope.showfail = 0;
                        $scope.showSaved = false;
                    } else {
                        $scope.showfail = 1;
                        $scope.bottleExist = 1;
                        $scope.showSaved = true;
                        $scope.openPrintView(data.id);
                        $location.url('/donor');
                    }
                });
            }
        } else {
            if ($scope.donor.age < 18 || $scope.donor.age > 70) {
                $scope.showAgeError = true;
                $scope.showPinError = false;
            } else if (!$scope.donor.pincode || $scope.donor.pincode.toString().length != 6) {
                $scope.showAgeError = false;
                $scope.showPinError = true;
            } else if (!$scope.donor.mobile || $scope.donor.mobile.toString().length != 10 || $scope.donor.mobile.toString().length == "") {
                $scope.showMobileErr = true;
            } else if (!$scope.donor.weight || $scope.donor.weight == "") {
                $scope.showWeightErr = true;
            }
        }
    };
    $scope.donor.village = [];
    $scope.ismatchVillage = function (data, select) {
        _.each(data, function (l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveVillage(item, function (data, status) {
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
    $scope.refreshVillage = function (search) {
        $scope.village = [];
        if (search) {
            NavigationService.findVillage(search, $scope.donor.village, function (data, status) {
                if (data.value != false) {
                    $scope.village = data;
                }
            });
        }
    };

    $scope.openPrintView = function (id) {
        var abc = {
            'id': id,
            'campnumber': $.jStorage.get("adminuser").campnumber
        }
        NavigationService.printSummary(abc, function (data, status) {
            console.log(data);
            if (data.value != false) {
                var mywin = window.open('', '', 'width=1000,height=600');
                mywin.document.write(data);
                mywin.document.write('<script type="text/javascript">window.onload = function() { window.print();window.close(); }</script>');
                mywin.document.close();
            }
        });
    }
    $scope.closePrintModal = function () {
        ngDialog.closeAll();
        $location.url('/donor');
    }
    $scope.bottleCheck = function () {
        $scope.donor.camp = $.jStorage.get("adminuser").camp;
        $scope.donor.campnumber = $.jStorage.get("adminuser").campnumber;
        $scope.donor.hospital = $.jStorage.get("adminuser").hospital;
        NavigationService.bottleCheck($scope.donor, function (data) {
            console.log(data);
            if (data.value != false) {
                $scope.assignedTo = "";
                $scope.formValid = true;
                $scope.bottleExist = 1;
            } else {
                $scope.assignedTo = data.donorid;
                $scope.formValid = false;
                $scope.bottleExist = 0;
            }
        })
    }

    //createDonor
});
//createDonor Controller
//editDonor Controller
phonecatControllers.controller('editDonorCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
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
    $scope.showBottleError = false;
    $scope.hideSubmitPrint = false;
    $scope.showOnlyPrint = false;
    $scope.showMobileErr = false;

    if ($.jStorage.get("adminuser").accesslevel == "admin") {
        $scope.showbottle = false;
        getDetails();
    } else {
        $scope.showbottle = true;
        if ($.jStorage.get("adminuser").hospital) {
            NavigationService.getLastBottleNumber($.jStorage.get("adminuser").hospital, function (data) {
                console.log(data);
                if (data.value != false)
                    $scope.bottleCount = data.bottle;
                getDetails();
            })
        }
    }

    $scope.calculate = function () {
        var birth = new Date($scope.donor.birthdate);
        var curr = new Date();
        var diff = curr.getTime() - birth.getTime();
        $scope.donor.age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }

    function getDetails() {
        NavigationService.getOneDonor($routeParams.id, function (data, status) {
            console.log(data);
            data.isWeb = true;
            // console.log("in edit donor getdetails", data);
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
            if ($scope.bottleCount && !data.bottle) {
                $scope.donor.bottle = parseInt($scope.bottleCount) + 1;
            }
            // console.log($scope.donor);
        });
    }

    // NavigationService.findallHospital(function(data, status) {
    //     $scope.hospital = data;
    // });

    NavigationService.findallHospital(function (data, status) {
        console.log(data);
        if (data.value != false) {
            $scope.hospitals = data;
        }
    });

    $scope.goback = function () {
        $location.url('/donor');
    }

    $scope.onlyEditUser = function () {
        if ($scope.donor.age >= 18 && $scope.donor.age <= 70 && $scope.donor.pincode.toString().length == 6 && ($scope.donor.mobile.toString().length == 10 || $scope.donor.mobile.toString().length == 0) && $scope.donor.weight != "") {
            $scope.showAgeError = false;
            $scope.donor._id = $routeParams.id;
            delete $scope.donor.bottle;
            delete $scope.donor.hospital;
            delete $scope.donor.camp;
            delete $scope.donor.campnumber;
            NavigationService.saveappDonor($scope.donor, function (data, status) {
                if (data.value == false) {
                    $scope.showfail = 1;
                    $scope.showSaved = false;
                } else {
                    $scope.showfail = 0;
                    $scope.showPrintBtn = true;
                    $scope.showSaved = true;
                    // $scope.openPrintView();
                    $location.url('/donor');
                }
            });
        } else {
            if ($scope.donor.age < 18 || $scope.donor.age > 70) {
                $scope.showAgeError = true;
                $scope.showPinError = false;
            } else if ($scope.donor.pincode.toString().length != 6) {
                $scope.showAgeError = false;
                $scope.showPinError = true;
            } else if ($scope.donor.mobile.toString().length != 10 || $scope.donor.mobile.toString().length != 0) {
                $scope.showMobileErr = true;
            } else if (!$scope.donor.weight || $scope.donor.weight != "") {
                $scope.showWeightErr = true;
            }
        }
    }

    $scope.savedonor = function () {
        if ($scope.formValid != false) {
            console.log($scope.donor);
            if ($scope.donor.age >= 18 && $scope.donor.age <= 70 && $scope.donor.pincode && $scope.donor.pincode.toString().length == 6 && $scope.donor.bottle && $scope.donor.bottle.toString().length >= 1 && $scope.donor.mobile && $scope.donor.mobile.toString().length == 10 && $scope.donor.weight && $scope.donor.weight != '') {
                $scope.showAgeError = false;
                $scope.showBottleError = false;
                if ($.jStorage.get("adminuser").accesslevel == "admin") {
                    $scope.donor._id = $routeParams.id;
                    NavigationService.saveappDonor($scope.donor, function (data, status) {
                        if (data.value == false) {
                            $scope.showfail = 1;
                            $scope.showSaved = false;
                        } else {
                            $scope.showfail = 0;
                            $scope.showPrintBtn = true;
                            $scope.showSaved = true;
                            // $scope.openPrintView();
                            $location.url('/donor');
                        }
                    });
                } else {
                    $scope.donor._id = $routeParams.id;
                    $scope.donor.camp = $.jStorage.get("adminuser").camp;
                    $scope.donor.campnumber = $.jStorage.get("adminuser").campnumber;
                    NavigationService.saveDonor($scope.donor, function (data, status) {
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
                            $location.url('/donor');
                        }
                    });
                }
            } else {
                if ($scope.donor.age < 18 || $scope.donor.age > 70) {
                    $scope.showAgeError = true;
                    $scope.showPinError = false;
                    $scope.showBottleError = false;
                } else if (!$scope.donor.pincode || $scope.donor.pincode.toString().length != 6) {
                    $scope.showAgeError = false;
                    $scope.showPinError = true;
                } else if (!$scope.donor.bottle || $scope.donor.bottle == '') {
                    $scope.showBottleError = true;
                } else if (!$scope.donor.mobile || $scope.donor.mobile.toString().length != 10) {
                    $scope.showMobileErr = true;
                    $scope.showBottleError = false;
                } else if (!$scope.donor.weight) {
                    $scope.showWeightErr = true;
                    $scope.showBottleError = false;
                }
            }
        }
    };
    $scope.donor.village = [];
    $scope.ismatchVillage = function (data, select) {
        _.each(data, function (l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveVillage(item, function (data, status) {
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
    $scope.refreshVillage = function (search) {
        $scope.village = [];
        if (search) {
            NavigationService.findVillage(search, $scope.donor.village, function (data, status) {
                if (data.value != false) {
                    $scope.village = data;
                }
            });
        }
    };

    $scope.openHistory = function () {
        $scope.ngDialogData = $scope.donor;
        ngDialog.open({
            template: 'views/history.html',
            controller: 'editDonorCtrl',
            data: $scope.ngDialogData
        });
    }

    $scope.openPrintView = function () {
        var abc = {
            'id': $routeParams.id,
            'campnumber': $scope.access.campnumber
        }
        NavigationService.printSummary(abc, function (data, status) {
            console.log(data);
            if (data.value != false) {
                var mywin = window.open('', '', 'width=1000,height=600');
                mywin.document.write(data);
                mywin.document.write('<script type="text/javascript">window.onload = function() { window.print();window.close(); }</script>');
                mywin.document.close();
            }
        });
    }

    $scope.closePrintModal = function () {
        ngDialog.closeAll();
        $location.url('/donor');
    }

    $scope.bottleCheck = function () {
        $scope.donor.camp = $.jStorage.get("adminuser").camp;
        $scope.donor.campnumber = $.jStorage.get("adminuser").campnumber;
        NavigationService.bottleCheck($scope.donor, function (data) {
            console.log(data);
            if (data.value != false) {
                $scope.assignedTo = "";
                $scope.formValid = true;
                $scope.bottleExist = 1;
            } else {
                $scope.assignedTo = data.donorid;
                $scope.formValid = false;
                $scope.bottleExist = 0;
            }
        })
    }

    //editDonor
});
//editDonor Controller
phonecatControllers.controller('oldDonorCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $timeout) {
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
    $scope.pagedata.limit = '50';
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

    $scope.showNoResult = false;

    NavigationService.findallHospital(function (data, status) {
        console.log(data);
        if (data.value != false) {
            $scope.hospitals = data;
        }
    });

    $scope.reload1 = function () {
        console.log($scope.pagedata);
        NavigationService.findEntry($scope.pagedata, function (data, status) {
            console.log(data);
            if (data.value != false) {
                $scope.showNoResult = false;
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
                $scope.showNoResult = true;
                $scope.donorEntry = [];
            }
        });
    }

    $scope.reload1();

    $scope.getFilterResults1 = function (val) {
        switch (val) {
            case 'id':
                {
                    $scope.pagedata.page = 1;
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

    $scope.changePage1 = function (pageno) {
        console.log(pageno);
        $scope.pagedata.page = pageno.pageno;
        $scope.reload1();
    }

    $scope.reload2 = function () {
        NavigationService.findVerified($scope.pagedata, function (data, status) {
            if (data.value != false) {
                $scope.showNoResult = false;
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
            } else {
                $scope.showNoResult = true;
            }
        });
    }

    $scope.reload2();

    $scope.getFilterResults2 = function (val) {
        switch (val) {
            case 'id':
                {
                    $scope.pagedata.page = 1;
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

    $scope.changePage2 = function (pageno) {
        console.log(pageno);
        $scope.pagedata.page = pageno.pageno;
        $scope.reload2();
    }

    $scope.openverify = function (value) {
        $scope.editdonor = value;
        $scope.editdonor.verified = false;
        $scope.isValidLogin = 1;
    }
    $scope.verify = function () {
        if ($scope.editdonor.verified == true) {
            $scope.showerror = 1;
            NavigationService.acksave($scope.editdonor, function (data, status) {
                if (data.value == false && data.comment == "No data found") {
                    $scope.showerror2 = true;
                    $timeout(function () {
                        $scope.showerror2 = false;
                    }, 2500);
                    $scope.editdonor = {};
                    $scope.donor = {};
                    $scope.searchdonor = {};
                    $scope.isValidLogin = 2;
                } else {
                    $scope.showtrue = true;
                    $timeout(function () {
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
    $scope.opengift = function (value) {
        console.log(value);
        $scope.editdonor = value;
        $scope.isValidLogin = 1;
    }
    $scope.gift = function () {
        if ($scope.editdonor.giftdone && $scope.editdonor.giftdone != "") {
            $scope.showerror = 1;
            if ($scope.editdonor.giftdone == "true") {
                $scope.editdonor.giftdone = true;
            } else {
                $scope.editdonor.giftdone = false;
            }
            delete $scope.editdonor.donationcount;
            NavigationService.giftsave($scope.editdonor, function (data, status) {
                if (data.value == false && data.comment == "No data found") {
                    $scope.showerror2 = true;
                    $timeout(function () {
                        $scope.showerror2 = false;
                    }, 2500);
                    $scope.editdonor = {};
                    $scope.donor = {};
                    $scope.searchdonor = {};
                    $scope.isValidLogin = 2;
                } else {
                    $scope.showtrue = true;
                    $timeout(function () {
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
phonecatControllers.controller('FamilyCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
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
    $scope.pagedata.limit = '50';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function (pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedFamily($scope.pagedata, function (data, status) {
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
    $scope.confDelete = function () {
        NavigationService.deleteFamily(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function (id) {
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
phonecatControllers.controller('createFamilyCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Family');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createfamily.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.family = {};
    $scope.submitForm = function () {
        NavigationService.saveFamily($scope.family, function (data, status) {
            $location.url('/family');
        });
    };
    $scope.family.donor = [];
    $scope.ismatchDonor = function (data, select) {
        _.each(data, function (l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveDonor(item, function (data, status) {
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
    $scope.refreshDonor = function (search) {
        $scope.donor = [];
        if (search) {
            NavigationService.findDonor(search, $scope.family.donor, function (data, status) {
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
phonecatControllers.controller('editFamilyCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Family');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editfamily.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.family = {};
    NavigationService.getOneFamily($routeParams.id, function (data, status) {
        $scope.family = data; //Add More Array
    });
    $scope.submitForm = function () {
        $scope.family._id = $routeParams.id;
        NavigationService.saveFamily($scope.family, function (data, status) {
            $location.url('/family');
        });
    };
    $scope.family.donor = [];
    $scope.ismatchDonor = function (data, select) {
        _.each(data, function (l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveDonor(item, function (data, status) {
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
    $scope.refreshDonor = function (search) {
        $scope.donor = [];
        if (search) {
            NavigationService.findDonor(search, $scope.family.donor, function (data, status) {
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
phonecatControllers.controller('CampCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
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
    $scope.pagedata.limit = '50';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function (pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedCamp($scope.pagedata, function (data, status) {
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
    $scope.confDelete = function () {
        NavigationService.deleteCamp(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function (id) {
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
phonecatControllers.controller('createCampCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Camp');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createcamp.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.camp = {};

    $scope.add = function (camp) {
        if (!camp.venues) {
            camp.venues = [{
                "value": "",
                "address": "",
                "hospital": [],
                "status": "enable"
            }];
        } else {
            camp.venues.push({
                "value": "",
                "address": "",
                "hospital": [],
                "status": "enable"
            });
        }
    };
    $scope.remove = function (i, dev) {
        dev.splice(i, 1);
    };

    $scope.submitForm = function () {
        console.log($scope.camp);
        NavigationService.saveCamp($scope.camp, function (data, status) {
            $location.url('/camp');
        });
    };

    $scope.ismatchHospital = function (data, select) {
        _.each(data, function (l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveHospital(item, function (data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                data = select.selected;
            }
        });
    }
    $scope.refreshHospital = function (search, hospitals) {
        $scope.hospital = [];
        if (search) {
            NavigationService.findHospital(search, hospitals, function (data, status) {
                if (data.value != false) {
                    $scope.hospital = data;
                }
            });
        }
    };

    //createCamp
});
//createCamp Controller
//editCamp Controller
phonecatControllers.controller('editCampCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Camp');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editcamp.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.camp = {};
    $scope.disableCampClose = 'no';
    $scope.updated = false;
    $scope.closeLogin = function (venue) {
        var obj = {};
        obj.camp = venue.value;
        obj.campnumber = $scope.camp.campnumber;
        obj.status = venue.status;
        NavigationService.closeLogin(obj, function (data) {
            if (data.value != false) {
                $scope.updated = true;
                $timeout(function () {
                    $scope.updated = false;
                }, 3000);
            }
        });
    }

    $scope.add = function (camp) {
        if (!camp.venues) {
            camp.venues = [{
                "value": "",
                "address": "",
                "hospital": []
            }];
        } else {
            camp.venues.push({
                "value": "",
                "address": "",
                "hospital": []
            });
        }
    };
    $scope.remove = function (i, dev) {
        dev.splice(i, 1);
    };
    NavigationService.getOneCamp($routeParams.id, function (data, status) {
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
    $scope.submitForm = function () {
        $scope.camp._id = $routeParams.id;
        NavigationService.saveCamp($scope.camp, function (data, status) {
            $location.url('/camp');
        });
    };

    $scope.ismatchHospital = function (data, select) {
        _.each(data, function (l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveHospital(item, function (data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                data = select.selected;
            }
        });
    }
    $scope.refreshHospital = function (search, hospitals) {
        $scope.hospital = [];
        if (search) {
            NavigationService.findHospital(search, hospitals, function (data, status) {
                if (data.value != false) {
                    $scope.hospital = data;
                }
            });
        }
    };

    //editCamp
});
phonecatControllers.controller('AdminCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
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
    $scope.pagedata.limit = '50';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function (pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedAdmin($scope.pagedata, function (data, status) {
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
    $scope.confDelete = function () {
        NavigationService.deleteAdmin(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function (id) {
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
phonecatControllers.controller('createAdminCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createadmin.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.admin = {};
    $scope.camp = [];
    $scope.showDrop = true;
    NavigationService.getCamp(function (data, status) {
        console.log(data);
        if (data.value != false) {
            $scope.camp = data;
            $scope.camp.push({
                campnumber: "All"
            });
        } else {
            $scope.camp = [];
        }
    });

    $scope.changedrop = function () {
        if ($scope.admin.accesslevel == "needblood") {
            $scope.admin.campnumber = "All";
            $scope.admin.camp = "All";
            $scope.showDrop = false;
        } else if ($scope.admin.accesslevel == "score") {
            $scope.admin.campnumber = "All";
            $scope.admin.camp = "All";
            $scope.showDrop = false;
        } else if ($scope.admin.accesslevel == "search") {
            $scope.admin.campnumber = "All";
            $scope.admin.camp = "All";
            $scope.showDrop = false;
        } else {
            $scope.showDrop = true;
        }
    }

    $scope.submitForm = function () {
        NavigationService.saveAdmin($scope.admin, function (data, status) {
            $location.url('/admin');
        });
    };

    $scope.changeVenues = function (val) {
        console.log(val);
        var foundIndex = _.findIndex($scope.camp, {
            'campnumber': val
        });
        $scope.venues = $scope.camp[foundIndex].venues;
        $scope.venues = _.uniq($scope.venues, 'value');
        $scope.venues.push({
            value: "All"
        });

    }

    //createCamp
});
//createCamp Controller
//editCamp Controller
/*$scope.template = TemplateService;
$scope.menutitle = NavigationService.makeactive('User');
TemplateService.title = $scope.menutitle;
TemplateService.submenu = '';
TemplateService.content = 'views/editadmin.html';
TemplateService.list = 2;
$scope.navigation = NavigationService.getnav();
$scope.admin = {};*/

phonecatControllers.controller('addDonorCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Add Donor');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/addDonor.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.donorData = {};
    $scope.donorData.campnumber = '';
    $scope.donorData.camp = '';
    $scope.donorData.donorid = '';
    $scope.donorData.bottle = '';
    //hospital
    $scope.donorData.hospital = '';

    $scope.addDonor = function () {
        $scope.donor.campnumber = $scope.donorData.campnumber;
        $scope.donor.camp = $scope.donorData.camp;
        $scope.donor.bottle = $scope.donorData.bottle;
        $scope.donor.hospital = $scope.donorData.hospital;
        NavigationService.saveDonorWithAckAndGift($scope.donor, function (data, status) {
            if (data.value == true && data.comment == "Bottle already exists") {
                $scope.bottleExist = 0;
            } else if (data.value == false) {
                $scope.showfail = 0;
                $scope.showSaved = false;
            } else {
                $scope.showfail = 1;
                $scope.bottleExist = 1;
                $scope.showSaved = true;
                //  $scope.openPrintView(data.id);
                $location.url('/adddonorview');
            }
        });
        console.log("inside donorData");
        console.log($scope.donor);
    }

    function getDetails() {
        NavigationService.getOneDonor($routeParams.id, function (data, status) {
            console.log(data);
            data.isWeb = true;
            // console.log("in edit donor getdetails", data);
            $scope.donor = data;
            $scope.donorData.donorid = data.donorid;
            //   $scope.calculate(); //Add More Array



            // console.log($scope.donor);
        });
    }

    getDetails();

    function generateDrop() {

        NavigationService.getCamp(function (data, status) {
            if (data.value != false) {
                $scope.camp = data;

            } else {
                $scope.camp = [];
            }
        });

    }
    generateDrop();
    $scope.changeHospitals = function (camp, venue) {
        //    / console.log(val);
        var foundIndex = _.findIndex($scope.camp, {
            'campnumber': camp
        });
        var venueIndex = _.findIndex($scope.camp[foundIndex].venues, {
            'value': venue
        });
        $scope.hospitals = $scope.camp[foundIndex].venues[venueIndex].hospital;
        $scope.hospitals = _.uniq($scope.hospitals, 'name');

    }

    $scope.changeVenues = function (val) {
        console.log(val);
        var foundIndex = _.findIndex($scope.camp, {
            'campnumber': val
        });
        console.log(foundIndex);
        $scope.venues = $scope.camp[foundIndex].venues;
        $scope.venues = _.uniq($scope.venues, 'value');

    }

});
phonecatControllers.controller('editAdminCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editadmin.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.admin = {};
    $scope.showDrop = true;

    $scope.changeVenues = function (val) {
        console.log(val);

        var foundIndex = _.findIndex($scope.camp, {
            'campnumber': val
        });
        $scope.venues = $scope.camp[foundIndex].venues;
        $scope.venues = _.uniq($scope.venues, 'value');
        $scope.venues.push({
            camp: "All"
        });
    }
    NavigationService.getOneAdmin($routeParams.id, function (data, status) {
        $scope.admin = data;
        generateDrop();
        if ($scope.admin.accesslevel == "needblood") {
            $scope.admin.campnumber = "All";
            $scope.admin.camp = "All";
            $scope.showDrop = false;
        } else if ($scope.admin.accesslevel == "score") {
            $scope.admin.campnumber = "All";
            $scope.admin.camp = "All";
            $scope.showDrop = false;
        } else if ($scope.admin.accesslevel == "search") {
            $scope.admin.campnumber = "All";
            $scope.admin.camp = "All";
            $scope.showDrop = false;
        } else {
            $scope.showDrop = true;
        }
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

    $scope.changedrop = function () {
        if ($scope.admin.accesslevel == "needblood") {
            $scope.admin.campnumber = "All";
            $scope.admin.camp = "All";
            $scope.showDrop = false;
        } else if ($scope.admin.accesslevel == "score") {
            $scope.admin.campnumber = "All";
            $scope.admin.camp = "All";
            $scope.showDrop = false;
        } else if ($scope.admin.accesslevel == "search") {
            $scope.admin.campnumber = "All";
            $scope.admin.camp = "All";
            $scope.showDrop = false;
        } else {
            $scope.showDrop = true;
        }
    }

    function generateDrop() {
        if ($scope.admin.accesslevel != 'admin') {
            NavigationService.getCamp(function (data, status) {
                if (data.value != false) {
                    $scope.camp = data;
                    $scope.camp.unshift({
                        'campnumber': 'All'
                    });

                    var foundIndex = _.findIndex($scope.camp, {
                        'campnumber': $scope.admin.campnumber
                    });

                    $scope.venues = $scope.camp[foundIndex].venues;
                    $scope.venues = _.uniq($scope.venues, 'value');
                    $scope.venues.push({
                        camp: "All"
                    });
                } else {
                    $scope.camp = [];
                }
            });
        }
    }

    $scope.submitForm = function () {
        $scope.admin._id = $routeParams.id;
        console.log("before if");
        if($scope.admin.campnumber == 'All'){
            console.log("after if");
            $scope.admin.camp = 'All';
        }
        NavigationService.saveAdmin($scope.admin, function (data, status) {
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
phonecatControllers.controller('GiftTypeCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
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
    $scope.pagedata.limit = '50';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function (pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedGiftType($scope.pagedata, function (data, status) {
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
    $scope.confDelete = function () {
        NavigationService.deleteGiftType(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function (id) {
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
phonecatControllers.controller('createGiftTypeCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('GiftType');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/creategifttype.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.gifttype = {};
    $scope.submitForm = function () {
        NavigationService.saveGiftType($scope.gifttype, function (data, status) {
            $location.url('/gifttype');
        });
    };
    //createGiftType
});
//createGiftType Controller
//editGiftType Controller
phonecatControllers.controller('editGiftTypeCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('GiftType');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editgifttype.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.gifttype = {};
    NavigationService.getOneGiftType($routeParams.id, function (data, status) {
        $scope.gifttype = data; //Add More Array
    });
    $scope.submitForm = function () {
        $scope.gifttype._id = $routeParams.id;
        NavigationService.saveGiftType($scope.gifttype, function (data, status) {
            $location.url('/gifttype');
        });
    };
    //editGiftType
});
//editGiftType Controller
//Hospital Controller
phonecatControllers.controller('HospitalCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
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
    $scope.pagedata.limit = '50';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function (pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedHospital($scope.pagedata, function (data, status) {
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
    $scope.confDelete = function () {
        NavigationService.deleteHospital(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function (id) {
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
phonecatControllers.controller('createHospitalCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Hospital');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createhospital.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.hospital = {};

    $scope.submitForm = function () {
        NavigationService.saveHospital($scope.hospital, function (data, status) {
            $location.url('/hospital');
        });
    };

    $scope.removeimage = function (i) {
        $scope.hospital.image = '';
    };

    var imagejstupld = "";
    $scope.hospital.image = '';
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function () {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function (index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function (index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function ($files) {
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
                var loadFile = function (fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
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

    $scope.start = function (index) {
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
            $scope.upload[index].then(function (response) {
                $timeout(function () {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.hospital.image = imagejstupld.files[0].fd;
                        console.log($scope.hospital.image);
                        imagejstupld = "";
                    }
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function (xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function (response) {
                    $scope.uploadResult.push(response.data);
                }, function (response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function ($event) {
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

    //createHospital
});
//createHospital Controller
//editHospital Controller
phonecatControllers.controller('editHospitalCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Hospital');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/edithospital.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.hospital = {};
    NavigationService.getOneHospital($routeParams.id, function (data, status) {
        $scope.hospital = data; //Add More Array
    });
    $scope.submitForm = function () {
        $scope.hospital._id = $routeParams.id;
        NavigationService.saveHospital($scope.hospital, function (data, status) {
            $location.url('/hospital');
        });
    };

    $scope.removeimage = function (i) {
        $scope.hospital.image = '';
    };

    var imagejstupld = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function () {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function (index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function (index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function ($files) {
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
                var loadFile = function (fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
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

    $scope.start = function (index) {
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
            $scope.upload[index].then(function (response) {
                $timeout(function () {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.hospital.image = imagejstupld.files[0].fd;
                        console.log($scope.hospital.image);
                        imagejstupld = "";
                    }
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function (xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function (response) {
                    $scope.uploadResult.push(response.data);
                }, function (response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function ($event) {
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

    //editHospital
});
//editHospital Controller
//Slider Controller
phonecatControllers.controller('SliderCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
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
    $scope.pagedata.limit = '50';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function (pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedSlider($scope.pagedata, function (data, status) {
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
    $scope.confDelete = function () {
        NavigationService.deleteSlider(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function (id) {
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
phonecatControllers.controller('createSliderCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Slider');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createslider.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.slider = {};

    $scope.removeimage = function (i) {
        $scope.slider.image.splice(i, 1);
    };

    var imagejstupld = "";
    $scope.slider.image = [];
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function () {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function (index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function (index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function ($files) {
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
                var loadFile = function (fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
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

    $scope.start = function (index) {
        $scope.progress[index] = 0;
        $scope.errorMsg = null;
        console.log($scope.howToSend = 1);
        if ($scope.howToSend == 1) {
            $scope.upload[index] = $upload.upload({
                url: uploadUrl2,
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
            $scope.upload[index].then(function (response) {
                $timeout(function () {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.slider.image.push(imagejstupld.files[0].fd);
                        console.log($scope.slider.image);
                        imagejstupld = "";
                    }
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function (xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function (response) {
                    $scope.uploadResult.push(response.data);
                }, function (response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function ($event) {
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

    $scope.submitForm = function () {
        NavigationService.saveSlider($scope.slider, function (data, status) {
            $location.url('/slider');
        });
    };
    //createSlider
});
//createSlider Controller
//editSlider Controller
phonecatControllers.controller('editSliderCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Slider');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editslider.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.slider = {};

    $scope.removeimage = function (i) {
        $scope.slider.image.splice(i, 1);
    };

    var imagejstupld = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function () {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function (index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function (index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function ($files) {
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
                var loadFile = function (fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
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

    $scope.start = function (index) {
        $scope.progress[index] = 0;
        $scope.errorMsg = null;
        console.log($scope.howToSend = 1);
        if ($scope.howToSend == 1) {
            $scope.upload[index] = $upload.upload({
                url: uploadUrl2,
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
            $scope.upload[index].then(function (response) {
                $timeout(function () {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.slider.image.push(imagejstupld.files[0].fd);
                        imagejstupld = "";
                    }
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function (xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function (response) {
                    $scope.uploadResult.push(response.data);
                }, function (response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function ($event) {
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

    NavigationService.getOneSlider($routeParams.id, function (data, status) {
        $scope.slider = data; //Add More Array
    });
    $scope.submitForm = function () {
        $scope.slider._id = $routeParams.id;
        NavigationService.saveSlider($scope.slider, function (data, status) {
            $location.url('/slider');
        });
    };
    //editSlider
});

phonecatControllers.controller('SliderAppHomeCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('sliderAppHome');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/sliderAppHome.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.sliderAppHome = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '50';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function (pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedSliderAppHome($scope.pagedata, function (data, status) {
            $scope.sliderAppHome = data;
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
    $scope.confDelete = function () {
        NavigationService.deleteSliderAppHome(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function (id) {
        $.jStorage.set('deletesliderAppHome', id);
        ngDialog.open({
            template: 'views/delete.html',
            controller: 'SliderAppHomeCtrl',
            closeByDocument: false
        });
    }
    //End SliderAppHome
});
//sliderAppHome Controller
//createSlider Controller
phonecatControllers.controller('createSliderAppHomeCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('SliderAppHome');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createsliderAppHome.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.sliderAppHome = {};

    $scope.removeimage = function (i) {
        $scope.sliderAppHome.image.splice(i, 1);
    };

    var imagejstupld = "";
    $scope.sliderAppHome.image = [];
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function () {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function (index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function (index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function ($files) {
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
                var loadFile = function (fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
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

    $scope.start = function (index) {
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
            $scope.upload[index].then(function (response) {
                $timeout(function () {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.sliderAppHome.image.push(imagejstupld.files[0].fd);
                        console.log($scope.sliderAppHome.image);
                        imagejstupld = "";
                    }
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function (xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function (response) {
                    $scope.uploadResult.push(response.data);
                }, function (response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function ($event) {
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

    $scope.submitForm = function () {
        NavigationService.saveSliderAppHome($scope.sliderAppHome, function (data, status) {
            $location.url('/sliderAppHome');
        });
    };
    //createSliderAppHome
});
//createSliderAppHome Controller
//editSliderAppHome Controller
phonecatControllers.controller('editSliderAppHomeCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('SliderAppHome');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editsliderAppHome.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.sliderAppHome = {};

    $scope.removeimage = function (i) {
        $scope.sliderAppHome.image.splice(i, 1);
    };

    var imagejstupld = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function () {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function (index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function (index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function ($files) {
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
                var loadFile = function (fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
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

    $scope.start = function (index) {
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
            $scope.upload[index].then(function (response) {
                $timeout(function () {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.sliderAppHome.image.push(imagejstupld.files[0].fd);
                        imagejstupld = "";
                    }
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function (xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function (response) {
                    $scope.uploadResult.push(response.data);
                }, function (response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function ($event) {
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

    NavigationService.getOneSliderAppHome($routeParams.id, function (data, status) {
        $scope.sliderAppHome = data; //Add More Array
    });
    $scope.submitForm = function () {
        $scope.sliderAppHome._id = $routeParams.id;
        NavigationService.saveSliderAppHome($scope.sliderAppHome, function (data, status) {
            $location.url('/sliderAppHome');
        });
    };
    //editSliderAppHome
});

phonecatControllers.controller('SponsorCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
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
    $scope.pagedata.limit = '50';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function (pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedSponsor($scope.pagedata, function (data, status) {
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
    $scope.confDelete = function () {
        NavigationService.deleteSponsor(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function (id) {
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
phonecatControllers.controller('createSponsorCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Sponsor');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createsponsor.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.sponsor = {};
    $scope.submitForm = function () {
        NavigationService.saveSponsor($scope.sponsor, function (data, status) {
            $location.url('/sponsor');
        });
    };
    //createSponsors
});
//createSponsors Controller
//editSponsors Controller
phonecatControllers.controller('editSponsorCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Sponsor');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editsponsor.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.sponsor = {};
    NavigationService.getOneSponsor($routeParams.id, function (data, status) {
        $scope.sponsor = data; //Add More Array
    });
    $scope.submitForm = function () {
        $scope.sponsor._id = $routeParams.id;
        NavigationService.saveSponsor($scope.sponsor, function (data, status) {
            $location.url('/sponsor');
        });
    };
    //editSponsors
});
phonecatControllers.controller('headerctrl', function ($scope, TemplateService, $location, $routeParams, NavigationService, ngDialog) {
    $scope.template = TemplateService;
    $scope.navigation = NavigationService.getnav();
    $scope.showaccess = $.jStorage.get("adminuser");

    $scope.bottleCount = 0;

    if (!$.jStorage.get("adminuser")) {
        $location.url("/login");
    } else {
        if ($.jStorage.get("adminuser").accesslevel == "admin") {
            _.each($scope.navigation, function (n) {
                n.visible = "yes";
            });
        } else if ($.jStorage.get("adminuser").accesslevel == "needblood") {
            _.each($scope.navigation, function (n) {
                if (n.name == "Need Blood") {
                    n.visible = "yes";
                } else {
                    n.visible = "no";
                }
            });
        } else if ($.jStorage.get("adminuser").accesslevel == "score") {
            _.each($scope.navigation, function (n) {
                if (n.name == "Score Viewer") {
                    n.visible = "yes";
                } else {
                    n.visible = "no";
                }
            });
        } else if ($.jStorage.get("adminuser").accesslevel == "search") {
            _.each($scope.navigation, function (n) {
                if (n.name == "Search Blood") {
                    n.visible = "yes";
                } else {
                    n.visible = "no";
                }
            });
        } else {
            _.each($scope.navigation, function (n) {
                if (n.name == "Donor" || n.name == "Dashboard" || n.name == "Printing Rules") {
                    n.visible = "yes";
                } else {
                    n.visible = "no";
                }
            });
        }
        NavigationService.setnav($scope.navigation);

        if ($.jStorage.get("adminuser").hospital) {
            NavigationService.getOneHospital($.jStorage.get("adminuser").hospital, function (data) {
                console.log(data);
                $scope.hospname = data.name;
            });

            NavigationService.getLastBottleNumber($.jStorage.get("adminuser").hospital, function (data) {
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
phonecatControllers.controller('findEntryCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
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
    $scope.pagedata.limit = '50';
    $scope.pagedata.camp = $scope.access.camp;
    $scope.pagedata.campnumber = $scope.access.campnumber;
    $scope.pagedata.donorid = '';
    $scope.pagedata.name = '';
    $scope.pagedata.firstname = '';
    $scope.pagedata.middlename = '';
    $scope.pagedata.lastname = '';
    $scope.pagedata.pincode = '';
    $scope.pagedata.accesslevel = $scope.access.accesslevel;
    $scope.pagedata.hospital = $scope.access.hospital;
    $scope.deleteReason = '';
    $scope.showNoResult = false;

    $scope.venues = [{
        value: 'All'
    }];

    NavigationService.findallHospital(function (data, status) {
        console.log(data);
        if (data.value != false) {
            $scope.hospitals = data;
        }
    });

    $scope.reload = function () {
        NavigationService.findEntry($scope.pagedata, function (data, status) {
            console.log(data);
            if (data.value != false) {
                $scope.showNoResult = false;
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
            } else {
                $scope.showNoResult = true;
            }
        });
    }

    $scope.reload();

    $scope.confDelete = function () {
        NavigationService.deleteDonor(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }

    $scope.confDeleteForEntry = function () {
        console.log($scope.deleteReason);
        NavigationService.deleteDonorReason($scope.deleteReason, function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }

    $scope.deletefun = function (id) {
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

    NavigationService.getCamp(function (data) {
        $scope.camps = data;
        $scope.camps.unshift({
            campnumber: 'All',
            venues: [{
                value: "All"
            }]
        });
    })

    $scope.showVenues = function () {
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

    $scope.getFilterResults = function (val) {
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

    $scope.changePage = function (pageno) {
        console.log(pageno);
        $scope.pagedata.page = pageno.pageno;
        $scope.reload();
    }

    //End Donor
});
//findEntry Controller
phonecatControllers.controller('findVerifyCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $timeout) {
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
    $scope.pagedata.limit = '50';
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

    $scope.showNoResult = false;

    NavigationService.findallHospital(function (data, status) {
        console.log(data);
        if (data.value != false) {
            $scope.hospitals = data;
        }
    });

    $scope.reload1 = function () {
        NavigationService.findVerified($scope.pagedata, function (data, status) {
            console.log(data);
            if (data.value != false) {
                $scope.showNoResult = false;
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
            } else {
                $scope.showNoResult = true;
            }
        });
    }

    $scope.reload1();

    $scope.getFilterResults1 = function (val) {
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

    $scope.changePage1 = function (pageno) {
        console.log(pageno);
        $scope.pagedata.page = pageno.pageno;
        $scope.reload1();
    }

    $scope.openverify = function (value) {
        $scope.editdonor = value;
        $scope.editdonor.verified = false;
        $scope.isValidLogin = 1;
    }
    $scope.verify = function () {
        if ($scope.editdonor.verified == true) {
            $scope.showerror = 1;
            NavigationService.acksave($scope.editdonor, function (data, status) {
                if (data.value == false && data.comment == "No data found") {
                    $scope.showerror2 = true;
                    $timeout(function () {
                        $scope.showerror2 = false;
                    }, 2500);
                    $scope.editdonor = {};
                    $scope.donor = {};
                    $scope.searchdonor = {};
                    $scope.isValidLogin = 2;
                } else {
                    $scope.showtrue = true;
                    $timeout(function () {
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

phonecatControllers.controller('findGiftCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $timeout) {
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
    $scope.pagedata.limit = '50';
    $scope.pagedata.donorid = '';
    $scope.pagedata.name = '';
    $scope.pagedata.firstname = '';
    $scope.pagedata.middlename = '';
    $scope.pagedata.lastname = '';
    $scope.pagedata.pincode = '';
    $scope.pagedata.camp = $.jStorage.get("adminuser").camp;
    $scope.pagedata.campnumber = $.jStorage.get("adminuser").campnumber;
    $scope.pagedata.accesslevel = $.jStorage.get("adminuser").accesslevel;
    // $scope.pagedata.hospital = $.jStorage.get("adminuser").hospital;

    $scope.showNoResult = false;

    NavigationService.findallHospital(function (data, status) {
        console.log(data);
        if (data.value != false) {
            $scope.hospitals = data;
        }
    });

    $scope.reload2 = function () {
        NavigationService.findGifted($scope.pagedata, function (data, status) {
            if (data.value != false) {
                $scope.showNoResult = false;
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
            } else {
                $scope.showNoResult = true;
            }
        });
    }

    $scope.reload2();

    $scope.getFilterResults2 = function (val) {
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

    $scope.changePage2 = function (pageno) {
        console.log(pageno);
        $scope.pagedata.page = pageno.pageno;
        $scope.reload2();
    }

    $scope.opengift = function (value) {
        $scope.editdonor = value;
        $scope.editdonor.giftdone = false;
        $scope.isValidLogin = 1;
    }
    $scope.gift = function () {
        if ($scope.editdonor.giftdone == true) {
            $scope.showerror = 1;
            delete $scope.editdonor.donationcount;
            NavigationService.giftsave($scope.editdonor, function (data, status) {
                if (data.value == false && data.comment == "No data found") {
                    $scope.showerror2 = true;
                    $timeout(function () {
                        $scope.showerror2 = false;
                    }, 2500);
                    $scope.editdonor = {};
                    $scope.donor = {};
                    $scope.searchdonor = {};
                    $scope.isValidLogin = 2;
                } else {
                    $scope.showtrue = true;
                    $timeout(function () {
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

phonecatControllers.controller('campReportCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Camp Report');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/campreport.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.report = {};
    var lastCamp = "";

    function populateData(data, val) {
        $scope.levelCounts = {};
        $scope.levelCounts.verify = 0;
        $scope.levelCounts.pendingV = 0;
        $scope.levelCounts.gift = 0;
        $scope.levelCounts.giftRejected = 0;
        $scope.levelCounts.rejected = 0;
        _.each(data, function (respo) {
            if (respo.verify)
                $scope.levelCounts.verify += respo.verify;
            if (respo.pendingV)
                $scope.levelCounts.pendingV += respo.pendingV;
            if (respo.gift)
                $scope.levelCounts.gift += respo.gift;
            if (respo.rejected)
                $scope.levelCounts.rejected += respo.rejected;
            if (respo.giftRejected)
                $scope.levelCounts.giftRejected += respo.giftRejected;
        });
        // console.log("$scope.levelCounts.verify = " + $scope.levelCounts.verify);
        // console.log("$scope.levelCounts.pendingV = " + $scope.levelCounts.pendingV);
        // console.log("$scope.levelCounts.gift = " + $scope.levelCounts.gift);
        // console.log("$scope.levelCounts.rejected = " + $scope.levelCounts.rejected);
        // console.log("$scope.levelCounts.giftRejected = " + $scope.levelCounts.giftRejected);
        $scope.levelCounts.entry = $scope.levelCounts.verify + $scope.levelCounts.pendingV + $scope.levelCounts.rejected;
        $scope.levelCounts.pendingG = $scope.levelCounts.verify - ($scope.levelCounts.gift + $scope.levelCounts.giftRejected);
        if (data && data[0] && data[0].hospitalname) {
            var hospitals = [];
            _.each(data, function (n) {
                if (n.verify > 0) {
                    hospitals.push(n);
                }
            })
            // $scope.hospitalCounts = _.chunk(data, 3);
            $scope.hospitalCounts = _.chunk(_.uniq(hospitals, 'hospitalname'), 3);
        } else {
            $scope.hospitalCounts = [];
        }
        if (val) {
            $scope.$apply();
        }
        lastCamp = $scope.report.camp + "_" + $scope.report.campnumber;
        console.log(lastCamp);
    }
    var callOn = function (msg) {
        console.log(msg);
        populateData(msg, "withSocket");
    }
    NavigationService.getCamp(function (data) {
        $scope.camps = data;
        $scope.report.campnumber = $scope.camps[0].campnumber;
        if ($scope.camps[0].venues) {
            $scope.venues = $scope.camps[0].venues;
        } else {
            $scope.venues = [];
        }
        $scope.venues.unshift({
            value: 'All'
        });
        $scope.report.camp = 'All';
        console.log("All_" + $scope.report.campnumber);
        io.socket.on("All_" + $scope.report.campnumber, callOn);
        getCounts();
    });

    NavigationService.countUser(function (data, status) {
        $scope.allusers = data;
    });

    $scope.changeVenues = function (val) {
        console.log(val);
        var foundIndex = _.findIndex($scope.camps, {
            'campnumber': val
        });
        $scope.venues = $scope.camps[foundIndex].venues;
        if (!$scope.venues) {
            $scope.venues = [];
        }
        console.log($scope.venues);
        $scope.venues.unshift({
            value: 'All'
        });
        $scope.venues = _.uniq($scope.venues, 'value');
        $scope.report.camp = 'All';
        getCounts();
    }

    $scope.changeCounts = function () {
        if ($scope.report.camp != "All") {
            console.log(lastCamp);
            io.socket.off(lastCamp, callOn);

            var blastName = $scope.report.camp + "_" + $scope.report.campnumber;
            console.log(blastName);
            io.socket.on(blastName, callOn);
        } else {
            console.log("in All");
            io.socket.off(lastCamp, callOn);

            var blastName = "All" + "_" + $scope.report.campnumber;
            console.log(blastName);
            io.socket.on(blastName, callOn);
        }
        getCounts();
    }

    function getCounts() {
        NavigationService.countHospital($scope.report, function (data) {
            populateData(data);
        });
    }

    $scope.getDonorLevels = function (accesslevel) {
        $location.url("/campreportusers/" + $scope.report.campnumber + "/" + $scope.report.camp + "/" + accesslevel);
    }

    $scope.getHospUsers = function (hospid) {
        $location.url("/campreporthospusers/" + $scope.report.campnumber + "/" + $scope.report.camp + "/" + hospid);
    }

});

phonecatControllers.controller('campReportUsersCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $timeout) {
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
    if($.jStorage.get('adminuser')){
    $scope.access = $.jStorage.get('adminuser');
    $scope.access.accesslevel =  $.jStorage.get('adminuser').accesslevel;
    }
    $scope.number = 100;
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '50';
    $scope.pagedata.camp = $routeParams.camp;
    $scope.pagedata.campnumber = $routeParams.campnumber;
    $scope.pagedata.accesslevel = $routeParams.accesslevel;
    $scope.pagedata.name = '';
    $scope.pagedata.firstname = '';
    $scope.pagedata.middlename = '';
    $scope.pagedata.lastname = '';
    $scope.pagedata.donorid = '';
    $scope.pagedata.pincode = '';
    $scope.hidebottleno = false;
    if ($routeParams.accesslevel == "rejected") {
        $scope.hidebottleno = true;
        $scope.showreason = true;
    } else {
        $scope.showreason = false;
    }

    $scope.reload = function () {
        NavigationService.donorLevels($scope.pagedata, function (data, status) {
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

    $scope.getFilterResults = function (val) {
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

    $scope.changePage = function (pageno) {
        console.log(pageno);
        $scope.pagedata.page = pageno.pageno;
        $scope.reload();
    }
    $scope.printReport = function () {
        NavigationService.excelDonor($scope.pagedata, function (data) {
            // console.log(data);
            if (data.value != false) {
                var mywin = window.open('', '', 'width=1000,height=600');

                mywin.document.write('<script type="text/javascript">window.onload = function() { window.print();window.close(); }</script>');
                mywin.document.write(data);
                mywin.document.close();
                // $timeout(function(){
                // mywin.document.close();
                // },30000);

            }
        })
    }
    $scope.confDelete = function () {
        
        var data = $.jStorage.get("deleteAck");
        console.log("data:",data);
        NavigationService.deleteAck(data,function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function (data) {
        console.log("inside function");
       $.jStorage.set('deleteAck', data);
        ngDialog.open({
            template: 'views/delete.html',
            closeByEscape: false,
            controller: 'campReportUsersCtrl',
            closeByDocument: false
        });
    }
    $scope.downloadExcel = function () {
        window.location.href = adminurl + "camp/excelDonor1?accesslevel=" + $scope.pagedata.accesslevel + "&camp=" + $scope.pagedata.camp + "&campnumber=" + $scope.pagedata.campnumber;
    }

    //End Donor
});
phonecatControllers.controller('campReportHospUsersCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
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
    $scope.pagedata.limit = '50';
    $scope.pagedata.camp = $routeParams.camp;
    $scope.pagedata.campnumber = $routeParams.campnumber;
    $scope.pagedata.hospital = $routeParams.hospital;
    $scope.pagedata.donorid = '';
    $scope.pagedata.name = '';
    $scope.pagedata.firstname = '';
    $scope.pagedata.middlename = '';
    $scope.pagedata.lastname = '';
    $scope.pagedata.pincode = '';

    $scope.reload = function () {
        NavigationService.hospDonors($scope.pagedata, function (data, status) {
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

    $scope.getFilterResults = function (val) {
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

    $scope.changePage = function (pageno) {
        console.log(pageno);
        $scope.pagedata.page = pageno.pageno;
        $scope.reload();
    }

    $scope.printReport = function () {
        // window.open("http://192.168.0.125:81/camp/hospitalDonor?hospital=" + $scope.pagedata.hospital + "&camp=" + $scope.pagedata.camp + "&campnumber=" + $scope.pagedata.campnumber);
        NavigationService.hospexcelDonor($scope.pagedata, function (data) {
            // console.log(data);
            if (data.value != false) {
                var mywin = window.open('', '', 'width=1000,height=600');
                mywin.document.write(data);
                mywin.document.write('<script type="text/javascript">window.onload = function() { window.print();window.close(); }</script>');
                mywin.document.close();
            }
        })
    }
    
    $scope.downloadExcel = function () {
        window.location.href = adminurl + "camp/hospitalDonor1?hospital=" + $scope.pagedata.hospital + "&camp=" + $scope.pagedata.camp + "&campnumber=" + $scope.pagedata.campnumber;
    }
    

    //End Donor
}); //Notification Controller
phonecatControllers.controller('NotificationCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Notification');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/notification.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Notification = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '50';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function (pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedNotification($scope.pagedata, function (data, status) {
            $scope.notification = data;
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
    $scope.confDelete = function () {
        NavigationService.deleteNotification(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function (id) {
       // $.jStorage.set('deletenotification', id);
        ngDialog.open({
            template: 'views/delete.html',
            closeByEscape: false,
            controller: 'NotificationCtrl',
            closeByDocument: false
        });
    }

    //End Notification
});
//notification Controller
//createNotification Controller
phonecatControllers.controller('createNotificationCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Notification');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createnotification.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.notification = {};

    $scope.removeimage = function (i) {
        $scope.notification.image = "";
    };

    var imagejstupld = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function () {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function (index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function (index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function ($files) {
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
                var loadFile = function (fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
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

    $scope.start = function (index) {
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
            $scope.upload[index].then(function (response) {
                $timeout(function () {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.notification.image = imagejstupld.files[0].fd;
                    }
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function (xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function (response) {
                    $scope.uploadResult.push(response.data);
                }, function (response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function ($event) {
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

    $scope.submitForm = function () {
        NavigationService.saveNotification($scope.notification, function (data, status) {
            $location.url('/notification');
        });
    };
    //createNotification
});
//createNotification Controller
//editNotification Controller
phonecatControllers.controller('editNotificationCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Notification');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editnotification.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.notification = {};

    $scope.removeimage = function (i) {
        $scope.notification.image = "";
    };

    var imagejstupld = "";
    $scope.notification.image = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function () {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function (index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function (index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function ($files) {
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
                var loadFile = function (fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
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

    $scope.start = function (index) {
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
            $scope.upload[index].then(function (response) {
                $timeout(function () {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.notification.image = imagejstupld.files[0].fd;
                    }
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function (xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function (response) {
                    $scope.uploadResult.push(response.data);
                }, function (response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function ($event) {
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

    NavigationService.getOneNotification($routeParams.id, function (data, status) {
        $scope.notification = data; //Add More Array
    });
    $scope.submitForm = function () {
        $scope.notification._id = $routeParams.id;
        NavigationService.editNotification($scope.notification, function (data, status) {
            $location.url('/notification');
        });
    };
    //editNotification
});
//editNotification Controller
phonecatControllers.controller('FolderCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Folder');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/folder.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.folder = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '50';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function (pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedFolder($scope.pagedata, function (data, status) {
            $scope.folder = data;
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
    $scope.confDelete = function () {
        NavigationService.deleteFolder(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function (id) {
        $.jStorage.set('deletefolder', id);
        ngDialog.open({
            template: 'views/delete.html',
            closeByEscape: false,
            controller: 'FolderCtrl',
            closeByDocument: false
        });
    }
});
//folder Controller
//createFolder Controller
phonecatControllers.controller('createFolderCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Folder');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createfolder.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.folder = {};
    $scope.folder.image = [];
    $scope.removeimage = function (i) {
        $scope.folder.image.splice(i, 1);
    };

    var imagejstupld = "";

    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function () {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function (index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function (index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function ($files) {
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
                var loadFile = function (fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
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

    $scope.start = function (index) {
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
            $scope.upload[index].then(function (response) {
                $timeout(function () {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.folder.image.push(imagejstupld.files[0].fd);
                    }
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function (xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function (response) {
                    $scope.uploadResult.push(response.data);
                }, function (response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function ($event) {
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

    $scope.submitForm = function () {
        NavigationService.saveFolder($scope.folder, function (data, status) {
            $location.url('/folder');
        });
    };
    //createSlider
});
//createFolder Controller
//editFolder Controller
phonecatControllers.controller('editFolderCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Folder');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editfolder.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.folder = {};

    $scope.removeimage = function (i) {
        $scope.folder.image.splice(i, 1);
    };

    var imagejstupld = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function () {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function (index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function (index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function ($files) {
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
                var loadFile = function (fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
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

    $scope.start = function (index) {
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
            $scope.upload[index].then(function (response) {
                $timeout(function () {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.folder.image.push(imagejstupld.files[0].fd);
                    }
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function (xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function (response) {
                    $scope.uploadResult.push(response.data);
                }, function (response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function ($event) {
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

    NavigationService.getOneFolder($routeParams.id, function (data, status) {
        $scope.folder = data; //Add More Array
    });
    $scope.submitForm = function () {
        $scope.folder._id = $routeParams.id;
        NavigationService.saveFolder($scope.folder, function (data, status) {
            $location.url('/folder');
        });
    };
    //editSlider
});
//editFolder Controller
phonecatControllers.controller('RequestCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Need Blood');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/request.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.request = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '50';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function (pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedRequest($scope.pagedata, function (data, status) {
            $scope.request = data;
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
    $scope.confDelete = function () {
        NavigationService.deleteRequest(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function (id) {
        $.jStorage.set('deleterequest', id);
        ngDialog.open({
            template: 'views/delete.html',
            controller: 'RequestCtrl',
            closeByDocument: false
        });
    }
    //End Request
});
//request Controller
//createRequest Controller
phonecatControllers.controller('editRequestCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Need Blood');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editrequest.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.request = {};

    NavigationService.getOneRequest($routeParams.id, function (data, status) {
        NavigationService.getOneDonor(data.getid, function (donor) {
            $scope.request = data;
            $scope.request.donorName = donor.name;
        })
    });
    $scope.submitForm = function () {
        $scope.request._id = $routeParams.id;
        NavigationService.saveRequest($scope.request, function (data, status) {
            $location.url('/request');
        });
    };
    //createRequest
});
phonecatControllers.controller('MergeCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Merge Donors');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/merge.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.merge = {};
    $scope.confMerge = function (mergeData) {
        ngDialog.close();
        NavigationService.mergeDonors(mergeData, function (data, status) {
            if (data.value != false) {
                ngDialog.open({
                    template: '<div><div class="row"><div class="col-md-offset-4 col-md-4"><div class="white-bg"><div class="more-text text-center"><toaster-container></toaster-container><p style="color:#FF5A60;text-transform: uppercase;">Donor Merged Successfully!</p></div></div></div></div></div>',
                    controller: 'MergeCtrl',
                    plain: true,
                    closeByDocument: false
                });
            } else {
                ngDialog.open({
                    template: '<div><div class="row"><div class="col-md-offset-4 col-md-4"><div class="white-bg"><div class="more-text text-center"><toaster-container></toaster-container><p style="color:#FF5A60;text-transform: uppercase;">' + data.comment + '</p></div></div></div></div></div>',
                    controller: 'MergeCtrl',
                    plain: true,
                    closeByDocument: false
                });
            }
            $timeout(function () {
                ngDialog.closeAll();
                window.location.reload();
            }, 2500);
        });
    }
    $scope.submitForm = function () {
        $scope.ngDialogData = $scope.merge;
        ngDialog.open({
            template: 'views/confirmMerge.html',
            controller: "MergeCtrl",
            closeByDocument: false,
            showClose: true,
            data: $scope.ngDialogData
        });
    };
    //createRequest
});
phonecatControllers.controller('DownloadCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $timeout, $upload) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Download Excel');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/download.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.download = {};
    $scope.check = {};
    $scope.countErr = false;
    $scope.countArr = [];
    $scope.campArr = [];
    $scope.donorUpdated = '';
    ///////////////////////

    $scope.removefile = function (i) {
        $scope.download.file = "";
    };
    $scope.updateDonor = function(){
        NavigationService.updateDonor(function(data){
            $scope.donorUpdated = "Updated";
        });
    } 
    //callback
    var imagejstupld = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function () {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function (index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function (index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function ($files) {
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
                var loadFile = function (fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
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

    $scope.start = function (index) {
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
            $scope.upload[index].then(function (response) {
                $timeout(function () {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.download.file = imagejstupld.files[0].fd;
                        $scope.download.name = imagejstupld.files[0].filename;
                    }
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function (xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function (response) {
                    $scope.uploadResult.push(response.data);
                }, function (response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function ($event) {
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
    $scope.donwloadAll = function () {
        window.location.href = adminurl + "donor/downloadLabel";
    }
    $scope.submitForm = function () {
        window.location.href = adminurl + "donor/excelData?file=" + $scope.download.file;
        $scope.download = {};
    }

    NavigationService.getCamp(function (data, status) {
        if (data.value != false) {
            $scope.campArr = data;
        } else {
            $scope.campArr = [];
        }
    });

    for (var i = 1; i <= 100; i++) {
        $scope.countArr.push({
            id: i,
            value: i
        });
    }
    $scope.countArr.unshift({
        id: "",
        value: "All"
    })

    $scope.check.count = "";
    $scope.check.campnumber = "";

    $scope.dataDownload = function () {
        if ($scope.check.count && $scope.check.campnumber) {
            $scope.countErr = false;
            window.location.href = adminurl + "donor/check?count=" + $scope.check.count + "&campnumber=" + $scope.check.campnumber;
        } else if ($scope.check.count) {
            window.location.href = adminurl + "donor/singleCheck?count=" + $scope.check.count;
        } else {
            $scope.countErr = true;
        }
    }
});
phonecatControllers.controller('SendSMSCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $timeout, $upload) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Send SMS');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/sendsms.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.sms = {};
    $scope.sms.type = 'All';
    $scope.sms.remaining = 160;

    $scope.sendSMS = function () {
        if ($scope.sms.type == "All") {
            NavigationService.sendSMS($scope.sms, function (data) {
                if (data.value != false) {
                    $scope.sms = {};
                    $scope.showSuccess = true;
                    $timeout(function () {
                        $scope.showSuccess = false;
                    }, 3000);
                }
            });
        } else {
            console.log($scope.sms);
            $scope.sms.pincode = $scope.sms.pincode.split(',');
            NavigationService.sendSMS($scope.sms, function (data) {
                console.log(data);
                if (data.value != false) {
                    $scope.sms = {};
                    $scope.showSuccess = true;
                    $timeout(function () {
                        $scope.showSuccess = false;
                    }, 3000);
                }
            });
        }
    }

    $scope.calcRemaining = function () {
        if ($scope.sms.message)
            $scope.sms.remaining = 160 - $scope.sms.message.length;
        else
            $scope.sms.remaining = 160;
    }

});
phonecatControllers.controller('searchBloodCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Search Blood');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/searchBlood.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Hospital = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '50';
    $scope.pagedata.search = '';
    //searchBlood
    $scope.pagedata.searchValue = '';
    $scope.number = 100;
    $scope.reload = function () {
        //console.log("inside the searchBloodCtrl");
        if ($scope.pagedata.searchValue && $scope.pagedata.bloodgrp) {
          //  console.log("inside if");
            if ($scope.pagedata.searchValue == 'pincode') {
                if ($scope.pagedata.pincode) {
                    if (typeof $scope.pagedata.pincode == "string")
                        $scope.pagedata.pincode = $scope.pagedata.pincode.split(',');
                }
            } else {
                $scope.pagedata.pincode = 'All';
            }
            NavigationService.getSearch($scope.pagedata, function (data, status) {
                if ($scope.pagedata.searchValue != 'pincode') {
                    $scope.pagedata.pincode = '';
                }
                $scope.hospital = data;
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
    }

    $scope.getSearchResults = function () {
        $scope.pagedata.page = 1;
        $scope.reload();
    }

});

phonecatControllers.controller('printingCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Printing Rules');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/printing.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
});

phonecatControllers.controller('ScoreCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Score Viewer');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/score.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.report = {};
    var lastCamp = "";

    function populateData(data, val) {
        var grouped = _.groupBy(data, 'camp');
       // console.log(grouped)
        var campwise = [];
        _.each(grouped, function (value, key) {
            var obj = {
                name: "",
                count: 0,
                ack: 0
            }
            _.each(value, function (n) {
                obj.name = n.camp;
                if (n.verify) {
                    obj.count += n.verify;
                    obj.ack += n.verify;
                }
                if (n.pendingV)
                    obj.count += n.pendingV;
                if (n.rejected)
                    obj.count += n.rejected;
            })
            campwise.push(obj);
        });
        var allObj = {
            name: "All",
            count: 0
        }
        var totalAck = 0;
        _.each(campwise, function (k) {
            if (k.count)
                allObj.count += k.count;
            if (k.ack) {
                totalAck += k.ack;
            }
        });
        $scope.totalBottles = 122893 + 1541 + totalAck;
        campwise.unshift(allObj);
        $scope.allCampCounts = campwise;
        if (val) {
            $scope.$apply();
        }
        lastCamp = $scope.report.camp + "_" + $scope.report.campnumber;
    }
    var callOn = function (msg) {
        console.log(msg);
        populateData(msg, "withSocket");
    }
    NavigationService.getCamp(function (data) {
        $scope.camps = data;
        $scope.report.campnumber = $scope.camps[0].campnumber;
        if ($scope.camps[0].venues) {
            $scope.venues = $scope.camps[0].venues;
        } else {
            $scope.venues = [];
        }
        $scope.venues.unshift({
            value: 'All'
        });
        $scope.report.camp = 'All';
        console.log("All_" + $scope.report.campnumber);
        io.socket.on("All_" + $scope.report.campnumber, callOn);
        getCounts();
    });

    NavigationService.countUser(function (data, status) {
        $scope.allusers = data;
    });

    $scope.changeVenues = function (val) {
        console.log(val);
        var foundIndex = _.findIndex($scope.camps, {
            'campnumber': val
        });
        $scope.venues = $scope.camps[foundIndex].venues;
        if (!$scope.venues) {
            $scope.venues = [];
        }
        console.log($scope.venues);
        $scope.venues.unshift({
            value: 'All'
        });
        $scope.venues = _.uniq($scope.venues, 'value');
        $scope.report.camp = 'All';
        getCounts();
    }

    $scope.changeCounts = function () {
        if ($scope.report.camp != "All") {
            console.log(lastCamp);
            io.socket.off(lastCamp, callOn);

            var blastName = $scope.report.camp + "_" + $scope.report.campnumber;
            console.log(blastName);
            io.socket.on(blastName, callOn);
        } else {
            console.log("in All");
            io.socket.off(lastCamp, callOn);

            var blastName = "All" + "_" + $scope.report.campnumber;
            console.log(blastName);
            io.socket.on(blastName, callOn);
        }
        getCounts();
    }

    function getCounts() {
        NavigationService.countHospital($scope.report, function (data) {
            populateData(data);
        });
    }

    $scope.getDonorLevels = function (accesslevel) {
        $location.url("/campreportusers/" + $scope.report.campnumber + "/" + $scope.report.camp + "/" + accesslevel);
    }

    $scope.getHospUsers = function (hospid) {
        $location.url("/campreporthospusers/" + $scope.report.campnumber + "/" + $scope.report.camp + "/" + hospid);
    }

});

// viewMobileBannerCtrl
phonecatControllers.controller('viewMobileBannerCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('MobileBanner');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/viewMobileBanner.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Camp = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '50';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function (pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedMobileBanner($scope.pagedata, function (data, status) {
            $scope.mobileBanner = data;
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
    $scope.confDelete = function () {
        NavigationService.deleteMobileBanner(function (data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }


    $scope.deletefun = function (id) {
        $.jStorage.set('deleteMobileBanner', id);
        ngDialog.open({
            template: 'views/delete.html',
            controller: 'viewMobileBannerCtrl',
            closeByDocument: false
        });
    }
    $scope.createfn = function () {
        $location.path("/createMobileBanner");
    }
});

//createMobileBanner
phonecatControllers.controller('createMobileBannerCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('MobileBanner');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createMobileBanner.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.mobileBanner = {};
    $scope.mobileBanner.image = [];
    $scope.removeimage = function (i) {
        $scope.mobileBanner.image.splice(i, 1);
    };

    var imagejstupld = "";

    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function () {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function (index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function (index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function ($files) {
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
                var loadFile = function (fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
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

    $scope.start = function (index) {
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
            $scope.upload[index].then(function (response) {
                $timeout(function () {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.mobileBanner.image.push(imagejstupld.files[0].fd);
                    }
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function (xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function (response) {
                    $scope.uploadResult.push(response.data);
                }, function (response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function ($event) {
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

    $scope.remove = function (i, dev) {
        dev.splice(i, 1);
    };

    $scope.submitForm = function () {
        NavigationService.saveMobileBanner($scope.mobileBanner, function (data, status) {
            $location.url('/mobileBanner');
        });
    };


});

//edit Mobile Banner
phonecatControllers.controller('editMobileBannerCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('MobileBanner');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editMobileBanner.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.mobileBanner = {};
    $scope.adminurl = "http://wohlig.io:81/api/upload/readFile?file="
    $scope.removeimage = function (i) {
        $scope.mobileBanner.image.splice(i, 1);
    };

    var imagejstupld = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function () {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function (index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function (index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function ($files) {
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
                var loadFile = function (fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
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

    $scope.start = function (index) {
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
            $scope.upload[index].then(function (response) {
                $timeout(function () {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.mobileBanner.image.push(imagejstupld.files[0].fd);
                    }
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function (xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function (response) {
                    $scope.uploadResult.push(response.data);
                }, function (response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function ($event) {
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

    NavigationService.getOneMobileBanner($routeParams.id, function (data, status) {
        $scope.mobileBanner = data; //Add More Array
    });


    $scope.remove = function (i, dev) {
        dev.splice(i, 1);
    };
    NavigationService.getOneMobileBanner($routeParams.id, function (data, status) {
        $scope.mobileBanner = data;
        // $scope.mobileBanner.date = new Date($scope.mobileBanner.date);
        // $scope.donationRequest.fullname = $scope.donationRequest.fullname;
        // $scope.MobileBanner.status = $scope.donationRequest.status;
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
    $scope.download = function () {

    };
    $scope.submitForm = function () {
        $scope.mobileBanner._id = $routeParams.id;
        NavigationService.saveMobileBanner($scope.mobileBanner, function (data, status) {
            $location.url('/mobileBanner');
        });
    };

});

// ViewDonationRequest
phonecatControllers.controller('viewDonationRequestCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('DonationRequest');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/viewDonationRequest.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Camp = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '50';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function (pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedDonationRequest($scope.pagedata, function (data, status) {
            console.log("******in Donation Request data", data, "status", status)
            $scope.donationRequest = data;
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
    $scope.confDelete = function () {
        NavigationService.deleteDonationRequest(function (data, status) {
            console.log("in delete user", data)
            ngDialog.close();
            window.location.reload();
        });
    }

    // $scope.reload($scope.pagedata);
    // $scope.confDelete = function () {
    //     NavigationService.deleteDonationRequest(function (data, status) {
    //         console.log("inconfDelete", data)
    //         ngDialog.close();
    //         window.location.reload();
    //     });
    // }

    $scope.deletefun = function (id) {
        console.log("in deleteFun donationrequest", id)
        $.jStorage.set('deleteDonationRequest', id);
        ngDialog.open({
            template: 'views/delete.html',
            controller: 'viewDonationRequestCtrl',
            closeByDocument: false
        });
    }
    $scope.createfn = function () {
        $location.path("/createDonationRequest");
    }
});

//createDonationRequest
phonecatControllers.controller('createDonationRequestCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('DonationRequest');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createDonationRequest.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.donationRequest = {};


    $scope.remove = function (i, dev) {
        dev.splice(i, 1);
    };
    var imagejstupld = "";
    $scope.donationRequest.image = [];
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function () {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function (index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function (index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function ($files) {
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
                var loadFile = function (fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
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

    $scope.start = function (index) {
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
            $scope.upload[index].then(function (response) {
                $timeout(function () {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.donationRequest.image.push(imagejstupld.files[0].fd);
                        console.log($scope.donationRequest.image);
                        imagejstupld = "";
                    }
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function (xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function (response) {
                    $scope.uploadResult.push(response.data);
                }, function (response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function ($event) {
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

    $scope.submitForm = function () {
        console.log($scope.donationRequest);
        NavigationService.saveDonationRequest($scope.donationRequest, function (data, status) {
            $location.url('/donationRequest');
        });
    };


});

//editDonationRequest
phonecatControllers.controller('editDonationRequestCtrl', function ($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $http) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('DonationRequest');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editDonationRequest.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.donationRequest = {};

    $scope.remove = function (i, dev) {
        dev.splice(i, 1);
    };

    var imagejstupld = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function () {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function (index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function (index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function ($files) {
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
                var loadFile = function (fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
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

    $scope.start = function (index) {
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
            $scope.upload[index].then(function (response) {
                $timeout(function () {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.donationRequest.image.push(imagejstupld.files[0].fd);
                        imagejstupld = "";
                    }
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function (xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function (response) {
                    $scope.uploadResult.push(response.data);
                }, function (response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function ($event) {
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

    $scope.imageDownload = function (data) {
        console.log("hello", data);
        $scope.imageName = data
        $http({
            method: 'GET',
            url: adminurl + "uploadfile/resize?file=" + data,
            // name: $scope.drafterInstSheet.fileName,
            responseType: 'arraybuffer'
        }).success(function (data, status, headers) {
            // console.log("hello@@@@@", data);
            headers = headers();

            var filename = $scope.imageName;
            var contentType = headers['content-type'];

            var linkElement = document.createElement('a');
            try {
                var blob = new Blob([data], {
                    type: contentType
                });
                var url = window.URL.createObjectURL(blob);

                linkElement.setAttribute('href', url);
                linkElement.setAttribute("download", filename);

                var clickEvent = new MouseEvent("click", {
                    "view": window,
                    "bubbles": true,
                    "cancelable": false
                });
                linkElement.dispatchEvent(clickEvent);
            } catch (ex) {
                console.log(ex);
            }
        }).error(function (data) {
            console.log(data);
        });
    };

    NavigationService.getOneDonationRequest($routeParams.id, function (data, status) {
        console.log("&&&in edit DonationRequest", data, "status", status)
        $scope.donationRequest = data;
        $scope.donationRequest.date = new Date($scope.donationRequest.date);
        // $scope.donationRequest.fullname = $scope.donationRequest.fullname;
        $scope.donationRequest.status = $scope.donationRequest.status;
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
    NavigationService.getOneDonationRequest($routeParams.id, function (data, status) {


    });
    $scope.submitForm = function () {
        $scope.donationRequest._id = $routeParams.id;
        NavigationService.saveDonationRequest($scope.donationRequest, function (data, status) {
            $location.url('/donationRequest');
        });
    };

});

///////////////////////
//Add New Controller
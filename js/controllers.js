var uploadres = [];
var selectedData = [];
var abc = {};
var dummylogin = [{
    email: "sadmin@wohlig.com",
    password: "wohlig123",
    accesslevel: "admin",
    camp: "all"
}, {
    email: "verify@wohlig.com",
    password: "wohlig123",
    accesslevel: "verify",
    camp: "58"
}, {
    email: "entry@wohlig.com",
    password: "wohlig123",
    accesslevel: "entry",
    camp: "58"
}, {
    email: "gift@wohlig.com",
    password: "wohlig123",
    accesslevel: "gift",
    camp: "58"
}];

var phonecatControllers = angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ngDialog', 'angularFileUpload', 'ui.select', 'ngSanitize']);
window.uploadUrl = 'http://localhost:1337/user/uploadfile';
phonecatControllers.controller('home', function($scope, TemplateService, NavigationService, $routeParams, $location) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Dashboard");
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = "";
    TemplateService.content = "views/dashboard.html";
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    NavigationService.countUser($.jStorage.get("adminuser"), function(data, status) {
        $scope.user = data;
    });
});
phonecatControllers.controller('login', function($scope, TemplateService, NavigationService, $routeParams, $location) {
    $scope.template = TemplateService;
    TemplateService.content = "views/login.html";
    TemplateService.list = 3;

    $scope.navigation = NavigationService.getnav();
    $.jStorage.flush();
    $scope.isValidLogin = 1;
    $scope.login = {};
    $scope.changedrop = function() {
        if ($scope.login.accesslevel == "admin") {
            $scope.login.camp = "all";
            document.getElementById("mydrop").disabled = true;
        } else {
            $scope.login.camp = "";
            document.getElementById("mydrop").disabled = false;
        }
    }
    $scope.verifylogin = function() {
        if ($scope.login.email && $scope.login.password && $scope.login.accesslevel && $scope.login.camp && $scope.login.email != "" && $scope.login.password != "" && $scope.login.accesslevel != "" && $scope.login.camp != "") {
            // if ($scope.login.camp == "all") {
            //     delete $scope.login.camp;
            // }

            //remove

            _.each(dummylogin, function(m) {
                if (m.email == $scope.login.email && m.password == $scope.login.password && m.camp == $scope.login.camp) {
                    $scope.isValidLogin = 1;
                    $.jStorage.set("adminuser", m);
                    if (m.accesslevel == "admin") {
                        _.each($scope.navigation, function(n) {
                            n.visible = "yes";
                        });
                    } else {
                        _.each($scope.navigation, function(n) {
                            if (n.name == "Donor") {
                                n.visible = "yes";
                            } else {
                                n.visible = "no";
                            }
                        });
                    }
                    NavigationService.setnav($scope.navigation);
                    $location.url("/home");
                } else {
                    $scope.isValidLogin = 0;
                }
            })

            //remove

            // NavigationService.adminLogin($scope.login, function(data, status) {
            //     if (data.value == false) {
            //         $scope.login = {};
            //         $scope.isValidLogin = 0;
            //         document.getElementById("mydrop").disabled = false;
            //     } else {
            //         $scope.isValidLogin = 1;
            //         $.jStorage.set("adminuser", data);
            //         if (data.accesslevel == "admin") {
            //             _.each($scope.navigation, function(n) {
            //                 n.visible = "yes";
            //             });
            //         } else {
            //             _.each($scope.navigation, function(n) {
            //                 if (n.name == "Donor") {
            //                     n.visible = "yes";
            //                 } else {
            //                     n.visible = "no";
            //                 }
            //             });
            //         }
            //         NavigationService.setnav($scope.navigation);
            //         $location.url("/home");
            //     }
            // });
        } else {
            $scope.login = {};
            document.getElementById("mydrop").disabled = false;
            console.log("blank login");
            $scope.isValidLogin = 0;
        }

    }
});
phonecatControllers.controller('headerctrl', function($scope, TemplateService, $location, $routeParams, NavigationService) {
    $scope.template = TemplateService;
    $scope.navigation = NavigationService.getnav();
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
    }
});

phonecatControllers.controller('createorder', function($scope, TemplateService, NavigationService, ngDialog, $routeParams, $location) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Orders");
    TemplateService.title = $scope.menutitle;
    TemplateService.list = 2;
    TemplateService.content = "views/createorder.html";
    $scope.navigation = NavigationService.getnav();
    console.log($routeParams.id);

    $scope.order = {};

    $scope.submitForm = function() {
        console.log($scope.order);
        NavigationService.saveOrder($scope.order, function(data, status) {
            console.log(data);
            $location.url("/order");
        });
    };


    $scope.order.tag = [];
    $scope.ismatch = function(data, select) {
        abc.select = select;
        _.each(data, function(n, key) {
            if (typeof n == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(n),
                    category: $scope.artwork.type
                };
                NavigationService.saveTag(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, n);
                select.selected.push(item);
                $scope.order.tag = select.selected;
            }
        });
        console.log($scope.artwork.tag);
    }


    $scope.refreshOrder = function(search) {
        $scope.tag = [];
        if (search) {
            NavigationService.findArtMedium(search, $scope.order.tag, function(data, status) {
                $scope.tag = data;
            });
        }
    };

    $scope.GalleryStructure = [{
        "name": "name",
        "type": "text",
        "validation": [
            "required",
            "minlength",
            "min=5"
        ]
    }, {
        "name": "image",
        "type": "image"
    }, {
        "name": "name",
        "type": "text",
        "validation": [
            "required",
            "minlength",
            "min=5"
        ]
    }];

    $scope.persons = [{
        "id": 1,
        "name": "first option"
    }, {
        "id": 2,
        "name": "first option"
    }, {
        "id": 3,
        "name": "first option"
    }, {
        "id": 4,
        "name": "first option"
    }, {
        "id": 5,
        "name": "first option"
    }];

    NavigationService.getUser(function(data, status) {
        $scope.persons = data;
    });

});




//Donor Controller
phonecatControllers.controller('DonorCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
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
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.access = $.jStorage.get('adminuser').accesslevel;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedDonor($scope.pagedata, function(data, status) {
            $scope.donor = data;
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
        NavigationService.deleteDonor(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletedonor', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'DonorCtrl',
                closeByDocument: false
            });
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
    $scope.submitForm = function() {
        NavigationService.saveDonor($scope.donor, function(data, status) {
            $location.url('/donor');
        });
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
    $scope.donor = {};
    // NavigationService.getOneDonor($routeParams.id, function(data, status) {
    //     $scope.donor = data; //Add More Array
    // });
    // $scope.submitForm = function() {
    //     $scope.donor._id = $routeParams.id;
    //     NavigationService.saveDonor($scope.donor, function(data, status) {
    //         $location.url('/donor');
    //     });
    // };
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
    //editDonor
});
phonecatControllers.controller('oldDonorCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Donor');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/olddonor.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.donor = {};
    $scope.getid = "";
    $scope.access = $.jStorage.get('adminuser').accesslevel;
    $scope.isValidLogin = 1;
    if ($scope.access == "admin" || $scope.access == "entry") {
        $scope.submitForm = function() {
            $location.url('/editdonor/1');
            NavigationService.getDonorbyid($scope.donor, function(data, status) {
                if (!data.value) {
                    $location.url('/editdonor/' + data._id);
                } else {
                    // $scope.donor = {};
                    // $scope.isValidLogin = 0;
                    $location.url('/editdonor/' + data._id);
                }
            });
        };
    } else if ($scope.access == "verify") {
        $scope.submitForm = function() {
            $scope.isValidLogin = 0;
            NavigationService.getDonorbyid($scope.donor, function(data, status) {
                if (!data.value) {
                    // $scope.donor = data;
                    // $scope.getid = data._id;
                    $scope.isValidLogin = 0;
                } else {
                    $scope.donor = {};
                    $scope.isValidLogin = 0;
                }
            });
        }
        $scope.verify = function() {
            if ($scope.donor.verified == "yes") {
                $scope.donor._id = $scope.getid;
                NavigationService.saveDonor($scope.donor, function(data, status) {
                    $location.url('/donor');
                });
            } else {

            }
        };
    } else {
        $scope.submitForm = function() {
            $scope.isValidLogin = 0;
            NavigationService.getDonorbyid($scope.donor, function(data, status) {
                if (!data.value) {
                    // $scope.donor = data;
                    // $scope.getid = data._id;
                    $scope.isValidLogin = 0;
                } else {
                    $scope.donor = {};
                    $scope.isValidLogin = 0;
                }
            });
        }
        $scope.gift = function() {
            if ($scope.donor.giftdone == "yes") {
                delete $scope.donor.donationcount;
                $scope.donor._id = $scope.getid;
                NavigationService.saveDonor($scope.donor, function(data, status) {
                    $location.url('/donor');
                });
            } else {

            }
        };
    }
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
                closeByEscape: false,
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
                closeByEscape: false,
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
    $scope.submitForm = function() {
        NavigationService.saveCamp($scope.camp, function(data, status) {
            $location.url('/camp');
        });
    };
    $scope.camp.donation = [];
    $scope.DonationStructure = [{
        "name": "user",
        "type": "text"
    }, {
        "name": "timestamp",
        "type": "text"
    }, {
        "name": "Bottleid",
        "type": "text"
    }];
    NavigationService.getSponsor(function(data, status) {
        $scope.sponsor = data;
    });
    $scope.camp.gift = [];
    $scope.GiftStructure = [{
        "name": "User",
        "type": "text"
    }, {
        "name": "Type",
        "type": "text"
    }];
    $scope.camp.bottle = [];
    $scope.BottleStructure = [{
        "name": "Status",
        "type": "text"
    }, {
        "name": "user",
        "type": "text"
    }, {
        "name": "hospital",
        "type": "text"
    }];
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
    NavigationService.getOneCamp($routeParams.id, function(data, status) {
        $scope.camp = data;
        if (!$scope.camp.donation) {
            $scope.camp.donation = [];
        }
        if (!$scope.camp.gift) {
            $scope.camp.gift = [];
        }
        if (!$scope.camp.bottle) {
            $scope.camp.bottle = [];
        } //Add More Array
    });
    $scope.submitForm = function() {
        $scope.camp._id = $routeParams.id;
        NavigationService.saveCamp($scope.camp, function(data, status) {
            $location.url('/camp');
        });
    };
    $scope.DonationStructure = [{
        "name": "user",
        "type": "text"
    }, {
        "name": "timestamp",
        "type": "text"
    }, {
        "name": "Bottleid",
        "type": "text"
    }];
    NavigationService.getSponsor(function(data, status) {
        $scope.sponsor = data;
    });
    $scope.GiftStructure = [{
        "name": "User",
        "type": "text"
    }, {
        "name": "Type",
        "type": "text"
    }];
    $scope.BottleStructure = [{
        "name": "Status",
        "type": "text"
    }, {
        "name": "user",
        "type": "text"
    }, {
        "name": "hospital",
        "type": "text"
    }];
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
                closeByEscape: false,
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
                closeByEscape: false,
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
//Add New Controller

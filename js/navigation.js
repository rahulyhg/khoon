// var adminurl = "http://localhost:1337/";
var adminurl = "http://192.168.0.119:1337/";
var adminlogin = {
    "username": "admin@admin.com",
    "password": "admin123"
};
var navigationservice = angular.module('navigationservice', [])

.factory('NavigationService', function($http) {
    var navigation = [{
            name: "Dashboard",
            classis: "active",
            link: "#/home",
            subnav: [],
            visible: "yes"
        }, {
            name: 'Donor',
            active: '',
            link: '#/donor',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Camp',
            active: '',
            link: '#/camp',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Admin',
            active: '',
            link: '#/admin',
            subnav: [],
            visible: "yes"
        },
        //  {
        //     name: 'GiftType',
        //     active: '',
        //     link: '#/gifttype',
        //     subnav: [],
        //     visible: "yes"
        // },
        {
            name: 'Hospital',
            active: '',
            link: '#/hospital',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Sponsor',
            active: '',
            link: '#/sponsor',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Slider',
            active: '',
            link: '#/slider',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Emergency Donation',
            active: '',
            link: '#/home',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Need Blood',
            active: '',
            link: '#/home',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Activity',
            active: '',
            link: '#/home',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Notification',
            active: '',
            link: '#/home',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Request',
            active: '',
            link: '#/home',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Online Donation',
            active: '',
            link: '#/home',
            subnav: [],
            visible: "yes"
        }, //Add New Left
    ];

    return {
        makeactive: function(menuname) {
            for (var i = 0; i < navigation.length; i++) {
                if (navigation[i].name == menuname) {
                    navigation[i].classis = "active";
                } else {
                    navigation[i].classis = "";
                }
            }
            return menuname;
        },
        getnav: function() {
            return navigation;
        },
        setnav: function(nav) {
            navigation = nav;
        },
        adminLogin: function(data, callback) {
            $http({
                url: adminurl + "admin/adminlogin",
                method: "POST",
                data: data
            }).success(callback);
        },
        countUser: function(data, callback) {
            $http({
                url: adminurl + "donor/countdonor",
                method: "POST",
                data: data
            }).success(callback);
        },
        getOneDonor: function(id, callback) {
            $http({
                url: adminurl + 'donor/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        getDonorbyid: function(data, callback) {
            $http({
                url: adminurl + 'donor/findbyid',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getBlood: function(callback) {
            $http({
                url: adminurl + 'blood/find',
                method: 'POST'
            }).success(callback);
        },
        getverified: function(data, callback) {
            $http({
                url: adminurl + 'donor/getverified',
                method: 'POST',
                data: data
            }).success(callback);
        },
        acksave: function(data, callback) {
            $http({
                url: adminurl + 'donor/acksave',
                method: 'POST',
                data: data
            }).success(callback);
        },
        giftsave: function(data, callback) {
            $http({
                url: adminurl + 'donor/giftsave',
                method: 'POST',
                data: data
            }).success(callback);
        },
        findLimitedDonor: function(donor, callback) {
            $http({
                url: adminurl + 'donor/findlimited',
                method: 'POST',
                data: {
                    'donorid': donor.donorid,
                    'campnumber': donor.campnumber,
                    'camp': donor.camp,
                    'name': donor.name,
                    'firstname': donor.firstname,
                    'middlename': donor.middlename,
                    'lastname': donor.lastname,
                    'search': donor.search,
                    'pagesize': parseInt(donor.limit),
                    'pagenumber': parseInt(donor.page)
                }
            }).success(callback);
        },
        deleteDonor: function(callback) {
            $http({
                url: adminurl + 'donor/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletedonor')
                }
            }).success(callback);
        },
        saveDonor: function(data, callback) {
            $http({
                url: adminurl + 'donor/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        saveVillage: function(data, callback) {
            $http({
                url: adminurl + 'village/save',
                method: 'POST',
                data: {
                    'name': data.name
                }
            }).success(callback);
        },
        findVillage: function(data, village, callback) {
            $http({
                url: adminurl + 'village/find',
                method: 'POST',
                data: {
                    search: data,
                    village: village
                }
            }).success(callback);
        },
        getOneFamily: function(id, callback) {
            $http({
                url: adminurl + 'family/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedFamily: function(family, callback) {
            $http({
                url: adminurl + 'family/findlimited',
                method: 'POST',
                data: {
                    'search': family.search,
                    'pagesize': parseInt(family.limit),
                    'pagenumber': parseInt(family.page)
                }
            }).success(callback);
        },
        deleteFamily: function(callback) {
            $http({
                url: adminurl + 'family/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletefamily')
                }
            }).success(callback);
        },
        saveFamily: function(data, callback) {
            $http({
                url: adminurl + 'family/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getOneCamp: function(id, callback) {
            $http({
                url: adminurl + 'camp/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        getCamp: function(callback) {
            $http({
                url: adminurl + 'camp/find',
                method: 'POST'
            }).success(callback);
        },
        findLimitedCamp: function(camp, callback) {
            $http({
                url: adminurl + 'camp/findlimited',
                method: 'POST',
                data: {
                    'search': camp.search,
                    'pagesize': parseInt(camp.limit),
                    'pagenumber': parseInt(camp.page)
                }
            }).success(callback);
        },
        deleteCamp: function(callback) {
            $http({
                url: adminurl + 'camp/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletecamp')
                }
            }).success(callback);
        },
        saveCamp: function(data, callback) {
            $http({
                url: adminurl + 'camp/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getOneAdmin: function(id, callback) {
            $http({
                url: adminurl + 'admin/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedAdmin: function(admin, callback) {
            $http({
                url: adminurl + 'admin/findlimited',
                method: 'POST',
                data: {
                    'search': admin.search,
                    'pagesize': parseInt(admin.limit),
                    'pagenumber': parseInt(admin.page)
                }
            }).success(callback);
        },
        deleteAdmin: function(callback) {
            $http({
                url: adminurl + 'admin/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deleteadmin')
                }
            }).success(callback);
        },
        saveAdmin: function(data, callback) {
            $http({
                url: adminurl + 'admin/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getOneGiftType: function(id, callback) {
            $http({
                url: adminurl + 'gifttype/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedGiftType: function(gifttype, callback) {
            $http({
                url: adminurl + 'gifttype/findlimited',
                method: 'POST',
                data: {
                    'search': gifttype.search,
                    'pagesize': parseInt(gifttype.limit),
                    'pagenumber': parseInt(gifttype.page)
                }
            }).success(callback);
        },
        deleteGiftType: function(callback) {
            $http({
                url: adminurl + 'gifttype/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletegifttype')
                }
            }).success(callback);
        },
        saveGiftType: function(data, callback) {
            $http({
                url: adminurl + 'gifttype/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getOneHospital: function(id, callback) {
            $http({
                url: adminurl + 'hospital/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedHospital: function(hospital, callback) {
            $http({
                url: adminurl + 'hospital/findlimited',
                method: 'POST',
                data: {
                    'search': hospital.search,
                    'pagesize': parseInt(hospital.limit),
                    'pagenumber': parseInt(hospital.page)
                }
            }).success(callback);
        },
        deleteHospital: function(callback) {
            $http({
                url: adminurl + 'hospital/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletehospital')
                }
            }).success(callback);
        },
        saveHospital: function(data, callback) {
            $http({
                url: adminurl + 'hospital/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        findallHospital: function(callback) {
            $http({
                url: adminurl + 'hospital/find',
                method: 'POST'
            }).success(callback);
        },
        getOneSponsor: function(id, callback) {
            $http({
                url: adminurl + 'sponsor/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedSponsor: function(sponsors, callback) {
            $http({
                url: adminurl + 'sponsor/findlimited',
                method: 'POST',
                data: {
                    'search': sponsors.search,
                    'pagesize': parseInt(sponsors.limit),
                    'pagenumber': parseInt(sponsors.page)
                }
            }).success(callback);
        },
        deleteSponsor: function(callback) {
            $http({
                url: adminurl + 'sponsor/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletesponsor')
                }
            }).success(callback);
        },
        saveSponsor: function(data, callback) {
            $http({
                url: adminurl + 'sponsor/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getOneSlider: function(id, callback) {
            $http({
                url: adminurl + 'slider/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedSlider: function(slider, callback) {
            $http({
                url: adminurl + 'slider/findlimited',
                method: 'POST',
                data: {
                    'search': slider.search,
                    'pagesize': parseInt(slider.limit),
                    'pagenumber': parseInt(slider.page)
                }
            }).success(callback);
        },
        deleteSlider: function(callback) {
            $http({
                url: adminurl + 'slider/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deleteslider')
                }
            }).success(callback);
        },
        saveSlider: function(data, callback) {
            $http({
                url: adminurl + 'slider/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getLastBottleNumber: function(hospitalId, callback) {
            $http({
                url: adminurl + 'donor/lastbottlenumber',
                method: 'POST',
                data: {
                    "hospital": hospitalId,
                    "camp": $.jStorage.get("adminuser").camp,
                    "campnumber": $.jStorage.get("adminuser").campnumber
                }
            }).success(callback);
        },
        setUser: function(data) {
            $.jStorage.set("user", data);
        },
        getUser: function() {
            $.jStorage.get("user");
        }, //Add New Service

    }
})

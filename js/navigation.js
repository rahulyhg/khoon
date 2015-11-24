var adminurl = "http://192.168.0.121:1337/";
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
        },
         {
            name: 'Family',
            active: '',
            link: '#/family',
            subnav: [],
            visible: "yes"
        },
         {
            name: 'Camp',
            active: '',
            link: '#/camp',
            subnav: [],
            visible: "yes"
        }, {
            name: 'GiftType',
            active: '',
            link: '#/gifttype',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Hospital',
            active: '',
            link: '#/hospital',
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
        setUser: function(data) {
            $.jStorage.set("user", data);
        },
        getUser: function() {
            $.jStorage.get("user");
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
                data: {
                    'donorid': data.search
                }
            }).success(callback);
        },
        findLimitedDonor: function(donor, callback) {
            $http({
                url: adminurl + 'donor/findlimited',
                method: 'POST',
                data: {
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
        saveDonor: function(data, callback) {
            $http({
                url: adminurl + 'donor/save',
                method: 'POST',
                data: {
                    'name': data.name
                }
            }).success(callback);
        },
        findDonor: function(data, donor, callback) {
            $http({
                url: adminurl + 'donor/find',
                method: 'POST',
                data: {
                    search: data,
                    donor: donor
                }
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
        getSponsor: function(callback) {
            $http({
                url: adminurl + 'sponsor/find',
                method: 'POST',
                data: {}
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
        }, //Add New Service

    }
})

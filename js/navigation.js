var adminurl = "http://api.thetmm.org/";
// var adminurl = "http://localhost:1337/"
// var adminurl = "http://192.168.1.131:90/";
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
            name: 'User',
            active: '',
            link: '#/admin',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Hospital',
            active: '',
            link: '#/hospital',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Camp Report',
            active: '',
            link: '#/campreport',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Slider',
            active: '',
            link: '#/slider',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Folder',
            active: '',
            link: '#/folder',
            subnav: []
        }, {
            name: 'Sponsor',
            active: '',
            link: '#/sponsor',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Merge Donors',
            active: '',
            link: '#/merge',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Download Labels',
            active: '',
            link: '#/download',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Send SMS',
            active: '',
            link: '#/sendsms',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Notification',
            active: '',
            link: '#/notification',
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
            link: '#/request',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Activity',
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
        }, {
            name: 'Search Blood',
            active: '',
            link: '#/searchBlood',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Printing Rules',
            active: '',
            link: '#/printing',
            subnav: [],
            visible: "yes"
        }, {
            name: 'Score Viewer',
            active: '',
            link: '#/score',
            subnav: [],
            visible: "no"
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
        countUser: function(callback) {
            $http({
                url: adminurl + "donor/countdonor",
                method: "POST"
            }).success(callback);
        },
        countEntry: function(data, callback) {
            $http({
                url: adminurl + "donor/countentry",
                method: "POST",
                data: data
            }).success(callback);
        },
        countVerified: function(data, callback) {
            $http({
                url: adminurl + "donor/countverified",
                method: "POST",
                data: data
            }).success(callback);
        },
        countGifted: function(data, callback) {
            $http({
                url: adminurl + "donor/countgifted",
                method: "POST",
                data: data
            }).success(callback);
        },
        countHospital: function(data, callback) {
            $http({
                url: adminurl + "table/findCount",
                method: "POST",
                data: data
            }).success(callback);
        },
        countDeleted: function(data, callback) {
            $http({
                url: adminurl + "donor/countdeleted",
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
        getBlood: function(data, callback) {
            $http({
                url: adminurl + 'blood/find',
                method: 'POST',
                data: {
                    _id: data
                }
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
            delete data.hospital;
            $http({
                url: adminurl + 'donor/acksave',
                method: 'POST',
                data: data
            }).success(callback);
        },
        giftsave: function(data, callback) {
            delete data.hospital;
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
                    'pincode': donor.pincode,
                    'pagesize': parseInt(donor.limit),
                    'pagenumber': parseInt(donor.page),
                    'accesslevel': donor.accesslevel
                }
            }).success(callback);
        },
        deleteDonor: function(callback) {
            $http({
                url: adminurl + 'donor/deleteDonor',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletedonor')
                }
            }).success(callback);
        },
        deleteDonorReason: function(reason, callback) {
            $http({
                url: adminurl + 'donor/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletedonor'),
                    'deletereason': reason,
                    'campnumber': $.jStorage.get('adminuser').campnumber
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
        saveappDonor: function(data, callback) {
            $http({
                url: adminurl + 'donor/saveforapp',
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
                ignoreLoadingBar: true,
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
        findHospital: function(data, hospital, callback) {
            $http({
                url: adminurl + 'hospital/findForCamp',
                method: 'POST',
                ignoreLoadingBar: true,
                data: {
                    search: data,
                    hospital: hospital
                }
            }).success(callback);
        },
        findCampHospital: function(campnumber, camp, callback) {
            $http({
                url: adminurl + 'camp/findCampHospital',
                method: 'POST',
                ignoreLoadingBar: true,
                data: {
                    camp: camp,
                    campnumber: campnumber
                }
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
        findEntry: function(donor, callback) {
            $http({
                url: adminurl + 'donor/findEntry',
                method: 'POST',
                data: {
                    'donorid': donor.donorid,
                    'campnumber': donor.campnumber,
                    'camp': donor.camp,
                    'name': donor.name,
                    'firstname': donor.firstname,
                    'middlename': donor.middlename,
                    'lastname': donor.lastname,
                    'pincode': donor.pincode,
                    'pagesize': parseInt(donor.limit),
                    'pagenumber': parseInt(donor.page),
                    'accesslevel': donor.accesslevel,
                    "hospital": donor.hospital
                }
            }).success(callback);
        },
        findVerified: function(donor, callback) {
            $http({
                url: adminurl + 'donor/findVerified',
                method: 'POST',
                data: {
                    'donorid': donor.donorid,
                    'campnumber': donor.campnumber,
                    'camp': donor.camp,
                    'name': donor.name,
                    'firstname': donor.firstname,
                    'middlename': donor.middlename,
                    'lastname': donor.lastname,
                    'pincode': donor.pincode,
                    'pagesize': parseInt(donor.limit),
                    'pagenumber': parseInt(donor.page),
                    'accesslevel': donor.accesslevel,
                    "hospital": donor.hospital
                }
            }).success(callback);
        },
        findGifted: function(donor, callback) {
            $http({
                url: adminurl + 'donor/findGifted',
                method: 'POST',
                data: {
                    'donorid': donor.donorid,
                    'campnumber': donor.campnumber,
                    'camp': donor.camp,
                    'name': donor.name,
                    'firstname': donor.firstname,
                    'middlename': donor.middlename,
                    'lastname': donor.lastname,
                    'pincode': donor.pincode,
                    'pagesize': parseInt(donor.limit),
                    'pagenumber': parseInt(donor.page),
                    'accesslevel': donor.accesslevel,
                }
            }).success(callback);
        },
        countLevels: function(data, callback) {
            $http({
                url: adminurl + 'camp/countlevels',
                method: 'POST',
                data: data
            }).success(callback);
        },
        donorLevels: function(data, callback) {
            $http({
                url: adminurl + 'camp/donorlevels',
                method: 'POST',
                data: {
                    'donorid': data.donorid,
                    'campnumber': data.campnumber,
                    'camp': data.camp,
                    'name': data.name,
                    'firstname': data.firstname,
                    'middlename': data.middlename,
                    'lastname': data.lastname,
                    'pincode': data.pincode,
                    'pagesize': parseInt(data.limit),
                    'pagenumber': parseInt(data.page),
                    'accesslevel': data.accesslevel
                }
            }).success(callback);
        },
        hospDonors: function(data, callback) {
            $http({
                url: adminurl + 'camp/hospDonors',
                method: 'POST',
                data: {
                    'campnumber': data.campnumber,
                    'camp': data.camp,
                    'name': data.name,
                    'firstname': data.firstname,
                    'middlename': data.middlename,
                    'lastname': data.lastname,
                    'pagesize': parseInt(data.limit),
                    'pagenumber': parseInt(data.page),
                    'hospital': data.hospital
                }
            }).success(callback);
        },
        excelDonor: function(data, callback) {
            $http.get(adminurl + "camp/excelDonor?accesslevel=" + data.accesslevel + "&camp=" + data.camp + "&campnumber=" + data.campnumber).success(callback);
        },
        hospexcelDonor: function(data, callback) {
            $http.get(adminurl + "camp/hospitalDonor?hospital=" + data.hospital + "&camp=" + data.camp + "&campnumber=" + data.campnumber).success(callback);
        },
        printSummary: function(data, callback) {
            $http.get(adminurl + "donor/findForPrint?_id=" + data.id + "&campnumber=" + data.campnumber).success(callback);
        },
        setUser: function(data) {
            $.jStorage.set("user", data);
        },
        getUser: function() {
            $.jStorage.get("user");
        },
        getOneNotification: function(id, callback) {
            $http({
                url: adminurl + 'notification/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedNotification: function(notification, callback) {
            $http({
                url: adminurl + 'notification/findlimited',
                method: 'POST',
                data: {
                    'search': notification.search,
                    'pagesize': parseInt(notification.limit),
                    'pagenumber': parseInt(notification.page)
                }
            }).success(callback);
        },
        deleteNotification: function(callback) {
            $http({
                url: adminurl + 'notification/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletenotification')
                }
            }).success(callback);
        },
        saveNotification: function(data, callback) {
            $http({
                url: adminurl + 'notification/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        editNotification: function(data, callback) {
            $http({
                url: adminurl + 'notification/editnot',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getOneFolder: function(id, callback) {
            $http({
                url: adminurl + 'folder/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedFolder: function(slider, callback) {
            $http({
                url: adminurl + 'folder/findlimited',
                method: 'POST',
                data: {
                    'search': slider.search,
                    'pagesize': parseInt(slider.limit),
                    'pagenumber': parseInt(slider.page)
                }
            }).success(callback);
        },
        deleteFolder: function(callback) {
            $http({
                url: adminurl + 'folder/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletefolder')
                }
            }).success(callback);
        },
        saveFolder: function(data, callback) {
            $http({
                url: adminurl + 'folder/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        saveRequest: function(data, callback) {
            $http({
                url: adminurl + 'request/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getOneRequest: function(id, callback) {
            $http({
                url: adminurl + 'request/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedRequest: function(slider, callback) {
            $http({
                url: adminurl + 'request/findlimited',
                method: 'POST',
                data: {
                    'search': slider.search,
                    'pagesize': parseInt(slider.limit),
                    'pagenumber': parseInt(slider.page)
                }
            }).success(callback);
        },
        deleteRequest: function(callback) {
            $http({
                url: adminurl + 'request/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deleterequest')
                }
            }).success(callback);
        },
        mergeDonors: function(merge, callback) {
            $http({
                url: adminurl + 'donor/mergeDonors',
                method: 'POST',
                data: merge
            }).success(callback);
        },
        closeLogin: function(obj, callback) {
            $http({
                url: adminurl + 'camp/closeLogin',
                method: 'POST',
                data: obj
            }).success(callback);
        },
        sendSMS: function(obj, callback) {
            $http({
                url: adminurl + 'donor/sms',
                method: 'POST',
                data: obj
            }).success(callback);
        },
        bottleCheck: function(obj, callback) {
            $http({
                url: adminurl + 'donor/bottleCheck',
                method: 'POST',
                data: {
                    "camp": obj.camp,
                    "campnumber": obj.campnumber,
                    "hospital": obj.hospital,
                    "bottle": obj.bottle
                },
                ignoreLoadingBar: true
            }).success(callback);
        },
        getSearch: function(obj, callback) {
            $http({
                url: adminurl + 'donor/getSearch',
                method: 'POST',
                data: {
                    "pagenumber": obj.page,
                    "pagesize": obj.limit,
                    "pincode": obj.pincode,
                    "bloodgrp": obj.bloodgrp
                }
            }).success(callback);
        },
        //Add New Service
    }
})
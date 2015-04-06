'use strict';

// Declare app level module which depends on filters, and services
var arloApp = angular.module('arloApp', ['ngAnimate', 'arloApp.filters', 'ui.bootstrap', 'ui.bootstrap.tooltip', 'ui.router', 'arloApp.services', 'arloApp.directives', 'arloApp.controllers', 'localization', 'arloPartials'])

    .constant('appProperties', {

        // web server url paths (probably should rename these by changing Context to Path in refactoring ...
        passwordHelpContext: '/passwordHelp',
        logoutContext: '/logout',
        devicesContext: '/users/devices',
        syncBaseStationContext: '/users/devices/update',
        notifyContext: '/users/devices/notify',
        notifyResponsesPushServiceContext: '/client/subscribe',
        claimDeviceContext: '/users/devices/claimDevice',
        streamContext: '/users/devices/startStream',
        stopStreamContext: '/users/devices/stopStream',
        startRecordContext: '/users/devices/startRecord',
        stopRecordContext: '/users/devices/stopRecord',
        takeSnapshotContext: '/users/devices/takeSnapshot',
        takeFullFrameSnapshotContext: '/users/devices/fullFrameSnapshot',
        takeUserFrameSnapshotContext: '/users/devices/userSnapshot',
        metadataContext: '/users/library/metadata',
        recordingsContext: '/users/library',
        libraryStateContext: '/users/library/state/v1',
        editContext: '/users/media',
        favoriteContext: '/users/library/favorite',
        profileContext: '/users/profile',
        registerContext: '/register',
        ssoRegisterContext: '/ssoregister',
        friendsContext: '/users/friends',
        friendsDeleteContext: '/users/friends/remove',
        queryPresentDevicesContext: '/locateDevice',
        updateNameContext: '/user',
        updatePasswordContext: '/users/changePassword',
        requestPasswordResetContext: '/requestPasswordReset',
        resetPasswordContext: '/resetPassword',
        updateUserIdContext: '/users/changeEmail',
        confirmUserIdContext: '/users/resend/confirm/email',
        jsonContext: '/json',
        staticContext: '/static',
        recycleContext: '/users/library/recycle',
        getOffersContext: '/users/payment/offers',
        getOffersV1Context: '/users/payment/offers/v1',
        getOffersDetailsContext: '/users/payment/offersdetail',
        createPaymentAccountContext: '/users/payment/accounts',
        paymentQuotationContext: '/users/payment/quotations',
        paymentBillingContext: '/users/payment/billing',
        paymentRenewContext: '/users/payment/autoRenew',
        servicePlanContext: '/users/serviceLevel',
        servicePlansPaymentContext: '/users/payment/plans',
        upgradeContext: '/upgrade',
        checkEmailUsage: '/checkEmailUsage',
        checkAccountUsage: '/checkAccountUsage',
        cameraOrderContext: '/users/devices/displayOrder',
        deleteAccountContext: '/users/closeAccount',
        removeDeviceContext: '/users/devices/removeDevice',
        renameDeviceContext: '/users/devices/renameDevice',
        restartDeviceContext: '/users/devices/restart',
        preferencesContext: '/users/preferences',
        storageQuotaContext: '/users/quota',
        termsContext: '/termsAndConditions',
        policyContext: '/policy/v1',
        updateTermsContext: '/users/termsAndConditions',
        updatePolicyContext: '/users/policy',
        renewContext: '/renew',
        cancelContext: '/cancel',
        changeContext: '/change',
        allContext: '/all',

        _RESOURCE_UPDATE_: '_RESOURCE_UPDATE_',
        DEVICE_UPDATE: 'DEVICE_UPDATE',
        BILLING_EVENT: 'BILLING_EVENT',

        urlTld: '.com',
        portNo: ':8080',
        registerTokenText: 'registrationtoken',
        resetPasswordTokenText: 'passwordresetcode=',

        // local routes withing client
        loginRoute: '/login',
        claimBaseStationRoute: '/claimBaseStation',
        accountRegistrationRoute: '/accountRegistration',
        billingInformationRoute: '/billingInformation',
        syncHardwareRoute: '/syncHardware',
        calendarRoute: '/calendar',
        camerasRoute: '/cameras',
        dayRoute: '/day',
        recordingRoute: '/recording',
        recordingSharedRoute: '/viewShared',
        settingsRoute: '/settings',
        cameraSettingsRoute: '/settings/camera',
        listFriendsRoute: '/friends/list',
        editFriendRoute: '/friends/edit/',
        personalInfoRoute: '/settings/personalInfo',
        modesRoute: '/modes',
        editModeRoute: '/modes/edit',
        rulesRoute: '/rules',
        editRuleRoute: '/rule',
        alertEmailsRoute: '/alerts/emails',
        editAlertsRoute: '/alerts',
        scheduleRoute: '/schedule',
        dailyScheduleRoute: '/schedule/daily',
        weeklyScheduleRoute: '/schedule/weekly',
        servicePlanRoute: '/plans/select',
        upgradeServicePlanRoute: '/plans/select/upgrade',
        upgradeStoragePlanRoute: '/plans/storage/upgrade',

        FREE_PLAN_TYPE: 'BASIC',
        PAID_PLAN_TYPE: 'SERVICE',
        STORAGE_PLAN_TYPE: 'STORAGE',
        ONE_MEGA: 1024 * 1024,
        videoFormat: 'video/mp4',
        HTML5: 'HTML5',
        JWPLAYER: 'JWPLAYER',
        FLOWPLAYER: 'FLOWPLAYER',

        REGISTRATION_TOKEN: 'registrationToken',

        ACCEPTANCE_PENDING: 'pending',
        BASE_STATION_DEVICE_TYPE: 'basestation',
        CAMERA_DEVICE_TYPE: 'camera',
        FAVORITE_STATE: 'favorite',
        NEW_STATE: 'new',
        REMOVED_STATE: 'removed',
        DEACTIVATED_STATE: 'deactivated',
        RECYCLE_STATE: 'recycle',
        PROVISIONED_STATE: 'provisioned',
        SYNCED_STATE: 'synced',
        AVAILABLE_STATE: 'available',
        UNAVAILABLE_STATE: 'unavailable',
        DEVICE_ACTIONS: ['recordActiveMotionVideo', 'recordSnapshot', 'sendEmailAlert'],
        DEVICE_TRIGGERS: ['motionDetect', 'lowBattery', 'lowSignalStrength'],

        DEVICE_TRANSACTION_PREFIX: 'basestation',
        WEB_TRANSACTION_PREFIX: 'web',

        DEVICE_SETTINGS_ACTIVE: 'active',
        DEVICE_SCHEDULE: 'schedule',

        CAMERA_SETTINGS_ACTIVITYSTATE: "activityState",
        CAMERA_SETTINGS_ACTIVITYSTATE_POSITION_MODE: "startPositionStream",
        CAMERA_ACTIVITYSTATE_START_ALERT_STREAM: "startAlertStream",
        CAMERA_ACTIVITYSTATE_ALERT_STREAM_ACTIVE: "alertStreamActive",
        CAMERA_ACTIVITYSTATE_ALERT_SNAPSHOT: "alertSnapshot",
        CAMERA_ACTIVITYSTATE_ALERT_WATCH: "alertStreamActiveWatchAlong",
        CAMERA_ACTIVITYSTATE_FULLFRAMESNAPSHOT: "fullFrameSnapshot",
        CAMERA_SETTINGS_ACTIVITYSTATE_MOTION_DETECTION_MODE: "setupMotionStart",
        CAMERA_SETTINGS_ACTIVITYSTATE_IDLE: "idle",
        CAMERA_SETTINGS_ACTIVITYSTATE_STREAM: 'startUserStream',
        CAMERA_SETTINGS_ACTIVITYSTATE_ACTIVESTREAM: 'userStreamActive',
        CONNECTION_STATE: 'connectionState',
        CAMERA_CONNECTION_STATE: 'connectionState',
        CAMERA_CONNECTION_STATE_AVAILABLE: 'available',
        CAMERA_CONNECTION_STATE_BATTERY_CRITICAL: 'batteryCritical',
        CAMERA_CONNECTION_STATE_UNAVAILABLE: 'unavailable',

        CAMERAS_ALL_SELECTED: 'all',

        POSITION_MODE_DURATION: 5 * 60 * 1000,
        CAMERA_SETTINGS_POWERSAVEMODE: "powerSaveMode",
        CAMERA_SETTINGS_POWERSAVEMODE_BEST_VIDEO: 3,  // highest def video
        CAMERA_SETTINGS_POWERSAVEMODE_OPTIMIZED: 2,
        CAMERA_SETTINGS_POWERSAVEMODE_BATTERY_LIFE: 1, // best battery life

        CAMERA_SETTINGS_BRIGHTNESS: "brightness",
        CAMERA_SETTINGS_MIRROR: "mirror",
        CAMERA_SETTINGS_FLIP: "flip",
        CAMERA_SETTINGS_ZOOM: "zoom",

        CAMERA_STATUS_BATTERY_LEVEL: 'batteryLevel',
        CAMERA_STATUS_SIGNAL_STRENGTH: 'signalStrength',
        CAMERA_STATUS_MOTION: 'motion',

        SENSOR_MOTION_DETECTION_STATE: 'pirMotionActive',

        CSS_CAMERA_MOTION_DISABLED: '0',
        CSS_CAMERA_MOTION_ACTIVE: '1',
        CSS_CAMERA_MOTION_ARMED: '2',

        USER_ROLE_OWNER: 'OWNER',
        USER_ROLE_ADMIN: 'ADMIN',
        USER_ROLE_USER: 'USER',

        favoritesOptions: [
            {"value": "all", "text": "filter_label_all"},
            {"value": "only", "text": "filter_label_favorites"},
            {"value": "non", "text": "filter_label_non_favorites"}
        ],

        timeZoneHash: [
            {"offset": "660", "id": "WST11"},
            {"offset": "600", "id": "HST10"},
            {"offset": "540", "id": "AKST9AKDT,M3.2.0,M11.1.0"},
            {"offset": "480", "id": "PST8PDT,M3.2.0,M11.1.0"},
            {"offset": "420", "id": "MST7MDT,M3.2.0,M11.1.0"},
            {"offset": "420", "id": "MST7"},
            {"offset": "360", "id": "CST6CDT,M3.2.0,M11.1.0"},
            {"offset": "300", "id": "EST5EDT,M3.2.0,M11.1.0"},
            {"offset": "270", "id": "VET4:30"},
            {"offset": "240", "id": "CLT"},
            {"offset": "210", "id": "NST3:30NDT,M3.2.0/0:01,M11.1.0/0:01"},
            {"offset": "180", "id": "BRT3BRST,M10.3.0/0,M2.3.0/0"},
            {"offset": "60", "id": "CVT1"},
            {"offset": "0", "id": "GMT0BST,M3.5.0/1,M10.5.0"},
            {"offset": "-60", "id": "CET-1CEST,M3.5.0,M10.5.0/3"},
            {"offset": "-120", "id": "EET-2EEST,M3.5.0/3,M10.5.0/4"},
            {"offset": "-180", "id": "MSK-4"},
            {"offset": "-210", "id": "IRST"},
            {"offset": "-240", "id": "GST-4"},
            {"offset": "-270", "id": "AFT-4:30"},
            {"offset": "-300", "id": "PKT-5"},
            {"offset": "-330", "id": "IST-5:30"},
            {"offset": "-360", "id": "BDT-6"},
            {"offset": "-390", "id": "MMT-6:30"},
            {"offset": "-420", "id": "WIT-7"},
            {"offset": "-480", "id": "CST-8"},
            {"offset": "-540", "id": "JST-9"},
            {"offset": "-570", "id": "CST-9:30CST,M10.1.0,M4.1.0/3"},
            {"offset": "-600", "id": "EST-10EST,M10.1.0,M4.1.0/3"},
            {"offset": "-660", "id": "NCT-11"},
            {"offset": "-720", "id": "NZST-12NZDT,M9.5.0,M4.1.0/3"},
            {"offset": "-780", "id": "TOT-13"}
        ],
        appEvents: {
            BODY_CLICK: 'body_click',
            TAKE_SNAPSHOT: 'take_snapshot',
            SNAPSHOT_LOADED: 'snapshot_loaded',
            SHOW_ERROR: 'show_error',
            HIDE_ERROR: 'hide_error',
            CAMERA_BUSY: 'camera_busy',
            CAMERA_ERROR: 'camera_error',
            SCROLL_TOP: 'scrollTop',
            BRIGHTNESS_UPDATED: 'brightness_updated',
            BS_REBOOTED: 'bs_rebooted',
            MEDIA_UPLOAD_NOTIFICATION: 'mediaUploadNotification'
        }
    })
    // wrap local storage to create a storage service
    .value('localStorage', window.localStorage)
    // wrap session storage to create a session storage service
    .value('sessionStorage', window.sessionStorage)
    .config(['$sceProvider', '$locationProvider', '$compileProvider', '$httpProvider', '$logProvider', function ($sceProvider, $locationProvider, $compileProvider, $httpProvider, $logProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|file):/);
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-REQUESTED-WITH'];
        // $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
        // the following disables strict contextual escaping and is insecure (should be uncommented in production)
        $sceProvider.enabled(false);
        if(window["_DEBUG_"]) {
            $logProvider.debugEnabled(_DEBUG_);
        }
        // check for 401 status in response and redirect to login page
        $httpProvider.interceptors.push('authInterceptor');
    }])

    .config(['$stateProvider', '$urlRouterProvider', 'appProperties', function ($stateProvider, $urlRouterProvider, appProperties) {

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'partials/loginView.html',
                controller: 'LoginCtrl',
                authenticate: false,
                viewName: 'Login',
                accViewName: 'AcctMgr_Login'
            })
            .state('useMobile', {
                url: '/useMobile',
                templateUrl: 'partials/useMobileView.html',
                authenticate: false,
                viewName: 'UseMobile'
            })
            .state('oldBrowser', {
                url: '/oldBrowser',
                templateUrl: 'partials/oldBrowserView.html',
                controller: 'ShutdownCtrl',
                authenticate: false,
                viewName: 'OldBrowser'
            })
            .state('otherTab', {
                url: '/otherTab',
                templateUrl: 'partials/otherTabView.html',
                controller: 'ShutdownCtrl',
                authenticate: false,
                viewName: ''
            })
            .state('gettingStarted', {
                url: '/gettingStarted',
                templateUrl: 'partials/gettingStartedView.html',
                authenticate: false,
                viewName: 'NewSystemSetup_GettingStarted'
            })
            .state('claimBaseStation', {
                url: '/claimBaseStation',
                templateUrl: 'partials/claimBaseStationView.html',
                controller: 'ClaimBaseStationCtrl',
                authenticate: false,
                viewName: 'NewSystemSetup_LocateDevices'
            })
            .state('passwordHelp', {
                url: appProperties.passwordHelpContext,
                templateUrl: 'partials/passwordHelpView.html',
                controller: 'PasswordHelpCtrl',
                authenticate: false,
                viewName: 'PasswordHelp'
            })
            .state('accountRegistration', {
                url: '/accountRegistration',
                templateUrl: 'partials/accountRegistrationView.html',
                controller: 'AccountRegistrationCtrl',
                authenticate: false,
                viewName: 'NewSystemSetup_AccountSetup'
            })
            .state('servicePlan', {
                url: appProperties.servicePlanRoute,
                templateUrl: 'partials/selectServicePlanView.html',
                controller: 'SelectServicePlanCtrl',
                authenticate: false,
                viewName: 'NewSystemSetup_GetOffers'
            })
            .state('billingInformation', {
                url: appProperties.billingInformationRoute,
                templateUrl: 'partials/billingInformationView.html',
                controller: 'BillingInformationCtrl',
                authenticate: false,
                viewName: 'NewSystemSetup_PaymentMethod'
            })
            .state('syncHardware', {
                url: appProperties.syncHardwareRoute,
                templateUrl: 'partials/syncHardwareView.html',
                controller: 'SyncHardwareCtrl',
                authenticate: false,
                viewName: 'NewSystemSetup_SyncCameras'
            })
            .state('modes', {
                url: appProperties.modesRoute,
                templateUrl: 'partials/footerModesView.html',
                controller: 'FooterModesCtrl',
                authenticate: true,
                viewName: 'Mode_Manual'
            })
            .state('cameras', {
                url: appProperties.camerasRoute,
                templateUrl: 'partials/camerasView.html',
                controller: 'CamerasCtrl',
                authenticate: true,
                viewName: 'Cameras'
            })
            .state('calendar', {
                url: appProperties.calendarRoute + '/:month/:favorites/:cameraIds/:day',
                templateUrl: 'partials/calendarView.html',
                controller: 'CalendarCtrl',
                authenticate: true,
                viewName: ''
            })
            .state('calendar.day', {
                url: '/day',
                templateUrl: 'partials/dayView.html',
                controller: 'DayCtrl',
                authenticate: true,
                viewName: ''
            })
            .state('calendar.recycled', {
                url: '/recycled',
                templateUrl: 'partials/recycleView.html',
                controller: 'RecycledCtrl',
                authenticate: true,
                viewName: 'Library_Recycled'
            })
            .state('recording', {
                url: appProperties.recordingRoute + '/:favorites/:cameraIds/:recordingNumber',
                templateUrl: 'partials/recordingView.html',
                controller: 'RecordingCtrl',
                authenticate: true,
                viewName: 'Library_Carousel'
            })
            .state('recordingShared', {
                url: appProperties.recordingSharedRoute + '/:token',
                templateUrl: 'partials/sharedRecordingView.html',
                controller: 'SharedRecordingCtrl',
                authenticate: false,
                viewName: 'Library_SharedCarousel'
            })
            .state('recordingShared2', {
                url: '/shared/:token',
                templateUrl: 'partials/sharedRecordingView.html',
                controller: 'SharedRecordingCtrl',
                authenticate: false,
                viewName: 'Library_SharedCarousel'
            })
            .state('settings', {
                url: appProperties.settingsRoute,
                templateUrl: 'partials/settingsView.html',
                controller: 'SettingsCtrl',
                authenticate: true,
                viewName: 'Settings'
            })
            .state('settings.camera', {
                url: '/camera/:deviceId',
                templateUrl: 'partials/cameraSettingsView.html',
                controller: 'CameraSettingsCtrl',
                authenticate: true,
                viewName: 'CameraSettings_Main'
            })
            .state('settings.personalInfo', {
                url: '/personalInfo',
                templateUrl: 'partials/personalInfoView.html',
                controller: 'PersonalInfoCtrl',
                authenticate: true,
                viewName: 'PersonalInformation',
                accViewName: 'AcctMgr_PersonalInformation'
            })
            .state('settings.friends', {
                url: '/friends',
                templateUrl: 'partials/friendsView.html',
                controller: 'FriendsCtrl',
                authenticate: true,
                viewName: 'Friends'
            })
            .state('settings.editFriend', {
                url: '/friends/edit/:email',
                templateUrl: 'partials/editFriendView.html',
                controller: 'EditFriendCtrl',
                authenticate: true,
                viewName: 'Friends_Edit'
            })
            .state('settings.addFriend', {
                url: '/friends/add',
                templateUrl: 'partials/editFriendView.html',
                controller: 'EditFriendCtrl',
                authenticate: true,
                viewName: 'Friends_Add'
            })
            .state('settings.modes', {
                url: '/modes' + '/:deviceId',
                templateUrl: 'partials/modesView.html',
                controller: 'ModesCtrl',
                authenticate: true,
                viewName: 'BaseStationModes'
            })
            .state('settings.editMode', {
                url: '/modes/edit' + '/:deviceId/:modeId',
                templateUrl: 'partials/editModeView.html',
                controller: 'EditModeCtrl',
                authenticate: true,
                viewName: 'BaseStationModes_Edit'
            })
            .state('settings.addMode', {
                url: '/modes/edit' + '/:deviceId',
                templateUrl: 'partials/editModeView.html',
                controller: 'EditModeCtrl',
                authenticate: true,
                viewName: 'BaseStationModes_Add'
            })
            .state('settings.rules', {
                url: '/rules' + '/:deviceId',
                templateUrl: 'partials/rulesView.html',
                controller: 'RulesCtrl',
                authenticate: true,
                viewName: 'BaseStationRules'
            })
            .state('settings.editRule', {
                url: '/modes/rule/edit' + '/:baseStationId/:ruleId',
                templateUrl: 'partials/editRuleView.html',
                controller: 'EditRuleCtrl',
                authenticate: true,
                viewName: 'BaseStationRules_Edit'
            })
            .state('settings.addRule', {
                url: '/modes/rule/add' + '/:baseStationId',
                templateUrl: 'partials/editRuleView.html',
                controller: 'EditRuleCtrl',
                authenticate: true,
                viewName: 'BaseStationRules_Add'
            })
            .state('settings.cameraOrder', {
                url: '/cameraOrder',
                templateUrl: 'partials/cameraOrderView.html',
                controller: 'CameraOrderCtrl',
                authenticate: true,
                viewName: 'SystemSettings_CameraOrder'
            })
            .state('settings.help', {
                url: '/help',
                templateUrl: 'partials/helpView.html',
                authenticate: true,
                viewName: 'SystemSettings_Help'
            })
            .state('settings.about', {
                url: '/about',
                templateUrl: 'partials/settingsAboutView.html',
                controller: 'AboutCtrl',
                authenticate: true,
                viewName: 'SystemSettings_About'
            })
            .state('settings.baseStation', {
                url: '/baseStation' + '/:baseStationId',
                templateUrl: 'partials/settingsBaseStationView.html',
                controller: 'BaseStationCtrl',
                authenticate: true,
                viewName: 'BaseStationSettings_Main'
            })
            .state('settings.baseStation.update', {
                url: '/update',
                templateUrl: 'partials/settingsBaseStationUpdateView.html',
                controller: 'BaseStationUpdateCtrl',
                authenticate: true,
                viewName: 'BaseStationSettings_Update'
            })
            .state('settings.subscription', {
                url: '/subscription',
                templateUrl: 'partials/settingsSubscriptionView.html',
                controller: 'SubscriptionCtrl',
                reload: true,
                authenticate: true,
                viewName: 'Subscription',
                accViewName: 'AcctMgr_Subscription'
            })
            .state('settings.plans', {
                url: '/subscription/plans',
                templateUrl: 'partials/settingsSelectPlanView.html',
                controller: 'SubscriptionPlansCtrl',
                reload: true,
                authenticate: true,
                viewName: 'Subscription_UpgradeOffers',
                accViewName: 'AcctMgr_Subscription_UpgradeOffers'
            })
            .state('settings.billingInformation', {
                url: appProperties.billingInformationRoute,
                templateUrl: 'partials/billingInformationView.html',
                controller: 'BillingInformationCtrl',
                authenticate: true,
                viewName: 'Subscription_PaymentMethod',
                accViewName: 'AcctMgr_Subscription_PaymentMethod'
            })
            .state('settings.preferences', {
                url: '/preferences',
                templateUrl: 'partials/settingsPreferencesView.html',
                controller: 'PreferencesCtrl',
                authenticate: true,
                viewName: 'SystemSettings_Preferences'
            })
            .state('settings.positionMode', {
                url: '/positionMode' + '/:deviceId',
                templateUrl: 'partials/positionModeView.html',
                controller: 'CamerasCtrl',
                authenticate: true,
                viewName: 'CameraSettings_PositionMode'
            })
            .state('settings.motionTest', {
                url: '/motionTest' + '/:deviceId',
                templateUrl: 'partials/motionTestView.html',
                controller: 'motionTestCtrl',
                authenticate: true,
                viewName: 'CameraSettings_MotionDetectionTest'
            })
        ;

        $urlRouterProvider.otherwise('/login');

    }])

    .run(function ($rootScope, $state, $http, urlService, calendarService, libraryService, appProperties, userService,
                   appStateService, pushHandlerService, utilService, sessionExpire, offlineService, loginService) {

        urlService.setWebUrl();

        // load data -- handles browser reloads/refreshes, if this is a new login data will be
        // retrieved from server anyway and update the session data
        appStateService.loadSessionData();

        // todo: these should be moved to closer to where they are used, or add comment to why they are here
        calendarService.setDefaultMonth();
        libraryService.setFavorites(appProperties.favoritesOptions[0]);

        var _tz = timezoneJS.timezone;
        _tz.loadingScheme = _tz.loadingSchemes.MANUAL_LOAD;
        _tz.transport = function (args) {
            $http.get(args.url).then(function (result) {
                args.success(result.data);
                });
        };
        _tz.loadZoneJSONData('/json/tz_cities.json?v=VERSION', false);

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            // redirect to login if user not authenticated
            if (toState.authenticate && !userService.isLoggedIn()) {
                event.preventDefault();
                $state.go('login');
                return false;
            }
            if(toState.authenticate && userService.isLoggedIn() && utilService.checkMobile()) {
                event.preventDefault();
                if(toState.accViewName) {
                    utilService.gaSend(toState.accViewName);
                }
                else if(toState.viewName) {
                    utilService.gaSend(toState.viewName);
                }
                return false;
            }
            if(fromState.abstract && userService.isLoggedIn() && userService.settings) {
                loginService.checkCredentials(userService.userName, userService.getSettings());
            }
            if(toState.authenticate && userService.isLoggedIn() && !pushHandlerService.notifyResponsesSource) {
                offlineService.init();
                pushHandlerService.init();
            }
            if(toState.accViewName) {
                utilService.gaSend(toState.accViewName);
            }
            else if(toState.viewName) {
                utilService.gaSend(toState.viewName);
            }
        });
        sessionExpire.init();
    });

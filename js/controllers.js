'use strict';

angular.module('arloApp.controllers', [])
    .controller('LoginCtrl', function ($scope, $rootScope, $location, $log, $state, $timeout, $modal, $q, $locale, $filter, appProperties, loginService, logoutService, setupService, devicesService, userService, urlService, cameraSettingsService, baseStationService, pushHandlerService, libraryService, calendarService, dayService, servicePlanService, appStateService, localStorage, utilService, offlineService) {

        $scope.init = function () {
            $log.debug('Initializing login view');
            $scope.notAccount = !window["_ACCOUNT_"];
            //if (localStorage['ssoToken']) localStorage.removeItem('ssoToken');
            if (!$scope.isFriendUser() && !$scope.resettingPassword() && utilService.checkMobile()) {
                return;
            }
            if (userService.isLoggedIn() && $scope.isFriendUser()) {
                userService.ssoToken = null;
            }
            else if (userService.isLoggedIn()) {
                $state.go(window["_ACCOUNT_"] ? "settings.subscription" : "cameras");
                return;
            }
            if (userService.settings) {
                $scope.userId = userService.userName;
                $scope.rememberMe = true;
                if (!userService.fromLogout) {
                    $scope.attemptLogin(true);
                }
                else {
                    $scope.password = userService.getSettings();
                }
            }
            setupService.setupPending = true;
            if (loginService.redirectError) {
                $timeout(function () {
                    $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, { data: { message: loginService.redirectError}});
                    loginService.redirectError = null;
                });
            }
        };

        /*
         Attempt login -- this handles three different cases:  1) ordinary login for users with accounts and devices, 2) friend
         user accepting a friend invite coming from signin view (signin=true, registrationToken present), and 3) users with accounts who just need to sync
         hardware coming from signin view (signin=true, no registrationToken).
         */
        $scope.attemptLogin = function (auto) {
            if(utilService.checkMobile()) {
                return;
            }
            $scope.loginError = null;
            if ((!$scope.userId || !$scope.password) && !auto) {
                //alert('Please enter Email (user id) and Password.');
                return;
            }

            $scope.inProgress = true;

            if (!$scope.rememberMe) {
                userService.clearSettings();
            }

            var promise;
            if ($scope.isFriendUser()) {
                var token = getRegistrationToken().split('=')[1];
                var stripPos = token.search('#');
                if (stripPos > -1) {
                    token = token.substr(0, stripPos);
                }
                stripPos = token.search('/');
                if (stripPos > -1) {
                    token = token.substr(0, stripPos);
                }
                promise = loginService.checkCredentials($scope.userId, $scope.password, token);
            } else {
                promise = loginService.checkCredentials($scope.userId, auto ? userService.getSettings() : $scope.password);
            }

            promise.then(function (result) {
                    if (userService.isLoggedIn()) {
                        $rootScope.$broadcast(appProperties.appEvents.HIDE_ERROR, null);
                        $scope.inProgress = true;
                        $scope.viewMode = false;
                        var accStatus =  result.data.accountStatus;
                        var promise;
                        if (result.data.tocUpdate && result.data.policyUpdate) {
                            promise = $modal.open({
                                windowTemplateUrl: 'partials/tosDialog.html',
                                templateUrl: result.data.tocLink,
                                scope: $scope,
                                backdrop: 'static'
                            }).result.then(
                                function (dialog_result) {
                                    if (dialog_result == 'ok') {
                                        return loginService.updateTosVersion(result.data.tocVersion).then(function () {
                                            return $modal.open({
                                                windowTemplateUrl: 'partials/tosDialog.html',
                                                templateUrl: result.data.policyLink,
                                                scope: $scope,
                                                backdrop: 'static'
                                            }).result.then(
                                                function (dialog_result) {
                                                    if (dialog_result == 'ok') {
                                                        return loginService.updatePolicyVersion(result.data.policyVersion);
                                                    }
                                                    else {
                                                        return $q.reject();
                                                    }
                                                }
                                            );
                                        }, function () {
                                            return $q.reject();
                                        });
                                    }
                                    else {
                                        return $q.reject();
                                    }
                                }
                            );
                        }
                        else if (result.data.policyUpdate) {
                            promise = $modal.open({
                                windowTemplateUrl: 'partials/tosDialog.html',
                                templateUrl: result.data.policyLink,
                                scope: $scope,
                                backdrop: 'static'
                            }).result.then(
                                function (dialog_result) {
                                    if (dialog_result == 'ok') {
                                        return loginService.updatePolicyVersion(result.data.policyVersion);
                                    }
                                    else {
                                        return $q.reject();
                                    }
                                }
                            );
                        }
                        else if (result.data.tocUpdate) {
                            promise = $modal.open({
                                windowTemplateUrl: 'partials/tosDialog.html',
                                templateUrl: result.data.tocLink,
                                scope: $scope,
                                backdrop: 'static'
                            }).result.then(
                                function (dialog_result) {
                                    if (dialog_result == 'ok') {
                                        return loginService.updateTosVersion(result.data.tocVersion);
                                    }
                                    else {
                                        return $q.reject();
                                    }
                                }
                            )
                        }
                        else {
                            var defer = $q.defer();
                            promise = defer.promise;
                            defer.resolve();
                        }
                        promise.then(function () {
                            userService.clearFromLogout();
                            setupService.setupPending = false;
                            if ($scope.rememberMe && !auto) {
                                userService.setSettings($scope.password);
                            }
                            offlineService.init();
                            pushHandlerService.init();

                            if(window["_ACCOUNT_"]) {
                                $state.go("settings.subscription");
                            }
                            else if (accStatus == "verifyBilling") {
                                $state.go("settings.billingInformation");
                            }
                            else {
                                $state.go("cameras");
                            }
                        }, function (result) {
                            userService.setSsoToken('');
                            result && ($rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result));
                        })["finally"](function () {
                            $scope.inProgress = false;
                        });
                    }
                },
                function (result) {
                    $scope.inProgress = false;
                    if(result && result.data && result.data.message) {
                        $scope.loginError = result.data.message;
                    }
                    else {
                        $scope.loginError = $filter("i18n")("login_error_validation_username");
                    }
                });
        };

        $scope.systemSetup = function () {
            //window.open("http://routerlogin.net/startArlo", "_blank");
            // clear all remembered session data
            appStateService.clearSessionData();

            // where to go, depends on some things ...
            var resultUrl;

            setupService.start();
            if (!setupService.setupPending) { // system already setup!
                resultUrl = 'cameras';
            } else if (!setupService.baseStationClaimed) {
                resultUrl = 'gettingStarted';
            } else if (!setupService.accountRegistered) {
                resultUrl = 'accountRegistration';
            } else {    // this should not happen!
                throw "Unknown system setup state";
            }

            setupService.updateSetupState();
            $state.go(resultUrl);
        };

        $scope.createAccount = function () {
            var url = appProperties.accountRegistrationRoute;
            $location.path(url);
        };

        $scope.resetPassword = function () {

            // locale = location.hash.match( /[?&]locale=([^&]*)?/ );

            var absUrl = $location.absUrl();
            var match = absUrl.match(new RegExp('/[?&]' + appProperties.resetPasswordTokenText + '([^&#]*)?[/#]','i'));
            var passwordResetCode = match && match[1] ? match[1] : null;

            var promise = loginService.resetPassword($scope.newPassword, passwordResetCode);
            promise.then(function () {
                //$window.alert("Password reset");
                // fixme: redirect to login page without parameters
                location.href = $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '');
            })

        };

        /*
         Determines if this is a friend user if so there is a registrationToken which needs to be included.
         */
        $scope.isFriendUser = function () {
            var absUrl = $location.absUrl();
            var tokenPos = absUrl.toLowerCase().indexOf(appProperties.registerTokenText);
            if (tokenPos < 0) {
                return false;
            } else {
                return true;
            }
        };

        var getRegistrationToken = function () {
            var absUrl = $location.absUrl().toLowerCase();
            var tokenPos = absUrl.indexOf(appProperties.registerTokenText);
            if (tokenPos < 0) {
                return "";
            } else {
                return absUrl.substr(tokenPos);
            }
        };

        $scope.resettingPassword = function () {
            var absUrl = $location.absUrl().toLowerCase();
            var tokenPos = absUrl.indexOf(appProperties.resetPasswordTokenText);
            if (tokenPos < 0) {
                return false;
            } else {
                return true;
            }
        };

        $scope.gotoLogin = function () {
            // fixme: redirect to login page without parameters
            location.href = $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '');
        };

        $scope.gotoLogout = function () {
            userService.setFromLogout();

            var promise = logoutService.logout();
            promise.then(function () {
                $state.go('login');
            });

        };

        $scope.isLoggedIn = function () {
            return userService.isLoggedIn();
        };
    })

    .controller('PasswordHelpCtrl', function ($scope,loginService) {
        $scope.submit = function () {
            $scope.inProgress = true;
            $scope.error = null;
            var promise = loginService.requestPasswordReset($scope.email);

            promise.then(function () {
                $scope.inProgress = false;
                $scope.sent = true;
            }, function (result) {
                $scope.error = result.data.message;
            });
        }
    })

    .controller('CamerasCtrl', function ($scope, $rootScope, $state, $stateParams, $log, $timeout, $q, $filter, appProperties, devicesService, camerasService, dayService, libraryService, calendarService, cameraSettingsService, servicePlanService, baseStationService, offlineService, uiService) {

        var startPromises = {};
        var startCameras = {};
        var startRetries = {};
        var pendingBrightness = 0;

        $scope.sliderClick = function (event, cameraId) {
            var X = event.offsetX;
            if(!event.hasOwnProperty('offsetX')) {
                var target  = event.target || event.srcElement,
                    rect    = target.getBoundingClientRect(),
                    X = event.clientX - rect.left;
            }

            var w = 100 * (X - 5) / angular.element(event.currentTarget).prop('offsetWidth');
            $scope.setPercent(w, cameraId);
        };

        $scope.setPercent = function (proc, cameraId) {
            $scope.uiStates[cameraId].brightness = Math.round(proc/25) - 2;
        };

        $scope.showBrightness = function (camera) {
            if(!$scope.uiStates[camera.deviceId].showBright) {
                angular.extend($scope.uiStates[camera.deviceId], {
                    brightnessUpdating: false,
                    brightness: camera.properties.brightness,
                    showBright: true
                });
            }
            else {
                $scope.uiStates[camera.deviceId].showBright = false;
            }
        };

        $scope.getCameras = function () {
            return devicesService.getAllCameras();
        };

        $scope.getCamera = function () {
            return devicesService.getDeviceById($scope.deviceId);
        };

        $scope.getSyncedCameras = function() {
            var syncedCameras = _.findWhere(devicesService.devices, {
                deviceType: appProperties.CAMERA_DEVICE_TYPE,
                state: appProperties.SYNCED_STATE
            });

            return syncedCameras ? [syncedCameras] : [];
        };

        $scope.isCameraRecording = function (camera) {
            return $scope.uiStates[camera.deviceId].record ||
                [appProperties.CAMERA_ACTIVITYSTATE_START_ALERT_STREAM,
                    appProperties.CAMERA_ACTIVITYSTATE_ALERT_STREAM_ACTIVE,
                    appProperties.CAMERA_ACTIVITYSTATE_ALERT_WATCH].indexOf(camera.properties.activityState) != -1;
        };

        $scope.getCameraState = function (camera) {
            if($scope.isCameraConnecting(camera)) {
                return "connecting";
            }
            else if(camera.properties.activityState == 'upgradeInProgress') {
                return "upgrade";
            }
            else if(camera.properties.connectionState == appProperties.UNAVAILABLE_STATE) {
                return "offline";
            }
            else if(camera.properties.connectionState == appProperties.CAMERA_CONNECTION_STATE_BATTERY_CRITICAL) {
                return "critical";
            }
            else if($scope.startErrors[camera.deviceId]) {
                return "start_error";
            }
            else if($scope.uiStates[camera.deviceId].loading) {
                return "loading";
            }
            else if (!$scope.stopTimeouts[camera.deviceId] && !$scope.uiStates[camera.deviceId].play &&
                _.indexOf([appProperties.CAMERA_SETTINGS_ACTIVITYSTATE_IDLE,
                    appProperties.CAMERA_SETTINGS_ACTIVITYSTATE_ACTIVESTREAM,
                    appProperties.CAMERA_ACTIVITYSTATE_START_ALERT_STREAM,
                    appProperties.CAMERA_ACTIVITYSTATE_ALERT_STREAM_ACTIVE,
                    appProperties.CAMERA_SETTINGS_ACTIVITYSTATE_STREAM,
                    appProperties.CAMERA_ACTIVITYSTATE_ALERT_WATCH], camera.properties.activityState) != -1) {
                return camera.properties.hasStreamed ? "idle" : "idle_new";
            }
            return null;
        };

        $scope.getOfflineMessage = function (camera) {
            if (offlineService.isOffline) {
                return $filter('i18n')('error_no_internet_connection');
            }
            var bs = devicesService.getDeviceById(camera.parentId) || _.findWhere(devicesService.friendedBaseStations, {deviceId: camera.parentId});

            if (bs && bs.properties && bs.properties.connectionState) {
                if (bs.properties.connectionState == appProperties.UNAVAILABLE_STATE) {
                    return $filter('i18n')('camera_state_gateway_offline');
                }
                if (camera.properties && camera.properties.connectionState == appProperties.UNAVAILABLE_STATE) {
                    return $filter('i18n')('camera_state_offline');
                }
            }
            return '';
        };

        function detectflash() {
            if (navigator.plugins != null && navigator.plugins.length > 0) {
                return navigator.plugins["Shockwave Flash"] && true;
            }
            if (~navigator.userAgent.toLowerCase().indexOf("webtv")) {
                return true;
            }
            if (~navigator.appVersion.indexOf("MSIE") && !~navigator.userAgent.indexOf("Opera")) {
                try {
                    return new ActiveXObject("ShockwaveFlash.ShockwaveFlash") && true;
                } catch (e) {
                }
            }
            return false;
        };

        function detectflashDisable() {
            if($f() && (angular.isArray($f().getVersion()) || $scope.disableTimeout)) {
                return;
            }
            $scope.disableTimeout = $timeout(function () {
                if(!$f() || !angular.isArray($f().getVersion())) {
                    var showMsg = true;
                    for(var prop in $scope.uiStates) {
                        var state = $scope.uiStates[prop];
                        if(state.loading) {
                            state.loading = false;
                            showMsg = false;
                            $scope.startErrors[prop] = 'Adobe ShockwaveFlash plug-in disabled!';
                        }
                    }
                    !$scope.deviceId && showMsg && ($rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, { data: { message: 'Adobe ShockwaveFlash plug-in disabled!'}}));
                }
                $scope.disableTimeout = null;
            }, 20*1000);
        };

        $scope.init = function () {
            $log.debug('initializing cameras controller');
            if (window.location.href.toLowerCase().indexOf(appProperties.registerTokenText) != -1) {
                window.location.href = '/#/cameras';
                return;
            }
            $scope.scrollable = false;
            $scope.isOfferShown = false;
            $scope.stopTimeouts = {};
            $scope.startErrors = {};
            $scope.deviceId = $stateParams.deviceId || null;
            $scope.uiStates = devicesService.uiStateHash;

            if ($scope.deviceId) {
                $scope.positionMode = true;
                if (!devicesService.devices) {
                    $state.go('settings');
                    return;
                }
            }

            if (!$scope.deviceId) {
                var promise = devicesService.initDevices();
                promise.then(function () {
                    _.each($scope.getCameras(), function (camera) {
                        if(!$scope.lastTimeHash[camera.deviceId]) {
                            devicesService.updateLastDate(camera);
                        }
                        $scope.uiStates[camera.deviceId].loading = false;
                        $scope.uiStates[camera.deviceId].play = false;
                        $scope.uiStates[camera.deviceId].zoom = false;
                    });
                    _.each(devicesService.getBaseStations(), function (bs) {
                        if(bs.properties && bs.properties.connectionState == appProperties.AVAILABLE_STATE) {
                            bs.modes || (baseStationService.getBaseStationResource(bs.deviceId, "modes"));
                            bs.rules || (baseStationService.getBaseStationResource(bs.deviceId, "rules"));
                        }
                    });
                    //$scope.uiStates["3T21457D00001"].play = true;
                });

                // todo:  ROLES
                if (!servicePlanService.purchasedPlans) {
                    var promise = servicePlanService.getPurchasedPlans();
                    promise.then(function () {
                        $scope.servicePlan = servicePlanService.getServicePlan();
                    });
                }
                else {
                    $scope.servicePlan = servicePlanService.getServicePlan();
                }
            }

            // initialize array of owned cameras that are currently displayed
            $scope.ownDisplayed = [];

            // todo:  ROLES

            $scope.isSafari = navigator.userAgent.indexOf('Safari/534.57.2') != -1;
            $scope.isIE10 = navigator.userAgent.match(/MSIE [6789]/) != null;

            if ($scope.isSafari || $scope.isIE10) {
                $state.go('oldBrowser');
                return;
            }
            $timeout(function () {
                if(!detectflash()) {
                    $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, { data: { message: $filter("i18n")("camera_player_plugin_not_installed")}});
                }

                if($scope.deviceId) {
                    $scope.play($scope.deviceId);
                    $scope.positionTimeout = $timeout(function () {
                        $scope.stopPlay($scope.deviceId);
                    }, 5*60000);
                }
            });
            try {
                $scope.shutter = new Audio('/mp3/camera-shutter.mp3');
            }
            catch (e) {
            }

            $scope.lastTimeHash = devicesService.lastTimeHash;

            document.onkeyup = function (event) {
                var keycode;
                if(!event) var event = window.event;
                if (event.keyCode) keycode = event.keyCode;
                else if(event.which) keycode = event.which;

                if (keycode == 27 && $scope.isOfferShown)
                    $scope.showOfferView();
            };
            if($filter("i18n")("marketing_how_to_sync_camera_content")) { initSyncSteps ();}
            else {
                $scope.$on("localizeResourcesUpdated", initSyncSteps);
            }
        };

        function initSyncSteps() {
            var str = $filter("i18n")("marketing_how_to_sync_camera_content");
            var strs = str.split("\n");
            $scope.syncSteps = [];
            _.each(strs, function (s) {
                if(s) {
                    $scope.syncSteps.push(s.indexOf("o ") == 0 ? s.substr(2) : s);
                }
            });
        };

        $scope.$on(appProperties.appEvents.BODY_CLICK, function(event, obj) {
            if ((obj.target.id == "cameraViews" || obj.target.classList.contains("header") || obj.target.classList.contains("footer")) && $scope.isOfferShown)
                $scope.showOfferView();
        });

        $scope.canRecord = function (camera) {
            return camera.userRole != 'USER';
        };

        $scope.canTakeSnapshot = function (camera) {
            return camera.userRole != 'USER';
        };

        $scope.numOwnCameras = function () {
            return _.reduce($scope.getCameras(), function (memo, camera) {
                return memo + (camera.userId === camera.owner.ownerId ? 1 : 0);
            }, 0)
        };

        $scope.isNoCameras = function () {
            return devicesService.devices && !_.findWhere($scope.getCameras(), {state: appProperties.PROVISIONED_STATE});
        };

        $scope.isScrollable = function () {
            return $scope.scrollable = !!(document.body.clientHeight - document.getElementById("cameraViews").scrollHeight - 120)
        };

        $scope.showOfferView = function () {
            $scope.isOfferShown = !$scope.isOfferShown;
        };

        /*
         True if user has a service plan -- a pure friend user wouldn't have a plan.
         */
        $scope.hasServicePlan = function () {

            // todo:  ROLES
            if ($scope.servicePlan && devicesService.devices) {
                return true;
            } else {
                return false;
            }

        };

        $scope.servicePlanCameraCount = function () {
            return $scope.servicePlan ? $scope.servicePlan.maxCameras : 0;
        };

        /*
         Handles incoming device event.

         @param eventObject object of form:
         {
         deviceId: deviceId,
         prop1: val1,
         prop2: val2,
         ...
         }
         */
        var onDeviceEventHandler = function (eventObject) {

            var camera = devicesService.getDeviceById(eventObject.deviceId);

            if (!camera || !camera.properties) return;

            var stopPlay = false;
            if ((eventObject.activityState == appProperties.CAMERA_SETTINGS_ACTIVITYSTATE_IDLE ||
                eventObject.connectionState == appProperties.UNAVAILABLE_STATE)
                && (startCameras[eventObject.deviceId] && !startCameras[eventObject.deviceId].stopped)) {
                stopPlay = true;
            }

            if(startCameras[eventObject.deviceId] && !startCameras[eventObject.deviceId].stopped &&
                camerasService.isPlayActivity(eventObject.activityState)) {
                startCameras[eventObject.deviceId].streamActive = true;
            }

            //for (var prop in eventObject) {
            //    if (prop != 'deviceId') {
            //        camera.properties[prop] = eventObject[prop];
            //    }
            //}

            if(stopPlay && $scope.deviceId) {
                $scope.stopPlay($scope.deviceId);
            }
            else if (stopPlay && $scope.uiStates[camera.deviceId] && ($scope.uiStates[camera.deviceId].play)) {
                $scope.stopPlay(camera.deviceId);
            }
        };

        /*
         Functions used to stop live streaming on 30 sec timeout
         */
        $scope.$on("$destroy", function () {
            cancel_busy();
            startCameras = {};
            $scope.go = true;
            $timeout.cancel($scope.positionTimeout);
            $timeout.cancel($scope.disableTimeout);
            for(var prop in $scope.uiStates) {
                var state = $scope.uiStates[prop];
                if(state.play) {
                    $scope.stopPlay(prop);
                }
                if(state.loading) {
                    state.loading = false;
                }
            }
        });

        var cancel_busy = $scope.$on(appProperties.appEvents.CAMERA_ERROR, function (event, payload) {
            var deviceId = payload.deviceId;
            if(payload.code != 4015) {
                $scope.startErrors[deviceId] = payload.message;
                $scope.uiStates[deviceId].loading && ($scope.uiStates[deviceId].loading = false);
                $scope.stopPlay(deviceId);
            }
            else {
                if(!startRetries[deviceId]) {
                    startRetries[deviceId] = 1;
                }
                else {
                    startRetries[deviceId] += 1;
                }
                if(startRetries[deviceId] == 4) {
                    startPromises[deviceId] && (startPromises[deviceId].cancel());
                    startPromises[deviceId] = null;
                }
                else {
                    startPromises[deviceId] && (startPromises[deviceId].cancel());
                    $timeout(function () {
                        $scope.play(deviceId);
                    }, 3000);
                }
            }
            if(startPromises[deviceId]) {
                startPromises[deviceId].cancel();
                startPromises[deviceId] = null;
            }
        });

        $scope.$on(appProperties.appEvents.BRIGHTNESS_UPDATED, function (event, deviceId) {
            if(pendingBrightness) {
                $scope.uiStates[deviceId].showBright = false;
                $scope.uiStates[deviceId].brightnessSaved = true;
                $timeout(function () {
                    pendingBrightness--;
                    $scope.uiStates[deviceId].brightnessSaved = false;
                }, 4000);
            }
        });

        $scope.clearStartError = function (deviceId) {
            $scope.startErrors[deviceId] = null;
        };

        $scope.setCameraBright = function (camera) {
            pendingBrightness++;
            cameraSettingsService.updateSettings(camera.parentId, camera.deviceId, { 'brightness': $scope.uiStates[camera.deviceId].brightness});
            $scope.uiStates[camera.deviceId].brightnessUpdating = true;
        };

        $scope.isCameraConnecting = function (camera) {
            return camera.properties && !camera.properties.connectionState;
        };

        $scope.isCameraOnline = function (camera) {
            var bs = devicesService.getDeviceById(camera.parentId);
            if(bs) {
                return bs.properties && bs.properties.connectionState == appProperties.AVAILABLE_STATE && camera.properties && (camera.properties.connectionState == appProperties.AVAILABLE_STATE || camera.properties.connectionState == appProperties.CAMERA_CONNECTION_STATE_BATTERY_CRITICAL);
            }
            return camera.properties && (camera.properties.connectionState == appProperties.AVAILABLE_STATE || camera.properties.connectionState == appProperties.CAMERA_CONNECTION_STATE_BATTERY_CRITICAL);
        };

        $scope.play = function (id) {
            $log.debug('Start play pressed.');
            if(!detectflash()) {
                $scope.startErrors[id] = $filter("i18n")("camera_player_plugin_not_installed");
                return;
            }
            var device = devicesService.getDeviceById(id);
            $scope.uiStates[device.deviceId].loading = true;
            $scope.uiStates[device.deviceId].zoom = false;

            startCameras[id] = {gettingUrl: true};
            startPromises[id] = camerasService.startStream(id, $scope.positionMode);
            startPromises[id].promise.then(function (result) {
                startPromises[id] = null;
                if (!$scope.$$destroyed && result.retried) {
                    return;
                }
                else if ($scope.$$destroyed || result.canceled) {
                    camerasService.stopStream(id);
                    return;
                }
                device = devicesService.getDeviceById(id);

                $log.debug(new Date() +  ": got live stream dynamically:" + device.liveStreamUrl);
                if ($scope.isSafari || $scope.isIE10) {
                    $scope.uiStates[device.deviceId].play = true;
                    $scope.uiStates[device.deviceId].loading = false;
                    $scope.clearStartError(device.deviceId);
                    startRetries[device.deviceId] = 0;
                }
                streamCamera(device);
            }, function (result) {
                startPromises[id] = null;
                if ($scope.$$destroyed || $scope.uiStates[id].play) {
                    camerasService.stopStream(id);
                    return;
                }
                // error

                device = devicesService.getDeviceById(id);
                result && !$scope.startErrors[device.deviceId] && ($scope.startErrors[device.deviceId] = 'Error ' + (result.data.error || '') + ': ' + result.data.message);
                $scope.uiStates[device.deviceId].play = false;
                $scope.uiStates[device.deviceId].loading = false;
                if(startCameras[device.deviceId] && !startCameras[device.deviceId].stopped) {
                    $scope.clearStartError(device.deviceId);
                    $scope.play(device.deviceId);
                }
                else {
                    startCameras[device.deviceId] = null;
                }
            });

        };

        var streamCamera = function (camera) {
            var config = {
                key: '#$47cc9f6a88604d203d3',
                debug: false,
                log: {
                    level: "error",
                    filter: "*"
                },
                onBeforeFullscreen: function()  {
                    if(!this.isFullscreen() && !$scope.maximizeId && !$scope.deviceId) {
                        $scope.maximizeId = camera.deviceId;
                        return false;
                    }
                    else if(!this.isFullscreen()) {
                        $scope.maximizeId = null;
                    }
                    return true;
                },
                play: { opacity: 0 },
                clip: {
                    autoPlay: true,
                    autoBuffering: true,
                    url: camera.liveStreamUrl.slice(-27),
                    live: true,
                    provider: 'influxis',
                    connectionProvider: 'secure',
                    bufferLength: 1,

                    onBufferEmpty: function () {
                        $log.debug("flowplayer buffer empty on device:" + camera.deviceId);
                    },
                    onStart: function () {
                        $log.debug(new Date() +  ": flowplayer started on device: " + camera.deviceId);
                        var device = devicesService.getDeviceById(camera.deviceId);
                        $scope.uiStates[device.deviceId].loading = false;
                        $scope.uiStates[device.deviceId].play = true;
                        $scope.clearStartError(device.deviceId);
                        startRetries[device.deviceId] = 0;
                    },
                    onStop: function () {
                        $log.debug("flowplayer onStop called on device:" + camera.deviceId);
                        this.stop();
                        if(this.isFullscreen()) {
                            this.toggleFullscreen();
                        }
                    },
                    onBufferStop: function () {
                        $log.debug("flowplayer stop buffering called on device:" + camera.deviceId);
                    },
                    onPause: function () {
                        $log.debug("flowplayer onPause called on device:" + camera.deviceId);
                        this.stop();
                    }
                },
                plugins: {
                    influxis: {
                        url: 'flowplayer/flowplayer.rtmp-3.2.13.swf',
                        proxyType: 'best',
                        netConnectionUrl: encodeURIComponent(camera.liveStreamUrl)
                    },
                    secure: {
                        url: 'flowplayer/flowplayer.securestreaming-3.2.9.swf',
                        token: 'PgtFksiOpsIyWZsfejCohmtqGszDkb8REbL3yZLOF6uSUIyFH9etV7QYuLuZ5MA'
                    },
                    controls: {

                        // location of the controlbar plugin
                        url: 'flowplayer/flowplayer.controls-3.2.16.swf',

                        // display properties such as size, location and opacity
                        top: '10px',
                        right: '25px',
                        height: '34px',
                        width: '34px',
                        //bottom: 0,
                        //opacity: 0.95,

                        // styling properties (will be applied to all plugins)
                        background: 'transparent',
                        backgroundGradient: 'none',

                        all: false,
                        fullscreen: true,

                        // tooltips (since 3.1)
                        tooltips: {
                            buttons: false,
                            fullscreen: 'Enter fullscreen mode'
                        }
                    }
                },
                onError: function (code, text) {
                    $log.debug("Flowplayer error " + code + ": " + text);
                    this.stop();
                    if(code == "200") {
                        $scope.play(camera.deviceId);
                        return;
                    }
                    $scope.startErrors[camera.deviceId] = text || "Flowplayer: unknown error";
                    $scope.stopPlay(camera.deviceId);
                }
            };
            var res = $f(camera.deviceId, {
                'src': 'flowplayer/flowplayer.commercial-3.2.18.swf',
                'wmode': "opaque",
                onFail: function () {
                    $scope.uiStates[camera.deviceId].loading = false;
                    $scope.startErrors[camera.deviceId] = $filter("i18n")("camera_player_plugin_not_installed");
                    $log.debug('Flash not installed.');
                }
            }, config).play();
            detectflashDisable();
        };

        $scope.stopPlay = function (id) {
            if($scope.uiStates[id].recordRequest || $scope.uiStates[id].snapshotRequest) { return;}
            $scope.normalExit = true;
            startCameras[id].stopped = true;
            var device = devicesService.getDeviceById(id);
            if(!device) { return;}

            $scope.uiStates[id].play = false;
            $scope.uiStates[id].record = false;
            $scope.uiStates[id].showBright = false;
            $scope.uiStates[id].loading = true;
            $scope.stopTimeouts[id] = true;
            $timeout(function () {
                $scope.stopTimeouts[id] = null;
            }, 1000);
            //device.properties.activityState = '';
            var flplayer = $f(id);
            if (flplayer) {
                flplayer.pause();
                flplayer.unload();
            }

            $scope.uiStates[device.deviceId].loading = false;
            $scope.maximizeId = null;
            $log.info("stream on camera:" + id + " successfully stopped");
            if ($scope.deviceId && !$scope.go) {
                $state.go('settings.camera', {deviceId: $scope.deviceId});
            }
        };

        function checkTZ(camera) {
            var bs = devicesService.getBaseStationById(camera.parentId);
            if(bs && !bs.properties.olsonTimeZone) {
                uiService.info($filter("i18n")("timezone_error"));
                return false;
            }
            return true;
        };

        $scope.startRecord = function (id) {
            var device = devicesService.getDeviceById(id);
            if(!checkTZ(device)) { return;}

            $scope.uiStates[device.deviceId].recordRequest = true;
            var promise = camerasService.startRecord(device);
            promise.then(function () {
                    $log.debug("started recording");
                    device = devicesService.getDeviceById(id);
                    $scope.uiStates[device.deviceId].recordRequest = false;
                    $scope.uiStates[device.deviceId].record = true;
                },
                function (data) {
                    device = devicesService.getDeviceById(id);
                    $scope.uiStates[device.deviceId].recordRequest = false;
                    $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, data);
                });
        };

        $scope.stopRecord = function (id) {

            // todo:  ROLES

            var device = devicesService.getDeviceById(id);
            $scope.uiStates[device.deviceId].recordRequest = true;
            var promise = camerasService.stopRecord(id);
            promise.then(function () {
                    $log.debug("stop recording call returned ");
                    device = devicesService.getDeviceById(id);
                    $scope.uiStates[device.deviceId].recordRequest = false;
                    $scope.uiStates[device.deviceId].record = false;
                },
                function (data) {
                    device = devicesService.getDeviceById(id);
                    $scope.uiStates[device.deviceId].recordRequest = false;
                    $scope.uiStates[device.deviceId].record = false;
                    $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, data);
                });
        };

        $scope.takeSnapshot = function (id) {
            var device = devicesService.getDeviceById(id);
            if(!checkTZ(device)) { return;}

            $scope.shutter && $scope.shutter.play();
            $scope.uiStates[device.deviceId].snapshotRequest = true;
            var promise = camerasService.takeSnapshot(device);
            promise.then(function () {
                    device = devicesService.getDeviceById(id);
                    $scope.uiStates[device.deviceId].snapshotRequest = false;
                    $log.debug("snapshot taken");
                },
                function (data) {
                    device = devicesService.getDeviceById(id);
                    $scope.uiStates[device.deviceId].snapshotRequest = false;
                    $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, data);
                });
        };

        $scope.filterByCamera = function (camera) {
            //todo: implement files filter
            calendarService.createStateParams();
            calendarService.stateParams.cameraIds = [camera.deviceId];
            calendarService.gotoCalendarView();
        };

        $scope.toggleFullscreen = function (camera) {
            $scope.maximizeId = $scope.maximizeId ? null : camera.deviceId;
        };

        $scope.isRecording = function (camera) {
            if(camera.properties && [appProperties.CAMERA_ACTIVITYSTATE_ALERT_STREAM_ACTIVE,
                    appProperties.CAMERA_ACTIVITYSTATE_ALERT_WATCH].indexOf(camera.properties.activityState)!= -1) {
                return true;
            }
            return $scope.uiStates[camera.deviceId] && $scope.uiStates[camera.deviceId].record;
        };

        $scope.getLastTime = function (camera) {
            if(!$scope.lastTimeHash[camera.deviceId]) { return "";}

            var tz;
            var bs = devicesService.getBaseStationById(camera.parentId);
            if(bs && bs.properties && bs.properties.olsonTimeZone) {
                tz = bs.properties.olsonTimeZone;
            }
            else if(camera.properties.olsonTimeZone) {
                tz = camera.properties.olsonTimeZone;
            }
            return tz ? $filter("date")($filter("toBSTime")($scope.lastTimeHash[camera.deviceId], tz), "short") : "";
        };
    })

    /*
     Provides business logic for the calendar or month's view.
     */
    .controller('CalendarCtrl', function ($scope, $rootScope, $stateParams, $state, $modal, $filter, $log, devicesService, calendarService, libraryService, appProperties, dayService, utilService, metadataService, recordingsService, calendarNamesService) {

        $scope.todayDisable = $scope.firstDisable = $scope.prevDisable = $scope.nextDisable = true;

        $scope.init = function () {
            $log.debug('entering init of calendar controller');
            $scope.$parent.selectMode = false;
            $rootScope.selectAllMode = false;

            devicesService.initDevices().then(function () {
                // set correct favorites filter setting upon arriving at page
                if ($stateParams.favorites) {
                    libraryService.setFavorites($stateParams.favorites);
                }
                $scope.favorites = libraryService.favorites;

                var cameraIds = $stateParams.cameraIds.split(",") == appProperties.CAMERAS_ALL_SELECTED
                    ? devicesService.getAvailableCameraIds()
                    : $stateParams.cameraIds.split(",");

                $scope.deviceIds = $stateParams.cameraIds;
                libraryService.setSelectedCamerasFromIds(cameraIds);


                if ($stateParams.month) {
                    $scope.month = calendarService.month = $stateParams.month;
                } else { // get remembered selected month setting
                    $scope.month = calendarService.month;
                }

                loadCalendar();
            });
            this.names = calendarNamesService.getCalendar();
        };

        function loadCalendar(first) {
            $scope.todayDisable = $scope.firstDisable = $scope.prevDisable = $scope.nextDisable = true;

            $scope.month = calendarService.month;
            $scope.currentMonth = dayService.getToday().substring(0,6);
            $scope.lastMonth = calendarService.month == $scope.currentMonth;

            calendarService.decrementMonth();
            $scope.nextMonth = calendarService.month == $scope.currentMonth;
            calendarService.incrementMonth();

            $scope.isLastDayOfMonth = dayService.getToday() == ($scope.month + calendarService.getLastDayOfMonth($scope.month));

            $scope.loading = true;

            var promise = calendarService.refreshData();

            promise.then(function () {
                $scope.weeks = calendarService.weeks;
                // favorites is a string containing the favorites filterireng preference
                $scope.favorites = libraryService.favorites;
                // options of favorites filtering prefrences
                $scope.favoritesOptions = appProperties.favoritesOptions;
                // array of camera ids as strings
                $scope.cameras = libraryService.cameras;
                $scope.selectedCameras = libraryService.selectedCameras;

                if ((!calendarService.stateParams.day || first || calendarService.getNumRecordingsOnDay(calendarService.stateParams.day) == 0)) {
                    // load day state
                    var day = first ? calendarService.getFirstRecordingsDay() : calendarService.getDayDate(calendarService.getMostRecentRecordingsDay());

                    if(calendarService.stateParams.day != day) {
                        calendarService.stateParams.day = day;
                        calendarService.gotoCalendarView($scope.recycleModeEnable);
                        return;
                    }
                    //$state.go('calendar.day', {day: day});
                }
                utilService.gaSend($scope.isFiltered() ? "Library_Filtered_web": "Library_web");

                var firstRecordDatePromise = metadataService.getFirstMetadata(true);
                firstRecordDatePromise.then(function(date){
                    $scope.firstDisable = date
                        ? date.substring(0, 6) == $scope.month
                        : true;

                    $scope.todayDisable = date
                        ? ($scope.month == $filter('date')(new Date(), "yyyyMM"))
                        : true;

                    $scope.prevDisable = $scope.nextMonth
                        ? false
                        : date
                            ? +date.substring(0, 6) >= +$scope.month
                            : true;

                    $scope.nextDisable = $scope.nextMonth
                        ? true
                        : $scope.isLastDayOfMonth
                            ? false
                            : $scope.currentMonth == $scope.month
                                ? true
                                : false;
                });
            })['finally'](function() {
                $scope.loading = false;
            });

            return promise;
        }

        $scope.goToRecycle = function() {
            $state.go("calendar.recycled", angular.copy($stateParams));
        };

        $scope.getDay = function (day) {
            var result = $scope.month + (day < 10 ? '0' + day : day);
            return result;
        };

        //used in css class name
        $scope.getDayType = function (day) {
            var css = 'calendar-day';

            if (day.numLibraryRecordings > 0) {
                if ($scope.isFiltered()) {
                    css += ' calendar-day-filter';
                }
                css += ' calendar-day-video';
            }

            return css;
        };

        $scope.getCameras = function () {
            if ($scope.selectedCameras) {
                return $scope.selectedCameras;
            }
            if (devicesService.devices && !$scope.isFiltered()) {
                $scope.cameras = _.filter(devicesService.devices, function (camera) {
                    return camera.deviceType == appProperties.CAMERA_DEVICE_TYPE && (camera.state == appProperties.PROVISIONED_STATE || camera.state == appProperties.SYNCED_STATE);
                });
                $scope.sortDevices();
                return $scope.cameras;
            }

            return [];
        };

        $scope.sortDevices = function () {
            $scope.cameras = $filter('orderBy')($scope.cameras, "displayOrder");
        };

        $scope.reloadCalendar = function () {
            if($scope.$parent.selectMode)
                $scope.toggleSelectMode();
            loadCalendar();
        };

        //used in css class name
        $scope.getCellType = function (day, week) {
            var css = '';

            if (day.dayOfMonth) {
                var today = dayService.getToday();
                var currentDay = $scope.month + (day.dayOfMonth < 10 ? '0' : '') + day.dayOfMonth;
                if (day && currentDay == today) {
                    css += ' calendar-day-white calendar-day-today';
                }
                else if (!$scope.lastMonth || parseInt(today) > parseInt(currentDay)) {
                    css += ' calendar-day-white';
                }
            }
            else if (!$scope.lastMonth || week == 0) {
                css += ' calendar-day-white';
            }
            return css;
        };

        $scope.getRecordings = function () {
            if (!recordingsService.recordings || !$scope.favorites || !$scope.selectedCameras) {
                return [];
            }
            return _.filter(recordingsService.recordings, function (recording) {
                return ($scope.favorites.value == 'all' ||
                    ($scope.favorites.value == 'only' && recording.currentState == appProperties.FAVORITE_STATE) ||
                    ($scope.favorites.value == 'non' && recording.currentState != appProperties.FAVORITE_STATE)) &&
                    _.findWhere($scope.selectedCameras, {deviceId: recording.deviceId});
            });
        };

        $scope.toggleSelectMode = function () {
            $scope.$parent.selectMode = !$scope.$parent.selectMode;
            recordingsService.selectMode = $scope.$parent.selectMode;
            if (!$scope.$parent.selectMode) { // reset to deselected if necessary
                var recordings = $scope.getRecordings();
                for (var i = 0; i < recordings.length; i++) {
                    recordings[i].selected = false;
                }
                $rootScope.selectAllMode = false;
            }
            else {
                utilService.gaSend("Library_Selection_web");
            }
        };

        $scope.isFiltered = function () {
            // return if favorites is undefined
            // todo: fix this case
            if (!$scope.favorites) return false;

            if(libraryService.selectedCameras) {
                var count = devicesService.getAvailableCameraIds().length;
                return $scope.favorites.value != appProperties.favoritesOptions[0].value || count != libraryService.selectedCameras.length;
            }
        };

        $scope.isRecords = function () {
            return metadataService.metadata && metadataService.metadata[calendarService.stateParams.day];
        };

        $scope.prev = function () {
            if (!$scope.prevDisable) {
                $scope.todayDisable = $scope.firstDisable = $scope.prevDisable = $scope.nextDisable = true;
                var id = utilService.nextId();
                $rootScope.$broadcast('queueStatus',
                    {
                        id: id,
                        type: 'progress',
                        text: 'loading previous month'
                    });
                calendarService.decrementMonth();
                calendarService.stateParams.month = calendarService.month;
                calendarService.stateParams.day = '';
                loadCalendar().then(function () {
                    $rootScope.$broadcast('dequeueStatus', id);
                });
            }
        };

        $scope.next = function () {
            if (!$scope.nextDisable) {
                $scope.todayDisable = $scope.firstDisable = $scope.prevDisable = $scope.nextDisable = true;
                if ($scope.nextMonth) return;

                var id = utilService.nextId();
                $rootScope.$broadcast('queueStatus',
                    {
                        id: id,
                        type: 'info',
                        text: 'loading next month'
                    });
                calendarService.incrementMonth();
                calendarService.stateParams.month = calendarService.month;
                calendarService.stateParams.day = '';
                loadCalendar().then(function () {
                    $rootScope.$broadcast('dequeueStatus', id);
                });
            }
        };

        $scope.removeFilter = function () {
            calendarService.stateParams.cameraIds = "all";
            calendarService.stateParams.favorites = "all";
            calendarService.gotoCalendarView();
        };

        /*
         Take calendar to start of library.
         */
        $scope.first = function () {
            $scope.todayDisable = $scope.firstDisable = $scope.prevDisable = $scope.nextDisable = true;
            var promise = calendarService.getFirst();
            promise.then(function () {
                var day = calendarService.getFirstRecordingsDay();
                calendarService.month = calendarService.stateParams.month = day.substring(0, 6);
                calendarService.stateParams.day = day;
                calendarService.gotoCalendarView();
            });
        };

        /*
         Take calendar to today.
         */
        $scope.today = function () {
            $scope.todayDisable = $scope.firstDisable = $scope.prevDisable = $scope.nextDisable = true;
            var today = dayService.getToday();
            calendarService.month = calendarService.stateParams.month = today.substring(0, 6);
            calendarService.stateParams.day = today;
            calendarService.gotoCalendarView();
        };

        $scope.getDayDisplay = function (day) {
            return !day ? 'Please select date' : $filter('dayText')(day);
        };

        $scope.gotoDay = function (day) {
            if (day.numLibraryRecordings > 0) {
                if($scope.$parent.selectMode)
                    $scope.toggleSelectMode();

                calendarService.stateParams.day = $scope.getDay(day.dayOfMonth);
                calendarService.gotoCalendarView();
                //$state.go('calendar.day', { 'day': $scope.getDay(day.dayOfMonth)});
            }
        };

    })

    .controller('DayCtrl', function ($scope, $rootScope, $state, $stateParams, $modal, $log, appProperties, dayService, libraryService, calendarService, recordingsService, devicesService) {
        var inited;
        $scope.init = function () {
            $log.debug('entering init of day controller');
            calendarService.stateParams = angular.copy($stateParams);
            $scope.libraryMode = true;
            //$rootScope.$on('update_recording', refresh);
            dayService.day = calendarService.stateParams.day;
            devicesService.initDevices().then(function () {
                refresh();
            });
            if(dayService.day == dayService.getToday()) {
                $scope.$on(appProperties.appEvents.MEDIA_UPLOAD_NOTIFICATION, function () {
                    dayService.refreshData();
                });
            }
        };

        var refresh = function () {
            $rootScope.$broadcast("recycleModeDisable");
            recordingsService.selectMode = false;
            $scope.day = calendarService.stateParams.day;
            // set default view favorites upon arriving at page
            libraryService.setFavorites($stateParams.favorites);

            var cameraIds = $stateParams.cameraIds.split(",") == appProperties.CAMERAS_ALL_SELECTED
                ? devicesService.getAvailableCameraIds()
                : $stateParams.cameraIds.split(",");

            libraryService.setSelectedCamerasFromIds(cameraIds);

            // favorites is a string containing the favorites filtering preference
            $scope.favorites = libraryService.favorites;
            // options of favorites filtering prefrences
            $scope.favoritesOptions = appProperties.favoritesOptions;

            $scope.month = calendarService.month;
            if (cameraIds.length == 0) { // no selected cameras
                $scope.selectedCameras = libraryService.selectedCameras;
            } else {
                var promise = dayService.refreshData();
                promise.then(function () {
                    $scope.selectedCameras = libraryService.selectedCameras;
                    $scope.selectedRecordings = [];
                    var recordings = recordingsService.recordings;

                    for (var i = 0; i < recordings.length; i++) {
                        recordings[i].friendRecording = $scope.isFriendRecording(recordings[i]) ? true : false;
                        $scope.selectedRecordings[i] = false;
                    }
                    inited = true;
                });
            }
        };

        $scope.getRecordings = function () {
            if (!inited || !recordingsService.recordings || !$scope.favorites || !$scope.selectedCameras) {
                return null;
            }

            return _.filter(recordingsService.recordings, function (recording) {
                return ($scope.favorites.value == 'all' ||
                    ($scope.favorites.value == 'only' && recording.currentState == appProperties.FAVORITE_STATE) ||
                    ($scope.favorites.value == 'non' && recording.currentState != appProperties.FAVORITE_STATE)) &&
                    _.findWhere($scope.selectedCameras, {deviceId: recording.deviceId});
            });
        };

        $scope.getSelectableRecordings = function () {
            var recordings = $scope.getRecordings();
                return _.filter(recordings, function (recording) {
                    return recording.friendRecording == false;
            });
        };

        /*
         Puts the view into edit mode.  In edit mode user can select any combination of videos and perform an operation.
         The operations available are move to recycle and favorite.  When the user clicks edit mode, touching(clickin)
         on a recording image no longer goes to the recording view.  Instead the containing div becomes selected for the
         operation.  When the user clicks (touches) edit mode button, the edit mode button changes to a done button,
         and two new buttons appear.   The new buttons for edit mode are recycle and favorite.  Clicking favorite when
         one or more recordings is selected causes those recordings to be favorited and deselected.  Clicking recycle
         when one or more recordings is selected causes those recordings to be marked as recycle and they no longer
         appear in any view (except for the recycle bin view).
         */

        $scope.getSelectedCount = function () {
            return _.reduce(recordingsService.recordings, function(memo, value){
                value.selected && (memo++);
                return memo;
            }, 0);
        };

        $scope.selectRecording = function (index) {
            var recordings = recordingsService.recordings;

            if ($scope.$parent.selectMode) { // toggle value of selected
                if(!$scope.isFriendRecording(recordings[index])) {
                    recordings[index].selected = !recordings[index]["selected"];
                    if ($scope.getSelectableRecordings().length == $scope.getSelectedCount()) {
                        $rootScope.selectAllMode = true
                    }

                    if (!recordings[index].selected) {
                        $rootScope.selectAllMode = false
                    }
                }
            } else { // present video
                $state.go('recording', {recordingNumber: index, favorites: $scope.favorites.value, cameraIds: $stateParams.cameraIds});
            }
        };

        /*
         Checks if user has permission to make a selection.
         */
        $scope.canSelect = function () {
            return !devicesService.isPureUser();
        };

        $scope.isVideo = function (rec) {
            return rec.contentType == appProperties.videoFormat;
        };

        $scope.isFavorite = function (recording) {
            return recording.currentState == appProperties.FAVORITE_STATE;
        };

        $scope.isFriendRecording = function (recording) {
            var cam = _.findWhere(devicesService.allDevices, {deviceId: recording.deviceId});
            return !cam || cam.userRole == appProperties.USER_ROLE_USER;
        };

        $scope.isSelectMode = function () {
            return recordingsService.selectMode
        };

        $scope.showFilter = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/calendarFilterView.html',
                controller: 'CalendarFilterCtrl',
                backdrop: 'static'
            });
        };

        //{"deviceId":"3T21457X0002E","createdDate":"20141230","currentState":"favorite","name":"1419942455358","contentType":"video/mp4","reason":"record","createdBy":"100-3556","lastModified":1419942918189,"localCreatedDate":1419942455358,"presignedContentUrl":"https://vzs3-dev.s3.amazonaws.com/c0fe8b49_1939_408d_9291_92d1abb41f09/100-3556/3T21457X0002E/recordings/1419942455358.mp4?AWSAccessKeyId=AKIAJ7Z7XWLXAUFJZRPA&Expires=1425537530&Signature=QpH7jgzu5mpkXh%2B0yXLA2GPj%2FN0%3D","presignedThumbnailUrl":"https://vzs3-dev.s3.amazonaws.com/c0fe8b49_1939_408d_9291_92d1abb41f09/100-3556/3T21457X0002E/recordings/1419942455358_thumb.jpg?AWSAccessKeyId=AKIAJ7Z7XWLXAUFJZRPA&Expires=1425537530&Signature=vtdUiX6foVhmhoQ1PZfqrqrkL10%3D","utcCreatedDate":1419942455358,"timeZone":"America/Los_Angeles","mediaDuration":"00:07:40"}
    })

    .controller('SelectAllCtrl', function ($scope, $rootScope, $state, $stateParams, $filter, $interval, appProperties, recordingsService, devicesService) {
        $scope.getRecordings = function () {
            if (!recordingsService.recordings || !$scope.favorites || !$scope.selectedCameras) {
                return [];
            }

            return _.filter(recordingsService.recordings, function (recording) {
                return ($scope.favorites.value == 'all' ||
                    ($scope.favorites.value == 'only' && recording.currentState == appProperties.FAVORITE_STATE) ||
                    ($scope.favorites.value == 'non' && recording.currentState != appProperties.FAVORITE_STATE)) &&
                    _.findWhere($scope.selectedCameras, {deviceId: recording.deviceId});
            });
        };

        $scope.getSelectableRecordings = function () {
            var recordings = $scope.getRecordings();
            for (var i = 0; i < recordings.length; i++) {
                recordings[i].friendRecording = $scope.isFriendRecording(recordings[i]) ? true : false;
            }
            return _.filter(recordings, function (recording) {
                return recording.friendRecording == false;
            });
        };

        $scope.toggleSelectAll = function () {
            if (!$scope.getSelectableRecordings().length)
                return;

            $rootScope.selectAllMode = !$rootScope.selectAllMode;

            var recordings = $scope.getRecordings();
            for (var i = 0; i < recordings.length; i++) {
                if (!$scope.isFriendRecording(recordings[i])) {
                    recordings[i].selected = $rootScope.selectAllMode ? true : false;
                }
            }
        };

        $scope.isSelectMode = function () {
            return recordingsService.selectMode
        };

        $scope.isFriendRecording = function (recording) {
            var cam = _.findWhere(devicesService.allDevices, {deviceId: recording.deviceId});
            return !cam || cam.userRole == appProperties.USER_ROLE_USER;
        };

    })

    .controller('RecordingCtrl', function ($scope, $rootScope, $state, $stateParams, $filter, $interval, appProperties, recordingsService, calendarService, libraryService, devicesService) {
        $scope.init = function () {
            if (!Modernizr.video || (navigator.userAgent.toLowerCase().indexOf("mac") != -1 && navigator.userAgent.toLowerCase().indexOf("firefox") != -1)) {
                $scope.oldBrowser = true;
            }
            // todo: check validity of $stateParams.recordingNumber
            $scope.recordload = false;
            $scope.recordings = recordingsService.recordings;
            $scope.recordingNumber = $stateParams.recordingNumber;
            $scope.recording = recordingsService.recordings[$scope.recordingNumber];

            $scope.time = 0;
            $scope.duration = 0;
            $scope.timePercent = 0;
            $scope.playbackRate = 1;
            $scope.isIE10 = navigator.userAgent.match(/MSIE 10/) != null;

            recordingsService.setCurrent($scope.recording);
            $scope.recordingImageUrl = $scope.recording.presignedThumbnailUrl;

            devicesService.initDevices().then(function () {
                var date = $filter('toBSTime')($scope.recording.utcCreatedDate, $scope.recording.timeZone);
                $scope.videoDate = $filter('dayText')($filter('date')(date, "yyyyMMdd"));
                $scope.isLoadingVideo = $scope.loaded = false;

                $scope.recordingNext = recordingsService.getNextContent($scope.recordingNumber, $stateParams);
                $scope.recordingPrev = recordingsService.getPreviousContent($scope.recordingNumber, $stateParams);

                $scope.playing = false;
                $scope.pause();
                $scope.recordload = true;
                $scope.screenfull = screenfull;
            })
        };
        $scope.$on("recording-deleted", function (event, data) {
            event.stopPropagation();
            // force reload of view information
            $scope.playing = false;
            $scope.pause();
            $scope.setVideoPosition (0);

            if ((data[1]-data[0])>1) {
                $state.go('recording', {
                    recordingNumber: data[1]-1,
                    favorites: libraryService.favorites.value,
                    cameraIds: $stateParams.cameraIds
                });
            } else {
                $scope.init();
            }
        });

        $scope.getCameras = function () {
            return _.filter(devicesService.allDevices, function (camera) {
                return  (camera.deviceType == appProperties.CAMERA_DEVICE_TYPE && camera.state == appProperties.PROVISIONED_STATE) ||
                    (camera.deviceType == appProperties.CAMERA_DEVICE_TYPE && camera.mediaObjectCount);
            })
        };

        $scope.setSliderPosition = function (percent) {
            if(!$scope.playing) { return;}
            var el = document.getElementById('recordedVideo');
            if (el.duration) {
                $scope.time = percent * el.duration / 100;
                $scope.timePercent = percent;
            }
            else {
                $scope.time = 0;
                $scope.timePercent = 0;
            }
            $scope.setVideoPosition(percent);
        };

        $scope.getRecordingDuration = function () {
            return $scope.duration ? $filter('secToString')($scope.duration) : '00:00:00';
        };

        $scope.sliderClick = function (event) {
            if ($scope.playing && $scope.duration > 0) {
                var X = event.offsetX;
                if(!event.hasOwnProperty('offsetX')) {
                    var target  = event.target || event.srcElement,
                        rect    = target.getBoundingClientRect(),
                        X = event.clientX - rect.left;
                }

                var w = 100 * (X - 5) / angular.element(event.currentTarget).prop('offsetWidth');
                $scope.setSliderPosition(w);

                var video = document.getElementById('recordedVideo');
                video.currentTime = w * video.duration / 100;
            }
        };

        $scope.setVideoPosition = function (percent) {
            if ($scope.duration > 0) {
                var video = document.getElementById('recordedVideo');
                video.currentTime = percent * video.duration / 100;
            }
        };

        $scope.isVideo = function () {
            return $scope.recording.contentType == appProperties.videoFormat;
        };

        $scope.prevContent = function () {
            if ($scope.isVideo() && $scope.playing) {
                $scope.pause();
            }
            var content = recordingsService.getPreviousContent($scope.recordingNumber, $stateParams);
            $state.go('recording', {recordingNumber: content.recordingNumber});
        };

        $scope.play = function () {
            if($scope.isIE10) {
                if(!$scope.player) {
                    $scope.player = $f('recordedVideo2', {
                        'src': 'flowplayer/flowplayer.commercial-3.2.18.swf',
                        'wmode': "opaque",
                        onFail: function () {
                            //$scope.uiStates[camera.deviceId].loading = false;
                            //$scope.startErrors[camera.deviceId] = $filter("i18n")("camera_player_plugin_not_installed");
                            $log.debug('Flash not installed.');
                        }
                    }, {
                        key: '#$47cc9f6a88604d203d3',
                        debug: false,
                        log: {
                            level: "error",
                            filter: "*"
                        },
                        clip: {
                            url: $scope.recording.presignedContentUrl.replace(/%/gi, '%25'),
                            autoBuffering: true,
                            autoPlay: true,
                            bufferLength: 1,
                            metaData: false
                        },
                        plugins: {
                            controls: {
                                volume: false,
                                mute: false,
                                tooltipTextColor: '#ffffff',
                                callType: 'default',
                                sliderColor: '#d7d7d7',
                                tooltipColor: '#000000',
                                bufferGradient: 'none',
                                timeColor: '#333333',
                                buttonColor: '#888888',
                                backgroundColor: '#ffffff',
                                buttonOverColor: '#888888',
                                sliderBorder: '1px solid rgba(215, 215, 215, 1.0)',
                                backgroundGradient: 'none',
                                buttonOffColor: 'rgba(130,130,130,1)',
                                timeBorder: '0px solid rgba(0, 0, 0, 0.3)',
                                sliderGradient: 'none',
                                progressGradient: 'none',
                                borderRadius: '0',
                                timeBgColor: 'rgb(0, 0, 0, 0)',
                                timeSeparator: ' ',
                                durationColor: '#333333',
                                disabledWidgetColor: '#555555',
                                autoHide: 'never',
                                progressColor: '#06a94e',
                                bufferColor: '#d7d7d7',
                                height: 42,
                                opacity: 1.0
                            }
                        }
                    });
                }
                $scope.player.play();
                $scope.playing = $scope.loaded =true;
                return;
            }
            var v = document.getElementById('recordedVideo');
            if(!$scope.loaded) {
                $scope.isLoadingVideo = $scope.loaded = true;
                v.innerHTML = "";
                var source = document.createElement('source');
                source.src = $scope.recording.presignedContentUrl;
                source.type = "video/mp4";
                v.appendChild(source);
                v.load();
            }

            $scope.playbackRate = 1;
            v.playbackRate = $scope.playbackRate;
            v.play();
            $scope.playing = true;
        };

        $scope.pause = function () {
            if($scope.isIE10) {
                $scope.player.stop();
            }
            else {
            var v = document.getElementById('recordedVideo');
            v.pause();
            }
            $scope.playing = false;
        };

        $scope.nextContent = function () {
            if ($scope.isVideo() && $scope.playing) {
                $scope.pause();
            }
            var content = recordingsService.getNextContent($scope.recordingNumber, $stateParams);
            $state.go('recording', {recordingNumber: content.recordingNumber});
        };

        $scope.gotoCalendarView = function () {
            devicesService.initDevices().then(
                function () {
                    calendarService.gotoCalendarView();
                });
        };

        $scope.fullScreen = function () {
            var v = document.getElementById('recordedVideo');
            if (screenfull.enabled) {
                screenfull.request(v);
            }
        };
    })

    .controller("SharedRecordingCtrl", function($scope, $rootScope, $stateParams, $filter, $timeout, appProperties, recordingsService) {
        $scope.init = function () {
            $scope.loading = true;
            if (!Modernizr.video || (navigator.userAgent.toLowerCase().indexOf("mac") != -1 && navigator.userAgent.toLowerCase().indexOf("firefox") != -1)) {
                $scope.oldBrowser = true;
            }
            $scope.token = $stateParams.token;
            recordingsService.getSharedRecordings($scope.token).then(
                function (result) {
                    $scope.recordings = result.data;
                    $scope.recording = result.data[0];
                    initRecording();
                },
                function (result) {
                    $scope.error = true;
                    $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result);
                }
            )["finally"](function () {
                $scope.loading = false;
            });
            $scope.screenfull = screenfull;
            $scope.isIE10 = navigator.userAgent.match(/MSIE 10/) != null;
        };

        function initRecording () {
            $scope.playing = false;
            $scope.time = 0;
            $scope.duration = 0;
            $scope.timePercent = 0;
            $scope.playbackRate = 1;
            $scope.isLoadingVideo = $scope.loaded = false;
            if(!$scope.isVideo($scope.recording)) {
                $scope.recordingImageUrl = $scope.recording.presignedContentUrl;
            }
        };

        $scope.setSliderPosition = function (percent) {
            if (!$scope.playing) {
                return;
            }
            var el = document.getElementById('recordedVideo');
            if (el.duration) {
                $scope.time = percent * el.duration / 100;
                $scope.timePercent = percent;
            }
            else {
                $scope.time = 0;
                $scope.timePercent = 0;
            }
            $scope.setVideoPosition(percent);
        };

        $scope.getRecordingDuration = function () {
            return $scope.duration ? $filter('secToString')($scope.duration) : '00:00:00';
        };

        $scope.sliderClick = function (event) {
            if ($scope.playing && $scope.duration > 0) {
                var X = event.offsetX;
                if(!event.hasOwnProperty('offsetX')) {
                    var target  = event.target || event.srcElement,
                        rect    = target.getBoundingClientRect(),
                        X = event.clientX - rect.left;
                }

                var w = 100 * (X - 5) / angular.element(event.currentTarget).prop('offsetWidth');
                $scope.setSliderPosition(w);

                var video = document.getElementById('recordedVideo');
                video.currentTime = w * video.duration / 100;
            }
        };

        $scope.setVideoPosition = function (percent) {
            if ($scope.duration > 0) {
                var video = document.getElementById('recordedVideo');
                video.currentTime = percent * video.duration / 100;
            }
        };

        $scope.isVideo = function (record) {
            return record && record.presignedContentUrl.indexOf(".mp4?") != -1;
        };

        $scope.play = function () {
            if ($scope.isIE10) {
                if (!$scope.player) {
                    $scope.player = $f('recordedVideo2', {
                        'src': 'flowplayer/flowplayer.commercial-3.2.18.swf',
                        'wmode': "opaque",
                        onFail: function () {
                            //$scope.uiStates[camera.deviceId].loading = false;
                            //$scope.startErrors[camera.deviceId] = $filter("i18n")("camera_player_plugin_not_installed");
                            $log.debug('Flash not installed.');
                        }
                    }, {
                        key: '#$47cc9f6a88604d203d3',
                        debug: false,
                        log: {
                            level: "error",
                            filter: "*"
                        },
                        clip: {
                            url: $scope.recording.presignedContentUrl.replace(/%/gi, '%25'),
                            autoBuffering: true,
                            autoPlay: true,
                            bufferLength: 1,
                            onStart: function () {

                                $scope.$apply(function () {
                                    $scope.loaded = true;
                                    $scope.isLoadingVideo = false;
                                    $scope.playing = true;
                                });
                            },
                            onResume: function () {
                                $scope.$apply(function () {
                                    $scope.playing = true;
                                });
                            },
                            onBeforePause: function () {
                                $scope.$apply(function () {
                                    $scope.playing = false;
                                });
                            },
                            onFinish: function () {
                                $scope.$apply(function () {
                                    $scope.playing = false;
                                });
                            }
                        },
                        plugins: {
                            controls: {
                                volume: false,
                                mute: false,
                                tooltipTextColor: '#ffffff',
                                callType: 'default',
                                sliderColor: '#d7d7d7',
                                tooltipColor: '#000000',
                                bufferGradient: 'none',
                                timeColor: '#333333',
                                buttonColor: '#888888',
                                backgroundColor: '#ffffff',
                                buttonOverColor: '#888888',
                                sliderBorder: '1px solid rgba(215, 215, 215, 1.0)',
                                backgroundGradient: 'none',
                                buttonOffColor: 'rgba(130,130,130,1)',
                                timeBorder: '0px solid rgba(0, 0, 0, 0.3)',
                                sliderGradient: 'none',
                                progressGradient: 'none',
                                borderRadius: '0',
                                timeBgColor: 'rgb(0, 0, 0, 0)',
                                timeSeparator: ' ',
                                durationColor: '#333333',
                                disabledWidgetColor: '#555555',
                                autoHide: 'never',
                                progressColor: '#06a94e',
                                bufferColor: '#d7d7d7',
                                height: 42,
                                opacity: 1.0
                            }
                        }
                    });
                }
                $scope.playing = false;
                $scope.isLoadingVideo = true;
                $scope.player.play();
                return;
            }
            var v = document.getElementById('recordedVideo');
            if(!$scope.loaded) {
                $scope.isLoadingVideo = $scope.loaded = true;
                v.innerHTML = "";
                var source = document.createElement('source');
                source.src = $scope.recording.presignedContentUrl;
                source.type = "video/mp4";
                v.appendChild(source);
                v.load();
            }

            $scope.playbackRate = 1;
            v.playbackRate = $scope.playbackRate;
            v.play();
            $scope.playing = true;
        };

        $scope.pause = function () {
            if ($scope.isIE10) {
                $scope.player.stop();
                $scope.playing = false;
            }
            else {
            var v = document.getElementById('recordedVideo');
            v.pause();
            }
            $scope.playing = false;
        };

        $scope.selectRecording = function (record) {
            if (record == $scope.recording) {
                return;
            }

            if ($scope.playing) {
                $scope.pause();
                $scope.recording = record;
                $timeout(function () {
                    initRecording();
                    $timeout(function () {
                        $scope.play();
                    });
                });
            }
            else {
                $scope.recording = record;
                $timeout(function () {
                    initRecording();
                });
            }
            if($scope.player) {
                $scope.player.unload();
                $scope.player = null;
            }
        };

        $scope.fullScreen = function () {
            var v = document.getElementById('recordedVideo');
            if (screenfull.enabled) {
                screenfull.request(v);
            }
        };

        $scope.goHome = function () {
            location.href = "/";
        };

        $scope.getZIndex = function () {
            return $scope.loaded ? 6 : 0;
        }
    })

    .controller('SettingsCtrl', function ($scope, $rootScope, $state, $stateParams, appProperties, baseStationService, devicesService, cameraSettingsService, friendsService, userService, servicePlanService) {

        $scope.init = function () {
            $scope.noServisePlan = true;
            $scope.onLoad = false;

            var promise = devicesService.initDevices();
            promise.then(function () {
                servicePlanService.getPurchasedPlans().then(
                    function(){
                        $scope.noServisePlan = !$scope.getServicePlan();
                        $scope.onLoad = true;
                    },
                    function(){}
                );
                friendsService.getFriends();
                _.each(devicesService.getBaseStations(), function (bs) {
                    if(!bs.modes && bs.properties && bs.properties.connectionState == appProperties.AVAILABLE_STATE) {
                        baseStationService.getBaseStationResource(bs.deviceId, "modes");
                    }
                });
            }, function(reason) {

            });
        };

        $scope.scrollTopPosition = function(scrollY) {
            $rootScope.settingsOffsetTopPosition = scrollY;
            $rootScope.$broadcast('settingsScrollingOn', null);
        };

        $scope.getBaseStations = function () {
            return _.filter(devicesService.getBaseStations(), $scope.isOwnerBS);
        };

        $scope.isOwnerBS = function (bs) {
            return bs.userRole == appProperties.USER_ROLE_OWNER;
        };

        $scope.getCameras = function () {
            if (!devicesService.devices) {
                return [];
            }
            return devicesService.getAllCameras();
        };

        $scope.getServicePlan = function () {
            return servicePlanService.getServicePlan();
        };

        $scope.gotoCamera = function (camera) {
            if (camera.properties && !camera.properties['connectionState']) return;

            if (camera.properties && camera.properties['connectionState'] != 'unavailable') {
                $state.go('settings.camera', {deviceId: camera.deviceId});
            }
        };

        $scope.isOwnCamera = function (camera) {
            return camera.userId === camera.owner.ownerId;
        };

        $scope.isNonOwner = function () {
            return !userService.paymentId;
        };

        /*
         Checks if user has permission to make a selection.
         */
        $scope.canSetPreferences = function () {
            return devicesService.hasOwnDevices();
        };

        $scope.hasOwnCameras = function () {
            if (!$scope.getCameras()) {
                return false;
            }
            return $scope.getCameras().length > 0 && _.reduce($scope.getCameras(), function (memo, camera) {
                    return memo || (camera.userId === camera.owner.ownerId);
                }, false);
        };

        /*
         True if user has a service plan -- a pure friend user wouldn't have a plan.
         */
        $scope.hasServicePlan = function () {
            // todo:  ROLES
            return !$scope.noServisePlan;
        };

        $scope.getFriendsCount = function () {
            return friendsService.friends ? '(' + friendsService.friends.length  + ')' : '';
        };

        $scope.alertBS = function (bs) {
            if(bs.properties && bs.properties.connectionState == appProperties.AVAILABLE_STATE && bs.properties.updateAvailable) {
                return true;
            }
            return false;
        };

        $scope.alertEmail = function () {
            return userService.validEmail != "true";
        };

        $scope.alertFriends = function () {
            return friendsService.friends && _.findWhere(friendsService.friends, {status: "EXPIRED"});
        };

        $scope.alertCamera = function (camera) {
            return camera.properties && camera.properties.connectionState == appProperties.CAMERA_CONNECTION_STATE_BATTERY_CRITICAL;
        };
    })

    .controller('CameraSettingsCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, cameraSettingsService, camerasService, devicesService, baseStationService, appProperties) {
        $scope.nameRegExp = /^[a-zA-Z0-9\s~!@#$%^&*()_+=,./<>?;:\-\\\|\[\]\{\"\'\}]+$/;
        $scope.init = function () {
            $scope.changed = false;

            $scope.bestVideo = appProperties.CAMERA_SETTINGS_POWERSAVEMODE_BEST_VIDEO;
            $scope.optimized = appProperties.CAMERA_SETTINGS_POWERSAVEMODE_OPTIMIZED;
            $scope.batteryLife = appProperties.CAMERA_SETTINGS_POWERSAVEMODE_BATTERY_LIFE;
            $scope.takingSnapshot = null;

            $scope.$on(appProperties.appEvents.SNAPSHOT_LOADED, function (event, args) {
                if (args.deviceId != $stateParams.deviceId) {
                    return;
                }
                $timeout.cancel($scope.takingSnapshot);
                $scope.takingSnapshot = null;
                $scope.camera.presignedFullFrameSnapshotUrl = devicesService.getCameraById($stateParams.deviceId).presignedFullFrameSnapshotUrl;
            });
            if ($stateParams.deviceId) {
                // deep copy the camera object for making changes
                $scope.camera = angular.copy(devicesService.getCameraById($stateParams.deviceId));

                if ($scope.camera) {
                    $scope.initialCameraName = $scope.camera.deviceName;
                    $scope.initialCameraFlip = $scope.camera.properties.flip;
                    $scope.initialPowerSaveMode = $scope.camera.properties.powerSaveMode;
                    $scope.initialCameraZoomX1 = $scope.camera.properties.zoom.topleftx;
                    $scope.initialCameraZoomX2 = $scope.camera.properties.zoom.bottomrightx
                }

            }

            if (!$scope.camera) {
                var promise = devicesService.initDevices();
            }
            else {
                $scope.camera.presignedFullFrameSnapshotUrl || ($scope.takeSnapshot());
                $scope.selectPowerSaveMode($scope.camera.properties.powerSaveMode);
            }

            $scope.$on(appProperties._RESOURCE_UPDATE_, function () {
                // deep copy the camera object for making changes
                if (!$scope.camera || !$scope.camera.properties || !$scope.camera.properties.powerSaveMode) {
                    var camera = devicesService.getCameraById($stateParams.deviceId);
                    if (camera && camera.properties && camera.properties.powerSaveMode) {
                        $scope.camera = angular.copy(camera);
                        $scope.selectPowerSaveMode($scope.camera.properties.powerSaveMode);
                        $scope.camera.presignedFullFrameSnapshotUrl || ($scope.takeSnapshot());

                        $scope.initialCameraName = $scope.camera.deviceName;
                        $scope.initialCameraFlip = $scope.camera.properties.flip;
                        $scope.initialPowerSaveMode = $scope.camera.properties.powerSaveMode;
                        $scope.initialCameraZoomX1 = $scope.camera.properties.zoom.topleftx;
                        $scope.initialCameraZoomX2 = $scope.camera.properties.zoom.bottomrightx
                    }
                }
            });
        };

        $scope.isLoading = function () {
            var camera = devicesService.getDeviceById($stateParams.deviceId);
            if(camera && camera.properties && camera.properties.connectionState == appProperties.UNAVAILABLE_STATE) {
                $state.go("settings");
            }

            if ($scope.camera) {
                var baseStation = devicesService.getBaseStationById($scope.camera.parentId);
                if (baseStation && (baseStation.properties['connectionState'] == "unavailable"))
                    $state.go('settings');
            }

            return !$scope.camera || !$scope.camera.properties || !$scope.camera.properties.powerSaveMode;
        };

        var cancel_busy = $scope.$on(appProperties.appEvents.CAMERA_ERROR, function (event, payload) {
            $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, {
                data: payload
            });
        });

        $scope.$on(appProperties.appEvents.TAKE_SNAPSHOT, function(event, cameraId) {
            cameraId == $stateParams.deviceId && ($scope.takeSnapshot());
        });

        $scope.takeSnapshot = function () {
            $timeout.cancel($scope.takingSnapshot);
            $scope.takingSnapshot = null;
            camerasService.getFullFrameSnapshot($stateParams.deviceId, true).then(function (result) {
                $scope.takingSnapshot = $timeout(function () {
                    $scope.takingSnapshot = null;
                }, 20000);
            });
        };

        $scope.isCameraAvailable = function () {
            var camera = devicesService.getCameraById($stateParams.deviceId);
            return !$scope.cameraNameForm.$invalid
                && (camera && camera.properties && camera.properties['connectionState'] && camera.properties['connectionState'] != appProperties.UNAVAILABLE_STATE);
        };

        $scope.isChanged = function () {
            if ($scope.camera) {
                return $scope.changed = $scope.initialCameraName != $scope.camera.deviceName ||
                                        $scope.initialCameraFlip != $scope.camera.properties.flip ||
                                        $scope.initialPowerSaveMode != $scope.camera.properties.powerSaveMode ||
                                        $scope.initialCameraZoomX1 != $scope.camera.properties.zoom.topleftx ||
                                        $scope.initialCameraZoomX2 != $scope.camera.properties.zoom.bottomrightx;
            }
        };

        $scope.positionMode = function () {
            var camera = devicesService.getCameraById($stateParams.deviceId);
            if (camera && camera.properties && camera.properties.connectionState == appProperties.UNAVAILABLE_STATE) {
                $state.go('settings');
            }
            return cameraSettingsService.isPositionMode($stateParams.deviceId);
        };

        $scope.motionDetectionMode = function () {
            return $scope.camera && $scope.camera.properties[appProperties.CAMERA_SETTINGS_ACTIVITYSTATE] ===
                appProperties.CAMERA_SETTINGS_ACTIVITYSTATE_MOTION_DETECTION_MODE;
        };

        $scope.selectPowerSaveMode = function (powerSaveMode) {
            $scope.camera.properties.powerSaveMode = powerSaveMode;
        };

        $scope.isSelected = function (powerSaveMode) {
            return $scope.camera && powerSaveMode == $scope.camera.properties.powerSaveMode;
        };

        $scope.done = function () {
            if(!$scope.isChanged()) return;

            var camera = devicesService.getCameraById($stateParams.deviceId);
            if (camera && camera.deviceName != $scope.camera.deviceName) {
                var renamePromise = baseStationService.renameDevice($scope.camera);
                renamePromise.then(function () {
                    camera.deviceName = $scope.camera.deviceName;
                });
            }

            $scope.camera.properties.mirror = $scope.camera.properties.flip;

            var promise = cameraSettingsService.updateSettings($scope.camera.parentId, $scope.camera.deviceId,
                _.pick($scope.camera.properties,
                    appProperties.CAMERA_SETTINGS_BRIGHTNESS,
                    appProperties.CAMERA_SETTINGS_ZOOM,
                    appProperties.CAMERA_SETTINGS_MIRROR,
                    appProperties.CAMERA_SETTINGS_FLIP,
                    appProperties.CAMERA_SETTINGS_POWERSAVEMODE
                ));
            promise.then(function () {
                // todo how to handle this
            });

            $state.go('settings');
        };

        $scope.toggleInvertMode = function () {
            $scope.camera && ($scope.camera.properties.flip = !$scope.camera.properties.flip);
        };

        /*
         If position mode is off, toggle it on.  If it is on, toggle it off.  Automatically turns off after five minutes unless it is
         turned off previously by user.  When position mode is on and user clicks play on camera, the activityState is
         'startPositionStream.'
         */

        $scope.togglePositionMode = function () {
            if(!$scope.isCameraBusy()) {
                $state.go("settings.positionMode", {deviceId: $scope.camera.deviceId});
            }
        };

        $scope.toggleMotionDetectionMode = function () {
            if(!$scope.isCameraBusy()) {
                $state.go("settings.motionTest", {deviceId: $scope.camera.deviceId});
            }
            return;
            var properties = {};
            if ($scope.motionDetectionMode()) {     // position mode on, toggle off
                properties[appProperties.CAMERA_SETTINGS_ACTIVITYSTATE] =
                    appProperties.CAMERA_SETTINGS_ACTIVITYSTATE_IDLE;
            } else {                                // position off, toggle on
                properties[appProperties.CAMERA_SETTINGS_ACTIVITYSTATE] =
                    appProperties.CAMERA_SETTINGS_ACTIVITYSTATE_MOTION_DETECTION_MODE;
            }
            if ($scope.camera) {
                var promise = cameraSettingsService.updateSettings($scope.camera.parentId, $scope.camera.deviceId,
                    properties);
                promise.then(function () {
                    // todo:  update status bar
                });
            } else {
                throw "Camera not defined in camera settings";
            }


        };

        $scope.isCameraBusy = function () {
            return !$scope.camera || !$scope.camera.properties ||
                $scope.camera.properties.connectionState == appProperties.CAMERA_CONNECTION_STATE_BATTERY_CRITICAL  ||
                $scope.camera.properties[appProperties.CAMERA_SETTINGS_ACTIVITYSTATE] == appProperties.CAMERA_ACTIVITYSTATE_START_ALERT_STREAM  ||
                $scope.camera.properties[appProperties.CAMERA_SETTINGS_ACTIVITYSTATE] == appProperties.CAMERA_ACTIVITYSTATE_ALERT_STREAM_ACTIVE ||
                $scope.camera.properties[appProperties.CAMERA_SETTINGS_ACTIVITYSTATE] == appProperties.CAMERA_ACTIVITYSTATE_ALERT_WATCH ||
                $scope.camera.properties[appProperties.CAMERA_SETTINGS_ACTIVITYSTATE] == appProperties.CAMERA_ACTIVITYSTATE_FULLFRAMESNAPSHOT;
        };

        $scope.isCameraIdle = function () {
            return $scope.camera && $scope.camera.properties &&
                $scope.camera.properties[appProperties.CAMERA_SETTINGS_ACTIVITYSTATE] == appProperties.CAMERA_SETTINGS_ACTIVITYSTATE_IDLE;
        };

        $scope.getFW = function () {
            var c = devicesService.getCameraById($stateParams.deviceId);
            return (c && c.properties && c.properties.swVersion) || "";
        };

        $scope.getHW = function () {
            var c = devicesService.getCameraById($stateParams.deviceId);
            return (c && c.properties && c.properties.hwVersion) || "";
        };
    })

    .controller('PersonalInfoCtrl', function ($scope, $rootScope, $q, $modal, $state, appProperties, userService, loginService, uiService) {

        $scope.init = function () {
            $scope.loading = true;
            $scope.password = "";
            $scope.oldUserId = userService.userName;
            userService.getProfile().then(function () {
                $scope.personalInfoForm.password.$setPristine();
                $scope.userId = $scope.initialUserID =$scope.oldUserId;
                $scope.firstName = $scope.initialFirstName = userService.firstName;
                $scope.lastName = $scope.initialLastName = userService.lastName;
                $scope.validEmail = userService.validEmail == "true";
                $scope.modifyUserId = false;
                $scope.modifyPassword = false;
                $scope.modifyName = false;
                $scope.loading = false;
            });
        };

        $scope.done = function () {

            if(!$scope.isChanged() || $scope.personalInfoForm.$invalid) return;

            $scope.modifyUserId = $scope.personalInfoForm.userId.$dirty && $scope.userId != $scope.oldUserId;
            $scope.modifyPassword = $scope.personalInfoForm.newPassword.$dirty;
            $scope.modifyName = $scope.personalInfoForm.firstName.$dirty || $scope.personalInfoForm.lastName.$dirty;

            $scope.loading = true;
            var updateUserIdPromise, updatePasswordPromise, updateNamePromise;
            if ($scope.modifyUserId) {
                updateUserIdPromise = userService.updateUserId($scope.userId, $scope.password);
                updateUserIdPromise.then(function () {
                    userService.userName = $scope.userId;
                    userService.settings && (userService.setUserName($scope.userId));
                });
            }

            if ($scope.modifyPassword) {
                updatePasswordPromise = loginService.updatePassword($scope.password, $scope.newPassword).then(function (result) {
                    userService.settings && (userService.setSettings($scope.newPassword));
                });
            }

            if ($scope.modifyName) {
                $scope.initialLastName = $scope.lastName;
                $scope.initialFirstName = $scope.firstName;
                $scope.personalInfoForm.firstName.$setPristine();
                $scope.personalInfoForm.lastName.$setPristine();
                updateNamePromise = userService.updateName($scope.firstName, $scope.lastName);
                updateNamePromise.then(function () {
                    userService.firstName = $scope.firstName;
                    userService.lastName = $scope.lastName;
                })
            }

            $q.all([updateUserIdPromise, updatePasswordPromise, updateNamePromise]).then(function (result) {
                    $scope.loading = false;
                },
                function (result) {
                    $scope.loading = false;
                    $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result);
                });

        };

        $scope.isChanged = function() {
            return ($scope.initialLastName != $scope.lastName) ||
                   ($scope.initialFirstName != $scope.firstName) ||
                   ($scope.initialUserID != $scope.userId) ||
                   ($scope.personalInfoForm.password.$dirty &&
                    $scope.personalInfoForm.password.$valid &&
                    $scope.personalInfoForm.newPassword.$dirty &&
                    $scope.personalInfoForm.newPassword.$valid &&
                    $scope.personalInfoForm.confirmPassword.$dirty &&
                    $scope.personalInfoForm.confirmPassword.$valid);

        };

        $scope.confirmEmail = function () {
            $scope.confirmMessage = "Send";
            $scope.message = "Send email confirmation to " + userService.userName + "?";
            var modalInstance = $modal.open({
                templateUrl: 'partials/confirmDialog.html',
                controller: "ConfirmCtrl",
                scope: $scope,
                backdrop: true
            });

            modalInstance.result.then(function (result) {
                userService.confirmEmail().then(function () {
                        uiService.info("A link to confirm your email address has been emailed to you.");
                    },
                    function (result) {
                        $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result);
                    });
            });
        };

        /*

         commenting out close account functionality as this is a stretch or phase two feature
         http://kira.netgear.com/issues/7875

         $scope.deleteAccount = function () {
         var modalInstance = $modal.open({
         templateUrl: 'partials/confirmDialog.html',
         controller: DeleteAccountCtrl,
         scope: $scope,
         backdrop: true,
         resolve: {
         }
         });

         modalInstance.result.then(function () {
         var promise = userService.deleteAccount();
         promise.then(function () {
         $state.go('login');
         });
         });
         }

         function DeleteAccountCtrl($scope, $modalInstance) {

         $scope.message = 'Are you sure you want to delete account?';
         $scope.confirmButton = 'Delete';
         $scope.confirm = function () {
         // user confirms delete the friend
         $modalInstance.close();
         }

         $scope.cancelDialog = function () {
         // exit modal and don't delete the account
         $modalInstance.dismiss('cancel');
         }
         };
         */
    })

    // allows user to select which base station is being registered with new account
    .controller('ClaimBaseStationCtrl', function ($scope, $rootScope, $state, $log, $modal, setupService, devicesService, jsonService, servicePlanService, appProperties, userService) {
        $scope.hasPaymentId = false;
        $scope.init = function () {
            if(!userService.isLoggedIn()) { // force setup on page refresh
                setupService.setupPending = true;
            }
            $scope.setupPending = setupService.setupPending;
            var promise = devicesService.queryPresentDevices();
            promise.then(function () {
                $scope.hasPaymentId = !userService.paymentId;
                $scope.devices = devicesService.presentDevices;
                // select the first device number (vgn) in list by default
                if ($scope.devices && $scope.devices.length > 0) {
                    $scope.device = $scope.devices[0].hardwareId;
                }
            }, function (result) {
                result && ($rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result));
            });

            if (!setupService.setupPending) { //to know where to go on cancel
                servicePlanService.getPurchasedPlans();
            }

            jsonService.timeZones().then(function (result) {
                $scope.timeZones = result.data;
                var newDate = new Date();
                var oneOffset = new Date(newDate.getFullYear(), 0, 1).getTimezoneOffset();
                var twoOffset = new Date(newDate.getFullYear(), 6, 1).getTimezoneOffset();
                var stdTimezoneOffset =  Math.max(oneOffset, twoOffset);
                var tz = _.findWhere(appProperties.timeZoneHash, {offset: stdTimezoneOffset.toString() });
                $scope.timeZone = tz ? _.findWhere($scope.timeZones, {id: tz.id }) : $scope.timeZones[0];
            });
        };

        $scope.cancel = function () {
            if (setupService.setupPending) {
                $state.go('login');
            }
            else if(!servicePlanService.getServicePlan()) {
                $state.go('settings');
            }
            else {
                $state.go('settings.subscription');
            }
        };

        $scope["continue"] = function () {

            var dev = _.findWhere($scope.devices, {hardwareId: $scope.device});
            if (setupService.isSetup || !setupService.setupPending) { // return back to settings.subscription view
                $scope.claimInProgress = true;
                devicesService.claimDevice(dev._id, dev.hardwareId, $scope.timeZone).then(function (result) {
                        $scope.claimInProgress = false;
                        if (!servicePlanService.getServicePlan()) {
                            setupService.setupPending = true;
                            $state.go('servicePlan');
                        }
                        else {
                            devicesService.getDevices();
                            $state.go('settings.subscription');
                        }
                    },
                    function (result) {
                        $scope.claimInProgress = false;
                        $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result || "Error occurred.");
                    });
            }
            else if (!setupService.accountRegistered) {

                // remember the selected device id for later claiming ...
                setupService.selectedBaseStation = dev;
                setupService.timeZone = angular.copy($scope.timeZone);
                $state.go('accountRegistration');
            } else {
                // this should not happen!
                throw "Unknown system setup state";
            }
        };
    })

    .controller('AccountRegistrationCtrl', function ($scope, $rootScope, $state, $q, $modal, $stateParams, $filter, $location, appProperties, setupService, devicesService, jsonService, urlService, userService, servicePlanService, pushHandlerService, localStorage, uiService) {

        $scope.init = function () {
            if (setupService.accountRegistered || setupService.isSetup) {
                $state.go("cameras");
                return;
            }

            var secretQuestions = jsonService.secretQuestions();
            secretQuestions.then(function (result) {
                    $scope.secretQuestions = result.data;
                    $scope.secretQuestion = $scope.secretQuestions[0];
                    $scope.accountRegistrationForm.accountRegistration_secretQuestion.$setViewValue("")
                },
                function (result) {
                    result && ($rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result));
                });
        };

        $scope.displayTos = function () {
            $scope.viewMode = false;
            $modal.open({
                windowTemplateUrl: 'partials/tosDialog.html',
                templateUrl: urlService.getTermsUrl(),
                scope: $scope,
                backdrop: 'static'
            }).result.then(
                function (result) {
                    $scope.agreeTos = result == 'ok';
                }
            );
        };

        $scope.displayPrivacy = function () {
            $modal.open({
                windowTemplateUrl: 'partials/tosDialog.html',
                templateUrl: urlService.getPolicyUrl(),
                scope: $scope,
                backdrop: 'static'
            }).result.then(
                function (result) {
                    $scope.agreePrivacy = result == 'ok';
                }
            );
        };

        $scope["continue"] = function () {
            if (!$scope.agreeTos) {
                $scope.agreeTosError = true;
                return false;
            }
            if (!$scope.agreePrivacy) {
                $scope.agreePrivacyError = true;
                return false;
            }

            $scope.loading = true;
                        var profileData = {
                            email: $scope.userId,
                            password: $scope.password,
                            firstName: $scope.firstName,
                            lastName: $scope.lastName,
                            secretQuestion: $scope.secretQuestion == $scope.secretQuestions[$scope.secretQuestions.length - 1] ? $scope.ownSecretQuestion : $scope.secretQuestion,
                            secretAnswer: $scope.secretAnswer,
                            phone: $scope.phone,
                            agreeTos: $scope.agreeTos,
                            agreePrivacyPolicy: $scope.agreePrivacy
                        };

                        if (setupService.timeZone) {
                            profileData.timeZone = setupService.timeZone;
                        }
            var promise = userService.register(profileData);

                    promise.then(function () {
                            if (!userService.registerUserError) {
                                setupService.updateSetupState();
                            }
                        },
                        function (data) {
                            $scope.loading = false;
                            $scope.registerError = data && data.data ? data.data.message : data;
                            $scope.accountRegistrationForm.$setPristine();
                            return $q.reject(data);
                        })
                        .then(function () {
                            setupService.updateSetupState();
                            localStorage.setItem('isSetup', 'true');
                            if (setupService.isSetup) {  // todo friend user also goes directly to cameras view
                                var promise = devicesService.getDevices();
                                promise.then(function () {
                                    pushHandlerService.init();
                                    $state.go('cameras');
                                });
                            } else {
                                $state.go('servicePlan');
                            }
                        });
        };

        $scope.checkEmail = function () {
            if($scope.accountRegistrationForm.userId.$invalid || $scope.checkingEmailInner) {
                return;
            }
            $scope.checkingEmail = $scope.checkingEmailInner = true;
            $scope.pwdError = 0;
            userService.checkEmailUsage($scope.userId).then(
                function (result) {
                    if (result.data.used && result.data.arlo) {
                        $scope.confirmMessage = $filter("i18n")("activity_go_to_login");
                        $scope.message = $filter("i18n")("status_account_exist");
                        var modalInstance = $modal.open({
                            templateUrl: 'partials/confirmDialog.html',
                            controller: "ConfirmCtrl",
                            scope: $scope,
                            backdrop: true
                        });
                        $scope.checkingEmail = false;

                        modalInstance.result.then(function (result) {
                            $state.go('login');
                        }).finally(function () {
                            $scope.userId = "";
                            $scope.checkingEmailInner = false;
                        });
                        return;
                    }
                    $scope.ssoAccount = result.data.used && !result.data.arlo;

                    if($scope.ssoAccount && $scope.password) {
                        $scope.pwdError = 0;
                        userService.checkAccountUsage($scope.userId, $scope.password).then(function (result) {
                            if(result.data && result.data.firstName){
                                $scope.firstName = result.data.firstName;
                            }
                            if(result.data && result.data.lastName){
                                $scope.lastName = result.data.lastName;
                            }
                        }, function (result) {
                            $scope.pwdError = result.data.message;
                        }).finally(function () {
                            $scope.checkingEmail = $scope.checkingEmailInner = false;
                        });
                    }
                    else if($scope.ssoAccount){
                            $scope.checkingEmail = false;
                        uiService.info($filter("i18n")("error_username_exists")).finally(function () {
                            $scope.checkingEmailInner = false;
                        });
                    }
                    else {
                        $scope.checkingEmail = $scope.checkingEmailInner = false;
                    }
                });
        };

        $scope.goBack = function () {
            var absUrl = $location.absUrl();
            var tokenPos = absUrl.toLowerCase().indexOf(appProperties.registerTokenText);
            if (tokenPos < 0) {
                $state.go('claimBaseStation');
            } else {
                $state.go('login');
            }
        }
    })

    .controller('SelectServicePlanCtrl', function ($scope, $rootScope, $modal, $state, setupService, servicePlanService, billingFlowService, devicesService, appProperties) {

        $scope.init = function () {
            billingFlowService.pendingPlan = null;
            $scope.setupPending = setupService.setupPending;
            $scope.loadingMessage = 'Loading service plans...';
            $scope.loading = true;
            // initially false but set to true when they choose any of the plans
            $scope.servicePlanSelected = setupService.servicePlanSelected;

            var promise = servicePlanService.getOffersV1();
            promise.then(function (result) {
                //$scope.offers = result.data;
                $scope.$on("plan_selected", function (type, plan) {
                    $scope.select(plan);
                });
                $rootScope.$broadcast("offers", result.data);
                $scope.loading = false;
            }, function (result) {
                $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result);
                $scope.loading = false;
            });
        };

        $scope.select = function (servicePlan) {
            if(servicePlan.planType.toLowerCase() != "paid") {
                $state.go('syncHardware');
                return;
            }
            setupService.servicePlanSelected = true;
            $scope.loadingMessage = '';

            billingFlowService.pendingPlan =
            {
                setupPlan: servicePlan
            };
            $state.go('billingInformation');
        };

        $scope.isBillingInProgress = function () {
            return billingFlowService.inProgress;
        };
    })

    .controller('BillingInformationCtrl', function ($scope, $rootScope, $state, $log, $filter, $timeout, appProperties, jsonService, setupService, servicePlanService, urlService, userService, billingFlowService, calendarNamesService) {

        $scope.init = function () {
            if (!Modernizr.postmessage) {
                $state.go('oldBrowser');
                return;
            }
            $scope.setupPending = setupService.setupPending;

            // handle postMessages from the embedded iframe
            window.addEventListener('message', handleFormOfPaymentMessages);

            $scope.vatNumber = '';

            var year = new Date().getFullYear();
            $scope.months = calendarNamesService.getCalendar().MONTH.slice(0);
            $scope.months.splice(0,0,"Month");

            $scope.years = _.map(_.range(year, year + 9), function (v) {return v.toString();});
            $scope.creditCard = {expirationYear: $scope.years[0], expirationMonth: "0"};
            if (servicePlanService.billingInfo && !$scope.setupPending) {
                initModel();
            }
            else if (!$scope.setupPending) {
                var promise = servicePlanService.getBilling();
                promise.then(function () {
                    initModel();
                }, function (result) {
                    $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result);
                });
            }
            else {
                $scope.billingInfo = {firstName: '',
                    lastName: '',
                    companyName: '',
                    address1: '',
                    address2: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    countryCode: ''
                };
                $scope.autoRenew = true;
                initStates();
            }
            $scope.isIE = navigator.userAgent.indexOf("Trident")>-1 || navigator.userAgent.match(/MSIE [6789]/) != null;
        };

        function initModel() {
            $scope.billingInfo = angular.copy(servicePlanService.billingInfo.billing);

            if(servicePlanService.billingInfo.creditCard.cardNumber) {
                var cc = servicePlanService.billingInfo.creditCard;
                $scope.creditCard.cardNumber = "************" + cc.cardNumber;
                $scope.creditCard.expirationMonth = cc.expirationMonth;
                $scope.creditCard.expirationYear = cc.expirationYear;
                $scope.creditCard.cvv = "***";
            }
            $scope.autoRenew = servicePlanService.billingInfo.autoRenew;
            $scope.vatNumber = servicePlanService.billingInfo.vatNumber;
            delete $scope.billingInfo.vatNumber;
            if(!servicePlanService.billingInfo.creditCard.cardNumber) {
                $scope.showRenew = true;
            }
            initStates();
        };

        function initStates() {
            jsonService.countryCodes().then(function (result) {
                $scope.countries = result.data;
                $scope.country = _.findWhere($scope.countries, {code: (userService.countryCode) || 'US'});
                $scope.isStates = !!$scope.country && $scope.country.states;

                if ($scope.isStates)
                {
                    jsonService.stateCodes($scope.country.statesName).then(function (result) {
                        $scope.countryStates = result.data;
                        if (servicePlanService.billingInfo) {
                            $scope.state = _.findWhere($scope.countryStates, {code: (servicePlanService.billingInfo && servicePlanService.billingInfo.billing.state)});
                        }
                    });
                }

                $scope.setVatPattern();

            });
        };

        $scope.vatRequired = function () {
            return $scope.country && $scope.country.vat;
        };

        $scope.zipPattern = (function() {
            var scope = $scope;
            return {
                test: function(value) {
                    if(scope.country && (scope.country.code == "US" || scope.country.code == "GB") && scope.country.zip) return new RegExp(scope.country.zip).test(value);
                    else return true;
                }
            };
        })();

        $scope.setVatPattern = function () {
            if ($scope.country) {
                $scope.vatRegExp = new RegExp($scope.country.vat);
            } else if ($scope.billingInfo && $scope.billingInfo.country) {
                $scope.vatRegExp = new RegExp($scope.billingInfo.country.vat);
            }
        };

        $scope.getCountry = function () {
            return $scope.country ? $scope.country.name : userService.countryCode;
        };

        function handleFormOfPaymentMessages(messageEvent) {
            var message = messageEvent.data;

            // check if this is an input validation message called on onreload
            if (message.hasOwnProperty('formReLoaded')) {
                $log.debug('Form of payment response reloaded');
                if (message.params) {
                    if (message.params.errors == "0") {
                        $log.debug('Setting formOfPaymentResponse');
                        $scope.formOfPaymentResponse = message.params;
                    }
                    else {
                        var errorCodes = getErrorCodes(message.params);

                        // todo:  we need to be more sophisticated to handle multiple errors
                        if (errorCodes.length >= 1) {
                            var errCode = parseInt(errorCodes[0]);
                            $scope.errorMessage = $filter('i18n')('aria_directpost_error_' + errCode);
                        } else {
                            $scope.errorMessage = $filter('i18n')('card_error');
                        }
                        $scope.formOfPaymentResponse = { error: true };
                    }
                } else { // oops
                    $log.debug('Form of payment returned no params in message');
                }
                $scope.$apply();
            }
        }

        function getErrorCodes(paramsObject) {
            var codes = [];
            for (var prop in paramsObject) {
                if (paramsObject.hasOwnProperty(prop) && prop.indexOf('error_code') > -1) {
                    codes.push(paramsObject[prop]);
                }
            }

            return codes;
        };

        function billingTimeout() {
            $scope.loading = false;
            $scope.errorMessage = $filter('i18n')('billing_timeout_error');
        };

        $scope.vatChange = function() {
            $scope.vatError = '';
            $scope.billingInformationForm.vatNumber.$setValidity('invalidvat', true);
        }

        /*
         Process event when user presses continue on billing information.  This
         involves multiple calls and exchanging information between the billingInformationView
         and the direct-post view (before sending the direct-post), as well as between the
         payment-response view (after the response has returned via hmsweb) and billingInformationView.
         */
        $scope["continue"] = function () {
            $scope.loading = true;
            $scope.errorMessage = false;

            // step 1:  Send billing address information to web server for forwarding to billing
            // provider.  The response of the modify billing call has the clientNo and billing
            // session id.
            $scope.billingInfo.countryCode = userService.countryCode;
            $scope.isStates && ($scope.billingInfo.state = $scope.state.code);

            var billingData = {
                billing: $scope.billingInfo,
                autoRenew: $scope.autoRenew,
                vatNumber: $scope.vatNumber
            };

            $scope.billingError = '';
            $scope.vatError = '';
            servicePlanService.modifyBilling(billingData)
                .then(
                function (result) {
                    $scope.loading = false;
                    var responseData = result.data.data;
                    // step 2:  Submit embedded formOfPayment form directly (insures PCI compliance) to the
                    // billing provider.  In this step two postMessage calls are made to the iframe.  The
                    // first sends the sessionId and client no.  The second submits the embedded form.
                    var iframeWindow = document.getElementById('formOfPayment').contentWindow;

                    // send the sessionId to the embedded form
                    // direct the embedded form to submit the form to the billing provider
                    if ($scope.cardInformationForm.$dirty) {
                        var message = {
                            sessionId: responseData.sessionId,
                            clientNo: responseData.client_no,
                            cardNumber: $scope.creditCard.cardNumber,
                            expirationMonth: $scope.creditCard.expirationMonth,
                            expirationYear: $scope.creditCard.expirationYear,
                            cvv: $scope.creditCard.cvv,
                            url: responseData.url
                        };
                        $scope.timeoutId && ($timeout.cancel($scope.timeoutId));
                        $scope.isIE && ($scope.timeoutId = $timeout(billingTimeout, 80000));

                        // todo:  we may want to simplify this into a service with a pubsub capability
                        $scope.$watch('formOfPaymentResponse', function () {
                            if ($scope.formOfPaymentResponse) {
                                // $log.debug('got form of payment response:' + JSON.stringify($scope.formOfPaymentResponse));
                                $scope.loading = false;
                                if (!$scope.formOfPaymentResponse.error) {
                                    if(setupService.setupPending) {
                                        if(billingFlowService.pendingPlan) {
                                            billingFlowService.processBillingEvent(billingFlowService.pendingPlan.setupPlan? billingFlowService.pendingPlan : {toPlanId: billingFlowService.pendingPlan.toPlans}).then(
                                                function () {
                                                    $timeout.cancel($scope.timeoutId);
                                                    billingFlowService.selectServicePending = false;
                                                    $state.go('syncHardware');
                                                },
                                                function (result) {
                                                    $timeout.cancel($scope.timeoutId);
                                                    result && ($scope.errorMessage = angular.isString(result) ? result : result.data.message);
                                                }
                                            );
                                        }
                                    }
                                    else {
                                        if(billingFlowService.selectServicePending) {
                                            billingFlowService.processBillingEvent({toPlanId: billingFlowService.pendingPlan.toPlans}).then(
                                                function () {
                                                    $timeout.cancel($scope.timeoutId);
                                                    billingFlowService.selectServicePending = false;
                                                    $state.go('settings.subscription');
                                                },
                                                function (result) {
                                                    $timeout.cancel($scope.timeoutId);
                                                    billingFlowService.selectServicePending = false;
                                                    angular.isString(result) && ($rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, {data: {message: result }}));
                                                    $state.go('settings.plans');
                                                }
                                            );
                                        }
                                        else {
                                            $timeout.cancel($scope.timeoutId);
                                            $state.go('settings.subscription');
                                        }
                                    }
                                }
                                else {
                                    document.getElementById('formOfPayment').src = document.getElementById('formOfPayment').src;
                                }
                                $scope.formOfPaymentResponse = null;
                            }
                        }, true);
                        // $log.debug('sending message to iframe:' + JSON.stringify(message));
                        $scope.loading = true;
                        iframeWindow.postMessage(message, urlService.staticAssetsUrl);
                        $scope.cardInformationForm.$setPristine();
                    }
                    else if(!setupService.setupPending) {
                        $state.go('settings.subscription');
                    }
                    else {
                            if(billingFlowService.pendingPlan) {
                                billingFlowService.processBillingEvent(billingFlowService.pendingPlan.setupPlan? billingFlowService.pendingPlan : {toPlanId: billingFlowService.pendingPlan.toPlans}).then(
                                    function () {
                                        billingFlowService.selectServicePending = false;
                                        $state.go('syncHardware');
                                    },
                                    function (result) {
                                        result && ($scope.errorMessage = angular.isString(result) ? result : result.data.message);
                                    }
                                );
                            }
                    }

                    $scope.billingInformationForm.$setPristine();
                },
                function (result) { // error occurred
                    $scope.loading = false;
                    if (result.data) {
                        if (result.data.error == 8016) {
                            $scope.vatError = result.data.message;
                            $scope.billingInformationForm.vatNumber.$setValidity('invalidvat', false);
                        } else {
                            $scope.billingError = result.data.message;
                        }
                    }
                    else {
                        $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, {data: {message: 'Unknown error in modify billing occurred'}});
                    }
                });
        };

        $scope.isBillingInProgress = function () {
            return billingFlowService.inProgress;
        };

    })

    .controller('ConfirmCtrl', function ($scope, $modalInstance) {

        $scope.confirmButton = $scope.confirmMessage;
        $scope.confirm = function () {
            // user confirms change to plan
            $modalInstance.close();
        };

        $scope.cancelDialog = function () {
            // exit modal and don't make the change
            $modalInstance.dismiss('cancel');
        }
    })

    .controller('SyncHardwareCtrl', function ($scope, $state, setupService, devicesService, calendarService, dayService, pushHandlerService, libraryService) {

        $scope.init = function () {
        };

        $scope["continue"] = function () {
            if (setupService.setupPending) {
                pushHandlerService.init();
                setupService.setupPending = false;
            }
            setupService.hardwareSynced = true;
            setupService.updateSetupState();

            var promise = devicesService.initDevices();
            promise.then(function () {

                // initialize current month, day, defaults favorites setting, camera selection
                calendarService.setDefaultMonth();
                dayService.setDefaultDay(calendarService.month);
                libraryService.initialize();
                $state.go('cameras');
            });

        };
    })

    .controller('FriendsCtrl', function ($scope, $state, $q, friendsService, devicesService, servicePlanService) {

        $scope.loading = true;
        $scope.init = function () {
            var promises = [
                devicesService.initDevices(),
                friendsService.getFriends(),
                servicePlanService.getPurchasedPlans()];

            $q.all(promises).then(function () {
                $scope.friends = friendsService.friends;
                $scope.maxAccounts = servicePlanService.getServicePlan().maxAccounts;
                var p = servicePlanService.getServicePlan();
                $scope.isBasic = p && p.sharingExpiry != -1 && p.sharingExpiry != null;
                $scope.expired = !servicePlanService.getServicePlan().sharing;
            })["finally"](function () {$scope.loading = false;});
        };

        $scope.add = function () {
            $state.go('settings.addFriend');
        };

        $scope.isDevices = function () {
            return devicesService.devices && devicesService.devices.length > 0 &&
                $scope.maxAccounts && ($scope.maxAccounts == -1 || $scope.maxAccounts > $scope.friends.length);
        };
    })

    .controller('EditFriendCtrl', function ($scope, $state, $stateParams, $modal, $filter, appProperties, devicesService, friendsService, servicePlanService, uiService) {

        $scope.init = function () {
            $scope.noCameras = false;

            if ($stateParams.email) { // are we editing an existing friend
                $scope.friend = angular.copy(_.findWhere(friendsService.friends, {email: $stateParams.email}));

                if(!$scope.friend) {
                    $state.go('settings.friends');
                    return;
                }
                $scope.oldEmail = $scope.friend.email;
                $scope.editMode = true;
            } else {
                $scope.friend = {adminUser: false};
                $scope.editMode = false;
            }

            devicesService.initDevices().then(function () {
                $scope.cameras = devicesService.getOwnCameras();
                $scope.noCameras = !$scope.oldEmail ? !$scope.cameras.length : false;
                $scope.selection = {};
                $scope.selection.ids = {};
                _.each($scope.cameras, function (camera, index) {
                    var selected = _.findWhere($scope.friend.devices, {deviceId: camera.deviceId});
                    $scope.selection.ids[camera.deviceId] = typeof selected !== 'undefined';
                });

                if ($scope.editMode) {
                    $scope.initialFirstName = $scope.friend.firstName;
                    $scope.initialLastName = $scope.friend.lastName;
                    $scope.initialEmail = $scope.friend.email;
                    $scope.initialSelectionIds = angular.copy($scope.selection.ids);
                    $scope.initialAdminUser = $scope.friend.adminUser;
                }

            });
            var plan = servicePlanService.getServicePlan();
            if (!plan) {
                servicePlanService.getPurchasedPlans().then(function () {
                    var p = servicePlanService.getServicePlan();
                    $scope.isBasic = p && p.sharingExpiry != -1 && p.sharingExpiry != null;
                });
            }
            else {
                $scope.isBasic = plan.sharingExpiry != -1 && plan.sharingExpiry != null;
            }
        };

        $scope.isChanged = function() {
            if (!$scope.editMode) {
                return true;
            } else if ((!angular.equals($scope.initialSelectionIds,$scope.selection.ids)) ||
                       ($scope.initialAdminUser != $scope.friend.adminUser) ||
                       ($scope.initialFirstName != $scope.friend.firstName) ||
                       ($scope.initialLastName != $scope.friend.lastName) ||
                       ($scope.initialEmail != $scope.friend.email)) {
                return $scope.deviceSelected();
            }
        };

        $scope.noCamerasAlert = function() {
            $scope.infoMessage = "You should select at least one camera.";
            //$scope.infoMessage = $filter("i18n")("library_label_confirm_delete_media");

            var modalInstance = $modal.open({
                templateUrl: 'partials/infoDialog.html',
                scope: $scope,
                backdrop: true,
                resolve: {}
            });

            modalInstance.result;
        };

        $scope.emailUnique = function (email) {
            $scope.editFriendForm.firstName.$setViewValue($scope.editFriendForm.firstName.$viewValue);
            $scope.editFriendForm.lastName.$setViewValue($scope.editFriendForm.lastName.$viewValue);

            var existingFriend = _.findWhere(friendsService.friends, {email: email});
            if ( $scope.editFriendForm.email.$error.email || (!$scope.editMode && existingFriend) || ($scope.editMode && existingFriend && existingFriend.email != $scope.oldEmail)) {
                return $scope.editFriendForm.email.$setValidity('unique', false);
            } else {
                return $scope.editFriendForm.email.$setValidity('unique', true);
            }
        };

        $scope.done = function (resend) {
            if(!resend && (!$scope.isChanged() || $scope.editFriendForm.$invalid)) return;

            $scope.loading = true;
            $scope.friend.devices = {};
            _.each($scope.selection.ids, function (selected, id) {
                if ($scope.selection.ids[id]) {
                    // add the key (device id), value (device name) pair if selected
                    $scope.friend.devices[id] = devicesService.getDeviceById(id).deviceName;
                }
            });

            var promise;
            if ($scope.editMode) {
                var friendCopy = angular.copy($scope.friend);
                // fixme: backend should support fields createdDate, status and any other($$hashKey) for friend object
                // fixme: server returns Edit friend error:2603, DynamoDB Service Unreachable
                delete friendCopy.createdDate;
                delete friendCopy.status;
                if(resend) {
                    promise = friendsService.addFriend(friendCopy)['finally'](function () {
                        $scope.loading = false;
                    });
                }
                else {
                    promise = friendsService.editFriend(friendCopy)['finally'](function () {
                        $scope.loading = false;
                    });
                }
            } else {
                promise = friendsService.addFriend($scope.friend)['finally'](function () {
                    $scope.loading = false;
                    $scope.isBasic && (uiService.info($filter("i18n")("marketing_label_warning_basic_friend_usage")));
                });
            }
            promise.then(function () {
                $state.go('settings.friends');
            });

        };

        $scope.deviceSelected = function () {
            return $scope.selection && _.some($scope.selection.ids, function (idSelected) {
                    return idSelected;
                });
        };

        $scope.deleteFriend = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/confirmDialog.html',
                controller: DeleteFriendCtrl,
                scope: $scope,
                backdrop: true,
                resolve: {
                }
            });

            modalInstance.result.then(function () {
                var promise = friendsService.deleteFriend($scope.friend);
                promise.then(function () {
                    $state.go('settings.friends');
                });
            });
        };

        function DeleteFriendCtrl($scope, $modalInstance) {

            $scope.message = 'Are you sure you want to delete friend?';
            $scope.confirmButton = $filter("i18n")("activity_delete");;
            $scope.confirm = function () {
                // user confirms delete the friend
                $modalInstance.close();
            };

            $scope.cancelDialog = function () {
                // exit modal and don't delete the friend
                $modalInstance.dismiss('cancel');
            }
        };

        $scope.toggleCamera = function (camera) {
            $scope.selection.ids[camera.deviceId] = !$scope.selection.ids[camera.deviceId];
        };

        $scope.toggleAdminUser = function () {
            $scope.friend.adminUser = !$scope.friend.adminUser;
        }
    })

    .controller('ModesCtrl', function ($scope, $state, $stateParams, scheduleValidationService, devicesService, baseStationService, appProperties, servicePlanService) {
        $scope.init = function () {
            $scope.deviceId = decodeURIComponent($stateParams.deviceId);
            devicesService.initDevices().then(function () {
                var baseStation = devicesService.getBaseStationById($scope.deviceId);
                if (!baseStation) {
                    $state.go('settings');
                }
                if (!baseStation.modes) {
                    baseStationService.getBaseStationResource($scope.deviceId, "modes");
                }
            });
            // sort by property
            $scope.predicate = 'name';

        };

        $scope.isLoading = function () {
            var baseStation = devicesService.getBaseStationById($scope.deviceId);
            return !baseStation || !baseStation.hasOwnProperty("modes");
        };

        $scope.getModes = function () {
            var baseStation = devicesService.getBaseStationById($scope.deviceId);

            if (baseStation && (baseStation.properties['connectionState'] == "unavailable"))
                $state.go('settings.baseStation', {baseStationId: baseStation.deviceId});

            return baseStation && baseStation.modes ? baseStation.modes : [];
        };

        $scope.getDeviceName = function () {
            var baseStation = devicesService.getBaseStationById($scope.deviceId);
            return baseStation ? baseStation.deviceName : '';
        };

        $scope.canAddMode = function () {
            var servicePlan = servicePlanService.getServicePlan();
            var maxModes = (servicePlan && servicePlan.maxSmartHomeModes) ? servicePlan.maxSmartHomeModes : 0;
            if(maxModes == -1) return true;
            var numModes = $scope.baseStation && $scope.baseStation.modes ? $scope.baseStation.modes.length : 0;

            return numModes < maxModes;
        };

        $scope.add = function () {
            $state.go('settings.addMode', {deviceId: $scope.deviceId});
        };
    })

    /* Edit the mode for a base station.  Lists the cameras for which there are rules.  Currently we are assuming that only
     one rule is allowed per camera for simplification.  This is a valid assumption for gen 3 device cameras.

     */
    .controller('EditModeCtrl', function ($scope, $rootScope, $state, $stateParams, $modal, $filter, appProperties, schedulingService, scheduleValidationService, baseStationService, devicesService, uiService) {

        var modeId;
        $scope.nameRegExp = /^[a-zA-Z0-9\s~!@#$%^&*()_+=,./<>?;:\-\\\|\[\]\{\"\'\}]+$/;

        $scope.init = function () {
            $scope.rulesSelected = false;
            $scope.changed = false;
            //$scope.addingMode = false;
            // initially editing ...
            $scope.baseStationId = decodeURIComponent($stateParams.deviceId);
            if ($stateParams.modeId) {
                modeId = decodeURIComponent($stateParams.modeId);
                $scope.editMode = true;
            }
            devicesService.initDevices().then(function () {
                var baseStation = devicesService.getBaseStationById($scope.baseStationId);
                if (!baseStation) {
                    $state.go('settings');
                }
                if (!baseStation.rules) {
                    $scope.initialMode = angular.copy($scope.getMode());
                    baseStationService.getBaseStationResource($scope.baseStationId, "rules");
                }
                if (!baseStation.modes) {
                    baseStationService.getBaseStationResource($scope.baseStationId, "modes");
                }
                if (!modeId) { // adding a new mode
                    $scope.newMode = baseStationService.createDefaultMode();
                }
                $scope.initialMode = angular.copy($scope.getMode());

            });
        };

        $scope.isLoading = function () {
            var baseStation = devicesService.getBaseStationById($scope.baseStationId);
            return !baseStation || !$scope.getMode() || !baseStation.hasOwnProperty("rules");
        };

        $scope.getMode = function () {
            if ($scope.newMode) {
                return $scope.newMode;
            }

            if ($scope.mode) {
                if (!$scope.initialMode)
                    $scope.initialMode = angular.copy($scope.mode);

                return $scope.mode;
            }

            var bs = devicesService.getBaseStationById($scope.baseStationId);

            if (bs && bs.modes) {
                $scope.mode = angular.copy(_.findWhere(bs.modes, {id: modeId}));
                return $scope.mode;
            }
            return null;
        };

        $scope.getRules = function () {
            var bs = devicesService.getBaseStationById($scope.baseStationId);
            var mode = $scope.getMode();
            return bs && bs.rules && mode ? _.filter(bs.rules, function (rule) {
                return _.contains(mode.rules, rule.id);
            }) : [];
        };

        $scope.getAvailableRules = function () {
            var mode = $scope.getMode();
            var baseStation = devicesService.getBaseStationById($scope.baseStationId);

            if (baseStation && (baseStation.properties['connectionState'] == "unavailable"))
                $state.go('settings.baseStation', {baseStationId: baseStation.deviceId});

            var result = mode && baseStation && baseStation.rules ? baseStation.rules : [];

            if (!$scope.isLoading()) {
                return result;
            }
        };

        $scope.isRuleSelected = function (rule) {
            var mode = $scope.getMode();
            return mode ? _.contains(mode.rules, rule.id) : false;
        };

        $scope.isModeValid = function (mode) {
            if ($scope.isLoading())
                return false;
            var mode = $scope.getMode();
            var bs = devicesService.getBaseStationById($scope.baseStationId);
            if (!_.findWhere(bs.modes, {name: mode.name.trim()})) {
                return mode;
            } else {
                return mode ? scheduleValidationService.validateMode($scope.baseStationId, mode) : false;
            }
        };

        $scope.deviceName = function (id) {
            return devicesService.getDeviceName(id);
        };

        $scope.deleteRule = function (id) {
            $scope.getMode().rules = _.without($scope.getMode().rules, id);
        };

        $scope.isChanged = function () {
            //if ($scope.addingMode) return false;

            var baseStation = devicesService.getBaseStationById($scope.baseStationId);
            if (baseStation && $scope.getMode()) {
                $scope.changed =  ($scope.initialMode.name != $scope.getMode().name.trim()) ||
                                    (!$scope.editMode && ($scope.getMode().name == $filter("i18n")("add_mode_label_title_new"))) ||
                                    $scope.rulesSelected;
            }
            return $scope.changed;
        };

        $scope.toggleSelectRule = function (rule) {
            if ($scope.isRuleSelected(rule)) {  // only add non-null id
                $scope.deleteRule(rule.id);
            }
            else {
                unSelectConflicted(rule);
                var mode = $scope.getMode();
                mode.rules.push(rule.id);
            }

            $scope.rulesSelected = !angular.equals(
                $scope.getMode().rules.sort(function (a, b) {
                    return (a > b ? 1 : -1);
                }),
                $scope.initialMode.rules.sort(function (a, b) {
                    return (a > b ? 1 : -1);
                })
            );
        };

        var unSelectConflicted = function (rule) {
            var actionDevice = _.find(rule.actions, function (action) {
                return action.deviceId;
            }).deviceId;
            var mode = $scope.getMode();
            var bs = devicesService.getBaseStationById($scope.baseStationId);
            _.each(mode.rules, function (ruleId) {
                var rule2 = _.findWhere(bs.rules, {id: ruleId});
                if(rule2 && rule.triggers[0].deviceId == rule2.triggers[0].deviceId && _.findWhere(rule2.actions, {deviceId: actionDevice})) {
                    $scope.deleteRule(rule2.id);
                }
            });
        };

        $scope.selectRule = function () {
            if ($scope.newRuleId) {  // only add non-null id
                var mode = $scope.getMode();
                mode.rules.push($scope.newRuleId);
                $scope.newRuleId = "";
            }
        };

        $scope.addRule = function () {
            // update scheduling service
            //schedulingService.editingModeInfo.addingRule = true;

            $state.go('settings.addModeRule', {baseStationId: $scope.baseStationId, modeId: modeId});

        };

        $scope.deleteMode = function () {

            var baseStation = devicesService.getBaseStationById($scope.baseStationId);

            if(baseStation.activeMode.id == modeId) {
                uiService.info("Active mode could not be deleted");
                return;
            }

            var modalInstance = $modal.open({
                templateUrl: 'partials/confirmDialog.html',
                controller: DeleteModeCtrl,
                scope: $scope,
                backdrop: true,
                resolve: {
                }
            });

            modalInstance.result.then(function () {
                var promise = baseStationService.deleteMode($scope.baseStationId, modeId);
                promise.then(null,
                    function (result) {
                        $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result ? { data: result } : { data: { message: 'Server returned null on delete mode request.' }});
                    });
                baseStation.modes = _.reject(baseStation.modes, function (mode) {
                    return mode.id === modeId;
                });
                delete baseStation.schedule;
                $state.go('settings.modes', {deviceId: $scope.baseStationId});
            });
        };

        function DeleteModeCtrl($scope, $modalInstance) {

            $scope.message = 'Are you sure you want to delete mode?';
            $scope.confirmButton = $filter("i18n")("activity_delete");

            $scope.confirm = function () {
                $modalInstance.close();
            };

            $scope.cancelDialog = function () {
                // exit modal and don't delete the email
                $modalInstance.dismiss('cancel');
            };
        };

        // change state of display when done editing
        $scope.done = function () {
            if (!$scope.isChanged()) return;

            $scope.getMode().name = $scope.getMode().name.trim();

            if (modeId) { // are we editing an existin mode
                // change the mode on the base station
                baseStationService.setMode($scope.baseStationId, $scope.getMode());
                $state.go('settings.modes', {deviceId: $scope.baseStationId});
            } else {
                // add the mode on the base station
                //$scope.addingMode = true;
                //$scope.loading = true;
                baseStationService.addMode($scope.baseStationId, $scope.getMode());

                /*var L = $rootScope.$$listeners.modeAdded
                    ? $rootScope.$$listeners.modeAdded.length
                    : 0;

                $rootScope.$on('modeAdded', function() {
                    $state.go('settings.modes', {deviceId: $scope.baseStationId});
                    $rootScope.$$listeners.modeAdded.splice(L, 1)
                })*/
                $state.go('settings.modes', {deviceId: $scope.baseStationId});
            }
        };

        $scope.isRuleAction = function (rule, type) {
            switch (type) {
                case 'email':
                    return _.findWhere(rule.actions, {type: "sendEmailAlert"});
                case 'record':
                    return _.findWhere(rule.actions, {type: "recordVideo"});
            }
        };
    })

    .controller('RulesCtrl', function ($scope, $state, $stateParams, baseStationService, devicesService) {
        //$scope.noRules = true;
        $scope.init = function () {
            $scope.deviceId = decodeURIComponent($stateParams.deviceId);
            devicesService.initDevices().then(function () {
                var baseStation = devicesService.getBaseStationById($scope.deviceId);
                if (!baseStation) {
                    $state.go('settings');
                    return true;
                }
                //if (!baseStation.rules) {
                    baseStationService.getBaseStationResource($scope.deviceId, "rules");
                //}

            });
        };

        $scope.isLoading = function () {
            var baseStation = devicesService.getBaseStationById($scope.deviceId);
            return !baseStation || !baseStation.hasOwnProperty("rules");
        };

        $scope.getRules = function () {
            var baseStation = devicesService.getBaseStationById($scope.deviceId);

            if (baseStation && (baseStation.properties['connectionState'] == "unavailable"))
                $state.go('settings.baseStation', {baseStationId: baseStation.deviceId});

            return baseStation && baseStation.rules ? baseStation.rules : [];
        };

        $scope.getDeviceName = function () {
            var baseStation = devicesService.getBaseStationById($scope.deviceId);
            return baseStation ? baseStation.deviceName : '';
        };

        /*$scope.isRules = function () {
            var baseStation = devicesService.getBaseStationById($scope.deviceId);
            if (baseStation && baseStation.rules) {
                $scope.noRules = baseStation.rules.length? false : true;
                return !$scope.noRules && !$scope.isLoading();
            }
        };*/
    })

    .controller('EditRuleCtrl', function ($scope, $stateParams, $state, $modal, $log, $timeout, $filter, appProperties, userService, baseStationService, devicesService, scheduleValidationService, camerasService) {
        var baseStationId;
        var baseStation;
        var modeId;
        var ruleId;
        $scope.nameRegExp = /^[a-zA-Z0-9\s~!@#$%^&*()_+=,./<>?;:\-\\\|\[\]\{\"\'\}]+$/;

        $scope.getCName = function (value) {
            return value.replace(/ /g, String.fromCharCode(160));
        };

        $scope.goBack = function () {
            if ($scope.isEditAlerts) {
                $scope.isEditAlerts = false;
                return;
            }
            if (modeId) {
                $state.go('settings.editMode', {deviceId: baseStationId, modeId: modeId});
            }
            else {
                $state.go('settings.rules', {deviceId: baseStationId});
            }
        };

        $scope.isLoading = function () {
            var baseStation = devicesService.getBaseStationById(baseStationId);
            return !baseStation || !$scope.getRule();
        };

        $scope.getOwnerEmail = function () {
            return userService.userName;
        };

        $scope.getRule = function () {
            if ($scope.newRule) {
                return $scope.newRule;
            }

            if ($scope.rule) {
                return $scope.rule;
            }

            var bs = devicesService.getBaseStationById(baseStationId);

            if (bs && bs.rules) {
                $scope.rule = angular.copy(_.findWhere(bs.rules, {id: ruleId}));
                if($scope.rule.name.length > 32) {
                    $scope.rule.name = $scope.rule.name.substring(0, 32);
                }
                if ($scope.rule && $scope.rule.actions[0]) {
                    if(!$scope.rule.actions[0]['stopCondition'] || $scope.rule.actions[0]['stopCondition'].motionDetectionZone) {
                        $scope.rule.actions[0].stopCondition = {
                            type: 'timeout',
                            timeout: 10
                        };
                    }
                    /*rule.actions[0].stopCondition = {
                     type: 'pirStartVideoMotionEnds',
                     sensitivity: 50,
                     motionDetectionZone: {
                     topleftx: 0,
                     toplefty: 0,
                     bottomrightx: 1280,
                     bottomrighty: 780
                     }
                     };*/
                }
                $scope.initialRule = angular.copy($scope.rule);

                var emailAction = _.find($scope.rule.actions, function (action) {
                    return action.type === "sendEmailAlert";
                });
                $scope.allAlertEmails = scheduleValidationService.getAllEmails();
                $scope.initialAlertEmails = [];
                if (emailAction && emailAction.recipients) {
                    $scope.initialAlertEmails = angular.copy(emailAction.recipients);
                }

                return $scope.rule;
            }
            return null;
        };

        $scope.getCameras = function () {
            var cams = _.filter(baseStationService.getAllCamerasOfBaseStation(baseStationId), function (camera) {
                return camera.state === 'provisioned';
            });
            return cams || [];
        };

        $scope.init = function () {
            $scope.takingSnapshot = null;
            $scope.changed = false;
//            $scope.$on(appProperties.appEvents.SNAPSHOT_LOADED, function (event, args) {
//                if ($scope.getRule().actions[0].deviceId == args.deviceId) {
//                    $timeout.cancel($scope.takingSnapshot);
//                    $scope.takingSnapshot = null;
//                }
//            });
            baseStationId = decodeURIComponent($stateParams.baseStationId);
            if ($stateParams.ruleId) {
                ruleId = $stateParams.ruleId;
            }

            devicesService.initDevices().then(function () {
                baseStation = devicesService.getBaseStationById(baseStationId);
                if (!baseStation) {
                    $state.go('settings');
                }
                if (!baseStation.rules) {
                    baseStationService.getBaseStationResource(baseStationId, "rules");
                }
            });

            $scope.actions = [
                {type: 'recordVideo', description: 'Record Video'}
                //{type: 'recordSnapshot', description: 'Record Snapshots'}
            ];

            if (ruleId) { // we are editing a rule
                $scope.editMode = true;
            } else {  // we are adding a rule
                $scope.newRule = baseStationService.createDefaultRule();
                $scope.initialRule = angular.copy(baseStationService.createDefaultRule());
            }

            // save mode id so can return to previous rule
            if ($stateParams.modeId) {
                modeId = $stateParams.modeId;
            }
//            $scope.$watch($scope.getRule, function () {
//                var rule = $scope.getRule();
//                if (rule && rule.actions && rule.actions[0].deviceId) {
//                    takeSnapshot(rule.actions[0].deviceId);
//                }
//            })
        };

        $scope.isChanged = function () {
            if (!!$scope.newRule && !$scope.isLoading()) {
                if($scope.isEditAlerts) {
                    return $scope.changed = $scope.changedAlertEmails.length || $scope.newAddedEmails;
                } else {
                    return $scope.changed = $scope.newAddedEmails ||
                                            $scope.initialRule.name != $scope.newRule.name.trim() ||
                                            $scope.initialRule.triggers[0].deviceId != $scope.newRule.triggers[0].deviceId ||
                                            $scope.initialRule.triggers[0].sensitivity != $scope.newRule.triggers[0].sensitivity ||
                                            $scope.initialRule.actions[0].deviceId != $scope.newRule.actions[0].deviceId ||
                                            $scope.initialRule.actions[0].stopCondition.timeout != $scope.newRule.actions[0].stopCondition.timeout;
                }
            } else if (!$scope.isLoading()){
                if ($scope.isEditAlerts) {
                    return $scope.changed = $scope.changedAlertEmails.length || $scope.newAddedEmails;
                } else {
                    return $scope.changed = $scope.editAlertsUpdated ||
                            $scope.initialRule.name != $scope.rule.name ||
                            $scope.initialRule.triggers[0].deviceId != $scope.rule.triggers[0].deviceId ||
                            $scope.initialRule.triggers[0].sensitivity != $scope.rule.triggers[0].sensitivity ||
                            $scope.initialRule.actions[0].deviceId != $scope.rule.actions[0].deviceId ||
                            $scope.initialRule.actions[0].stopCondition.timeout != $scope.rule.actions[0].stopCondition.timeout;
                }
            }
        };

        var takeSnapshot = function (deviceId) {
            $timeout.cancel($scope.takingSnapshot);
            $scope.takingSnapshot = null;
            camerasService.getFullFrameSnapshot(deviceId, false).then(function (result) {
                $scope.takingSnapshot = $timeout(function () {
                    $scope.takingSnapshot = null;
                }, 20000);
            });
        };

        $scope.isRuleValid = function () {
            var rule = $scope.getRule();
            var bs = devicesService.getBaseStationById(baseStationId);

            if (bs && (bs.properties['connectionState'] == "unavailable"))
                $state.go('settings.baseStation', {baseStationId: bs.deviceId});

            if (!rule || !bs) {
                return false;
            }
            return scheduleValidationService.validateRule(bs.deviceId, rule);
        };

        $scope.triggerChanged = function (deviceId) {
            if(deviceId && !$scope.getRule().actions[0].deviceId) {
                $scope.getRule().actions[0].deviceId = deviceId;
                $scope.deviceChanged(deviceId);
            }
        };

        $scope.deviceChanged = function (deviceId) {
            //deviceId && (takeSnapshot(deviceId));
            //if(camera && camera.properties && camera.properties.connectionState == appProperties.AVAILABLE_STATE) {
        };

        $scope.getDetector = function (id) {
            if (!$scope.getRule() || !$scope.getRule().actions || !$scope.getRule().actions.length) {
                return '';
            }
            var id = $scope.getRule().actions[0].deviceId;
            var device = devicesService.getDeviceById(id);
            return device && device.properties ? device.properties.presignedSnapshotUrl : '';
        };

        $scope.detectorSensitivity = function (rawSensitivity) {
            var integralSensitivity = Math.floor((rawSensitivity / 100 ) * 100);
            return isNaN(integralSensitivity) ? 50 : integralSensitivity;
        };

        $scope.cameraName = function (id) {
            return devicesService.getDeviceName(id);
        };

        $scope.done = function () {
            if($scope.isEditAlerts && !$scope.newRule) {
                $scope.editAlertsUpdated = !angular.equals(
                    $scope.alertEmails.sort(function (a, b) {
                        return (a > b ? 1 : -1);
                    }),
                    $scope.initialAlertEmails.sort(function (a, b) {
                        return (a > b ? 1 : -1);
                    })
                );
            }

            if (!$scope.changed) return;

            if ($scope.isEditAlerts) {
                $scope.doneAlerts();
            }
            else {
                $scope.doneRule();
            }
        };

        $scope.doneRule = function () {

            scheduleValidationService.fixRule($scope.getRule());

            if ($scope.getRule().actions[0].type == 'recordVideo') {
                $scope.getRule().actions[0].stopCondition.deviceId = $scope.getRule().actions[0].deviceId;
            }
            else {
                delete $scope.getRule().actions[0].stopCondition;
            }

            if (ruleId) {
                var emailAction = _.find($scope.getRule().actions, function (action) {
                    return action.type === "sendEmailAlert";
                });

                // change the rule on the base station
                baseStationService.setRule(baseStationId, $scope.getRule());
            } else {
                // add the rule on the base station
                baseStationService.addRule(baseStationId, $scope.getRule());
            }

            $scope.goBack();
        };

        $scope.editAlerts = function () {
            var email = $scope.alertsForm.newEmail;
            email.$setViewValue("");
            email.$setPristine();
            email.$render();

            $scope.$watch(
                function() {
                    return email.$viewValue.length;
                },
                function(){
                    if (!email.$viewValue.length) {
                        email.$setViewValue("");
                        email.$setPristine();
                    }
                }
            );

            var emailAction = _.find($scope.getRule().actions, function (action) {
                return action.type === "sendEmailAlert";
            });

            $scope.alertEmails = [];
            if (emailAction && emailAction.recipients) {
                $scope.alertEmails = angular.copy(emailAction.recipients);
            }

            $scope.newAddedEmails = 0;
            $scope.changedAlertEmails = [];
            $scope.allAlertEmails = scheduleValidationService.getAllEmails();
            $scope.isEditAlerts = true;
        };

        $scope.deleteRule = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/confirmDialog.html',
                controller: DeleteRuleCtrl,
                scope: $scope,
                backdrop: true,
                resolve: {
                }
            });

            modalInstance.result.then(function () {
                if(ruleId) {
                    baseStationService.deleteRule(baseStationId, ruleId);
                    baseStation.rules = _.reject(baseStation.rules, function (rule) {
                        return rule.id === ruleId;
                    });
                    delete baseStation.modes;
                }
                $scope.goBack();
            });
        };

        function DeleteRuleCtrl($scope, $modalInstance) {

            $scope.message = 'Are you sure you want to delete rule?';
            $scope.confirmButton = $filter("i18n")("activity_delete");
            $scope.confirm = function () {
                // user confirms delete
                $modalInstance.close();
            }

            $scope.cancelDialog = function () {
                // exit modal and don't delete
                $modalInstance.dismiss('cancel');
            }
        };


        // ------------------------------------------Edit Alerts---------------------------------

        /*
         Toggle select email alert for this rule.
         */
        $scope.select = function (email) {
            if (_.contains($scope.alertEmails, email)) {
                $scope.alertEmails = _.without($scope.alertEmails, email);
            } else {
                $scope.alertEmails.push(email);
            }

            if (!$scope.changedAlertEmails.length || !_.contains($scope.changedAlertEmails, email)) {
                $scope.changedAlertEmails.push(email)
            } else if (_.contains($scope.changedAlertEmails, email)) {
                $scope.changedAlertEmails = _.without($scope.changedAlertEmails, email);
            }
        };

        /*
         Add email to list if not already there.
         */
        $scope.addAlert = function () {
            if ($scope.alertsForm.newEmail.$error.email) {
                return;
            }
            var email = $scope.newEmail.trim();

            if(email.toLowerCase() == $scope.getOwnerEmail().toLowerCase()) {
                $scope.alertEmails.push(email);
                resetFieald();
                return;
            }

            if (_.find($scope.allAlertEmails, function (allEmail) {
                    return email.toLowerCase() == allEmail.toLowerCase();
                })) {
                $scope.alertEmails = _.union($scope.alertEmails, email);
            } else {
                $scope.newAddedEmails++;
                $scope.alertEmails.push(email);
                $scope.allAlertEmails.push(email);
            }

            resetFieald();

            function resetFieald() {
                $scope.newEmail = null;
                $scope.alertsForm.newEmail.$setViewValue("");
                $scope.alertsForm.newEmail.$setPristine();
                $scope.alertsForm.newEmail.$render();
            }


        };

        $scope.cancel = function () {
            if ($scope.isEditAlerts) {
                $scope.isEditAlerts = false;
            }
            else {
                $state.go('settings.editModeRule', {baseStationId: baseStationId, modeId: modeId, ruleId: ruleId});
            }
        }

        $scope.doneAlerts = function () {
            // save the email recipients in the rule
            // get the selected alert emails for this rule
            var emailAction = _.find($scope.getRule().actions, function (action) {
                return action.type === "sendEmailAlert";
            });
            if (emailAction && !$scope.alertEmails.length) {
                var idx = $scope.getRule().actions.indexOf(emailAction);
                $scope.getRule().actions.splice(idx, 1);
            }
            else if ($scope.alertEmails.length) {
                if (!emailAction) {
                    emailAction = scheduleValidationService.createDefaultEmailAction();
                    $scope.getRule().actions.push(emailAction);
                }
                emailAction.recipients = $scope.alertEmails;
            }

            $scope.isEditAlerts = false;
        };

        $scope.isSelected = function (email) {
            return _.contains($scope.alertEmails, email);
        };

    })

    .controller('FooterCtrl', function ($scope, $rootScope, $window, $state, $stateParams, $modal, $filter, $timeout, appProperties, userService, calendarService, logoutService, dayService, libraryService, recordingsService, baseStationService, devicesService, uiService, billingFlowService) {
        $scope.init = function (view, args) {
            $scope.listener = null;
            $scope.mode = view;
            $scope.showModes = false;
            devicesService.initDevices();
            recordingsService.selectMode = false;
            $timeout(function () {
            var client = new ZeroClipboard( document.getElementById("copy-button") );

            client.on( "ready", function( readyEvent ) {
                client.on( "aftercopy", function( event ) {
                    $scope.email = null;
                } );
            } );
            });

            var _leavingPageText = "Arlo is processing your request.";
            var _leavingPageText2 = "Are you sure you want to leave without finishing?";
            $window.onbeforeunload = function(e){
                if (billingFlowService.inProgress)
                    return (_leavingPageText + "\n" + _leavingPageText2);
            }
        };

        /*$scope.$on('logout', function(event){
                event.preventDefault();
                $scope.confirmHandler(event);
            }
        );

        $scope.confirmHandler = function (event) {
            $scope.message = "Arlo is processing your request. Are you sure you want to leave without finishing?";
            $scope.modalInstance = $modal.open({
                templateUrl: 'partials/preventingPlanChanging.html',
                controller: preventingPlanChanging,
                scope: $scope,
                backdrop: true,
                resolve: {}
            });

            $scope.modalInstance.result.then(function () {
                userService.setFromLogout();

                var promise = logoutService.logout();
                promise.then(function () {
                    $state.go('login');
                });
            });

            function preventingPlanChanging ($scope, $modalInstance) {
                $scope.stayButton = "STAY";
                $scope.leaveButton = "LEAVE";

                $scope.leave = function () {
                    $modalInstance.close();
                };

                $scope.stay = function () {
                    $scope.$parent.modalInstance = null;
                    $modalInstance.dismiss('cancel');
                };
            }
        };*/

        /*
         Checks if user has access to any base station to change a mode.
         */
        $scope.canChangeMode = function () {
            return _.findWhere(devicesService.getBaseStations(),{state: appProperties.PROVISIONED_STATE });
        };

        /*
         Checks if user has permission to select and favorite, share, download, delete.
         */
        $scope.canSelect = function () {
            var result = !devicesService.isPureUser() && (!recordingsService.selectMode || _.findWhere(recordingsService.recordings, {selected: true}));
            if (!result) $scope.email = false;
            return result;
        };

        $scope.gotoCalendarView = function () {
            calendarService.gotoCalendarView();
        };

        $scope.gotoLogout = function () {
            /*if (!$scope.modalInstance && billingFlowService.inProgress) {
                $scope.$emit('logout', null);
                return;
            }*/

            userService.setFromLogout();

            var promise = logoutService.logout();
            promise.then(function () {
                $state.go('login');
            });

        };

        $scope.getRecording = function () {
            return recordingsService.current;
        };

        $scope.isCurrentFavorite = function () {
            return recordingsService.isFavorite($scope.getRecording());
        };

        $scope.onlyFavoriteSelected = function () {
            var numOfSelectedFavurite = 0;

            for (var i = 0; i < recordingsService.recordings.length; i++) {
                if (recordingsService.recordings[i].selected && recordingsService.isFavorite(recordingsService.recordings[i])) {
                    numOfSelectedFavurite++;
                }
            }
            var result = _.where(recordingsService.recordings, {selected: true}).length == numOfSelectedFavurite;
            if (!recordingsService.selectMode) {
                var content = $scope.getRecording();
                result =  recordingsService.isFavorite(content);
            }
            return result
        };

        $scope.isFavorite = function () {
            if (recordingsService.selectMode) {
                var selection = false;

                for (var i = 0; i < recordingsService.recordings.length; ++i) {

                    selection = selection || recordingsService.recordings[i].selected;
                    if (recordingsService.recordings[i].selected && !recordingsService.isFavorite(recordingsService.recordings[i])) {
                        return false;
                    }
                }
                return selection;
            }
            else {
                return $scope.isCurrentFavorite();
            }
        };

        $scope.favorite = function () {
            var selection = new Array(recordingsService.recordings.length);
            var selectionExists = false;
            if (recordingsService.selectMode) {
                var favorite = !$scope.isFavorite();
                for (var i = 0; i < recordingsService.recordings.length; ++i) {
                    if (recordingsService.recordings[i].selected) {
                        selection[i] = favorite;
                        selectionExists = true;
                    }
                }
                $rootScope.selectAllMode = false;
            }
            else {
                var index = recordingsService.recordings.indexOf($scope.getRecording());
                selection[index] = !recordingsService.isFavorite($scope.getRecording());
                selectionExists = true;
            }
            if (!selectionExists) {
                return;
            }

            var promise = recordingsService.favoriteRecordings(selection, recordingsService.recordings);
            promise.then(function () {
                    //$window.alert("You have successfully set favorite.");
                    if (!recordingsService.selectMode) {
                        recordingsService.toggleFavorite($scope.getRecording());
                    }
                    else {
                        dayService.refreshData();
                    }
                },
                function () {
                    if (recordingsService.selectMode) {
                        dayService.refreshData();
                    }
                })
        };

        $scope.share = function () {
            if ($scope.email) { // duplicate click on 'share', remove body-click listener

                $scope.listener();
                $scope.emailLoading = false;
                $scope.email = false;

                return;

            } else {
                // 'share' popup on, add body-click listener
                $scope.listener = $scope.$on(appProperties.appEvents.BODY_CLICK, function () {
                    if ($scope.email) {
                        // 'share' popup off, remove body-click listener
                        $scope.emailLoading = false;
                        $scope.email = false;
                        $scope.listener();
                    }
                });
            }

            $scope.emailLoading = true;
            $scope.email = null;
            var promise = recordingsService.shareRecordings();
            promise.then(function (result) {
                    $scope.email = result.data.email;
                    $scope.link =  result.data.copyLink || $scope.email.content.match(/https:\/\/.*arlo.*[\r\n]/g)[0];
                },
                function (result) {
                    result && ($rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result));
                })["finally"](function () {
                $scope.emailLoading = false;
            });
        };

        $scope.download = function () {
            if (recordingsService.selectMode) {
                for (var i = 0; i < recordingsService.recordings.length; ++i) {
                    if (recordingsService.recordings[i].selected) {
                        $scope.downloadLink(recordingsService.recordings[i]);
                    }
                }
                $rootScope.selectAllMode = false;
            }
            else {
                $scope.downloadLink($scope.getRecording());
            }
        };

        $scope.downloadLink = function (record) {
            if (!Modernizr.adownload) {
                window.open(record.presignedContentUrl, "_blank");
                return false; // a[download] not supported on this browser
            }
            var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
            save_link.href = record.presignedContentUrl;
            save_link.download = record.reason + '.' + record.contentType.split('/')[1];
            save_link.target = "_blank";
            var event = document.createEvent("MouseEvents");
            event.initMouseEvent(
                "click", true, false, window, 0, 0, 0, 0, 0
                , false, false, false, false, 0, null
            );
            save_link.dispatchEvent(event);
        };

        $scope.getRecordings = function () {
            if (!recordingsService.recordings || !$scope.favorites || !$scope.selectedCameras) {
                return [];
            }
            return _.filter(recordingsService.recordings, function (recording) {
                return ($scope.favorites.value == 'all' ||
                    ($scope.favorites.value == 'only' && recording.currentState == appProperties.FAVORITE_STATE) ||
                    ($scope.favorites.value == 'non' && recording.currentState != appProperties.FAVORITE_STATE)) &&
                    _.findWhere($scope.selectedCameras, {deviceId: recording.deviceId});
            });
        };

        $scope["delete"] = function () {
            if (recordingsService.selectMode) {
                if(this.onlyFavoriteSelected())
                    return;

                var recordings = recordingsService.recordings;
                var selected = _.filter(recordings, function(rec) {return rec.selected});
                var fav_selected = _.filter(selected, function(fav_rec) {return fav_rec.currentState == appProperties.FAVORITE_STATE});

                if (selected) {
                    $scope.message = $filter("i18n")("library_label_confirm_delete_media");
                    if(fav_selected) {
                        $scope.message += '<br/>' + $filter('i18n')('subscription_label_delete_all_unlocked_files_note');
                    }
                    var modalInstance = $modal.open({
                        templateUrl: 'partials/confirmDialog.html',
                        controller: DeleteRecordingsCtrl,
                        scope: $scope,
                        backdrop: true,
                        resolve: {}
                    });

                    modalInstance.result.then(function () {
                        var promise = recordingsService.recycleRecordings(recordingsService.recordings);
                        var totalDeletedRecordings = selected.length - fav_selected.length;
                        promise.then(function () {

                            var infoMessage = totalDeletedRecordings == 1 ? '1 file has been deleted.' : totalDeletedRecordings + ' files have been deleted.';

                            uiService.info(infoMessage);
                            //$window.alert("Selected records deleted");
                            dayService.refreshData();
                            //$rootScope.$broadcast('update_recording', null);
                            $rootScope.selectAllMode = false;
                            if (totalDeletedRecordings == $scope.getRecordings().length) {
                                $scope.reloadCalendar();
                            }
                            devicesService.getDevices();
                        });
                    });
                }
            }
            else {
                var content = $scope.getRecording();
                content.selected = true;
                if (!recordingsService.isFavorite(content)) {
                    $scope.message = $filter("i18n")("library_label_confirm_delete_media");
                    var modalInstance = $modal.open({
                        templateUrl: 'partials/confirmDialog.html',
                        controller: DeleteRecordingsCtrl,
                        scope: $scope,
                        backdrop: true,
                        resolve: {
                        }
                    });

                    modalInstance.result.then(function () {
                        var promise = recordingsService.recycleRecordings([content]);
                        promise.then(function () {

                            var infoMessage = 'File has been deleted.';
                            var modalInstance = uiService.info(infoMessage);

                            modalInstance.then(function () {
                                var currentIndex = _.indexOf(recordingsService.recordings, recordingsService.current);
                                var nextIndex = _.indexOf(recordingsService.recordings, recordingsService.getNextContent(currentIndex, $stateParams));
                                var previousIndex = _.indexOf(recordingsService.recordings, recordingsService.getPreviousContent(currentIndex, $stateParams));

                                recordingsService.recordings.splice(currentIndex, 1);
                                recordingsService.persistRecordings();

                                if (content.recordingNumber != nextIndex) { // there is next content for this day
                                    $scope.$emit('recording-deleted', [currentIndex,nextIndex]);
                                } else if (content.recordingNumber != previousIndex) {  // otherwise there is previous content for this day
                                    $state.go('recording', {recordingNumber: previousIndex});
                                } else { // otherwise just go back to the library view showing day empty of recordings/snapshots
                                    //$state.go('calendar.day', {day: dayService.day});
                                    calendarService.gotoCalendarView();
                                }
                                devicesService.getDevices();
                            });

                        });
                    });
                }
            }

        };

        function DeleteRecordingsCtrl($scope, $modalInstance) {
            $scope.confirmButton = $filter("i18n")("activity_delete");;
            $scope.confirm = function () {
                // user confirms delete the friend
                $modalInstance.close();
            }

            $scope.cancelDialog = function () {
                // exit modal and don't delete the friend
                $modalInstance.dismiss('cancel');
            }
        };

        $scope.isVideo = function () {
            return $scope.getRecording().contentType == appProperties.videoFormat;
        };

        $scope.isRecordingMode = function () {
            return $scope.mode == 'recording' || recordingsService.selectMode;
        };

        $scope.sendEmail = function () {
            var str = "mailto:?subject=" + encodeURIComponent($scope.email.subject) + "&body=" + encodeURIComponent($scope.email.content);
            $scope.email = null;
            window.location.href = str.length > 2000 ? str.substr(0, 2000) : str;
        };

        $scope.isFriendRecording = function () {
            if (recordingsService.selectMode) {
                return false;
            }
            var cam = _.findWhere(devicesService.allDevices, {deviceId: $scope.getRecording().deviceId});
            return !cam || cam.userRole == appProperties.USER_ROLE_USER;
        };
    })

    .controller('CalendarFilterCtrl', function ($scope, $rootScope, $state, $filter, appProperties, calendarService, devicesService) {
        $scope.init = function () {
            $scope.favoritesOptions = appProperties.favoritesOptions;
            $scope.favorites = _.findWhere(appProperties.favoritesOptions, {value: calendarService.stateParams.favorites});
            var paramCameras = calendarService.stateParams.cameraIds.split(',');

            if(paramCameras == appProperties.CAMERAS_ALL_SELECTED)
                paramCameras = devicesService.getAvailableCameraIds();//devicesService.getAllCameraIds();

            $scope.selectedCameras = _.filter($scope.getCameras(), function (camera) {
                return paramCameras.indexOf(camera.deviceId) != -1;
            });
        };

        $scope.getCameras = function () {
            return _.filter(devicesService.allDevices, function (camera) {
                return  (camera.deviceType == appProperties.CAMERA_DEVICE_TYPE && camera.state == appProperties.PROVISIONED_STATE) ||
                    (camera.deviceType == appProperties.CAMERA_DEVICE_TYPE && camera.mediaObjectCount);
            })
        };

        $scope.favoritesChanged = function (favorite) {
                $scope.favorites = favorite;
            };

        $scope.camerasSelectionChanged = function (camera) {
            var idx = $scope.selectedCameras.indexOf(camera);

            if (idx > -1) {
                $scope.selectedCameras.splice(idx, 1);
            }
            else {
                $scope.selectedCameras.push(camera);
            }
        };

        $scope.done = function () {
            //libraryService.setFavorites($scope.favorites);
            //libraryService.setSelectedCameras($scope.selectedCameras);
            calendarService.stateParams.favorites = $scope.favorites.value;
            $scope.selectedCameras = $filter('orderBy')($scope.selectedCameras, "deviceId");
            calendarService.stateParams.cameraIds = _.map($scope.selectedCameras, function (camera) {
                return camera.deviceId
            }).join(',')

            if(calendarService.stateParams.cameraIds == devicesService.getAvailableCameraIds()) {
                calendarService.stateParams.cameraIds = appProperties.CAMERAS_ALL_SELECTED;
            }

            calendarService.gotoCalendarView();
        };

        $scope.isCameraSelected = function (id) {
            return _.findWhere($scope.selectedCameras, {deviceId: id}) ? true : false;
        };
    })

    .controller('RecycledDateCtrl', function ($scope, $rootScope, $filter,$element, recordingsService) {
        var defaultPageSize = 200,
            recordingsOnDate,
            recordingsOnPage,
            selectedRecordingsOnPage;

        $scope.init = function (createdDate, first) {
            $scope.selectedAllRecycleRecordings = false;
            $scope.expanded = false;
            $scope.createdDate = createdDate;
            $scope.promise.then(function () {
                if (first) {
                    $scope.expanded = true;
                    loadBlockContent()
                }
            })['finally'](function () {
               $scope.loading = false;
            });
        };

        $scope.expand = function() {
            $scope.promise.then(function () {
                loadBlockContent()
            })['finally'](function () {
                $scope.loading = false;
                $scope.expanded = !$scope.expanded;
            });
        };

        function loadBlockContent() {
            $scope.loading = true;
            $scope.currentPage = 1;
            recordingsOnDate = _.where(recordingsService.recycled, {createdDate: $scope.createdDate});
            $scope.pageCount = Math.ceil(recordingsOnDate.length / defaultPageSize);
            recordingsOnPage = recordingsOnDate.slice(0, defaultPageSize);
        }

        $scope.getRecordings = function () {
            return  recordingsOnPage;
        };

        $scope.nextPage = function (offset) {            $scope.currentPage += offset;
            recordingsOnPage = recordingsOnDate.slice(defaultPageSize * ($scope.currentPage - 1), defaultPageSize * $scope.currentPage);
            selectedRecordingsOnPage =_.where(recordingsOnPage, {selected: true})

            $scope.selectedAllRecycleRecordings = recordingsOnPage.length == selectedRecordingsOnPage.length ? true : false;
        };

        $scope.selectRecording = function (index) {
            $scope.utcDate = recordingsService.recycled[index].utcCreatedDate;
            recordingsService.recycled[index].selected = !recordingsService.recycled[index].selected;
            selectedRecordingsOnPage =_.where(recordingsOnPage, {selected: true})
            $scope.selectedAllRecycleRecordings = selectedRecordingsOnPage.length == recordingsOnPage.length ? true : false;
        };

        $scope.toggleRecycleSelectAll = function () {

            $scope.selectedAllRecycleRecordings = !$scope.selectedAllRecycleRecordings;
            $scope.selectedAllRecycleRecordings
                ? $scope.$emit('selectAllRecycleRecordings')
                : $scope.$emit('unselectAllRecycleRecordings');

            for (var i = 0; i < recordingsOnDate.length; i++) {
                recordingsOnDate[i].selected = $scope.selectedAllRecycleRecordings ? true : false;
            }
        };
    })

    .controller('RecycledCtrl', function ($scope, $rootScope, $filter, $stateParams, recordingsService, calendarService, dayService, appProperties, devicesService) {
        $scope.init = function () {
            recordingsService.selectMode = false;
            calendarService.stateParams = angular.copy($stateParams);

            dayService.day = calendarService.stateParams.day;
            $scope.loading = true;
            $scope.promise = recordingsService.getRecycleRecordings()["finally"](function () {
                $scope.getRecycleDates();
                $scope.loading = false;
            });
            $rootScope.$broadcast("recycleModeEnable");
        };

        $scope.getRecycleDates = function () {
            var recycled = recordingsService.recycled;
            $scope.dates = [];
            for (var i=0; i < recycled.length; i++) {
                if (_.indexOf($scope.dates, recycled[i].createdDate) == -1) {
                    $scope.dates.push(recycled[i].createdDate)
                }
            }
        };

        $scope.restore = function () {
            var selection = _.find(recordingsService.recycled, function (rec) {
                return rec.selected;
            });

            if (selection) {
                var promise = recordingsService.restoreRecordings(recordingsService.recycled);

                promise.then(
                    function () {
                        devicesService.getDevices();
                        $scope.init();
                        $scope.reloadCalendar();

                    },
                    function (result) {
                        result && $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result);
                    }
                );
            }
        };

        $scope.gotoCalendarView = function () {
            $scope.$parent.selectMode = false;
            $scope.reloadCalendar();
            calendarService.gotoCalendarView();
        };

        $scope.getSelectedCount = function () {
            return _.reduce(recordingsService.recycled, function(memo, value){
                value.selected && (memo++);
                return memo;
            }, 0);
        };

        $scope.isVideo = function (rec) {
            return rec.contentType == appProperties.videoFormat;
        };
    })

    .controller('AboutCtrl', function ($scope, $modal, urlService) {
        $scope.displayTos = function () {
            $scope.viewMode = true;
            $modal.open({
                windowTemplateUrl: 'partials/tosDialog.html',
                templateUrl: urlService.getTermsUrl(),
                scope: $scope,
                backdrop: true
            })
        };
    })

    // todo:  ROLES
    .controller('CameraOrderCtrl', function ($scope, $modal, $log, $state, $filter, appProperties, libraryService, devicesService, baseStationService, camerasService) {
        $scope.init = function () {
            $scope.loading = true;
            devicesService.initDevices().then(function () {
                $scope.cameras = null;
                $scope.syncCameras = null;
                $scope.loading = false;
                $scope.changed = false;
                $scope.initialCamerasOrder = '';
                _.forEach($scope.getCameras(), function (camera) {
                    $scope.initialCamerasOrder += camera.deviceId;
                })
            });
        };

        $scope.$on('new_camera', function () {
            $scope.cameras = null;
        });

        $scope.getCameras = function () {
            if ($scope.cameras) {
                return $scope.cameras;
            }

            if (devicesService.devices) {
                $scope.cameras = _.filter(angular.copy(devicesService.devices), function (camera) {
                    return camera.deviceType == appProperties.CAMERA_DEVICE_TYPE && (camera.state == appProperties.PROVISIONED_STATE);
                });
                $scope.sortDevices();
                return $scope.cameras;
            }
            return [];
        };

        $scope.isChanged = function() {
            return $scope.changed;
        };

        $scope.compareSoortedDevices = function() {
            var newCamerasOrder = '';
            _.forEach($scope.getCameras(), function (camera) {
                newCamerasOrder += camera.deviceId;
            });
            $scope.changed = newCamerasOrder != $scope.initialCamerasOrder
        };

        $scope.getSyncCameras = function () {
            if ($scope.syncCameras) {
                return $scope.syncCameras;
            }

            if (devicesService.devices) {
                $scope.syncCameras = _.filter(angular.copy(devicesService.devices), function (camera) {
                    return camera.deviceType == appProperties.CAMERA_DEVICE_TYPE && camera.state == appProperties.SYNCED_STATE;
                });
                $scope.sortDevices();
                return $scope.syncCameras;
            }
            return [];
        };

        $scope.sortDevices = function () {
            $scope.cameras = $filter('orderBy')($scope.cameras, "displayOrder");
        };

        $scope.done = function () {
            if(!$scope.isChanged()) return;

            var promise = camerasService.setCameraOrder($scope.cameras);
            promise.then(function () {
                var promise2 = devicesService.getDevices();
                promise2.then(function () {
                    $state.go('settings');
                })
            });
        };

        $scope.deleteCamera = function (camera) {
            $scope.cameraName = camera.deviceName;
            var modalInstance = $modal.open({
                templateUrl: 'partials/confirmDialog.html',
                controller: DeleteCameraCtrl,
                scope: $scope,
                backdrop: true,
                resolve: {
                }
            });

            modalInstance.result.then(function () {
                var promise = baseStationService.removeDevice(camera.parentId, camera.deviceId);
                promise.then(function () {
                    $log.info('Camera have been deleted.');
                    devicesService.getDevices().then(function () {
                        $scope.cameras = null;
                    });
                    var bs = devicesService.getDeviceById(camera.parentId);
                    if(bs && bs.state== appProperties.PROVISIONED_STATE && bs.properties && bs.properties.connectionState == appProperties.AVAILABLE_STATE) {
                        baseStationService.getBaseStationResource(camera.parentId, 'modes');
                        baseStationService.getBaseStationResource(camera.parentId, 'rules');
                    }
                });
            });
        };

        function DeleteCameraCtrl($scope, $modalInstance) {

            $scope.message = $filter('i18n')('camera_order_confirm_delete_camera').replace('{cameraName}', $scope.cameraName);
            $scope.confirmButton = $filter("i18n")("activity_delete");
            $scope.confirm = function () {
                // user confirms delete
                $modalInstance.close();
            };

            $scope.cancelDialog = function () {
                // exit modal and don't delete
                $modalInstance.dismiss('cancel');
            }
        };
    })

    .controller('BaseStationCtrl', function ($scope, $rootScope, $state, $stateParams, $modal, $q, $filter, appProperties, jsonService, baseStationService, devicesService, userService, uiService) {
        $scope.nameRegExp = /^[a-zA-Z0-9\s~!@#$%^&*()_+=,./<>?;:\-\\\|\[\]\{\"'\}]+$/;
        $scope.init = function () {
            $scope.changed = false;
            $scope.deviceId = decodeURIComponent($stateParams.baseStationId);
            devicesService.initDevices().then(function () {
                initValue();
            });
        };

        $scope.$on(appProperties.appEvents.BS_REBOOTED, function (event, deviceId) {
            var baseStation = devicesService.getDeviceById(deviceId);
            if(baseStation) {
                baseStation.properties['connectionState'] = appProperties.UNAVAILABLE_STATE;
                _.each(_.where(devicesService.devices, {parentId : $scope.deviceId}), function (device) {
                    device.properties['connectionState'] = appProperties.UNAVAILABLE_STATE;
                });
            }
            uiService.info("Base Station has been restarted");
        });

        var initValue = function () {
            $scope.AFModes = [
                {id : 0, value : $filter("i18n")("label_frequency_auto_value")},
                {id : 1, value : $filter("i18n")("label_frequency_60")},
                {id : 2, value : $filter("i18n")("label_frequency_50")}
            ];

            $scope.baseStation = angular.copy(devicesService.getBaseStationById($scope.deviceId));
            if (!$scope.baseStation || ($scope.baseStation.state != appProperties.PROVISIONED_STATE && $scope.baseStation.state != appProperties.SYNCED_STATE)) {
                $state.go('settings');
                return;
            }
            if ($scope.baseStation.owner.ownerId != userService.userId) {
                // admin base station
                $scope.admin = true;
            }
            else { // own base station
                jsonService.timeZones().then(function (result) {
                    //$scope.deviceId = "3T21447P00074"; /*On-Line BS*/
                    $scope.timeZones = result.data;
                    var i = 0;

                    if ($scope.baseStation.properties && $scope.baseStation.properties.timeZone) {
                        $scope.timeZone = _.findWhere($scope.timeZones, {"id": $scope.baseStation.properties.timeZone});
                        $scope.baseStation = angular.copy(devicesService.getBaseStationById($scope.deviceId));
                        if ($scope.baseStation.properties.antiFlicker) {
                            var modeId = $scope.baseStation.properties.antiFlicker.mode;
                            var autoDefaultId = $scope.baseStation.properties.antiFlicker.autoDefault;

                            $scope.AFMode = _.findWhere($scope.AFModes, {"id": modeId});
                            if (!modeId && !i) {
                                $scope.AFMode.value = $filter("i18n")("label_frequency_auto").replace("{frequency}", _.findWhere($scope.AFModes, {"id": autoDefaultId}).value);
                                i++;
                            }
                        }

                        $scope.initialAutoUpdateEnabled = $scope.baseStation.properties.autoUpdateEnabled;
                        $scope.initialAFModeId = $scope.AFMode ? $scope.AFMode.id : "";
                        $scope.initialTimeZoneId = $scope.timeZone.id;
                    }
                    
                    $scope.$on(appProperties._RESOURCE_UPDATE_, function () {
                        $scope.baseStation = angular.copy(devicesService.getBaseStationById($scope.deviceId));
                        $scope.initialAutoUpdateEnabled = $scope.baseStation.properties.autoUpdateEnabled;
                        if ($scope.baseStation.properties) {
                            $scope.timeZone = _.findWhere($scope.timeZones, {"id": $scope.baseStation.properties.timeZone});

                            if ($scope.baseStation.properties.antiFlicker) {
                                var modeId = $scope.baseStation.properties.antiFlicker.mode;
                                var autoDefaultId = $scope.baseStation.properties.antiFlicker.autoDefault;

                                $scope.AFMode = _.findWhere($scope.AFModes, {"id": modeId})
                                if (!modeId && !i) {
                                    $scope.AFMode.value += " (" + (_.findWhere($scope.AFModes, {"id": autoDefaultId})).value + ")"
                                    i++;
                                }
                            }
                            $scope.initialAFModeId = $scope.AFMode ? $scope.AFMode.id : "";
                            $scope.initialTimeZoneId = $scope.timeZone ? $scope.timeZone.id : "";
                        }
                    });
                });
            }
            $scope.baseStationName = $scope.baseStation.deviceName;
        };

        $scope.toggleAutoUpdate = function () {
            $scope.baseStation.properties.autoUpdateEnabled = !$scope.baseStation.properties.autoUpdateEnabled;
        };

        $scope.isAntiFlickerAvailable = function () {
            if ($scope.baseStation)
                return $scope.baseStation.properties.antiFlicker;
        };

        $scope.isBaseStationAvailable = function () {
            var baseStation = devicesService.getDeviceById($scope.deviceId);
            if (!baseStation || !baseStation.properties || !baseStation.properties['connectionState'] || (baseStation.properties['connectionState'] != 'available')) {
                if ($scope.AFMode) $scope.AFMode = null;
                return false;
            }

            return true;
        };

        $scope.isBaseStationMotion = function () {
            if (devicesService.devices) {
                var f = false;
                _.each(devicesService.devices, function (device) {
                    if (device.parentId == $scope.deviceId && device['properties'] && (device.properties['activityState'] == 'startAlertStream' || device.properties['activityState'] == 'alertStreamActive')) {
                        f = true;
                    }
                });
                return f;
            }
            return false;
        };

        $scope.done = function () {
            // todo: apply settings
            if(!$scope.isChanged() || $scope.cameraNameForm.name.$invalid) return;

            var renamePromise = baseStationService.renameDevice($scope.baseStation);
            if (!$scope.admin && $scope.isBaseStationAvailable()) {
                var antiFlickerPromise = $scope.AFMode
                    ? baseStationService.setAntiFlickerMode($scope.deviceId, $scope.AFMode.id)
                    : true;

                var timezonePromise = baseStationService.setTimeZone($scope.deviceId, $scope.timeZone);
                var updatePromise = baseStationService.setAutoUpdate($scope.deviceId, $scope.baseStation.properties.autoUpdateEnabled);
                $q.all([renamePromise, antiFlickerPromise, timezonePromise, updatePromise]).then(function (results) {
                    devicesService.getBaseStationById($scope.deviceId).deviceName = $scope.baseStation.deviceName;
                    baseStationService.getBaseStationResource($scope.deviceId, 'basestation');
                });
            } else {
                renamePromise.then(function (results) {
                    devicesService.getBaseStationById($scope.deviceId).deviceName = $scope.baseStation.deviceName;
                });
            }

            $state.go('settings');
        };

        $scope.isChanged = function() {
            if (!localStorage.fromLogout) {
                var AF = $scope.AFMode
                            ? $scope.AFMode.id != $scope.initialAFModeId
                            : false;

                if (devicesService.getDeviceById($scope.deviceId) && devicesService.getDeviceById($scope.deviceId).properties.connectionState == "available" && $scope.timeZone) {
                    $scope.changed = $scope.baseStationName != $scope.baseStation.deviceName ||
                    $scope.initialAutoUpdateEnabled != $scope.baseStation.properties.autoUpdateEnabled ||
                    $scope.initialTimeZoneId != $scope.timeZone.id || AF;
                }

                if (devicesService.getDeviceById($scope.deviceId) && devicesService.getDeviceById($scope.deviceId).properties.connectionState == "unavailable") {
                    $scope.changed = $scope.baseStationName != $scope.baseStation.deviceName;
                }

                return $scope.changed;
            }
        };

        $scope.isLoading = function () {
            var d = devicesService.getDeviceById($scope.deviceId);
            if(d && d.state == appProperties.SYNCED_STATE) { return false;}

            if (d && d.properties.connectionState) {
                if ((d.properties.connectionState == "available" && $scope.timeZone) ||
                    d.properties.connectionState == "unavailable") {
                    return false;
                }
            }
            return true;
        };

        $scope.reboot = function () {

            var modalInstance = $modal.open({
                templateUrl: 'partials/confirmDialog.html',
                controller: RebootCtrl,
                scope: $scope,
                backdrop: true,
                resolve: {
                }
            });

            modalInstance.result.then(function () {
                baseStationService.restartBaseStation($scope.deviceId).then(function (result) {
                    },
                    function (result) {
                        $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result && result.data && result.data.message ? result : {data: {message: "Base Station failed to restart."}});
                    });
            });
        };

        function RebootCtrl($scope, $modalInstance) {

            $scope.message = $filter("i18n")("base_station_settings_confirm_restart").replace("{baseStationName}", devicesService.getDeviceById($scope.deviceId).deviceName);
            $scope.confirmButton = $filter("i18n")("base_station_settings_activity_restart");
            $scope.confirm = function () {
                // user confirms reboot
                $modalInstance.close();
            };

            $scope.cancelDialog = function () {
                // exit modal and don't reboot
                $modalInstance.dismiss('cancel');
            }
        };

        $scope.isBSRebooting = function () {
            return baseStationService.rebootingBS[$scope.deviceId];
        };

        $scope.deactivate = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/confirmDialog.html',
                controller: DeactivateCtrl,
                scope: $scope,
                backdrop: true,
                resolve: {
                }
            });

            modalInstance.result.then(function () {
                var promise = baseStationService.removeDevice($scope.deviceId);
                promise.then(function () {
                    //$window.alert('Base Station have been deactivated.');
                    devicesService.getDevices();
                    $state.go('settings');
                });
            });
        };

        function DeactivateCtrl($scope, $modalInstance) {

            $scope.message = $filter("i18n")("base_station_settings_confirm_deactivate").replace("{baseStationName}", devicesService.getDeviceById($scope.deviceId).deviceName);
            $scope.confirmButton = $filter("i18n")("base_station_settings_activity_deactivate");
            $scope.confirm = function () {
                // user confirms reboot
                $modalInstance.close();
            }

            $scope.cancelDialog = function () {
                // exit modal and don't reboot
                $modalInstance.dismiss('cancel');
            }
        };

        $scope.gotoBSUpdate = function () {
            if($scope.baseStation.properties.autoUpdateEnabled) {return; }
            $state.go('settings.baseStation.update', {update: "update"});
        };

    })

    .controller('BaseStationUpdateCtrl', function ($scope, $rootScope, $state, $stateParams, $modal, $filter, $q, appProperties, jsonService, baseStationService, devicesService, uiService) {

        $scope.init = function () {
            $scope.deviceId = decodeURIComponent($stateParams.baseStationId);
            var bs = devicesService.getBaseStationById($scope.deviceId);
            if(!bs) {
                $scope.back();
                return;
            }
            $scope.$parent.update = true;
        };

        $scope.getUpdateAvailable = function () {
            var bs = devicesService.getBaseStationById($scope.deviceId);

            if (bs && (bs.properties['connectionState'] == "unavailable"))
                $state.go('settings.baseStation', {baseStationId: bs.deviceId});

            return bs.properties.updateAvailable;
        };

        $scope.isBusy = function () {
            return _.some(devicesService.devices, function (device) {
                if(device.deviceType == appProperties.CAMERA_DEVICE_TYPE &&
                    device.state == appProperties.PROVISIONED_STATE &&
                    device.parentId == $scope.deviceId &&
                    (device.properties && device.properties.connectionState == appProperties.AVAILABLE_STATE && device.properties.activityState != appProperties.CAMERA_SETTINGS_ACTIVITYSTATE_IDLE)) {
                    return true;
                }
                return false;
            });
        };

        $scope.updateClick = function () {
            var version = $scope.getUpdateAvailable().version;
            $scope.message = $filter('i18n')('manual_fw_update_confirm_update').replace("{fwVersion}", version);
            $scope.confirmMessage = $filter('i18n')("activity_label_update");
            var modalInstance = $modal.open({
                templateUrl: 'partials/confirmDialog.html',
                controller: "ConfirmCtrl",
                scope: $scope,
                backdrop: true,
                resolve: {
                }
            });

            modalInstance.result.then(function () {
                if($scope.isBusy()) {
                    uiService.info($filter('i18n')("base_station_error_4006"));
                }
                else {
                    baseStationService.manualUpdate($scope.deviceId, version);
                    delete devicesService.getBaseStationById($scope.deviceId).properties.updateAvailable;
                    uiService.info("Base Station upgrade has been started");
                }
            });
        };

        $scope.back = function () {
            $scope.$parent.update = false;
            $state.go('^');
        };
    })

    .controller('SubscriptionCtrl', function ($scope, $rootScope, $modal, $q, $state, $filter, appProperties, devicesService, baseStationService, recordingsService, servicePlanService, userService, billingFlowService, uiService) {
        $scope.init = function () {
            billingFlowService.selectServicePending = false;
            $scope.planAmount = '';
            $scope.storagePlanAmount = '';
            $scope.updating = true;
            $scope.loading = true;
            $scope.notAccount = !window["_ACCOUNT_"];
            var promises = [
                devicesService.initDevices(),
                servicePlanService.getPurchasedPlans(),
                servicePlanService.getOffers(),
                servicePlanService.getBilling()];

            $q.all(promises).then(
                function () {
                    $scope.initValues();
                    $scope.updating = false;
                },
                function (result) {
                    $scope.updating = false;
                    $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result);
                }
            )["finally"](function () {
                $scope.loading = false;
            });

            var promise = userService.updateStorageQuota();
            promise.then(
                function () {
                    $scope.storageQuota = userService.storageQuota;
                }
            );
            promise = recordingsService.getLibraryState();

        };

        $scope.$on(appProperties.BILLING_EVENT, function () {
            // force reload of view information
            $scope.init();
        });

        $scope.initValues = function () {
            $scope.billingInfo = servicePlanService.billingInfo;
            $scope.servicePlan = servicePlanService.getServicePlan();
            $scope.storageServicePlan = servicePlanService.getStorageServicePlan();
            $scope.cameras = _.where(devicesService.devices,
                {
                    deviceType: appProperties.CAMERA_DEVICE_TYPE,
                    userRole: 'OWNER'
                });

            var length = $scope.servicePlan.maxCameras - $scope.cameras.length;
            $scope.offCameras = new Array(length < 0 ? 0 : length);
            $scope.baseStations = _.where(devicesService.getBaseStations(),
                {
                    userRole: 'OWNER'
                });
            length = $scope.servicePlan.maxBaseStations - $scope.baseStations.length;

            $scope.offBaseStations = new Array(length < 0 ? 0 : length);
            var isFreePlan = servicePlanService.isFreePlan($scope.servicePlan);
            $scope.storage = $scope.servicePlan.maxStorage / appProperties.ONE_MEGA;

            $scope.servicePlanExt = _.findWhere(servicePlanService.servicePlans, {planId: $scope.servicePlan.planId});
            if (!$scope.servicePlanExt) $scope.servicePlanExt = servicePlanService.servicePlans[0];

            $scope.freePlanId = _.find(servicePlanService.servicePlans, function (servicePlan) {
                return servicePlanService.isFreePlan(servicePlan);
            }).planId;
            $scope.planAmount = isFreePlan ? 'Free' : ($scope.servicePlan.term == '1' ? 'Monthly ' : ($scope.servicePlan.term == '12' ? 'Annual ' : '')) + $scope.servicePlan.planCurrencyAmount;
            $scope.storagePlanAmount = $scope.storageServicePlan && ($scope.storageServicePlan.term == '1' ? 'Monthly ' : ($scope.storageServicePlan.term == '12' ? 'Annual ' : '')) + $scope.storageServicePlan.planCurrencyAmount;
        };

        $scope.cancelService = function () {
            billingFlowService.processBillingEvent({cancel: true}).then(
                function () {
                    $scope.updating = true;
                    devicesService.getDevices().then( function () {
                        $scope.updating = false;
                        $scope.init();
                    });
                },
                function (result) {
                    result && ($rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result));
                }
            );
        };

        function ConfirmCtrl($scope, $modalInstance) {

            $scope.confirmButton = $scope.confirmMessage;
            $scope.confirm = function () {
                // user confirms change to plan
                $modalInstance.close();
            }

            $scope.cancelDialog = function () {
                // exit modal and don't make the change
                $modalInstance.dismiss('cancel');
            }
        };

        $scope.recycleBinEmpty = function () {
            if (!recordingsService.libraryState) {
                return true;
            } else {
                var newState = _.findWhere(recordingsService.libraryState, {state: 'new'});
                if (!newState) throw "No 'new' library state";
                else {
                    return newState.count === 0;
                }
            }
        };

        $scope.deleteAllFiles = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/confirmDialog.html',
                controller: DeleteAllCtrl,
                scope: $scope,
                backdrop: true,
                resolve: {
                }
            });

            modalInstance.result.then(function () {
                var promise = recordingsService.deleteAllRecordings();
                promise.then(function () {
                    uiService.info("All unlocked recordings have been deleted");
                    devicesService.getDevices();
                    recordingsService.getLibraryState();
                    var promise = userService.updateStorageQuota();
                    promise.then(
                        function () {
                            $scope.storageQuota = userService.storageQuota;
                        }
                    )

                });
            });
        };

        function DeleteAllCtrl($scope, $modalInstance) {

            $scope.message = $filter("i18n")("label_confirm_delete_unlocked_files");
            $scope.confirmButton = $filter("i18n")("activity_delete");
            $scope.confirm = function () {
                // user confirms
                $modalInstance.close();
            };

            $scope.cancelDialog = function () {
                // exit modal
                $modalInstance.dismiss('cancel');
            };
        };

        $scope.isBillingInProgress = function () {
            return billingFlowService.inProgress;
        };

        $scope.isUpdateInProgress = function () {
            return $scope.updating;
        };

        $scope.changeRenew = function () {
            $scope.updating = true;

            servicePlanService.getBilling().then(function() {
                servicePlanService.changeRenew($scope.billingInfo.autoRenew)
                    ["catch"](function () {
                    $scope.billingInfo.autoRenew = !$scope.billingInfo.autoRenew;
                })
                    ["finally"](function () {
                    $scope.updating = false;
                });
            })
        };
    })

    .controller('SubscriptionPlansCtrl', function ($scope, $rootScope, $modal, $q, $state, $filter, $timeout, appProperties, servicePlanService, billingFlowService, devicesService, utilService) {
        $scope.init = function () {
            billingFlowService.pendingPlan = null;
            $scope.planAmount = '';
            $scope.storagePlanAmount = '';
            $scope.loading = true;
            var promises = [
                servicePlanService.getPurchasedPlans(),
                servicePlanService.getOffers(),
                servicePlanService.getBilling()];

            $q.all(promises).then(
                function () {
                    $scope.initValues();
                },
                function (result) {
                    $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result);
                }
            )["finally"](function () {
                $scope.loading = false;
            });

            var stopListen = $scope.$on(appProperties.BILLING_EVENT, function () {
                $state.go('settings.subscription');
            });
            $scope.$on('$destroy', function () {
                stopListen();
            });
        };

        $scope.initValues = function () {
            $scope.servicePlans = _.filter(servicePlanService.servicePlans, function (servicePlan) {
                return !servicePlanService.isStoragePlan(servicePlan);
            });
            $scope.servicePlan = servicePlanService.getServicePlan();
            $scope.selectPlan($scope.servicePlan);
            $scope.storageServicePlan = servicePlanService.getStorageServicePlan();
            $scope.selectedStorage  = $scope.storageServicePlan || {planId: 0};

            var isFreePlan = servicePlanService.isFreePlan($scope.servicePlan);
            $scope.storage = $scope.servicePlan.maxStorage / appProperties.ONE_MEGA;

            $scope.servicePlanExt = _.findWhere(servicePlanService.servicePlans, {planId: $scope.servicePlan.planId});
            if (!$scope.servicePlanExt) $scope.servicePlanExt = servicePlanService.servicePlans[0];

            $scope.freePlanId = _.find(servicePlanService.servicePlans, function (servicePlan) {
                return servicePlanService.isFreePlan(servicePlan);
            }).planId;
            $scope.planAmount = isFreePlan ? 'Free' : ($scope.servicePlan.term == '1' ? 'Monthly ' : ($scope.servicePlan.term == '12' ? 'Annual ' : '')) + $scope.servicePlan.planCurrencyAmount;
            $scope.storagePlanAmount = $scope.storageServicePlan && $scope.storageServicePlan.planId ? (($scope.storageServicePlan.term == '1' ? 'Monthly ' : ($scope.storageServicePlan.term == '12' ? 'Annual ' : '')) + $scope.storageServicePlan.planCurrencyAmount) : '';
        };

        /*$scope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                //Code to call before state change is complete.
                if(!$scope.modalInstance && billingFlowService.inProgress && toState.name != "login") {
                    event.preventDefault();
                    $scope.confirmHandler(event, toState);
                }
            }
        );

        $scope.confirmHandler = function (event, toState) {
            $scope.message = "Arlo is processing your request. Are you sure you want to leave without finishing?";
            $scope.modalInstance = $modal.open({
                    templateUrl: 'partials/preventingPlanChanging.html',
                    controller: preventingPlanChanging,
                    scope: $scope,
                    backdrop: true,
                    resolve: {}
                });

            $scope.modalInstance.result.then(function () {
                    $state.go(toState.name)
                });

            function preventingPlanChanging ($scope, $modalInstance) {
                $scope.stayButton = "STAY";
                $scope.leaveButton = "LEAVE";

                $scope.leave = function () {
                    $modalInstance.close();
                };

                $scope.stay = function () {
                    $scope.$parent.modalInstance = null;
                    $modalInstance.dismiss('cancel');
                };
            }
        };*/

        $scope.isOldPlansSelected = function () {
            var newPlans = [$scope.selectedPlan.planId];
            if ($scope.selectedStorage && $scope.selectedStorage.planId) {
                newPlans.push($scope.selectedStorage.planId);
            }

            var oldPlans = _.pluck(servicePlanService.purchasedPlans, 'planId');

            if(oldPlans.length == newPlans.length && _.intersection(oldPlans, newPlans).length == newPlans.length) {
                return true;
            }
        };

        $scope.changeService = function () {
            var newPlans = [$scope.selectedPlan.planId];
            if ($scope.selectedStorage && $scope.selectedStorage.planId) {
                newPlans.push($scope.selectedStorage.planId);
            }

            if(!servicePlanService.billingInfo.creditCard.cardNumber) {
                billingFlowService.selectServicePending = true;
                billingFlowService.pendingPlan =
                {
                    toPlans: newPlans
                };
                $state.go("settings.billingInformation");
                return;
            }

            billingFlowService.processBillingEvent({toPlanId: newPlans}).then(
                function () {
                    devicesService.getDevices();
                    servicePlanService.getPurchasedPlans();
                    $state.go("settings.subscription");
                },
                function (result) {
                    if(result && result.data) {
                        if(result.data.error.toString() == "8059" || result.data.error.toString() == "8060") {
                            $state.go("settings.billingInformation");
                            $timeout(function () {
                                $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result);
                            }, 1000);
                            return;
                        }
                    }
                    result && ($rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result.data ? result : {data: {message: result }}));
                }
            );
        };

        $scope.isBillingInProgress = function () {
            return billingFlowService.inProgress;
        };

        $scope.selectPlan = function (plan) {
            $scope.selectedPlan = plan;
            $scope.selectedStorage = null;
            var isBasic = servicePlanService.isFreePlan(plan);
            $scope.storagePlans = _.filter(servicePlanService.servicePlans, function (servicePlan) {
                return servicePlanService.isStoragePlan(servicePlan) && (isBasic || servicePlan.term == $scope.selectedPlan.term);
            });
        };

        $scope.selectStorage = function (plan) {
            $scope.selectedStorage = plan;
        };

        $scope.goBack = function () {
            if($scope.isShowDetails) {
                $scope.isShowDetails = !$scope.isShowDetails;
            }
            else {
                $state.go('settings.subscription');
            }
        };

        $scope.showDetails = function () {
            $scope.isShowDetails = true;
            utilService.gaSend(window["_ACCOUNT_"] ? "AcctMgr_Subscription_LearnMore_web" : "Subscription_LearnMore_web");

            if(!$scope.detailsHTML) {
                var promise = servicePlanService.getOffersDetails();
                promise.then(function (result) {
                    var style = result.data.html.match(/<\s*style[^>]*>.*?<\s*\/style>/)[0];
                    var body = result.data.html.match(/<\s*body[^>]*>(.*?)<\s*\/body>/)[1];
                    $scope.detailsHTML = style + body;
                }, function (result) {
                    $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result);
                });
            }
        }
    })

    .controller('PreferencesCtrl', function ($scope, $state, userService) {
        $scope.init = function () {
            $scope.autoUpdate = false;
            $scope.loading = true;
            $scope.changed = false;
            var promise = userService.updatePreferences();
            promise.then(
                function () {
                    $scope.preferences = userService.getPreferences();
                    $scope.loading = false;

                    $scope.initialStorageEnabled = $scope.preferences.storage.enabled;
                    $scope.initialAlertsStoragealert = $scope.preferences.alerts.storageAlert;
                    $scope.initialToggleLowBattery = $scope.preferences.alerts.lowBatteryAlert;
                    $scope.initialStorageAutoDelete = $scope.preferences.storage.autoDelete;
                }
            )
        };

        $scope.isChanged = function() {
            if ($scope.preferences) {
                return $scope.changed = $scope.initialStorageEnabled != $scope.preferences.storage.enabled ||
                                        $scope.initialAlertsStoragealert != $scope.preferences.alerts.storageAlert ||
                                        $scope.initialToggleLowBattery != $scope.preferences.alerts.lowBatteryAlert ||
                                        $scope.initialStorageAutoDelete != $scope.preferences.storage.autoDelete;
            }
        };

        $scope.done = function () {
            if(!$scope.isChanged()) return;

            userService.setPreferences($scope.preferences);
            $state.go('settings');
        };

        $scope.toggleStorage = function () {
            $scope.preferences.storage.enabled = !$scope.preferences.storage.enabled;
        };

        $scope.toggleStorageFull = function () {
            $scope.preferences.alerts.storageAlert = !$scope.preferences.alerts.storageAlert;
        };

        $scope.toggleLowBattery = function () {
            $scope.preferences.alerts.lowBatteryAlert = !$scope.preferences.alerts.lowBatteryAlert;
        };

        $scope.setAutoDelete = function (value) {
            $scope.preferences.storage.autoDelete = value;
        };
    })

    .controller('AlertErrorCtrl', function ($scope, $state, $timeout, appProperties) {
        $scope.timeout = 10000;
        $scope.hidden2 = true;
        $scope.animation = false;

        $scope.$on(appProperties.appEvents.SHOW_ERROR, function (event, result) {
            if ($scope.timeoutId) {
                clearTimeout($scope.timeoutId);
            }
            if (result && result.data && result.data.message) {
                $scope.alertMessage = result.data.message;
                $scope.animation = false;
                $scope.hidden2 = false;
                $timeout(function() {
                    $scope.animation = true;
                }, 0);
            }

//            $scope.timeoutId = setTimeout(function () {
//                $scope.hidden = true;
//            }, $scope.timeout);
        });

        $scope.$on(appProperties.appEvents.HIDE_ERROR, function (event, result) {
            $scope.hide();
        });

        $scope.$on(appProperties.appEvents.BODY_CLICK, function (event, result) {
            $scope.hide();
        });

        $scope.hide = function () {
            $scope.animation = false;
            $scope.hidden2 = true;
        };

        $scope.getType = function () {
            var name = $state.current.name;
            if(name.indexOf("settings") != -1) {
                return window['_ACCOUNT_'] ? "settingsAccount" : "settings";
            }
            if(name.indexOf("claimBaseStation") != -1 ||
                name.indexOf("accountRegistration") != -1 ||
                name.indexOf("servicePlan") != -1 ||
                name.indexOf("billingInformation") != -1 ||
                name.indexOf("syncHardware") != -1) {
                return "setup";
            }
            if(name.indexOf("cameras") != -1 || name.indexOf("calendar") != -1) {
                return "cameras";
            }
        };
    })

    .controller('ShutdownCtrl', function ($scope, gatewayPollingService, pushHandlerService) {
        gatewayPollingService.shutdown();
        pushHandlerService.shutdown();
    })

    .controller('motionTestCtrl', function ($scope, $rootScope, $state, $stateParams, $filter, devicesService, cameraSettingsService) {
        $scope.init = function () {
            var camera = devicesService.getCameraById($stateParams.deviceId);
            if(!camera) {
                $scope.back();
                return;
            }
            $scope.percent = $scope.startPercent = camera.properties.motionSetupModeSensitivity || 80;
            cameraSettingsService.updateSettings(camera.parentId, camera.deviceId,
                {
                    'motionSetupModeEnabled': true,
                    'motionSetupModeSensitivity': $scope.percent
                });
            $scope.offChangeStart = $rootScope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    $scope.offChangeStart();
                    if (fromState.name == $state.current.name) {
                        cameraSettingsService.updateSettings(camera.parentId, camera.deviceId,
                            {
                                'motionSetupModeEnabled': false
                            });
                    }
                });
            $scope.description = $filter("i18n")("label_motion_detection_test_description").replace('{cameraName}', $scope.getCameraName()).replace(/\n/g,"<br>");
            $scope.camera = camera;
            $scope.$watch("camera.properties.motionSetupModeEnabled", function () {
                if(!camera.properties.motionSetupModeEnabled) {
                    cameraSettingsService.updateSettings($scope.camera.parentId, $scope.camera.deviceId,
                        {
                            "motionSetupModeEnabled": true
                        });
                }
            }, true);
        };

        $scope.back = function () {
            $state.go("settings.camera", {deviceId: $stateParams.deviceId});
        };

        $scope.getCameraName = function () {
            return devicesService.getDeviceName($stateParams.deviceId);
        };

        $scope.sliderClick = function (event) {
            var X = event.offsetX;
            if(!event.hasOwnProperty('offsetX')) {
                var target  = event.target || event.srcElement,
                    rect    = target.getBoundingClientRect(),
                    X = event.clientX - rect.left;
            }

            var w = 100 * (X - 5) / angular.element(event.currentTarget).prop('offsetWidth');
            $scope.setPercent(w);
        };

        $scope.setPercent = function (proc) {
            $scope.percent = Math.round(proc) || 1;
        };

        $scope.applySensivity = function () {
            var camera = devicesService.getCameraById($stateParams.deviceId);
            camera && (cameraSettingsService.updateSettings(camera.parentId, camera.deviceId,
                { 'motionSetupModeSensitivity': $scope.percent,
                    'motionSetupModeEnabled': true}));
            camera.properties.motionSetupModeSensitivity = $scope.startPercent = $scope.percent;
        };
    })

    .controller('FooterModesCtrl', function ($scope, $rootScope, $state, $modal, $filter, appProperties, userService, baseStationService, devicesService, uiService, scheduleValidationService, servicePlanService, calendarNamesService) {

        var days = [
            {day: 'Monday'},
            {day: 'Tuesday'},
            {day: 'Wednesday'},
            {day: 'Thursday'},
            {day: 'Friday'},
            {day: 'Saturday'},
            {day: 'Sunday'}
        ];
        var numMillisecondsInDay = 24 * 3600 * 1000;
        // var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        var colors = ['#06a94e', '#666666'];
        var changingSchedule = false;

        $scope.init = function () {
            $scope.baseStation = null;
            $scope.devices = [];
            devicesService.initDevices(false).then(
                function () {
                    $scope.updateModes();
                }
            );
            $scope.servicePlan = servicePlanService.getServicePlan();
            if(!$scope.servicePlan) {
                servicePlanService.getPurchasedPlans().then(function () {
                    $scope.servicePlan = servicePlanService.getServicePlan();
                }, function (result) {
                    $rootScope.$broadcast(appProperties.appEvents.SHOW_ERROR, result);
                });
            }
            this.names = calendarNamesService.getCalendar();
        };

        $scope.$watch("baseStation.scheduleOn", function (newValue, oldValue) {
            if($scope.baseStation && $scope.baseStation.hasOwnProperty("scheduleOn") && changingSchedule) {
                changingSchedule = false;
            }
        }, true);

        $scope.$watch("baseStation.activeMode", function (newValue, oldValue) {
            if($scope.baseStation && $scope.baseStation.hasOwnProperty("activeMode") && changingSchedule) {
                changingSchedule = false;
            }
        }, true);

        $scope.isLoading = function () {
            var loading = false;
            if((!$scope.devices.length && !$scope.deviceId) || changingSchedule || ($scope.baseStation && $scope.baseStation.userRole == appProperties.USER_ROLE_OWNER && !$scope.servicePlan)) {
                loading = true;
            }
            if($scope.baseStation && !$scope.baseStation.hasOwnProperty("scheduleOn")) {loading = true;}
            if($scope.baseStation && $scope.baseStation.hasOwnProperty("scheduleOn") && !$scope.baseStation.scheduleOn && !$scope.baseStation.hasOwnProperty("modes")) {loading = true;}
            if($scope.baseStation && $scope.baseStation.hasOwnProperty("scheduleOn") && $scope.baseStation.scheduleOn && !$scope.baseStation.hasOwnProperty("schedule")) {loading = true;}
            if(loading && $scope.baseStation && $scope.baseStation.properties.connectionState == appProperties.UNAVAILABLE_STATE) {
                $scope.init();
                return false;
            }
            return loading;
        };

        $scope.isStateUnavailable = function (bs) {
            return !bs.properties || !bs.properties.hasOwnProperty("connectionState");
        };

        $scope.updateModes = function () {
            $scope.deviceId = null;
            var list = _.where(devicesService.getBaseStations(), {state: appProperties.PROVISIONED_STATE});
            if (!list.length) {
                // no owned or admined base stations
                return;
            }
            if (list.length == 1 && list[0].properties && list[0].properties.connectionState == appProperties.AVAILABLE_STATE) {
                $scope.updateMode(list[0]);
            }
            else {
                $scope.modes = [];
                $scope.devices = list;
            }
        };

        $scope.updateMode = function (baseStation) {
            $scope.baseStation = baseStation;
            if (baseStation) {
                $scope.deviceId = baseStation.deviceId;
                if (baseStation.modes) {
                    $scope.modes = baseStation.modes;
                }
                else {
                    baseStationService.getBaseStationResource($scope.deviceId, 'modes');
                }
                if (!baseStation.schedule) {
                    baseStationService.getBaseStationResource($scope.deviceId, 'schedule');
                }
            }
            // may not be there yet watch for changes
            $scope.$on(appProperties._RESOURCE_UPDATE_, function () {
                if ($scope.deviceId) {
                    var bs = devicesService.getBaseStationById($scope.deviceId);
                    if (bs && bs.modes) {
                        $scope.modes = bs.modes;
                    }
                }
            });
        };

        $scope.isBaseStationOffline = function () {
            return $scope.baseStation && $scope.baseStation.properties && $scope.baseStation.properties.connectionState == 'unavailable';
        };

        $scope.selectMode = function (mode) {
            if(mode.id != $scope.getActiveMode().id) {
                var properties = {};
                changingSchedule = true;
                properties[appProperties.DEVICE_SETTINGS_ACTIVE] = mode.id;
                baseStationService.setActiveMode($scope.deviceId, properties);
            }
        };

        $scope.selectBS = function (device) {
            if(device.properties && device.properties.connectionState == 'available') {
                $scope.scheduleChanged = false;
                $scope.devices = [];
                $scope.updateMode(device);
            }
        };

        $scope.getActiveMode = function () {
            return devicesService.getBaseStationById($scope.deviceId).activeMode;
        };

        $scope.toggleScheduleOn = function () {
            var baseStation = $scope.baseStation;
            var properties = {};

            if (baseStation.scheduleOn) {
                properties[appProperties.DEVICE_SETTINGS_ACTIVE] = false;
            } else {
                properties[appProperties.DEVICE_SETTINGS_ACTIVE] = true;
            }
            changingSchedule = true;
            $scope.daySchedules = null;

            var promise = baseStationService.toggleScheduleOn(baseStation.deviceId, properties);
            promise.then(function () {
                // todo:  update status bar
            });
        };

        $scope.isScheduleOn = function () {
            return baseStationService.isScheduleOn($scope.baseStation);
        };

        $scope.getDaySchedule = function () {
            if ($scope.daySchedules) {
                return $scope.daySchedules;
            }

            var baseStation = devicesService.getBaseStationById($scope.deviceId);
            if (validateSchedule(baseStation)) {
                $scope.scheduleChanged = false;
                $scope.daySchedules = setDaySchedules(angular.copy(baseStation.schedule), baseStation.modes);
                $scope.origSchedules = angular.copy($scope.daySchedules);
                $scope.modes = baseStation.modes;
                return $scope.daySchedules;
            }
            return null;
        };

        $scope.isScheduleChanged = function () {
            if($scope.scheduleChanged) { return true;}
            if($scope.daySchedules) {
                for (var i = 0; i < $scope.daySchedules.length; i++) {
                    if($scope.daySchedules[i].schedule.length != $scope.origSchedules[i].schedule.length) {
                        $scope.scheduleChanged = true;
                        return true;
                    }
                    for (var j = 0; j< $scope.daySchedules[i].schedule.length; j++) {
                        if($scope.daySchedules[i].schedule[j].modeId != $scope.origSchedules[i].schedule[j].modeId ||
                            $scope.daySchedules[i].schedule[j].startTime != $scope.origSchedules[i].schedule[j].startTime) {
                            $scope.scheduleChanged = true;
                            return true;
                        }
                    }
                }
            }
        };

        $scope.isScheduleAvailable = function () {
            if(!$scope.baseStation) { return false;}
            return $scope.baseStation.userRole == "ADMIN" || ($scope.servicePlan && $scope.servicePlan.schedule);
        };

        var validateSchedule = function (baseStation) {
            if (!baseStation || !baseStation.schedule || !baseStation.modes) {
                return false;
            }
            return _.uniq(_.pluck(baseStation.schedule, 'modeId')).length <= baseStation.modes.length;
        };

        /*
         Takes time in milliseconds since midnight Sunday night and returns a day text string, e.g. 'Tuesday'.
         */
        function dayFromMilliseconds(time) {
            var day = days[Math.floor(time / numMillisecondsInDay)].day;
            return day;
        }

        /*
         Breaks up a copy of weekly schedule into daily schedules.   This returns an array of objects.  Each object has the form:
         {
         day: 'day',
         schedule: schedule
         }
         where 'day' is one of the days of the week, schedule is an array of schedule items with a modified structure as from the
         base station schedule array (which only includes items with startTimes that fall on that day).  Schedule items look like:
         {
         startTime:milliseconds since midnight,
         modeId:'id',
         color: '#ff0000'
         }
         */
        function setDaySchedules(schedule, modes) {

            // todo: remove temporary fix
            if (!schedule.length) {
                schedule.push({'startTime': 0, modeId: modes[0].id});
            }
            // sort the schedule on the start times
            schedule = _.sortBy(schedule, function (item) {
                return item.startTime;
            });

            // gives an array of all the mode ids to help index colors
            var modeIds = _.pluck(modes, 'id');
            // array of strings of the days of week
            var dayVals = _.pluck(days, 'day');

            // make a copy of the array of days and attach a daily schedule for each day
            var daysCopy = angular.copy(days);
            var daySchedules = _.map(daysCopy, function (daySchedule) {
                daySchedule.schedule =
                    _.chain(schedule)
                        .filter(function (item) {   // attach the schedule item array for that day, then
                            return dayFromMilliseconds(item.startTime) === daySchedule.day;
                        })
                        .map(function (item) {      // add the color to each copied schedule item
                            item.color = colors[ _.indexOf(modeIds, item.modeId) % colors.length];
                            return item;
                        })
                        .map(function (item) {      // normalize startTime to be for that day
                            var delta = _.indexOf(dayVals, daySchedule.day) * numMillisecondsInDay
                            item.startTime -= delta;
                            return item;
                        })
                        .value();

                return daySchedule;
            });

            // if any daySchedules don't have entries, add one
            _.each(daySchedules, function (daySchedule, index) {
                if (daySchedule.schedule.length === 0) {
                    var prevSchedule;
                    if (index === 0) {  // first element search from rear of array
                        // start at end of schedules and find first non-empty day schedule going backwards
                        prevSchedule = _.find(angular.copy(daySchedules).reverse(),
                            function (daySchedule) {
                                return daySchedule.schedule.length > 0;
                            });
                    } else {
                        prevSchedule = _.find(angular.copy(daySchedules).splice(0, index).reverse(),
                            function (daySchedule) {
                                return daySchedule.schedule.length > 0;
                            });
                    }
                    daySchedule.schedule[0] = prevSchedule.schedule[prevSchedule.schedule.length - 1];
                    daySchedule.schedule[0].startTime = 0;
                }
            });


            // if not present add the startTime zero entry
            _.map(daySchedules, function (daySchedule) {
                if (daySchedule.schedule.length && !daySchedule.schedule[0].startTime) return;
                var prevIndex = _.indexOf(dayVals, daySchedule.day) === 0 ? 6 : _.indexOf(dayVals, daySchedule.day) - 1;
                var modeId = daySchedules[prevIndex].schedule[daySchedules[prevIndex].schedule.length - 1].modeId;
                var item = {
                    startTime: 0,
                    modeId: modeId,
                    color: colors[_.indexOf(modeIds, modeId) % colors.length]
                };
                // add to beginning
                daySchedule.schedule.unshift(item);
                return daySchedule;
            });

            return daySchedules;
        };

        $scope.setColor = function (index) {
            return {'background-color': colors[index % colors.length]};
        };

        /*
         Reconstruct the schedule from the separate day schedules.  Necessary to remove the added
         color attribute, as well as remove adjacent duplicate mode ids for cases from one day to
         next.
         */
        $scope.saveSchedule = function () {

            // add all the schedules to an array, normalizing the times back to week time and removing the color attr
            var schedules = angular.copy($scope.daySchedules);
            var newSchedule = _.map(schedules, function (daySchedule, index) {
                daySchedule.schedule = _.map(daySchedule.schedule, function (scheduleItem) {
                    scheduleItem.startTime += index * 24 * 60 * 60 * 1000; // convert to milliseconds since sunday midnight
                    return _.omit(scheduleItem, 'color'); // also remove color attribute
                });
                return daySchedule.schedule;
            });

            // combine arrays into one array
            newSchedule = _.flatten(newSchedule);

            // remove adjacent duplicate mode ids (can happen from one day to next)
//            var tmp = [];
//            _.each(newSchedule, function (element, index) {
//                if ((index == 0) || (newSchedule[index - 1].modeId !== element.modeId)) {
//                    tmp.push(element);
//                }
//            });
//
//            newSchedule = tmp;
            if (scheduleValidationService.validateSchedule(newSchedule)) {
                baseStationService.setSchedule($scope.deviceId, newSchedule);
                $scope.origSchedules = angular.copy($scope.daySchedules);
                $scope.scheduleChanged = false;
            }
        };
    })

    .controller('ModalNotifyCtrl', function ($scope, $rootScope, $timeout, userService) {
        $scope.posY = $scope.settingsOffsetTopPosition || 0;
        $scope.popupDisable = null;

        if (userService.calendarSessionPopup ===  null) {
            userService.setCalendarSessionPopup(true);
        }

        if (userService.rulesSessionPopup ===  null) {
            userService.setRulesSessionPopup(true);
        }

        if (userService.calendarClientPopup === 'false') {
            userService.setCalendarSessionPopup(false);
        }
        if (userService.rulesClientPopup === 'false') {
            userService.setRulesSessionPopup(false);
        }

        $scope.isPopupEnable = !!$scope.$parent.libraryMode
            ? userService.calendarSessionPopup
            : userService.rulesSessionPopup;

        var arrowTarget, arrowObj, arrows;

        $scope.$on("settingsScrollingOn", function() {
            $scope.posY = $scope.settingsOffsetTopPosition;
            for (var i=0; i<arrowTarget.length; i++) {
                arrowObj[i].style.top = $scope.deltaY+ arrowTarget[i].offsetTop - $scope.posY+ "px"
            }
        });

        $scope.getArrows = function() {
            if(arrows) { return arrows;}
            arrowTarget = document.getElementsByClassName("modal-arrowicon-rules");
            arrowObj = document.getElementsByClassName("overlay-arrow-icon");
            if(arrowTarget.length) {
                $timeout(function () {
                    $scope.deltaY =44;
                    arrows = [];
                    for (var i = 0; i < 2; i++) {
                        arrows.push({
                            posY: $scope.deltaY + arrowTarget[i].offsetTop + $scope.posY + "px"
                        });
                    }
                }, 100);
            }
            return null;
        };

        $scope.rulesNotifyHide = function() {
            if (!!$scope.$parent.libraryMode) {
                !!$scope.popupDisable
                    ? userService.setCalendarClientPopup(false)
                    : "";
                userService.setCalendarSessionPopup(false);
            } else {
                !!$scope.popupDisable
                    ? userService.setRulesClientPopup(false)
                    : "";
                userService.setRulesSessionPopup(false);
            }
            $scope.isPopupEnable = false
        };

    });

/* Controllers */

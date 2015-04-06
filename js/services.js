'use strict';

/* Services */

angular.module('arloApp.services', ['arloApp.services.calendarNamesService'])
    .factory('urlService', function (appProperties, $location) {
        return {
            ssoToken: null,
            webUrl: null,

            getLoginUrl: function () {
                return this.webUrl + appProperties.loginRoute;
            },

            getNotifyResponsesPushServiceUrl: function () {
                return this.webUrl + appProperties.notifyResponsesPushServiceContext;
            },

            getCountryCodesUrl: function () {
                return this.webUrl + appProperties.staticContext + '/countrycodes';
            },

            getStatesCodesUrl: function (statesName) {
                return this.webUrl + appProperties.staticContext + '/' + statesName;
            },

            getTimeZonesUrl: function () {
                return this.webUrl + appProperties.staticContext + "/timezones";
            },

            getSecretQuestionsUrl: function () {
                return this.webUrl + appProperties.staticContext + '/secretquestions';
            },

            getProfileUrl: function () {
                return this.webUrl + appProperties.profileContext;
            },

            getQueryPresentDevicesUrl: function () {
                return this.webUrl + appProperties.queryPresentDevicesContext;
            },

            getRegisterUserUrl: function () {
                return this.webUrl + appProperties.registerContext;

            },

            getSsoRegisterUserUrl: function () {
                return this.webUrl + appProperties.ssoRegisterContext;

            },

            getOffersUrl: function () {
                return this.webUrl + appProperties.getOffersContext;
            },

            getOffersV1Url: function () {
                return this.webUrl + appProperties.getOffersV1Context;
            },

            getOffersDetailsUrl: function () {
                return this.webUrl + appProperties.getOffersDetailsContext;
            },

            getCreatePaymentAccountUrl: function () {
                return this.webUrl + appProperties.createPaymentAccountContext;
            },

            getModifyBillingUrl: function (paymentId) {
                return this.webUrl + appProperties.paymentBillingContext + '/' + paymentId;
            },

            getCreateQuotationUrl: function (paymentId) {
                return this.webUrl + appProperties.paymentQuotationContext + '/' + paymentId;
            },

            getChangeQuotationUrl: function (paymentId) {
                return this.webUrl + appProperties.paymentQuotationContext + '/' + paymentId
                    + appProperties.changeContext;
            },

            getRenewQuotationUrl: function (paymentId) {
                return this.webUrl + appProperties.paymentQuotationContext + '/' + paymentId
                    + appProperties.renewContext;
            },

            getCancelQuotationUrl: function (paymentId) {
                return this.webUrl + appProperties.paymentQuotationContext + '/' + paymentId
                    + appProperties.cancelContext;
            },

            getCreatePlanUrl: function (paymentId) {
                return this.webUrl + appProperties.servicePlansPaymentContext + '/' + paymentId;
            },

            getChangePlanUrl: function (paymentId) {
                return this.webUrl + appProperties.servicePlansPaymentContext + '/' + paymentId;
            },

            getRenewPlanUrl: function (paymentId) {
                return this.webUrl + appProperties.servicePlansPaymentContext + '/'
                    + paymentId + appProperties.renewContext;
            },

            getCancelPlanUrl: function (paymentId) {
                return this.webUrl + appProperties.servicePlansPaymentContext + '/' + paymentId
                    + appProperties.cancelContext;
            },

            getPaymentBillingUrl: function (paymentId) {
                return this.webUrl + appProperties.paymentBillingContext + '/' + paymentId;
            },

            getPaymentRenewUrl: function (paymentId) {
                return this.webUrl + appProperties.paymentRenewContext + '/' + paymentId;
            },

            getClaimDeviceUrl: function () {
                return this.webUrl + appProperties.claimDeviceContext;
            },

            getFriendsUrl: function () {
                return this.webUrl + appProperties.friendsContext;
            },

            getFriendsDeleteUrl: function () {
                return this.webUrl + appProperties.friendsDeleteContext;
            },

            getUpdateUserIdUrl: function () {
                return this.webUrl + appProperties.updateUserIdContext;
            },

            getConfirmUserIdUrl: function () {
                return this.webUrl + appProperties.confirmUserIdContext;
            },

            getUpdatePasswordUrl: function () {
                return this.webUrl + appProperties.updatePasswordContext;
            },

            getRequestPasswordResetUrl: function () {
                return this.webUrl + appProperties.requestPasswordResetContext;
            },

            getResetPasswordUrl: function () {
                return this.webUrl + appProperties.resetPasswordContext;
            },

            getUpdateNameUrl: function () {
                return this.webUrl + appProperties.updateNameContext;
            },

            getLogoutUrl: function () {
                return this.webUrl + appProperties.logoutContext;
            },

            setWebUrl: function () {
                this.staticAssetsUrl = $location.protocol() + '://' + $location.host();
                this.webUrl = this.staticAssetsUrl + '/hmsweb';
                // this.webUrl = "https://arlodev.netgear.com/hmsweb";
            },

            getDevicesUrl: function (id) {
                return this.webUrl + appProperties.devicesContext + (id ? ('/' + id): '');
            },

            getSyncBaseStationUrl: function (deviceId) {
                return this.webUrl + appProperties.syncBaseStationContext + '/' + deviceId;
            },

            getNotifyUrl: function (deviceId) {
                return this.webUrl + appProperties.notifyContext + '/' + deviceId;
            },

            getFullFrameSnapshotUrl: function () {
                return this.webUrl + appProperties.takeFullFrameSnapshotContext;
            },

            getUserFrameSnapshotUrl: function () {
                return this.webUrl + appProperties.takeUserFrameSnapshotContext;
            },

            getStartStreamUrl: function () {
                return this.webUrl + appProperties.streamContext;
            },

            getStopStreamUrl: function () {
                return this.webUrl + appProperties.stopStreamContext;
            },

            getStartRecordUrl: function () {
                return this.webUrl + appProperties.startRecordContext;
            },

            getStopRecordUrl: function () {
                return this.webUrl + appProperties.stopRecordContext;
            },

            getTakeSnapshotUrl: function () {
                return this.webUrl + appProperties.takeSnapshotContext;
            },

            getMetadataUrl: function () {
                return this.webUrl + appProperties.metadataContext;
            },

            getRecordingsUrl: function () {
                return this.webUrl + appProperties.recordingsContext;
            },

            getDeviceUrl: function (deviceId) {
                return this.webUrl + appProperties.devicesContext + '/' + deviceId;
            },

            getEditUrl: function () {
                return this.webUrl + appProperties.editContext;
            },

            getFavoriteUrl: function () {
                return this.webUrl + appProperties.favoriteContext;
            },

            getCheckEmailUrl: function () {
                return this.webUrl + appProperties.checkEmailUsage;
            },

            getCheckAccountUrl: function () {
                return this.webUrl + appProperties.checkAccountUsage;
            },

            getRecycleUrl: function () {
                return this.webUrl + appProperties.recycleContext;
            },

            getShareUrl: function () {
                return this.webUrl + '/users/library/share';
            },

            getRecycleAllUrl: function () {
                return this.webUrl + appProperties.recycleContext + appProperties.allContext;
            },

            getCameraOrderUrl: function () {
                return this.webUrl + appProperties.cameraOrderContext;
            },

            getDeleteAccountUrl: function () {
                return this.webUrl + appProperties.deleteAccountContext;
            },

            getRemoveDeviceUrl: function () {
                return this.webUrl + appProperties.removeDeviceContext;
            },

            getRenameDeviceUrl: function () {
                return this.webUrl + appProperties.renameDeviceContext;
            },

            getRestartDeviceUrl: function () {
                return this.webUrl + appProperties.restartDeviceContext;
            },

            getPreferencesUrl: function () {
                return this.webUrl + appProperties.preferencesContext;
            },

            getServicePlanUrl: function () {
                return this.webUrl + appProperties.servicePlanContext;
            },

            getStorageQuotaUrl: function () {
                return this.webUrl + appProperties.storageQuotaContext;
            },

            getLibraryStateUrl: function () {
                return this.webUrl + appProperties.libraryStateContext;
            },

            getTermsUrl: function () {
                return this.webUrl + appProperties.termsContext;
            },

            getPolicyUrl: function () {
                return this.webUrl + appProperties.policyContext;
            }
        };
    })

    .factory('authInterceptor', ['$q', '$injector', '$log', '$cacheFactory', '$rootScope', '$filter', function ($q, $injector, $log, $cacheFactory, $rootScope, $filter) {

        return {

            response: function (response) {
                $injector.get('offlineService').isOffline = false;
                if (response.status == 401) {
                    $log.info('Got 401 status from server');
                    $injector.get('gatewayPollingService').shutdown();
                    $injector.get('pushHandlerService').shutdown();
                    var uService = $injector.get('userService');
                    uService.setSsoToken('');
                    if (!uService.settings) {
                        $injector.get('loginService').redirectError = 'Session expired. Please relog-in.';
                    }
                    $injector.get('$state').go('login');
                    $injector.get('appStateService').clearSessionData();
                    $cacheFactory.get('$http').removeAll();
                }

                return response || $q.when(response);
            },

            responseError: function (rejection) {
                switch (rejection.status) {
                    case 0:
                    {
                        if (!rejection.data) {
                            $injector.get('offlineService').checkOffline();
                        }
                        break;
                    }
                    case 401:
                    {
                        $injector.get('offlineService').isOffline = false;
                        $log.info('Got 401 status from server on response error');
                        $injector.get('gatewayPollingService').shutdown();
                        $injector.get('pushHandlerService').shutdown();
                        var uService = $injector.get('userService');
                        uService.setSsoToken('');
                        $injector.get('$state').go('login');
                        $injector.get('appStateService').clearSessionData();
                        $cacheFactory.get('$http').removeAll();
                        uService.settings || ($injector.get('loginService').redirectError = 'Session expired. Please relog-in.');
                        break;
                    }
                    case 500:
                    case 501:
                    case 502:
                    case 503:
                        $rootScope.$broadcast('show_error', {
                            data: {message: $filter('i18n')('error_http_' + rejection.status)}
                        });
                        break;
                    default: {
                        $log.error("Error from server: " + JSON.stringify(rejection));
                        return $q.reject(rejection.data);
                        break;
                    }
                }
                return $q.reject(rejection);
            }

        }
    }])

    .factory('utilService', function ($state) {

        return {

            id: 0,

            isMobile: (navigator.userAgent.match(/iPhone/i)) ||
                (navigator.userAgent.match(/iPad/i)) ||
                (navigator.userAgent.match(/Android/i)) ||
                (navigator.userAgent.match(/Silk/i)),

            previousState: {},

            // low level method for creating parts of a guid
            s4: function () {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            },

            guid: function () {
                return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
                    this.s4() + '-' + this.s4() + this.s4() + this.s4();

            },

            nextId: function () {
                return this.id++;
            },

            checkMobile: function () {
                if (!window["_ACCOUNT_"] && this.isMobile) {
                    $state.go('useMobile');
                    return true;
                }
                return false;
            },

            getLang: function () {
                if(this.lang) {
                    return this.lang;
                }
                var languages = ['de','fr','it','ru', "en", "ja", "sv"];
                var lang, androidLang;
                // works for earlier version of Android (2.3.x)
                if (navigator && navigator.userAgent && (androidLang = navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
                    lang = androidLang[1];
                } else {
                    // works for iOS, Android 4.x and other devices
                    lang = navigator.userLanguage || navigator.language;
                }
                this.lang = languages.indexOf(lang.split("-")[0]) != -1 ? lang.split("-")[0] : "en";

                return this.lang;
            },

            gaSend: function (id) {
                ga("send", {
                    "hitType": "pageview",
                    "page": "/"+ id + "_web",
                    "title": id + "_web"
                });
            }

        };
    })

    .factory('loginService', function ($http, $window, $timeout, $log, $q, urlService, userService, localStorage, appProperties) {
        return {
            reLoggedIn: false,

            checkCredentials: function (userId, password, token) {

                var data = {"email": userId, "password": password};

                // friend user logging in and confirming invite
                if (token) {
                    data.registrationToken = token;
                }

                var config = {
                    "method": "POST",
                    "url": urlService.getLoginUrl(),
                    "data": data,
                    "timeout": 300000
                };
                var that = this;

                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got result:" + JSON.stringify(result));
                            // appStateService.loadSessionData();
                            userService.setSsoToken(result.data.data.token);
                            that.ssoToken = result.data.data.token;
                            userService.setUserId(result.data.data.userId);
                            userService.setUserName(result.data.data.email);
                            userService.setPaymentId(result.data.data.paymentId);
                            userService.setCountryCode(result.data.data.countryCode);
                            userService.setValidEmail(result.data.data.validEmail);
                            that.loginError = false;
                        } else {
                            if (userId != password && userId != 'undefined' && userId != null && userId != '') {
                                $log.warn("login not successful");
                                return $q.reject(result.data);
                            }
                        }
                        return result.data;
                    });

                return promise;
            },

            updatePassword: function (password, newPassword) {
                var data = {"currentPassword": password, "newPassword": newPassword};
                var config = {
                    "method": "POST",
                    "url": urlService.getUpdatePasswordUrl(),
                    "data": data,
                    "timeout": 30000,
                    "headers": {"Authorization": this.ssoToken || userService.ssoToken }
                };
                $log.debug("calling updatePassword with config:" + JSON.stringify(config));

                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            if (userService.settings) {
                                userService.setSettings(newPassword);
                            }
                            $log.debug("update password result: " + JSON.stringify(result));
                        } else {
                            // $window.alert('Update password error:' + data.code + ', ' + data.message);
                            $log.warn("update password error: " + JSON.stringify(result));
                            return $q.reject(result.data);
                        }
                    });

                return promise;
            },

            requestPasswordReset: function (email) {

                var data = {"email": email};
                var config = {
                    "method": "POST",
                    "url": urlService.getRequestPasswordResetUrl(),
                    "data": data,
                    "timeout": 30000};

                $log.debug("calling requestPasswordReset with config: " + JSON.stringify(config));
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("Request password reset success:" + JSON.stringify(result));
                        } else {
                            // $window.alert('Request password reset error:' + data.code + ', ' + data.message);
                            $log.warn("server returned error:" + data.code + data.message);
                        }
                    });

                return promise;
            },

            resetPassword: function (newPassword, passwordResetCode) {

                var data = {"newPassword": newPassword, "passwordResetCode": passwordResetCode};
                var config = {
                    "method": "POST",
                    "url": urlService.getResetPasswordUrl(),
                    "data": data,
                    "timeout": 30000}

                $log.debug("calling resetPassword with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("Reset password success:" + JSON.stringify(result));
                        } else {
                            // $window.alert('Reset password error:' + data.code + ', ' + data.message);
                            $log.warn("server returned error:" + data.code + data.message);
                        }
                    });

                return promise;
            },

            updateTosVersion: function (version) {
                var config = {
                    "method": "POST",
                    "url": urlService.webUrl + appProperties.updateTermsContext,
                    "data": {"acceptedTermConditionVersion": version },
                    "timeout": 30000,
                    "headers": {"Authorization": userService.ssoToken}
                };
                $log.debug("calling updateTosVersion with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        if(result.data && result.data.success) {
                            return result.data;
                        }
                        else {
                            return $q.reject(result.data);
                        }
                    });

                return promise;
            },

            updatePolicyVersion: function (version) {
                var config = {
                    "method": "POST",
                    "url": urlService.webUrl + appProperties.updatePolicyContext,
                    "data": {"acceptedPolicyVersion": version },
                    "timeout": 30000,
                    "headers": {"Authorization": userService.ssoToken}
                };
                $log.debug("calling updatePolicyVersion with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        if(result.data && result.data.success) {
                            return result.data;
                        }
                        else {
                            return $q.reject(result.data);
                        }
                    });

                return promise;
            }

        };
    })

    .factory('logoutService', function ($rootScope, $http, $log, $injector, $modalStack, $q, urlService, appStateService, userService, recordingsService, calendarService, servicePlanService, cameraSettingsService, uiService, baseStationService) {

        return {

            logoutError: null,

            logout: function (simple) {

                // $http.defaults.headers.put['Content-Type'] = 'application/json; charset=UTF-8';
                $injector.get('pushHandlerService').shutdown();
                $injector.get('gatewayPollingService').shutdown();
                $modalStack.dismissAll();
                appStateService.clearSessionData();
                recordingsService.selectMode = false;
                calendarService.stateParams = null;
                servicePlanService.purchasedPlans = null;
                servicePlanService.billingInfo = null;
                cameraSettingsService.gettingCameraSettings = null;
                uiService.scope = $rootScope.$new(true);
                baseStationService.rebootingBS = [];
                $injector.get('gatewayPollingService').baseStationAlerts= {};

                if(simple) {
                    appStateService.clearSessionData();
                    userService.ssoToken = null;
                    return $q.when(1);
                }

                var config = {
                    "method": "PUT",
                    "url": urlService.getLogoutUrl(),
                    "timeout": 300000,
                    "headers": {"Authorization": userService.ssoToken}
                };

                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        $log.debug("got result:" + JSON.stringify(result));
                        appStateService.clearSessionData();
                        that.logoutError = false;
                        userService.ssoToken = null;
                    }, function (result) {
                        $log.debug("got result:" + JSON.stringify(result));
                        appStateService.clearSessionData();
                        that.logoutError = true;
                        userService.ssoToken = null;
                    });

                return promise;
            }
        };
    })

    .factory('jsonService', function ($http, $q, urlService) {
        return  {
            getData: function (url) {
                return $http.get(url).then(
                    function (result) {
                        if(!result.data || !result.data.success) {
                            return $q.reject(result.data);
                        }
                        return result.data;
                    },
                    function (result) {
                        return $q.reject(result && result.data);
                    }
                );
            },

            countryCodes: function () {
                return this.getData(urlService.getCountryCodesUrl());
            },

            stateCodes: function (statesName) {
                return this.getData(urlService.getStatesCodesUrl(statesName));
            },

            timeZones: function () {
                return this.getData(urlService.getTimeZonesUrl());
            },

            secretQuestions: function () {
                return this.getData(urlService.getSecretQuestionsUrl());
            }
        }
    })

    .factory('userService', function ($http, $log, $window, $q, $location, localStorage, setupService, urlService, appProperties) {

        return {

            userName: null,
            ssoToken: null,
            userId: null,
            firstName: null,
            lastName: null, // only set password if rememberMe set to true
            password: null,
            preferences: null,
            fromLogout: null,
            validEmail: null,
            ignoreUpdates: null,
            calendarSessionPopup: null,
            calendarClientPopup: null,
            rulesSessionPopup: null,
            rulesClientPopup: null,

            // the id for making payments on the account, used with every operation with quotation and plan
            paymentId: null,

            setCalendarSessionPopup: function (calendarSessionPopup) {
                this.calendarSessionPopup = calendarSessionPopup;
                this.persistCalendarSessionPopup();
            },

            setCalendarClientPopup: function (calendarClientPopup) {
                this.calendarClientPopup = calendarClientPopup;
                this.persistСalendarClientPopup();
            },

            setRulesSessionPopup: function (rulesSessionPopup) {
                this.rulesSessionPopup = rulesSessionPopup;
                this.persistRulesSessionPopup();
            },

            setRulesClientPopup: function (rulesClientPopup) {
                this.rulesClientPopup = rulesClientPopup;
                this.persistRulesClientPopup();
            },

            setUserId: function (userId) {
                this.userId = userId;
                this.persistUserId();
            },

            setUserName: function (userName) {
                this.userName = userName;
                this.persistUserName();
            },

            clearSettings: function () {
                this.settings = null;
                if (localStorage['settings']) localStorage.removeItem('settings');
            },

            setPaymentId: function (paymentId) {
                this.paymentId = paymentId;
                // save paymentId to local storage
                this.persistPaymentId();
            },

            setFirstName: function (firstName) {
                this.firstName = firstName;
                this.persistFirstName();
            },

            setLastName: function (lastName) {
                this.lastName = lastName;
                this.persistLastName();
            },

            setSsoToken: function (token) {
                this.ssoToken = token;
                // save token to session
                this.persistSsoToken();
            },

            setCountryCode: function (countryCode) {
                this.countryCode = countryCode;
                localStorage.setItem('countryCode', this.countryCode);
            },

            clearFromLogout: function () {
                this.fromLogout = false;
                if (localStorage['fromLogout']) localStorage.removeItem('fromLogout');
            },

            setFromLogout: function () {
                this.fromLogout = true;
                localStorage.setItem('fromLogout', this.fromLogout);
            },

            setValidEmail: function (v) {
                this.validEmail = v.toString();
                localStorage.setItem('validEmail', this.validEmail);
            },

            setIgnoreUpdates: function (v) {
                this.ignoreUpdates = v;
                if(v) {
                    localStorage.setItem('ignoreUpdates', "1");
                }
                else if(localStorage['ignoreUpdates']) {
                    localStorage.removeItem('ignoreUpdates');
                }
            },

            /*
             Check session storage to see if user already logged in.  If session storage contains a ssoToken
             set the token and return true.
             */
            isLoggedIn: function () {
                return this.ssoToken && true;
            },

            updateUserId: function (newUserId, password) {
                var data = {"email": newUserId, "currentPassword": password};

                var config = {
                    "method": "POST",
                    "url": urlService.getUpdateUserIdUrl(),
                    "data": data,
                    "timeout": 30000,
                    "headers": {"Authorization": this.ssoToken}
                };

                $log.debug("calling updateUserId with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got result: " + JSON.stringify(result));
                        } else {
                            // $window.alert('Update userId error:' + data.code + ', ' + data.message);
                            $log.warn("update userId error: " + JSON.stringify(result));
                            return $q.reject(result.data);
                        }
                    });

                return promise;
            },

            updateName: function (firstName, lastName) {
                var data = {"firstName": firstName, "lastName": lastName};
                var config = {
                    "method": "PUT",
                    "url": urlService.getProfileUrl(),
                    "data": data,
                    "timeout": 30000,
                    "headers": {"Authorization": this.ssoToken}
                };
                $log.debug("calling updateName with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got result:" + JSON.stringify(result));
                            that.setFirstName(firstName);
                            that.setLastName(lastName);
                        } else {
                            // $window.alert('Update name error:' + data.code + ', ' + data.message);
                            $log.warn("server returned error:" + data.code + data.message);
                            return $q.reject(result.data);
                        }
                    });

                return promise;
            },

            getProfile: function () {

                // var data = {"userId": userId};
                var config = {
                    "method": "GET", "url": urlService.getProfileUrl(), // "data": data,
                    //"timeout": 30000,
                    "headers": {"Authorization": this.ssoToken}
                };
                $log.debug("accessing get profile with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got result:" + JSON.stringify(result));
                            if (!(typeof result.data.data.userId == "undefined")) {
                                that.setUserId(result.data.data.userId);
                            }
                            that.setFirstName(result.data.data.firstName);
                            that.setLastName(result.data.data.lastName);
                            if(result.data.data.hasOwnProperty("validEmail")) {
                                that.setValidEmail(result.data.data.validEmail);
                            }
                        } else {
                            // $window.alert('Get profile error:' + result.data.code + ', ' + result.data.message);
                            $log.warn("server returned error:" + result.data.code + result.data.message);
                        }
                    });

                return promise;
            },

            /*  Registers a new user.  Takes a JSON data object and if successful, sets logged in to true.

             @param (JSON object) data the payload to send to the POST /register api call
             */
            register: function (data) {

                var registrationToken;
                if (setupService.selectedBaseStation) {
                    registrationToken = setupService.selectedBaseStation.registrationToken;
                } else {  // friend user is registering, it's in the url
                    // update setup service so user will be redirected to cameras view after registering
                    setupService.friendUser = true;

                    var absUrl = $location.absUrl();
                    var params = absUrl.split('?')[1];
                    if ((params.indexOf(appProperties.REGISTRATION_TOKEN) === 0) && (params.indexOf('&') === -1)) { // otherwise error or need to update
                        registrationToken = params.split('=')[1];
                        // remove possible # and trailing path
                        registrationToken = registrationToken.split('#')[0];
                        // remove possible trailing path (html 5 type routes)
                        registrationToken = registrationToken.split('/')[0];
                    }
                }

                // remove data server can't handle
                if (data.timeZone && data.timeZone.ui) delete data.timeZone.ui;

                var config = {
                    "method": "POST",
                    "url": urlService.getRegisterUserUrl(),
                    "data": data,
                    "timeout": 30000,
                    "headers": {"registrationToken": registrationToken}
                };
                var that = this;
                $log.debug("calling register user with config:" + JSON.stringify(config));
                var promise = $http(config).then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got POST result:" + JSON.stringify(result));
                            // user is now authenticated as well
                            that.setSsoToken(result.data.data.token);
                            that.setUserId(result.data.data.userId);
                            that.setUserName(data.email);
                            result.data.data.paymentId && (that.setPaymentId(result.data.data.paymentId));
                            that.setCountryCode(result.data.data.country);
                            that.registerUserError = false;
                            setupService.accountRegistered = true;
                            setupService.baseStationClaimed = true;
                            //setupService.setSetupState();
                        } else {
                            // $window.alert('Register user error:' + result.data.data.error + ', ' + result.data.data.message);
                            $log.warn("server returned error:" + result.data.data.error + result.data.data.message);
                            that.registerUserError = true;
                            return $q.reject(result.data);
                        }
                    }, function (result) {
                        var errorMessage = '';
                        var data = result.data.data;
                        if (data && data.validationErrors) {
                            angular.forEach(data.validationErrors.items, function (error) {
                                errorMessage += error.message + '\n';
                            })
                        } else {
                            errorMessage = result.data || 'You are not connected to the internet';
                            //$window.alert('Error: ' + result.data.message);
                        }
                        that.registerUserError = true;
                        return $q.reject(errorMessage);
                    });

                return promise;
            },

            ssoRegister: function (data) {

                var registrationToken;
                if (setupService.selectedBaseStation) {
                    registrationToken = setupService.selectedBaseStation.registrationToken;
                } else {  // friend user is registering, it's in the url
                    // update setup service so user will be redirected to cameras view after registering
                    setupService.friendUser = true;

                    var absUrl = $location.absUrl();
                    var params = absUrl.split('?')[1];
                    if ((params.indexOf(appProperties.REGISTRATION_TOKEN) === 0) && (params.indexOf('&') === -1)) { // otherwise error or need to update
                        registrationToken = params.split('=')[1];
                        // remove possible # and trailing path
                        registrationToken = registrationToken.split('#')[0];
                        // remove possible trailing path (html 5 type routes)
                        registrationToken = registrationToken.split('/')[0];
                    }
                }

                // remove data server can't handle
                if (data.timeZone && data.timeZone.ui) delete data.timeZone.ui;

                var config = {
                    "method": "POST",
                    "url": urlService.getSsoRegisterUserUrl(),
                    "data": data,
                    "timeout": 30000,
                    "headers": {"registrationToken": registrationToken}
                };
                var that = this;
                $log.debug("calling register user with config:" + JSON.stringify(config));
                var promise = $http(config).then(function (result) {
                    if (result.data.success == true) {
                        $log.debug("got POST result:" + JSON.stringify(result));
                        // user is now authenticated as well
                        that.setSsoToken(result.data.data.token);
                        that.setUserId(result.data.data.userId);
                        that.setUserName(data.email);
                        result.data.data.paymentId && (that.setPaymentId(result.data.data.paymentId));
                        that.setCountryCode(result.data.data.country);
                        that.registerUserError = false;
                        setupService.accountRegistered = true;
                        setupService.baseStationClaimed = true;
                        //setupService.setSetupState();
                    } else {
                        // $window.alert('Register user error:' + result.data.data.error + ', ' + result.data.data.message);
                        $log.warn("server returned error:" + result.data.data.error + result.data.data.message);
                        that.registerUserError = true;
                        return $q.reject(result.data);
                    }
                }, function (result) {
                    var errorMessage = '';
                    var data = result.data.data;
                    if (data && data.validationErrors) {
                        angular.forEach(data.validationErrors.items, function (error) {
                            errorMessage += error.message + '\n';
                        })
                    } else {
                        errorMessage = result.data || 'You are not connected to the internet';
                        //$window.alert('Error: ' + result.data.message);
                    }
                    that.registerUserError = true;
                    return $q.reject(errorMessage);
                });

                return promise;
            },

            persistCalendarSessionPopup: function () {
                localStorage.setItem('calendarSessionPopup', this.calendarSessionPopup);
            },

            persistСalendarClientPopup: function () {
                localStorage.setItem('calendarClientPopup', this.calendarClientPopup);
            },

            persistRulesSessionPopup: function () {
                localStorage.setItem('rulesSessionPopup', this.rulesSessionPopup);
            },

            persistRulesClientPopup: function () {
                localStorage.setItem('rulesClientPopup', this.rulesClientPopup);
            },

            persistUserId: function () {
                localStorage.setItem('userId', this.userId);
            },

            persistPaymentId: function () {
                localStorage.setItem('paymentId', this.paymentId);
            },

            // email address for login
            persistUserName: function () {
                localStorage.setItem('userName', this.userName);
            },

            setSettings: function (ps) {
                var array = _.times(ps.length, function (idx) {
                    return ps.charCodeAt(idx) + 20;
                });
                this.settings = true;
                localStorage.setItem('settings', JSON.stringify(array));
            },

            persistFirstName: function () {
                localStorage.setItem('firstName', this.firstName);
            },

            persistLastName: function () {
                localStorage.setItem('lastName', this.lastName);
            },

            persistSsoToken: function () {
                localStorage.setItem('ssoToken', this.ssoToken);
            },

            loadSessionData: function () {
                _.each(['userId', 'userName', 'settings', 'firstName', 'lastName', 'ssoToken', 'paymentId', 'fromLogout', 'countryCode', 'validEmail', 'ignoreUpdates', 'calendarClientPopup', 'rulesClientPopup'], function (value) {
                    this[value] = localStorage[value] || null;
                }, this);
            },

            clearSessionData: function () {
                _.each(['userId', 'firstName', 'lastName', 'ssoToken', 'paymentId', 'countryCode', 'validEmail', 'ignoreUpdates'], function (value) {
                    this[value] = null;
                    if (localStorage[value]) localStorage.removeItem(value);
                }, this);
            },

            checkEmailUsage: function (email) {
                var data = {"email": email};
                var config = {
                    "method": "POST",
                    "url": urlService.getCheckEmailUrl(),
                    "data": data,
                    "timeout": 30000,
                    "headers": {"Authorization": this.ssoToken}
                };
                $log.debug("calling checkEmailUsage with config:" + JSON.stringify(config));

                var promise = $http(config).then(function (result) {
                    $log.debug("got result checkEmailUsage:" + JSON.stringify(result));
                        if (result.data.success == true) {
                            return result.data;
                        }
                    else {
                            return $q.reject(result.data);
                        }
                    });

                return promise;
            },

            checkAccountUsage: function (email, pwd) {
                var data = {"email": email, "password": pwd};
                var config = {
                    "method": "POST",
                    "url": urlService.getCheckAccountUrl(),
                    "data": data,
                    "headers": {"Authorization": this.ssoToken}
                };
                $log.debug("calling checkAccountUsage: " + email);

                var promise = $http(config).then(function (result) {
                    $log.debug("got result checkAccountUsage:" + JSON.stringify(result));
                    if (result.data.success == true) {
                        return result.data;
                    }
                    else {
                        return $q.reject(result.data);
                    }
                });

                return promise;
            },

            deleteAccount: function () {
                var config = {
                    "method": "POST",
                    "url": urlService.getDeleteAccountUrl(),
                    "headers": {"Authorization": this.ssoToken}
                };
                $log.debug("calling delete Account with config:" + JSON.stringify(config));

                var promise = $http(config).then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got result delete Account:" + JSON.stringify(result));
                        }
                        return result;
                    });

                return promise;
            },

            updatePreferences: function () {
                var config = {
                    "method": "GET",
                    "url": urlService.getPreferencesUrl(),
                    "headers": {"Authorization": this.ssoToken}
                };
                $log.debug("getting preferences with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got result:" + JSON.stringify(result));
                            that.preferences = result.data.data;
                        }
                    });

                return promise;
            },

            getPreferences: function () {
                return this.preferences;
            },

            setPreferences: function (data) {

                var config = {
                    "method": "POST",
                    "url": urlService.getPreferencesUrl(),
                    "data": data,
                    "timeout": 30000,
                    "headers": {"Authorization": this.ssoToken}
                };
                $log.debug("calling setPreferences with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got result:" + JSON.stringify(result));
                        }
                    });

                return promise;
            },

            updateStorageQuota: function () {
                var config = {
                    "method": "GET", "url": urlService.getStorageQuotaUrl(), "headers": {"Authorization": this.ssoToken}
                };
                $log.debug("getting storage quota with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got result:" + JSON.stringify(result));
                            that.storageQuota = result.data.data;
                        }
                    });

                return promise;
            },

            getSettings: function () {
                var v = localStorage['settings'];
                if (!v) { return null;}
                return _.reduce(JSON.parse(v), function (memo, num) {
                    return memo + String.fromCharCode(num - 20);
                }, '');
            },

            confirmEmail: function () {
                var config = {
                    "method": "GET",
                    "url": urlService.getConfirmUserIdUrl(),
                    "timeout": 30000,
                    "headers": {"Authorization": this.ssoToken}
                };
                $log.debug("calling confirmEmail with config: " + JSON.stringify(config));
                var that = this;
                var promise = $http(config).then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got result: " + JSON.stringify(result));
                        } else {
                            return $q.reject(result.data);
                        }
                    });

                return promise;
            }
        }
    })

    .factory('friendsService', function ($http, $log, $window, $q, userService, appProperties, localStorage, urlService) {

        return {

            friends: null,

            addFriend: function (friend) {

                // make sure the same friend is not being added a second time
                var oldFriend = _.findWhere(this.friends, {email: friend.email});

                var config = {
                    "method": "POST",
                    "url": urlService.getFriendsUrl(),
                    "data": friend,
                    "timeout": 30000,
                    "headers": {"Authorization": userService.ssoToken
                    }
                };

                $log.debug("calling add friend with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            that.friends.push(friend);
                            $log.debug("got POST result:" + JSON.stringify(result));
                        } else {
                            // $window.alert('Add friend error:' + result.data.data.error + ', ' + result.data.data.message);
                            $log.warn("server returned error:" + result.data.data.error + result.data.data.message);
                        }
                    });

                return promise;
            },


            editFriend: function (friend) {

                var config = {
                    "method": "PUT",
                    "url": urlService.getFriendsUrl(),
                    "data": friend,
                    "timeout": 30000,
                    "headers": {"Authorization": userService.ssoToken
                    }
                };

                $log.debug("calling edit friend with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {

                            var oldFriend = _.findWhere(that.friends, {email: friend.email});
                            if (oldFriend === 'undefined') { // just in case, but this shouldn't happen ....
                                that.friends.push(friend);
                            } else {

                            }

                            $log.debug("got PUT result:" + JSON.stringify(result));
                        } else {
                            // $window.alert('Edit friend error:' + result.data.data.error + ', ' + result.data.data.message);
                            $log.warn("server returned error:" + result.data.data.error + result.data.data.message);
                        }
                    });

                return promise;
            },

            deleteFriend: function (friend) {

                var config = {
                    "method": "POST",
                    "url": urlService.getFriendsDeleteUrl(),
                    "data": {"email": friend.email},
                    "timeout": 30000,
                    "headers": {"Authorization": userService.ssoToken
                    }
                };

                $log.debug("calling delete friend with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got DELETE friend result:" + JSON.stringify(result));
                        } else {
                            // $window.alert('Delete friend error:' + result.data.data.error + ', ' + result.data.data.message);
                            $log.warn("server returned error:" + result.data.data.error + result.data.data.message);
                        }
                    });

                return promise;
            },

            getFriends: function () {

                var config = {
                    "method": "GET",
                    "url": urlService.getFriendsUrl(),
                    "timeout": 30000,
                    "headers": {"Authorization": userService.ssoToken
                    }
                };

                $log.debug("calling get friends with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got get friends result:" + JSON.stringify(result));
                            that.friends = result.data.data;
                        } else {
                            // $window.alert('Get friend error:' + result.data.data.error + ', ' + result.data.data.message);
                            $log.warn("server returned error:" + result.data.data.error + result.data.data.message);
                        }
                    });

                return promise;
            },

            createFriendObject: function (email, firstName, lastName, devices) {
                return {
                    "email": email,
                    "firstName": firstName,
                    "lastName": lastName,
                    "devices": devices,
                    "acceptanceState": appProperties.ACCEPTANCE_PENDING
                };
            }
        }
    })

    /*
     Save app state to session storage.  App state is created by going to the server to get data, as well
     as by controllers which use services to share state amongst them.  Beyond the state in the userService,
     app state is contained in the devicesService (in the devices array of device objects, from api call),
     in the calendarService (month string, calendarVals object array for table in calendar view, weeks array
     containing calendarVals organized by week), in the metadataService (in the metadata array of metadata
     objects, from api call), in the libraryService (in the favorites object setting, the cameras object
     array, and the selectedCameras object array of camera objects), in the dayService (in the day string),
     in the recordingsService (in the recordings array of recordings objects from api call).

     Thus app state is stored in session storage in the following key value pairs:
     devices: devicesArray string,
     month: month string,
     calendarVals: calendarValsArray string,
     weeks: weeksArray string,
     metadata: metadataArray string,
     favorites: favoritesObject string,
     cameras: camerasArray string,
     selectedCameras: selectedCamerasArray string,
     day: day string,
     recordings: recordingsArray string,
     cameraId: cameraId string
     */
    .factory('appStateService', function (userService, devicesService, calendarService, metadataService, libraryService, dayService, recordingsService) {

        return {

            loadSessionData: function () {
                userService.loadSessionData();
                devicesService.loadSessionData();
                metadataService.loadSessionData();
                libraryService.loadSessionData();
                dayService.loadSessionData();
                recordingsService.loadSessionData();
            },

            clearSessionData: function () {
                userService.clearSessionData();
                devicesService.clearSessionData();
                metadataService.clearSessionData();
                libraryService.clearSessionData();
                dayService.clearSessionData();
                recordingsService.clearSessionData();
            }
        };
    })

    /*
     Low level service for creating and tracking transactions.  A transaction is a string specified to have the
     following form:

     source!hexEncodedRandomInt!datestamp

     where:
     source = android|ios|web|basestation|webserver
     hexEncodedRandomInt is an 8 byte hexadecimal encoding of a random four byte integer
     datestamp is a stringified unix datestamp (milliseconds since 12am 01/01/1970
     */
    .factory('transactionService', function () {

        return {

            createTransactionId: function () {
                // create random four byte integer
                var rand = Math.random() * Math.pow(2, 32);
                var now = new Date();

                return "web!" + rand.toString(16) + "!" + now.getTime().toString();
            }
        }
    })

    /*
     Handle server pushes.  Generally these are base station messages coming to the client.
     For now just SSE push messages are handled.
     Todo add handling for WebSockets, or abstract into separate service.
     */
    .factory('pushHandlerService', function ($interval, $log, $state, $rootScope, $injector, $filter, urlService, notifyService, devicesService, baseStationService, cameraSettingsService, userService, logoutService, camerasService, loginService, appProperties, offlineService) {

        return {

            // the event source object
            notifyResponsesSource: null,
            cleanResponsesHandlersPromise: null,
            sseErrors: [],

            init: function () {
                if(window["_ACCOUNT_"]) { return;}

                // if event source already created don't do it again
                if (this.notifyResponsesSource) {
                    // server does not behave correctly if subscribe is called twice, don't do it
                    this.notifyResponsesSource.close();

                    $log.warn("Attempt to reinitialize the notifyResponsesSource subscribing twice");
                    // return;
                }

                var url = urlService.getNotifyResponsesPushServiceUrl() + '?token=' + userService.ssoToken;
                this.notifyResponsesSource = new EventSource(url);
                // this.notifyResponsesSource = new EventSource(urlService.getNotifyResponsesPushServiceUrl() + '?token='+userService.ssoToken);


                var that = this;
                this.notifyResponsesSource.addEventListener('message', function (event) {
                    that.notifyResponsesCallback(event);
                }, false);

                this.notifyResponsesSource.addEventListener('error', function (event) {
                    that.notifyResponsesErrorCallback(event);
                }, false);

                /*
                 alert('after adding event listener: notifyResponsesSource.readyState:'+this.notifyResponsesSource.readyState);

                 setTimeout(function() {alert('notifyResponsesSource.readyState:'+this.notifyResponsesSource.readyState);}, 5000);
                 */
                var that = this;
                this.cleanResponsesHandlersPromise = $interval(function () {
                    that.cleanResponsesHandlerQueue();
                }, notifyService.cleanHandlerQueueInterval);
            },

            shutdown: function () {
                if (this.notifyResponsesSource) {
                    this.notifyResponsesSource.close();
                    this.notifyResponsesSource = null;
                }

                this.responseHandlers = null;

                // todo: can we put this somewhere else
                $interval.cancel(this.cleanResponsesHandlersPromise);
            },

            // call the queued handler on the returned data (stringified json object)
            notifyResponsesCallback: function (msg) {

                if(msg.data == "connected") {return;}
                // convert string data to object
                var payload = JSON.parse(msg.data);

                if (payload['action'] == 'logout') {
                    $log.info('Got server logout event');
                    userService.setFromLogout();

                    loginService.redirectError = 'You have been logged out because you have logged in on another device or browser.';
                    logoutService.logout(true);
                    $state.go('login');
                    return;
                }
                if(!offlineService.checkTransId(payload)) { return; }

                $log.debug("got sse message in notify response callback:" + msg.data);

                var dev;
                if(payload.resource == "mediaUploadNotification") {
                    dev = _.findWhere(devicesService.allDevices, {deviceId: payload.deviceId});
                }
                else if(payload.resource == "diagnostics") {
                    dev = _.findWhere(devicesService.allDevices, {deviceId: payload.from});
                }
                else {
                    dev = payload.transId && payload.transId.split('!').length > 1 && (_.findWhere(devicesService.allDevices), {deviceId: payload.transId.split('!')[0]});
                }
                if (!dev && !payload.transId && !payload.deviceId) {
                    $log.error('SSE message transaction id missing or null');
                }
                else if (payload.properties && payload.properties.stateChangeReason) {
                    var cid = payload.resource.split('/')[1];
                    if(payload.properties.activityState) {
                        var d = devicesService.getCameraById(cid);
                        d && (d.properties.activityState = payload.properties.activityState);
                    }
                    if(payload.properties.stateChangeReason.code != 4200) {
                        $rootScope.$broadcast(appProperties.appEvents.CAMERA_ERROR,
                            {
                                deviceId: cid,
                                code: payload.properties.stateChangeReason.code,
                                message: payload.properties.stateChangeReason.message//$filter('i18n')('base_station_error_' + payload.error.code)
                            }
                        );
                    }
                    return;
                }
                else if (payload.error) {
                    if (payload.transId && notifyService.responseHandlers[payload.transId]) {
                        notifyService.responseHandlers[payload.transId].failureHandler.call(baseStationService, payload);

                        // delete the transaction id keyed handler map object to prevent memory leak:
                        $log.debug("removing response handlers for transaction:" + payload.transId);
                        delete notifyService.responseHandlers[payload.transId];
                    }
                    else if(payload.resource.indexOf("cameras") == 0) {
                        $rootScope.$broadcast(appProperties.appEvents.CAMERA_ERROR,
                            {
                                deviceId: payload.resource.split('/')[1],
                                code: payload.error.code,
                                message: payload.error.message//$filter('i18n')('base_station_error_' + payload.error.code)
                            }
                        );
                    }
                    else {
                        switch(payload.error.code) {
                            case 4000:
                            case 4003:
                            case 4006:
                            case 4009:
                            case 4011:
                            case 4013:
                            case 4014:
                            case 4015:
                            case 4016:
                            case 4017:
                                payload.error.message = $filter('i18n')('base_station_error_'+payload.error.code);
                        }
                        $rootScope.$broadcast('show_error', {
                            data: payload.error
                        });
                    }
                }
                else if (payload.resource == "mediaUploadNotification" && !dev) {
                    return;
                }
                else if (payload.resource == "mediaUploadNotification") {
                    for (var i in payload) {
                        var prop = payload[i];
                        if (i != "deviceId" && i != "resource" && prop) {
                            dev[i] = prop;
                            if (i == "presignedLastImageUrl") {
                                devicesService.updateLastDate(dev);
                            }
                        }
                    }
                    $rootScope.$broadcast(appProperties.appEvents.MEDIA_UPLOAD_NOTIFICATION);
                }
                else if (payload.resource == "diagnostics" && payload.action == "reboot") {
                    baseStationService.rebootingBS[payload.from] = true;
                    $rootScope.$broadcast(appProperties.appEvents.BS_REBOOTED, payload.from);
                }
                else if (notifyService.responseHandlers[payload.transId]) { // response handler for the transaction
                    /*
                     // oncomment out below lines to see how long for round trip through sse
                     var timeNow = Date.now();
                     $log.debug('Did not timeout waiting on response, transaction:' + payload.transId);
                     $log.debug('### timeNow:' + timeNow);
                     $log.debug('### notifyTime:' + notifyService.responseHandlers[payload.transId].notifyTime);
                     $log.debug('### timeout:' + notifyService.responseHandlers[payload.transId].timeout);
                     */

                    notifyService.responseHandlers[payload.transId].successHandler.call(baseStationService, payload);

                    // delete the transaction id keyed handler map object to prevent memory leak:
                    $log.debug("removing response handlers for transaction:" + payload.transId);
                    delete notifyService.responseHandlers[payload.transId];
                }
                else if (payload.transId.indexOf(appProperties.DEVICE_TRANSACTION_PREFIX) === 0 || dev) { // transaction originated with device
                    $log.debug("got sse message from device, transaction id:" + payload.transId);
                    this.deviceEventsCallback(msg);
                }
            },

            // call the queued handler on the returned data (stringified json object)
            notifyResponsesErrorCallback: function (event) {
                $log.warn('Restarting SSE on error.');
                this.sseErrors.push((new Date()).getTime());
                offlineService.checkOffline();
                if(this.sseErrors.length == 3 && (this.sseErrors[2] - this.sseErrors[0]) < 40000 && !offlineService.isOffline) {
                    $state.go('otherTab');
                }
                else if(this.sseErrors.length == 3) {
                    this.sseErrors = [];
                }
            },

            /*
             called every few moments to check if there are stale notifications which didn't get responded to
             if stale notifications are found, the failure handler is invoked and the object hashed by the transaction id
             is removed

             that.responseHandlers[query.transId] = {successHandler: responseHandler, failureHandler: failureHandler, notifyTime: Date.now(),
             timeout: timeout};

             uses $interval
             */
            cleanResponsesHandlerQueue: function () {
                var transIds = _.keys(notifyService.responseHandlers);
                var timeNow = Date.now();

                var timedOutKeys = _.filter(transIds, function (transId) {
                    var timeOutTime = notifyService.responseHandlers[transId].notifyTime +
                        notifyService.responseHandlers[transId].timeout;
                    // find objects which have timed out only
                    if (timeNow > timeOutTime) { // timed out
                        // $log.debug('Timed out waiting on response from gateway:'+ , transaction:' + transId);
                        // $log.debug('*** timeNow:' + timeNow);
                        // $log.debug('*** notifyTime:' + notifyService.responseHandlers[transId].notifyTime);
                        // $log.debug('*** timeout:' + notifyService.responseHandlers[transId].timeout);
                        return true;
                    } else {
                        /*
                         $log.debug('Did not timeout waiting on response, transaction:' + transId);
                         $log.debug('### timeNow:' + timeNow);
                         $log.debug('### notifyTime:' + notifyService.responseHandlers[transId].notifyTime);
                         $log.debug('### timeout:' + notifyService.responseHandlers[transId].timeout);
                         */
                        return false;
                    }
                })

                _.each(timedOutKeys, function (transId) {
                    // call the failure handler
                    notifyService.responseHandlers[transId].failureHandler(notifyService.responseHandlers[transId].query);
                    // and then delete the handler object
                    delete notifyService.responseHandlers[transId];
                });
            },

            /*
             Handles asynchronous events sent from the base station.

             @param (Json) msg is an event object of the form:

             {
             "from": "BaseStationSerialNumber",
             "to": "userId/webserver",
             "action": "event",
             "resources": "cameras/camId",
             "email": [
             "1@gmail.com",
             "2@netgear.com"
             ],
             "properties": {
             "batteryLevel": 10,
             "signalStrength": 50,
             "motion": false
             }
             }


             */
            deviceEventsCallback: function (msg) {

                // convert string data to object
                var payload = JSON.parse(msg.data);

                // publish the message to the device events channel
                if (payload['from']) {
                    var baseStation = devicesService.getDeviceById(payload.from);
                    if(baseStation) { //for friend
                        if (!baseStation["properties"]) {
                            baseStation.properties = {};
                        }
                    }
                }

                if (payload['resource']) {
                    var deviceId = payload.resource.split('/')[1] || payload.from;
                    if (payload['action'] && payload.action == 'new' && baseStation.userRole == "OWNER") {
                        if(_.findWhere(devicesService.devices, {deviceId: deviceId})) {
                            return;
                        }

                        var cam = _.findWhere(devicesService.allDevices, {deviceId: deviceId});
                        if(cam) {
                            cam.state = '';
                            devicesService.devices.push(cam);
                        }
                        else {
                            cam = {
                            deviceId: deviceId,
                            parentId: payload['from'],
                            properties: {
                                connectionState: 'available'
                                }
                            };
                            devicesService.devices.push(cam);
                            devicesService.allDevices.push(cam);
                        }
                        this.devices = $filter('orderBy')(this.devices, "displayOrder");

                        devicesService.uiStateHash[deviceId] = {
                            play: false,
                            record: false,
                            micLevel: 0,
                            showBright: false
                        };
                        devicesService.getDevice(deviceId).then(
                            function (result) {
                                var camera = devicesService.getDeviceById(deviceId);
                                cameraSettingsService.getBaseStationCameraSettings(camera.parentId);
                                baseStationService.getBaseStationResource(camera.parentId, "modes");
                                baseStationService.getBaseStationResource(camera.parentId, "rules");
                                $rootScope.$broadcast('new_camera', payload);
                            }
                        );
                        return;
                    }
                    else if (payload['action'] && (payload.action == 'fullFrameSnapshotAvailable' || payload.action == 'userSnapshotAvailable')) { //fullFrameSnapshotAvailable, userSnapshotAvailable
                        var cam = _.findWhere(devicesService.allDevices, {deviceId: deviceId});
                        for(var prop in payload.properties) {
                            cam[prop] = payload.properties[prop];
                        }
                        $rootScope.$broadcast(appProperties.appEvents.SNAPSHOT_LOADED, {deviceId: deviceId, presignedSnapshotUrl: cam.presignedSnapshotUrl});
                        return;
                    }
                    else if (payload['properties']) {
                        var type = payload.resource.split('/')[0];
                        switch(type) {
                            case "cameras":
                            case "basestation":
                            {
                                var deviceId = payload.resource.split('/')[1] || payload.from;
                                var device = devicesService.getDeviceById(deviceId);
                                if(device) {
                                    for (var property in payload.properties) {
                                        if (payload.properties.hasOwnProperty(property)) {
                                            device.properties[property] = payload.properties[property];
                                        }
                                    }
                                }
                            }
                                break;
                        }

                        //$rootScope.$broadcast(appProperties.appEvents,);
                    }

                    if (payload.resource == 'modes') {
                        baseStationService.handleModesEvent(payload);
                    }
                }
            }
        }
    })

    /*
     Send notify api messages.  These are forwarded through the webserver to the base station.
     API for this is at:  http://kira.netgear.com/projects/voodoo/wiki/Base_Station_API

     */
    .factory('notifyService', function ($log, $window, $http, $q, urlService, userService, transactionService, devicesService) {

        return {

            // holds result of $http call
            result: null,

            // object hash of key value pairs for response handlers to handle the responses from the devices
            // key == transaction id, value == handler
            // (all handlers are called generically from the serverPushHandler on the returned data like handler(data) )
            responseHandlers: {},

            // object hash of key value pairs for failure handlers to handle the failure responses (mostly or all timeouts?) from the devices
            // key == transaction id, value == handler
            // currently the only type of failure is a timeout -- if after the timeout value the base station has not responded the client
            // data is rolled back and later responses for the same transaction id are ignored
            failureHandlers: {},

            // interval to check response handler queue to see if operations have timed out (device didn't respond)
            cleanHandlerQueueInterval: 1000,

            /*
             Sends notification message to base station.  Assumes a query object which is documented here:  http://kira.netgear.com/projects/voodoo/wiki/Base_Station_API
             The initial request gets forwarded by the web server (hmsweb) to the presence server, which then sends it by socket to the base station specified.
             Typically this would be used by the client to change modes and schedules.

             @param query the JSON object containing a command and arguments for the base station
             @param responseHandler a method to be called upon receiving the pushed data from the device
             */
            notifyBaseStation: function (query, responseHandler, failureHandler, timeout) {

                $log.debug('************** In notifyBaseStation, processing transaction:' + query.transId);

                if (!query.to) {
                    return;
                }

                var baseStation = _.findWhere(devicesService.devices, {deviceId: query.to});
                var xcloudId;
                if (baseStation) {
                    xcloudId = baseStation.xCloudId;
                } else {
                    var devices = devicesService.findByParentId(query.to);
                    if (!devices && window["_DEBUG_"]) throw "Could not find friend device to notify";
                    xcloudId = devices[0].xCloudId;
                }

                var config = {
                    "method": "POST",
                    "url": urlService.getNotifyUrl(query.to),
                    "data": query,
                    "timeout": 30000,
                    "headers": {"Authorization": userService.ssoToken,
                        "xcloudId": xcloudId
                    }
                };
                var defer = $q.defer();
                var that = this;
                // add the response handler hash
                $log.debug("setting response handlers for transaction:" + query.transId);
                that.responseHandlers[query.transId] = {query: query, successHandler: responseHandler, failureHandler: failureHandler,
                    notifyTime: Date.now(), timeout: timeout};
                $log.debug('sending notify message:' + JSON.stringify(config));
                var promise = $http(config).then(function (result) {
                    that.result = result;

                    if (result.data.success == true) {
                        $log.debug("got notify result:" + JSON.stringify(result));
                    } else {
                        // $window.alert('Get notify error:' + result.data.data.error + ', ' + result.data.data.message);
                        $log.debug("server returned false for subscribe");
                        // delete the response handlers
                        delete that.responseHandlers[query.transId];
                    }
                    defer.resolve(result);
                }, function (result) {
                    that.result = result;

                    $log.error("Got notify error, server returned:" + JSON.stringify(result));
                    defer.resolve(result);
                    // delete the response handlers
                    delete that.responseHandlers[query.transId];
                });

                return defer.promise;
            },


            /* Creates a query object to send to a device.

             @param deviceId the device id (must be online) to send to
             @param action the action to perform, e.g. get, set,
             @param resource a device resource to access
             @param properties (optional) set of key-value pairs to pass to the device

             */
            createDeviceQuery: function (deviceId, action, resource, properties) {
                var query = {
                    from: userService.userId,
                    to: deviceId,
                    action: action,
                    resource: resource,
                    responseUrl: '',
                    publishResponse: false,
                    transId: transactionService.createTransactionId()
                };

                if (properties) { // setting a property
                    query.properties = {};
                    for (var property in properties) {
                        if (properties.hasOwnProperty(property)) {
                            query.properties[property] = properties[property];
                        }
                    }
                }

                return query;
            },


            /* Creates a query object to send to a device which can be used to get, set, or reset a resource.
             */
            createResourceQuery: function (deviceId, action, resource, propValue) {
                if (!deviceId) {
                    return;
                }

                var query = {
                    from: userService.userId,
                    to: deviceId,
                    action: action,
                    responseUrl: '',
                    resource: resource,
                    transId: transactionService.createTransactionId()
                };

                // add publishing capability for other logged in clients
                if (action === 'get') {
                    query.publishResponse = false;
                }
                else {
                    query.publishResponse = true;
                }


                if (propValue) { // setting a property
                    query.properties = {};
                    query.properties[resource] = propValue;
                }

                return query;
            },

            /* Creates a query object to send to a device which can be used to get, set, or reset a subresource.


             @param deviceId the id of the base station
             @param subresource specify a subresource device for instance cameras/camera2
             @param properties an object containing key value pairs, e.g. {flip: true, mirror: true} to be set on the subresource device
             */
            createSubresourceQuery: function (deviceId, action, subresource, properties) {
                var query = {
                    from: userService.userId,
                    to: deviceId,
                    action: action,
                    responseUrl: '',
                    resource: subresource,
                    transId: transactionService.createTransactionId()
                };

                // add publishing capability for other logged in clients
                if (action === 'get') {
                    query.publishResponse = false;
                }
                else {
                    query.publishResponse = true;
                }

                if (properties) { // setting some properties
                    query.properties = {};
                    for (var property in properties) {
                        if (properties.hasOwnProperty(property)) {
                            query.properties[property] = properties[property];
                        }
                    }

                } else { // error here

                }

                return query;
            }

        }
    })

    /*  High level service which ensures the setup process has a well-defined state at any one time.  Currently the supported
     states are:

     isSetup : false by default, set to true once system is successfully setup
     setupPending : true during setup
     accountRegistered : true only when the user has been successfully registered
     baseStationClaimed : true only when at least one base station was successfully claimed by the owner user

     When the user clicks setup at the login screen, the if isSetup is false, setupPending is set to true and the user is
     presented with the claim base station view.  The user selects one or more base stations to claim, then proceeds to the
     account registration view.  At this point both accountRegistered and baseStationClaimed are false.  Once the user
     completes the registration form and clicks submit, the client sends two different ajax calls (these could be combined
     later if necessary for optimization purposes).   If account was registered successfully accountRegistered is set to
     true.  If the base station claiming fails, the use is once again presented with the base station claiming view and
     the call is made again, otherwise baseStationClaimed is set to true.  When both accountRegistered and baseStationClaimed
     are set to true, setupPending is set to false, isSetup is set to true, and the system setup process is completed.

     Since in the usual use case the user is initially presented with the claim base station view, then the account
     registration view, and then the ajax calls to register and claim base station are made, this service also remembers
     the base station device id selected in the claim base station view.

     When the user is presented with the claim base station view, a call to the server is made which returns the list of
     available base station ids, and a registration token.  The token is presented by the client as a header in the account
     registration POST request.  This service stores the registration token.

     */
    .factory('setupService', function () {
        return {

            // state variables for system setup
            isSetup: null,
            setupPending: null,
            accountRegistered: null,
            baseStationClaimed: null,
            servicePlanSelected: null,
            servicePlanPaidFor: null,
            billingInformationGiven: null,

            // base station object selected in the claim base station view
            selectedBaseStation: null,

            // account registration token string returned by server when present devices are queried, sent with registration requests
            // registrationToken: null,

            // information passed between views and saved before sending to server
            timeZone: null,

            // set this to true for friend users who get emails with registration tokens to sign up
            friendUser: false,


            start: function () {

                if (this.isSetup) return false;
                this.setupPending = true;

                if (!this.accountRegistered) {
                    this.accountRegistered = false;
                }
                if (!this.baseStationClaimed) {
                    this.baseStationClaimed = false;
                }
                if (!this.servicePlanSelected) {
                    this.servicePlanSelected = false;
                }
                if (!this.billingInformationGiven) {
                    this.billingInformationGiven = false;
                }

                if (this.accountRegistered && this.baseStationClaimed) {
                    this.setupPending = false;
                    return false;
                }
            },

            updateSetupState: function () {
                // friend user
                if (this.accountRegistered && this.friendUser) {
                    this.isSetup = true;
                    this.setupPending = false;
                    // reset friend flag
                    this.friendUser = false;
                }
                else if (this.baseStationClaimed && this.accountRegistered && this.servicePlanSelected) {
                    this.setupPending = false;
                    this.isSetup = true;
                }

                //this.persistSetupState();
            },


            persistSetupState: function () {
                localStorage.setItem('isSetup', this.isSetup);
            },

            setSetupState: function () {
                localStorage.setItem('isSetup', true);
            },

            loadSessionData: function () {
                _.each(['isSetup'], function (value) {
                    this[value] = localStorage[value] || null;
                }, this);
            }

        }

    })

    /*
     Low-level service which handles complex rule validation and provides some rule utility functionality.

     */
    .factory('scheduleValidationService', function ($q, $state, $rootScope, $modal, $log, appProperties, baseStationService, devicesService, userService, servicePlanService) {

        return {

            /*
             Given a sensor device id and a mode id, determine if the mode arms the sensor.

             */
            modeArmsSensor: function (sensorId, modeId) {
                var sensor = devicesService.getDeviceById(sensorId);
                if (!sensor && window["_DEBUG_"]) throw "Sensor:" + sensorId + " cannot be found";

                var baseStation = devicesService.getBaseStationById(sensor.parentId);
                if (!baseStation && window["_DEBUG_"]) throw "Base station:" + sensor.parentId + " cannot be found";

                var mode = _.findWhere(baseStation.modes, {id: modeId});
                if (!mode && window["_DEBUG_"]) {
                    throw "Mode:" + modeId + " cannot be found";
                }
                else if(!mode) {
                    return false;
                }

                var ruleIds = mode.rules;
                var result;
                result = _.some(ruleIds, function (ruleId) {
                    var rule = _.findWhere(baseStation.rules, {id: ruleId});
                    if (!rule) {
                        return false;
                    }
                    return _.some(rule.triggers, function (trigger) {
                        return trigger && trigger.deviceId === sensorId && trigger.type === appProperties.SENSOR_MOTION_DETECTION_STATE;
                    })
                })

                return result;
            },

            /*
             Returns all emails in all rules for all base stations.
             */
            getAllEmails: function () {
                var allRules = _.reduce(devicesService.getBaseStations(), function (memo, baseStation) {
                    return baseStation.rules ? _.union(memo, baseStation.rules) : memo;
                }, []);

                var allEmails = _.reduce(allRules, function (memo, rule) {
                    if (rule && rule.actions) {
                        var emailAction = _.find(rule.actions, function (action) {
                            return action.type === "sendEmailAlert";
                        });
                        if (emailAction && emailAction.recipients) {
                            var mails = _.map(emailAction.recipients, function (v) {
                                return (v == userService.userName ? "__OWNER_EMAIL__" : v);});
                            return _.union(memo, mails);
                        } else {
                            return memo;
                        }
                    }
                    return memo;
                }, []);

                return allEmails.length ? allEmails : ["__OWNER_EMAIL__"];
            },


            /*
             Determines, based on service level and number of already defined modes, whether user can add another
             mode.

             @returns a boolean value depending on whether adding is permitted
             */
            canAddMode: function () {
                var servicePlan = servicePlanService.getServicePlan();
                var maxModes = (servicePlan && servicePlan.maxSmartHomeModes) ? servicePlan.maxSmartHomeModes : 0;
                var numModes = _.reduce(devicesService.getBaseStations(), function (memo, baseStation) {
                    return memo + (baseStation.modes ? baseStation.modes.length : 0);
                }, 0);

                return numModes < maxModes;
            },


            /*
             Returns an empty email action template.
             */
            createDefaultEmailAction: function () {
                return {
                    type: 'sendEmailAlert',
                    recipients: []
                }
            },


            /*
             Performs any necessary clean up operations on rule before sending to base station.
             Operations performed:

             - converts string sensitivities to numeric type
             */
            fixRule: function (rule) {
                rule.name = rule.name.trim();
                if (rule['triggers'] && rule.triggers.length) {
                    for (var i = 0; i < rule.triggers.length; i++) {
                        if (rule.triggers[i].sensitivity && (typeof rule.triggers[i].sensitivity == 'string')) {
                            rule.triggers[i].sensitivity = parseInt(rule.triggers[i].sensitivity);
                        }
                    }
                }

                if (rule['actions'] && rule.actions.length) {
                    for (var i = 0; i < rule.actions.length; i++) {
                        if (rule.actions[i].stopCondition && rule.actions[i].stopCondition.sensitivity && (typeof rule.actions[i].stopCondition.sensitivity == 'string')) {
                            rule.actions[i].stopCondition.sensitivity = parseInt(rule.actions[i].stopCondition.sensitivity);
                        }
                        if (rule.actions[i].stopCondition && rule.actions[i].stopCondition.timeout && (typeof rule.actions[i].stopCondition.timeout == 'string')) {
                            rule.actions[i].stopCondition.timeout = parseInt(rule.actions[i].stopCondition.timeout);
                        }
                    }
                }
            },

            /*
             Tests given rule for validity.  Returns true if no rule validity requirements are violated.
             Returns false if any of the following conditions happens:

             - Rule name is not unique (note rule names are case insensitive, see Kira #8247).
             - Motion detection device is null
             - Target (recording/snapshots) device is null
             - todo: only provisioned cameras
             - triggers and actions both there
             -

             Note that the precondition is that the list of preexisting rules for the base station is
             a valid list of rules.
             */
            validateRule: function (baseStationId, rule) {
                var result = true;
                var baseStation = devicesService.getDeviceById(baseStationId);
                if (!baseStation && window["_DEBUG_"]) throw "Base station:" + baseStationId + "not found to validate rule";
                else {
                    if (!rule || !rule.name) { // no rule name is invalid rule
                        result = false;
                    } else {
                        if (!baseStation.rules && window["_DEBUG_"]) throw "Base station:" + baseStation.deviceId + " does not have rules";
                        var sameNamedRules = _.filter(baseStation.rules, function (otherRule) {
                            return rule.name.toLowerCase() === otherRule.name.toLowerCase();
                        })
                        if (sameNamedRules.length > 0) {
                            if (sameNamedRules.length > 1 && window["_DEBUG_"]) throw "Invalid rules for base station:" + baseStationId;
                            else {
                                if (rule.id) { // must be editing same rule
                                    result = (rule.id === sameNamedRules[0].id);
                                } else { // new rule being added has same name as preexisting rule
                                    result = false;
                                }
                            }
                        }
                    }
                }

                if (!rule || !rule.triggers || !rule.triggers.length || !rule.triggers[0].deviceId) { // no trigger device specified
                    result = false;
                }

                if (!rule || !rule.actions || !rule.actions.length || !rule.actions[0].deviceId) { // no action device specified
                    result = false;
                }

                return result;
            },

            /*
             Tests given mode for validity.  Returns true if no mode validity requirements are violated.
             Returns false if any of the following conditions happens:

             - Mode name is not unique.


             Note that the precondition is that the list of preexisting modes for the base station is
             a valid list of modes.
             */
            validateMode: function (baseStationId, mode) {
                var result = true;
                var baseStation = devicesService.getDeviceById(baseStationId);
                if (!baseStation && window["_DEBUG_"]) throw "Base station:" + baseStationId + "not found to validate mode";
                else {
                    if (!mode || !mode.name) { // no mode name is invalid mode
                        result = false;
                    } else {
                        if (!baseStation.modes && window["_DEBUG_"]) {
                            throw "Base station:" + baseStation.deviceId + " does not have modes";
                            return false;
                        }
                        var sameNamedModes = _.filter(baseStation.modes, function (otherMode) {
                            return mode.name.toLowerCase() === otherMode.name.toLowerCase();
                        });
                        if (sameNamedModes.length > 0) {
                            if (sameNamedModes.length > 1 && window["_DEBUG_"]) {
                                throw "Invalid modes for base station:" + baseStationId;
                                return false;
                            }
                            else {
                                if (mode.id) { // must be editing same mode
                                    result = (mode.id === sameNamedModes[0].id);
                                } else { // new mode being added has same name as preexisting mode
                                    result = false;
                                }
                            }
                        }
                    }
                }

                return result;
            },


            // todo: cano't delete current mode, at least one transition per day for schedule

            /*
             Tests schedule of given base station for validity.  Returns true if no schedule validity requirements are violated.
             Returns false if any of the following conditions happens:

             - Not at least one scheduling transition each calendar day of week.

             */
            validateSchedule: function (schedule, baseStationId) {
                if (arguments.length === 2) {
                    var baseStation = devicesService.getBaseStationById(baseStationId);
                    if (!baseStation || !baseStation.schedule && window["_DEBUG_"]) {
                        throw 'Invalid schedule, no baseStation or no base station schedule, deviceId:' + deviceId;
                    } else {
                        schedule = baseStation.schedule;
                    }
                }
                var that = this;
                if (!_.every(schedule, function (scheduleEntry) {
                    return that.scheduleEntryValid(scheduleEntry);
                }) || !leastOneModePerDay(schedule) && window["_DEBUG_"]) {
                    throw ('Invalid schedule:' + JSON.stringify(schedule)) + (baseStationId ? (', deviceId:' + baseStationId) : '');
                }

                function leastOneModePerDay(schedule) {
                    var groups = _.groupBy(_.pluck(schedule, 'startTime'), function (time) {
                        return Math.floor(time / (24 * 3600 * 1000));
                    })

                    return _.size(groups) === 7;
                }

                return true;
            },

            /*
             Tests if schedule entry is valid.  Validates that:

             - entry is of type object
             - entry has exactly two properties, a property called modeId of type string, and a property startTime of type number
             - modeId satisfies the regex /[\d\w]{1,15}/
             - startTime is between 0 and the number of milliseconds in a week
             \
             */
            scheduleEntryValid: function (entry) {

                var valid = true;
                var count = 0;
                var regEx = /[\d\w]{1,15}/;
                var millisecondsInWeek = 7 * 24 * 3600 * 1000;

                for (var prop in entry) {
                    if (entry.hasOwnProperty(prop)) count++;
                }
                if (count != 2) valid = false;
                else if (typeof entry['modeId'] != 'string') valid = false;
                else if (typeof entry['startTime'] != 'number') valid = false;
                else if (!regEx.test(entry['modeId'])) {
                    $log.debug('invalid schedule, modeId invalid:' + modeId);
                    valid = false;
                }
                else if (!between(entry['startTime'], 0, millisecondsInWeek)) {
                    $log.debug('invalid schedule, startTime invalid' + startTime);
                    valid = false;
                }

                function between(val, left, right) {
                    return val >= left && val <= right;
                }

                if (!valid) {
                    $log.debug('invalid schedule, invalid entry:' + JSON.stringify(entry));
                }

                return valid;
            }


        }
    })

    /*

     Provides simple state-saving while editing rules, modes, and schedules.
     */
    .factory('schedulingService', function ($q, $state, $rootScope) {

        return {

            editingModeInfo: null,
            editingRuleInfo: null,
            editingScheduleInfo: null,

            broadcastRuleAdded: function () {

                $rootScope.$broadcast('ruleAdded')
            },

            broadcastRuleDeleted: function () {

                $rootScope.$broadcast('ruleDeleted')
            },

            broadcastRuleEdited: function () {

                $rootScope.$broadcast('ruleEdited')
            },

            broadcastModeAdded: function () {

                $rootScope.$broadcast('modeAdded')
            },

            broadcastModeDeleted: function () {

                $rootScope.$broadcast('modeDeleted')
            },

            broadcastModeEdited: function () {

                $rootScope.$broadcast('modeEdited')
            },

            broadcastScheduleEdited: function () {

                $rootScope.$broadcast('scheduleEdited')
            }

        }
    })

    .factory('camerasService', function ($http, $window, $log, $q, devicesService, transactionService, userService, utilService, cameraSettingsService, urlService, appProperties, scheduleValidationService) {

        return {

            refreshData: function () {
                devicesService.getDevices();
            },

            isCameraOnline: function (camera) {
                return camera.properties && camera.properties.connectionState == appProperties.AVAILABLE_STATE;
            },

            isMotionActive: function (camera) {
                var result = camera.properties && camera.properties.motionDetected;

                return result;
            },

            isCameraArmed: function (camera) {
                var baseStation = devicesService.getBaseStationById(camera.parentId);

                if (!baseStation || !baseStation.activeMode) {
                    // todo:  is this a bug?
                    // $log.warn("No active mode for base station:" + camera.parentId);
                    return false;
                }
                else {
                    var res1 = camera.properties && camera.properties[appProperties.CAMERA_CONNECTION_STATE]
                        && !(( camera.properties[appProperties.CAMERA_CONNECTION_STATE] ===
                        appProperties.CAMERA_CONNECTION_STATE_UNAVAILABLE)
                        || (camera.properties[appProperties.CAMERA_CONNECTION_STATE] ===
                        appProperties.CAMERA_CONNECTION_STATE_BATTERY_CRITICAL ));

                    var res2 = scheduleValidationService.modeArmsSensor(camera.deviceId, baseStation.activeMode.id);

                    return res1 && res2;
                }
            },

            /*
             Handle events coming from cameras.

             Precondition:  payload as an action property and if action not new a properties property.

             */
            cameraEvent: function (deviceId, payload) {

                if (payload['action'] && payload.action == 'new') {
                    // get the updated device list
                    devicesService.getDevices().then(function () {
                        // todo handle this event appropriately
                    });
                } else if (payload['properties']) {
                    this.setPropertiesOnEvent(deviceId, payload.properties);
                } else if(window["_DEBUG_"]) {
                    throw "called cameraEvent with bad payload:" + JSON.stringify(payload);
                }

            },


            // camerasService.setPropertiesOnEvent(deviceId, payload.properties);

            setPropertiesOnEvent: function (deviceId, properties) {
                $log.debug('Setting camera:' + deviceId + 'properties:' + JSON.stringify(properties));
                var camera = devicesService.getDeviceById(deviceId);
                if (camera) {
                    for (var property in properties) {
                        if (properties.hasOwnProperty(property)) {
                            camera.properties[property] = properties[property];
                        }
                    }
                }
            },

            /*
             calls server to tell it to start recording
             @param {string} deviceId of the camera
             */
            getFullFrameSnapshot: function (deviceId, fullframe) {

                var camera = devicesService.getDeviceById(deviceId);
                if (!camera) {
                    return;
                }

                var config = {
                    method: "POST",
                    url: fullframe ? urlService.getFullFrameSnapshotUrl() : urlService.getUserFrameSnapshotUrl(),
                    timeout: 35000,
                    data: this.createTakeFullFrameSnapshotPayload(camera.parentId, deviceId, fullframe),
                    headers: {Authorization: userService.ssoToken,
                        xcloudId: camera.xCloudId}
                };
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got full frame snapshot response:" + JSON.stringify(result.data));
                        } else {
                            $log.warn("server returned error:" + result.data.data.error + result.data.data.message);
                            return $q.reject(result.data);
                        }
                    });

                return promise;
            },


            /*
             calls server to tell it to start streaming
             @param {string} deviceId the camera deviceId
             */
            startStream: function (deviceId, positionMode) {

                var camera = devicesService.getDeviceById(deviceId);

                var canceller = $q.defer();

                var cancel = function(){
                    canceller.reject({canceled: true});
                };

                var config = {
                    "method": "POST",
                    "url": urlService.getStartStreamUrl(),
                    "timeout": canceller.promise,
                    "data": this.createStartStreamingPayload(camera.parentId, deviceId, positionMode),
                    "headers": {"Authorization": userService.ssoToken,
                        "xcloudId": camera.xCloudId }
                };

                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got startStream response:" + JSON.stringify(result.data));
                            // find and set the device's live stream url property
                            for (var i = 0; i < devicesService.devices.length; i++) {
                                if (devicesService.devices[i].deviceId == deviceId) {
                                    devicesService.devices[i].liveStreamUrl = result.data.data.url;
                                    break;
                                }
                            }

                            return result.data;
                        } else {
                            // $window.alert('Start stream error:' + result.data.data.error + ', ' + result.data.data.message);
                            $log.warn("server returned error:" + result.data.data.error + result.data.data.message);
                            return $q.reject(result.data);
                        }
                    }, function (result) {
                        // $window.alert('Server error, http code:' + result.status);
                        $log.debug("got startStream error:" + JSON.stringify(result.data));
                        return $q.reject(result.data);
                    });

                return {
                    promise: promise,
                    cancel: cancel
                };
            },

            /*
             calls server to tell it to stop streaming
             */
            stopStream: function (deviceId) {

                var camera = devicesService.getDeviceById(deviceId);

                var config = {
                    method: "POST",
                    url: urlService.getStartStreamUrl(),
                    timeout: 15000,
                    data: this.createStopStreamingPayload(camera.parentId, deviceId),
                    headers: {Authorization: userService.ssoToken,
                        xcloudId: camera.xCloudId }
                };
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got stopStream response:" + JSON.stringify(result.data));
                        } else {
                            // $window.alert('Stop stream error:' + result.data.data.error + ', ' + result.data.data.message);
                            $log.warn("server returned error:" + result.data.data.error + result.data.data.message);
                        }
                    });

                return promise;
            },

            /*
             calls server to tell it to start recording
             @param {string} deviceId of the camera
             */
            startRecord: function (camera) {
                var bs = _.findWhere(devicesService.devices, {deviceId: camera.parentId});
                var config = {
                    method: "POST",
                    url: urlService.getStartRecordUrl(),
                    timeout: 35000,
                    data: {
                        parentId: camera.parentId,
                        deviceId: camera.deviceId,
                        olsonTimeZone: bs.properties ? bs.properties.olsonTimeZone : ''
                    },
                    headers: {Authorization: userService.ssoToken,
                        xcloudId: camera.xCloudId}
                };
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got startRecord response:" + JSON.stringify(result.data));
                        } else {
                            // $window.alert('Start recording error:' + result.data.data.error + ', ' + result.data.data.message);
                            $log.warn("server returned error:" + result.data.data.error + result.data.data.message);
                            return $q.reject(result.data);
                        }
                    });

                return promise;
            },


            /*
             calls server to tell it to stop recording
             @param {string} deviceId of camera
             */
            stopRecord: function (deviceId) {
                var camera = devicesService.getDeviceById(deviceId);

                var config = {
                    method: "POST",
                    url: urlService.getStopRecordUrl(),
                    timeout: 35000,
                    data: {parentId: camera.parentId, deviceId: deviceId},
                    headers: {Authorization: userService.ssoToken,
                        xcloudId: camera.xCloudId}
                };
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got stopRecording response:" + JSON.stringify(result.data));
                        } else {
                            // $window.alert('Stop recording error:' + result.data.data.error + ', ' + result.data.data.message);
                            $log.warn("server returned error:" + result.data.data.error + result.data.data.message);
                            return $q.reject(result.data);
                        }
                    });

                return promise;
            },


            /*
             calls server to tell it to start recording
             @param {string} deviceId of camera
             */
            takeSnapshot: function (camera, xcloudId) {
                var bs = _.findWhere(devicesService.devices, {deviceId: camera.parentId});
                var config = {
                    method: "POST",
                    url: urlService.getTakeSnapshotUrl(),
                    timeout: 35000,
                    data: {
                        parentId: camera.parentId,
                        deviceId: camera.deviceId,
                        olsonTimeZone: bs.properties ? bs.properties.olsonTimeZone : ''
                    },
                    headers: {Authorization: userService.ssoToken,
                        xcloudId: camera.xCloudId}
                };
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got takeSnapshot response:" + JSON.stringify(result.data));
                        } else {
                            // $window.alert('Take snapshot error:' + result.data.data.error + ', ' + result.data.data.message);
                            $log.warn("server returned error:" + result.data.data.error + result.data.data.message);
                            return $q.reject(result.data);
                        }
                    });

                return promise;
            },


            /*
             Creates take full frame snapshot payload in the form:

             {
             “from”:”uixxxx”,
             “to”:” basestationDeviceId “,
             “resource”:”cameras/cameraDeviceId”,
             “action”:”set”,
             “transId”:”xxxx”,
             “properties“:{
             “activityState “:“userSnapshot“,
             }

             Checks to see if the camera settings position mode is currently active, and sets
             activityState accordingly (default is normal user stream).
             */
            createTakeFullFrameSnapshotPayload: function (gatewayId, cameraId, fullframe) {
                return {
                    to: gatewayId,
                    from: userService.userId,
                    resource: 'cameras/' + cameraId,
                    action: 'set',
                    responseUrl: "",
                    publishResponse: true,
                    transId: transactionService.createTransactionId(),
                    properties: {
                        activityState: fullframe ? 'fullFrameSnapshot' : 'userSnapshot'
                    }
                };
            },


            /*
             Creates start streaming payload in the form:

             {
             “from”:”uixxxx”,                               [optional and nullable]
             “to”:” basestationDeviceId “,
             "from:" guid,
             “resource”:”cameras/cameraDeviceId”,
             “action”:”set”,
             “transId”:”xxxx”,
             “property“:{
             “activityState “:“stream“,
             “streamurl“:“http://<Wowza Server>/live/tokenId“  [optional]
             }

             Checks to see if the camera settings position mode is currently active, and sets
             activityState accordingly (default is normal user stream).
             */
            createStartStreamingPayload: function (gatewayId, cameraId, positionMode) {
                var activityState = positionMode ? appProperties.CAMERA_SETTINGS_ACTIVITYSTATE_POSITION_MODE : appProperties.CAMERA_SETTINGS_ACTIVITYSTATE_STREAM;

                return {
                    to: gatewayId,
                    from: utilService.guid(),
                    resource: 'cameras/' + cameraId,
                    action: 'set',
                    responseUrl: '',
                    publishResponse: true,
                    transId: transactionService.createTransactionId(),
                    properties: {
                        activityState: activityState
                    }
                };
            },


            /*
             Creates stop streaming payload in the form:

             {
             “from”:”uixxxx”,                               [optional and nullable]
             “to”:” basestationDeviceId “,
             "from:" guid,
             “resource”:”cameras/cameraDeviceId”,
             “action”:”set”,
             “transId”:”xxxx”,
             “property“:{
             “activityState “:“stream“,
             “streamurl“:“http://<Wowza Server>/live/tokenId“  [optional]
             }

             */
            createStopStreamingPayload: function (gatewayId, cameraId) {
                return {
                    to: gatewayId,
                    from: utilService.guid(),
                    resource: 'cameras/' + cameraId,
                    action: 'set',
                    responseUrl: '',
                    publishResponse: true,
                    transId: transactionService.createTransactionId(),
                    properties: {
                        activityState: appProperties.CAMERA_SETTINGS_ACTIVITYSTATE_IDLE
                    }
                };
            },

            getCameraOrder: function () {

                var config = {
                    "method": "GET",
                    "url": urlService.getCameraOrderUrl(),
                    "timeout": 30000,
                    "headers": {"Authorization": userService.ssoToken
                    }
                };

                $log.debug("calling get camera order with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        $log.debug("got camera order result:" + JSON.stringify(result));
                    });

                return promise;
            },

            setCameraOrder: function (cameras) {
                var data = {};
                for (var i = 0; i < cameras.length; i++) {
                    data[cameras[i].deviceId] = cameras[i].displayOrder;
                }

                var config = {
                    "method": "POST",
                    "url": urlService.getCameraOrderUrl(),
                    "timeout": 30000,
                    "headers": {
                        "Authorization": userService.ssoToken
                    },
                    "data": {"devices": data}
                };

                $log.debug("calling set camera order with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        $log.debug("got set camera order result:" + JSON.stringify(result));
                    });

                return promise;
            },

            isPlayActivity: function (state) {
                return [appProperties.CAMERA_SETTINGS_ACTIVITYSTATE_ACTIVESTREAM,
                        appProperties.CAMERA_ACTIVITYSTATE_ALERT_WATCH,
                        appProperties.CAMERA_ACTIVITYSTATE_START_ALERT_STREAM,
                        appProperties.CAMERA_ACTIVITYSTATE_ALERT_STREAM_ACTIVE].indexOf(state) != -1;
            }
        };

    })

    .factory('gatewayPollingService', function ($rootScope, $q, $log, $interval, $state, appProperties, devicesService, userService, notifyService, baseStationService, cameraSettingsService, pushHandlerService, offlineService) {

        var service =
        {

            // delay in milliseconds between polling the different base station user has access to
            pollingInterval: 30000,

            // timeout in milliseconds after which the response handler object for asynchronous calls to the device are deleted.
            responseTimeout: 20000,

            gatewayPollingPromise: null,

            baseStationAlerts: {}
        };

        function deviceOnline(device) {
            // device has just come on line, update all child device settings
            var id = device.deviceId;
            baseStationService.getBaseStationResource(id, 'basestation');
            cameraSettingsService.getBaseStationCameraSettings(id);
            var name = $state.current.name;
            if(name.indexOf("settings") != -1) {
                baseStationService.getBaseStationResource(id, 'modes');
            }
            else if(name.indexOf("cameras") != -1) {
                baseStationService.getBaseStationResource(id, 'modes');
                baseStationService.getBaseStationResource(id, 'rules');
            }
            device.properties['connectionState'] = appProperties.AVAILABLE_STATE;
            baseStationService.rebootingBS[id] = null;
        };

        function deviceOffline(device) {
            var play = false;
            _.each(_.where(devicesService.devices, {parentId: device.deviceId}), function (camera) {
                if(devicesService.uiStateHash[camera.deviceId] && devicesService.uiStateHash[camera.deviceId].play) {
                    play = true;
                }
            });
            //if(play) { return; }

            delete device.modes;
            delete device.activeMode;
            delete device.rules;
            delete device.schedule;
            delete device.scheduleOn;

            _.each(_.where(devicesService.devices, {parentId: device.deviceId}), function (camera) {
                if(!camera.properties) { camera.properties = {}};
                camera.properties.connectionState = appProperties.UNAVAILABLE_STATE;
                devicesService.uiStateHash[camera.deviceId] = {
                    play: false,
                    record: false,
                    micLevel: 0,
                    showBright: false
                };
            });
            device.properties['connectionState'] = appProperties.UNAVAILABLE_STATE;
        };

            /*
             setup polling which gets status of online and offline base stations
             */
            service.start = function () {
                if(window["_ACCOUNT_"]) { return;}

                this.gatewayPollingPromise = $interval(function () {
                    service.runPolling();
                }, this.pollingInterval);
                service.runPolling();
            };

            service.runPolling = function () {
                var resource = 'subscriptions/' + userService.userId;

                // send poll requests to owned base stations
                _.each(devicesService.getBaseStations(), function (baseStation) {
                    // don't poll non-provisioned devices
                    if (baseStation.state != appProperties.PROVISIONED_STATE) return;
                    var devicesList = [];
                    devicesList.push(baseStation.deviceId);
                    var query = notifyService.createDeviceQuery(baseStation.deviceId, 'set', resource, {devices: devicesList});
                    notifyService.notifyBaseStation(query, service.processPollResponse, service.processPollFailure, service.responseTimeout).then(function (result) {
                        if(result.data && result.data.data && result.data.data.error == 2059) {
                            deviceOffline(devicesService.getBaseStationById(result.config.data.to));
                        }
                        //debugger;
                    });
                });

                // send poll requests to friended base stations
                _.each(devicesService.friendedBaseStations, function (device) {
                    var id = device.deviceId;
                    var friendedDevices = devicesService.findByParentId(id);
                    // just sending the device ids
                    var devicesList = _.pluck(friendedDevices, 'deviceId');
                    var query = notifyService.createDeviceQuery(id, 'set', resource, {devices: devicesList});
                    notifyService.notifyBaseStation(query, service.processPollResponse, service.processPollFailure, service.responseTimeout).then(function (result) {
                        if (result.data && result.data.data && result.data.data.error == 2059) {
                            deviceOffline(devicesService.getBaseStationById(result.config.data.to));
                        }
                    });
                });
            };


            service.shutdown = function () {
                $interval.cancel(service.gatewayPollingPromise);
            };

            /*
             Handle response from base station poll.  If device comes back as online, checks value of
             properties.connectionState against possible values 'available' or 'unavailable'

             @param data the json object returned from the gateway device
             */
            service.processPollResponse = function (data) {

                if (!data || !data.from && window["_DEBUG_"]) {
                    throw "No from property in poll response";
                } else if (!offlineService.checkTransId(data)) {
                    return;
                } else {
                    $log.debug('Got poll response from device:' + data.from);
                }

                service.baseStationAlerts[data.from] = null;
                    var device = devicesService.getDeviceById(data.from) || _.findWhere(devicesService.friendedBaseStations, {deviceId: data.from});
                    device.properties || (device.properties = {});
                    if (!device.properties['connectionState'] || device.properties.connectionState != appProperties.AVAILABLE_STATE) {
                        deviceOnline(device);
                    }
            };

            /*
             Handle timeout from base station poll.

             @param data the json object containing the original query sent to gateway device
             */
            service.processPollFailure = function (data) {
                if (!data['to'] && window["_DEBUG_"]) {
                    throw "Expected to in poll query:" + JSON.stringify(data);
                    return;
                }
                if (!offlineService.checkTransId(data)) {
                    return;
                }

                $log.info('Timed out waiting for device:' + data.to + ' to respond, for tansaction:' + data.transId);
                if(_.find(service.baseStationAlerts, function (bs){
                    return bs && bs.restarted == true;
                })) {
                    service.baseStationAlerts = {};
                } else if(!service.baseStationAlerts[data.to]) {
                    service.baseStationAlerts[data.to] = {failed: true};
                }
                if(_.every(service.baseStationAlerts, _.isObject) && _.findWhere(service.baseStationAlerts, {failed: true})) {
                    $log.debug('Restarting SSE and Ping. Offline id: ' + data.to);
                    service.baseStationAlerts[data.to].restarted = true;
                    service.shutdown();
                    pushHandlerService.shutdown();
                    offlineService.init();
                    pushHandlerService.init();
                    service.start();
                    return;
                }
                deviceOffline(devicesService.getDeviceById(data.to) || _.findWhere(devicesService.friendedBaseStations, {deviceId: data.to}));
            };
        return service;
    })

    .factory('baseStationService', function ($rootScope, $q, $http, $log, $window, $interval, $injector, $filter, devicesService, userService, schedulingService, transactionService, notifyService, appProperties, urlService, uiService) {

        return {

            rebootingBS: [],

            // delay in milliseconds between polling the different base station user has access to
            pollingInterval: 30000,

            // timeout in milliseconds after which the response handler object for asynchronous calls to the device are deleted.
            responseTimeout: 10000,

            /*
             Given a base station id returns all the sensors under the base station.
             */
            getAllCamerasOfBaseStation: function (id) {
                return _.filter(devicesService.getAllCameras(), function (camera) {
                    return camera.parentId == id;
                });
            },

            /*
             Determine whether base station connected device is not streaming or otherwise using gateway.

             @param (String) the id of the base station
             @return (Boolean) whether base station is available or not
             */
            isBaseStationAvailable: function (id) {
                var baseStation = devicesService.getDeviceById(id);
                if (!baseStation || !baseStation.properties || !baseStation.properties['connectionState'] || (baseStation.properties['connectionState'] != 'available')) {
                    return false;
                }
                var sensors = this.getAllCamerasOfBaseStation(id);
                return _.every(sensors, function (sensor) {
                    return !sensor.properties['activityState'] || sensor.properties.activityState === 'idle';
                })
            },

            /*
             Handles sse event with resource == 'modes'.  Right now only
             handles setting the active mode.

             @param payload the data coming from the base station
             */
            handleModesEvent: function (payload) {
                if (payload['properties'] && payload.properties['activeMode']) {
                    if (!payload.from && window["_DEBUG_"]) throw "Payload has no from id:" + JSON.stringify(payload);
                    var baseStation = devicesService.getBaseStationById(payload.from);
                    if (!baseStation && window["_DEBUG_"]) throw "Base station not found for id:" + payload.from;
                    var mode = _.findWhere(baseStation.modes, {id: payload.properties.activeMode});
                    if (!mode && window["_DEBUG_"]) throw "Mode not found for id:" + payload.properties.activeMode;

                    baseStation.activeMode = mode;
                }
            },

            isScheduleOn: function (baseStation) {
                return baseStation.scheduleOn;
            },

            /*
             Syncs base station with web server.
             */
            syncBaseStation: function (deviceId) {

                var baseStation = _.findWhere(devicesService.devices, {deviceId: deviceId});
                var xcloudId;
                if (baseStation) {
                    xcloudId = baseStation.xCloudId;
                } else {
                    $log.error('Unable to sync ' + deviceId);
                    var deferred = $q.defer();
                    deferred.reject();
                    return deferred.promise;
                }

                var config = {
                    "method": "POST",
                    "url": urlService.getSyncBaseStationUrl(deviceId),
                    "timeout": 30000,
                    "headers": {"Authorization": userService.ssoToken,
                        "xcloudId": xcloudId
                    }
                };

                $log.debug("calling sync base station with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        $log.debug("got sync base station result:" + JSON.stringify(result));
                    });

                return promise;
            },


            /*
             Gets all base station resources, including schedules, rules, modes.
             */
            getAllResources: function () {
                var promises = [];
                var promise = this.getResource('basestation');
                promises.push(promise);
                promise = this.getResource('schedule');
                promises.push(promise);
                promise = this.getResource('rules');
                promises.push(promise);
                promise = this.getResource('modes');
                promises.push(promise);
                var that = this;

                // combine all promises with the one $q.all promise and return it to controller for
                // resolving
                return $q.all(promises).then(function (results) {
                    for (var i = 0; i < results.length; i++) {
                        // todo
                    }
                });
            },

            /*
             Get a resource, assumes the base station is available.  The order of the resources in the resource
             array is the same as that of the base stations.  Gets resource from the given base station.

             Precondition:  Base station should not be in removed state or deactivated state.

             @param deviceId the device id of the base station to get the resources from
             */
            getBaseStationResource: function (deviceId, resource, successHandler, failureHandler) {
                var query = notifyService.createResourceQuery(deviceId, "get", resource);
                $log.debug("in getResource, query:" + JSON.stringify(query));
                var promise;
                if (arguments.length <= 2) { // no success and failure handlers, use default callbacks
                    promise = notifyService.notifyBaseStation(query, this.attachResource, this.getResourceFailure, this.responseTimeout);
                } else { // success and error callbacks provided
                    promise = notifyService.notifyBaseStation(query, successHandler, failureHandler, this.responseTimeout);
                }

                return promise;
            },

            /*
             Handles case where base station doesn't respond within some period of time.  Maybe display error message to user, but nothing needs to
             be done since only on success is the no resource stored in the reource property of the corresponding device.
             */
            getResourceFailure: function () {

            },

            /*
             Search through the array of baseStations to find the deviceId to which the data response was sent
             from the base station, and attaches the resource from the data response.

             @param data the response data sent back from the base station as part of the notify service response
             @return true or false if the operation was succesful or not
             */
            attachResource: function (data) {
                var baseStation = _.findWhere(devicesService.devices, {deviceId: data.from});
                if (!baseStation) {
                        _.each(data.properties, function (cameraProperties) {
                            var camera = devicesService.getCameraById(cameraProperties.serialNumber);
                            camera && ( camera.properties = cameraProperties);
                        });
                    return;
                }

                if (data.resource == 'basestation') {
                    if (!baseStation.properties) {
                        baseStation['properties'] = data.properties;
                    } else {
                        angular.extend(baseStation.properties, data.properties)
                    }
                    uiService.processBSUpdate(baseStation);
                }
                else {
                    baseStation[data.resource] = data.properties[data.resource];
                    // in case there are watchers/listeners, broadcast the changes
                    // device event message from a gateway device arrived
                }

                switch (data.resource) {
                    case 'modes':
                    {
                        _.each(baseStation.modes, function (mode) {
                            if(mode.name == '*****_DEFAULT_MODE_ARMED_*****') {
                                mode.name = $filter('i18n')('default_mode_armed');
                            }
                            else if(mode.name == '*****_DEFAULT_MODE_DISARMED_*****') {
                                mode.name = $filter('i18n')('default_mode_disarmed');
                            }
                        });
                        baseStation.activeMode = _.findWhere(baseStation.modes, { 'id': data.properties['active']});
                        break;
                    }
                    case 'rules':
                    {
                        _.each(baseStation.rules, function (rule) {
                            if(rule.name.indexOf('**_DEFAULT_RULE_**') != -1) {
                                var name = devicesService.getDeviceName(rule.triggers[0].deviceId);
                                rule.name = $filter('i18n')('default_rule_name').replace("{cameraName}", name);
                            }
                        });
                        break;
                    }
                    case 'schedule':
                    {
                        baseStation.scheduleOn = data.properties['active'];
                        break;
                    }
                }
                if (!baseStation.properties) {
                    baseStation['properties'] = {};
                }
                baseStation.properties.connectionState = 'available';
                $rootScope.$broadcast(appProperties._RESOURCE_UPDATE_);
            },


            /*
             Set the resource for a given base station.

             */
            setResource: function (deviceId, resource, resourceValue, success, failure) {
                var query = notifyService.createResourceQuery(deviceId, "set", resource, resourceValue);
                var promise = notifyService.notifyBaseStation(query, success, failure, this.responseTimeout);
                var that = this;
                promise.then(function (result) {
                    if (result.data.success == true) {
                        // server request successful, device will respond asynchrnously
                        that.setResourceError = false;
                    } else {
                        if (result.data.data) {
                            $log.warn("server returned error:" + result.data.data.error + result.data.data.message);
                        } else {
                            $log.error('Error setting modes, server status ' + result.status);
                        }
                        that.setResourceError = true;
                    }
                });
            },


            /*
             Set a subresource for a given base station.  E.g., one or more camera settings.

             @param deviceId the id of the base station
             @param subresource for instance cameras/camera2
             @param properties an object containing key value pairs, e.g. {flip: true, mirror: true}

             */
            setSubresource: function (deviceId, subresource, properties, success, failure) {
                var query = notifyService.createSubresourceQuery(deviceId, "set", subresource, properties);
                var promise = notifyService.notifyBaseStation(query, success, failure, this.responseTimeout);
                var that = this;
                promise.then(function (result) {
                    if (result.data.success == true) {
                        // server request successful, device will respond asynchrnously
                        that.setSubresourceError = false;
                    } else {
                        if (result.data.data) {
                            $log.warn("server returned error:" + result.data.data.error + result.data.data.message);
                        } else {
                            $log.error('Error setting modes, server status ' + result.status);
                        }
                        that.setSubresourceError = true;
                    }
                });

                return promise;
            },

            /*
             Add a subresource for a given base station.  E.g., create a new rule.

             @param deviceId the id of the base station
             @param subresource for instance rules
             @param properties an object containing key value pairs, individual rule properties

             */
            addSubresource: function (deviceId, subresource, properties, success, failure) {
                var query = notifyService.createSubresourceQuery(deviceId, "add", subresource, properties);
                var promise = notifyService.notifyBaseStation(query, success, failure, this.responseTimeout);
                var that = this;
                promise.then(function (result) {
                    if (result.data.success == true) {
                        // server request successful, device will respond asynchrnously
                        that.addSubresourceError = false;
                    } else {
                        if (result.data.data) {
                            $log.warn("server returned error:" + result.data.data.error + result.data.data.message);
                        } else {
                            $log.error('Error adding sub resource, server status ' + result.status);
                        }
                        that.addSubresourceError = true;
                    }
                });

                return promise;
            },

            /*
             Set the resource for a given base station.

             */
            addResource: function (deviceId, resource, resourceValue, success, failure) {
                var query = notifyService.createResourceQuery(deviceId, "add", resource, resourceValue);
                var promise = notifyService.notifyBaseStation(query, success, failure, this.responseTimeout);
                var that = this;
                promise.then(function (result) {
                    if (result.data.success == true) {
                        // server request successful, device will respond asynchrnously
                        that.addResourceError = false;
                    } else {
                        if (result.data.data) {
                            $log.warn("server returned error:" + result.data.data.error + result.data.data.message);
                        } else {
                            $log.error('Error adding resource, server status ' + result.status);
                        }
                        that.addResourceError = true;
                    }
                });
            },

            /*
             Delete a resource for a given base station.


             this.deleteResource(deviceId, 'modes/' + data, null, this.deleteModeResponseHandler, this.deleteModeErrorHandler);
             this.deleteResource(deviceId, 'rules/' + data, null, this.deleteRuleResponseHandler, this.deleteRuleErrorHandler);

             */
            deleteResource: function (deviceId, resource, resourceId, success, failure) {
                var query = notifyService.createResourceQuery(deviceId, "delete", resource, resourceId);
                var promise = notifyService.notifyBaseStation(query, success, failure, this.responseTimeout);
                var that = this;
                promise.then(function (result) {
                    if (result.data.success == true) {
                        // server request successful, device will respond asynchrnously
                        that.deleteResourceError = false;
                    } else {
                        if (result.data.data) {
                            $log.warn("server returned error:" + result.data.data.error + result.data.data.message);
                        } else {
                            $log.error('Error deleting resource, server status ' + result.status);
                        }
                        that.deleteResourceError = true;
                    }
                });
            },

            /*
             Reboot a resource for a given base station.
             */
            rebootResource: function (deviceId, resource, success, failure) {
                var query = notifyService.createResourceQuery(deviceId, "reboot", resource);
                var promise = notifyService.notifyBaseStation(query, success, failure, this.responseTimeout);
                var that = this;
                promise.then(function (result) {
                    if (result.data.success == true) {
                        // server request successful, device will respond asynchrnously
                        that.rebootResourceError = false;
                    } else {
                        if (result.data.data) {
                            $log.warn("server returned error:" + result.data.data.error + result.data.data.message);
                        } else {
                            $log.error('Error rebooting resource, server status ' + result.status);
                        }
                        that.rebootResourceError = true;
                    }
                });
            },

            createDefaultMode: function () {
                return {
                    name: $filter("i18n")("add_mode_label_title_new"),
                    rules: []
                }
            },

            createDefaultRule: function (deviceId) {
                return {
                    name: $filter("i18n")("rule_label_default_value"),
                    id: 'ruleNew',
                    triggers: [
                        {
                            deviceId: deviceId,
                            type: 'pirMotionActive',
                            sensitivity: 80
                        }
                    ],
                    actions: [
                        {
                            type: 'recordVideo',
                            deviceId: deviceId,
                            stopCondition: {
                                type: 'timeout',
                                timeout: 10
                            }
                            /*
                            stopCondition: {
                             type: 'pirStartVideoMotionEnds',
                             deviceId: deviceId,
                             sensitivity: 50,
                             motionDetectionZone: {
                             topleftx: 0,
                             toplefty: 0,
                             bottomrightx: 1280,
                             bottomrighty: 780
                             }}*/
                        },
                        {
                            type: 'sendEmailAlert',
                            recipients: ["__OWNER_EMAIL__"]
                        }
                    ]
                }
            },


            setSchedule: function (deviceId, data) {
                $log.debug("setting schedule on base station:" + deviceId);
                this.setResource(deviceId, 'schedule', data, this.setScheduleResponseHandler, this.setScheduleErrorHandler);
            },

            /*
             Handles sse event message which is a response from a base station as the result of successfully setting a schedule.
             */
            setScheduleResponseHandler: function (data) {
                if (!(data.action === "is")) { //not expected action
                    // $window.alert("unexpected action in set schedule response");
                } else {
                    var baseStation = devicesService.getBaseStationById(data.from);

                    // attach new schedule
                    baseStation.schedule = data.properties['schedule'];

                    // tell this to all scopes are listening a mode was edited
                    schedulingService.broadcastScheduleEdited();
                }
            },

            /*
             Handles timeout or other condition.
             */
            setScheduleErrorHandler: function () {
                // $window.alert("error setting schedule, please call customer support");
            },

            toggleScheduleOn: function (deviceId, data) {

                $log.debug("setting schedule active property on base station:" + deviceId);
                return this.setSubresource(deviceId, appProperties.DEVICE_SCHEDULE, data, this.toggleScheduleOnResponseHandler, this.toggleScheduleOnErrorHandler);
            },

            /*
             Handles sse event message which is a response from a base station as the result of successfully setting schedule active property.
             */
            toggleScheduleOnResponseHandler: function (data) {
                if (!(data.action === "is")) { //not expected action
                    // $window.alert("unexpected action in set schedule active property response");
                } else {
                    var baseStation = devicesService.getBaseStationById(data.from);

                    baseStation.scheduleOn = data.properties[appProperties.DEVICE_SETTINGS_ACTIVE];
                }
            },

            /*
             Handles timeout or other condition.
             */
            toggleScheduleOnErrorHandler: function () {
                // $window.alert("error setting schedule active, please call customer support");
            },

            /*
             Handles sse event message which is a response from a base station as the result of successfully setting the active mode.
             */
            setActiveModeResponseHandler: function (data) {
                    if (!data.properties || !data.properties.active && window["_DEBUG_"]) {
                        throw "Base station set active mode response does't contain active property";
                    } else {
                        var baseStation = devicesService.getBaseStationById(data.from);
                        baseStation['activeMode'] = _.findWhere(baseStation.modes, {id: data.properties.active});
                    }
            },

            setActiveMode: function (deviceId, data) {
                $log.debug("setting active mode: " + data[appProperties.DEVICE_SETTINGS_ACTIVE]);
                this.setSubresource(deviceId, 'modes', data, this.setActiveModeResponseHandler, this.setActiveModeErrorHandler);
            },

            /*
             Handles timeout or other condition.
             */
            setActiveModeErrorHandler: function () {
                // $window.alert("error setting active mode, please call customer support");
            },


            /*
             Handles sse event message which is a response from a base station as the result of successfully setting a mode.
             */
            setModeResponseHandler: function (data) {
                if (!(data.action === "is")) { //not expected action
                    // $window.alert("unexpected action in set mode response");
                } else {
                    var baseStation = devicesService.getDeviceById(data.from);

                    // detach old mode
                    baseStation.modes = _.reject(baseStation.modes, function (mode) {
                        return mode.id === data.properties.id
                    });

                    // attach new mode
                    baseStation.modes.push(data.properties);

                    // tell this to all scopes are listening a mode was edited
                    schedulingService.broadcastModeEdited();
                }
            },

            setMode: function (deviceId, data) {
                $log.debug("setting mode:" + data.id);
                var baseStation = devicesService.getDeviceById(deviceId);
                var mode = _.findWhere(baseStation.modes, {id: data.id});
                baseStation.modes[baseStation.modes.indexOf(mode)] = data;
                this.setSubresource(deviceId, 'modes/' + data.id, data, this.setModeResponseHandler, this.setModeErrorHandler);
            },

            /*
             Handles timeout or other condition.
             */
            setModeErrorHandler: function (result) {
                $injector.get("baseStationService").getBaseStationResource(result.to, "modes");
            },


            addMode: function (deviceId, data) {
                $log.debug("adding mode:" + data.name);
                this.addSubresource(deviceId, 'modes', data, this.addModeResponseHandler, this.addModeErrorHandler);
            },

            /*
             Handles sse event message which is a response from a base station as the result of successfully adding a mode.
             */
            addModeResponseHandler: function (data) {
                // fixme: action 'new' added for mode add. Is it right?
                if (!(data.action === "new")) { //not expected action
                    // $window.alert("unexpected action in add mode response");
                } else {
                    if (!data.from) {
                        // $window.alert("unexpected no 'from' property in add mode response");
                    } else if (data.hasOwnProperty('error')) {
                        $log.error('got error adding mode:' + JSON.stringify(data.error));
                        // $window.alert('got error adding mode:' + JSON.stringify(data.error));
                    } else {
                        var baseStation = devicesService.getDeviceById(data.from);
                        if(!_.findWhere(baseStation.modes, {id: data.properties.id})) {
                            baseStation.modes.push(data.properties);
                        }
                        schedulingService.editingModeInfo && (schedulingService.editingModeInfo.addingModeId = data.properties.id);
                        // tell this to all scopes are listening a new mode was added
                        schedulingService.broadcastModeAdded();
                    }
                }
            },

            /*
             Handles timeout or other condition.
             */
            addModeErrorHandler: function () {
                // $window.alert("error adding mode, call customer service");
            },

            deleteMode: function (deviceId, data) {
                $log.debug("deleting mode: " + JSON.stringify(data));
                this.deleteModePromise = $q.defer();
                this.deleteResource(deviceId, 'modes/' + data, null, this.deleteModeResponseHandler, this.deleteModeErrorHandler);
                return this.deleteModePromise.promise;
            },

            /*
             Handles sse event message which is a response from a base station as the result of successfully deleting a mode.
             */
            deleteModeResponseHandler: function (data) {
                if (!(data.action === "deleted")) { //not expected action
                    this.deleteModePromise.reject("unexpected action in delete mode response");
                } else {
                    if (!data.from) {
                        this.deleteModePromise.reject("unexpected no 'from' property in delete mode response");
                    }
                    else if (data.error) {
                        this.deleteModePromise.reject(data.error);
                    }
                    else {
                        this.deleteModePromise.resolve(data);
                    }
                }
            },

            /*
             Handles timeout or other condition.
             */
            deleteModeErrorHandler: function () {
                // $window.alert("error deleting mode, call customer service");
                this.deleteModePromise && (this.deleteModePromise.reject("unexpected response in delete mode"));
            },

            setRule: function (deviceId, data) {
                $log.debug("setting rule:" + data.id);
                var baseStation = devicesService.getDeviceById(deviceId);
                var rule = _.findWhere(baseStation.rules, {id: data.id});
                baseStation.rules[baseStation.rules.indexOf(rule)] = data;
                this.setSubresource(deviceId, 'rules/' + data.id, data, this.setRuleResponseHandler, this.setRuleErrorHandler);
            },

            /*
             Handles sse event message which is a response from a base station as the result of successfully setting a rule.
             */
            setRuleResponseHandler: function (data) {

                if (!(data.action === "is")) { //not expected action
                    // .alert("unexpected action in set rule response");
                } else {
                    var baseStation = devicesService.getDeviceById(data.from);
                    var rule = _.findWhere(baseStation.rules, {id: data.properties.id});

                    // update the rule
                    baseStation.rules[baseStation.rules.indexOf(rule)] = data.properties;

                    // tell this to all scopes are listening a rule was edited
                    schedulingService.broadcastRuleEdited();
                }
            },

            /*
             Handles timeout or other condition.
             */
            setRuleErrorHandler: function (result) {
                $injector.get("baseStationService").getBaseStationResource(result.to, "rules");
            },

            addRule: function (deviceId, data) {
                $log.debug("adding rule:" + data.name);
                this.addSubresource(deviceId, 'rules', data, this.addRuleResponseHandler, this.addRuleErrorHandler);
            },

            /*
             Handles sse event message which is a response from a base station as the result of successfully adding a rule.
             */
            addRuleResponseHandler: function (data) {
                if (!(data.action === "new")) { //not expected action
                    // $window.alert("unexpected action in add rule response");
                } else {
                    if (!data.from) {
                        // $window.alert("unexpected no 'from' property in add rule response");
                    } else if (data.hasOwnProperty('error')) {
                        $log.error('got error adding rule:' + JSON.stringify(data.error));
                        // $window.alert('got error adding rule:' + JSON.stringify(data.error));
                    } else {
                        var baseStation = devicesService.getDeviceById(data.from);
                        if(!_.findWhere(baseStation.rules, {id: data.properties.id})) {
                            baseStation.rules.push(data.properties);
                        }
                        schedulingService.editingModeInfo && (schedulingService.editingModeInfo.addingRuleId = data.properties.id);
                        // tell this to all scopes are listening a new rule was added
                        schedulingService.broadcastRuleAdded();
                    }
                }
            },

            /*
             Handles timeout or other condition.
             */
            addRuleErrorHandler: function () {
                // $window.alert("error adding rule, call customer service");
            },

            reboot: function (deviceId) {
                $log.debug("rebooting BS: " + deviceId);
                this.rebootResource(deviceId, 'basestation', this.rebootResponseHandler, this.rebootErrorHandler);
            },

            /*
             Handles sse event message which is a response from a base station as the result of successfully rebooting.
             */
            rebootResponseHandler: function (data) {

                // todo: uncomment when response from BS will have action
                //if (!(data.action === "rebooting")) { //not expected action
                if (data.action) { //not expected action
                    // $window.alert("unexpected action in reboot response");
                }
            },

            /*
             Handles timeout or other condition.
             */
            rebootErrorHandler: function () {
                // $window.alert("error rebooting, call customer service");
            },

            manualUpdate: function (deviceId, version) {
                var query = notifyService.createResourceQuery(deviceId, "manualUpgrade", "basestation");
                query.properties = {"version": version};
                var promise = notifyService.notifyBaseStation(query, function () {}, function () {}, this.responseTimeout);
                var that = this;
                promise.then(function (result) {
                    if (result.data.success == true) {
                        // server request successful, device will respond asynchrnously
                    } else {

                    }
                });
            },

            removeDevice: function (deviceId, cameraId) {
                var config = {
                    "method": "POST",
                    "url": urlService.getRemoveDeviceUrl(),
                    "data": {
                        "parentId": deviceId,
                        "deviceId": cameraId || deviceId
                    },
                    "timeout": 30000,
                    "headers": {"Authorization": userService.ssoToken
                    }
                };

                $log.debug("calling remove camera with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        $log.debug("got remove camera result:" + JSON.stringify(result));
                    });

                return promise;
            },

            setTimeZone: function (deviceId, data) {
                $log.debug("setting time zone:" + data.id);
                this.setSubresource(deviceId, 'basestation', {"timeZone": data.id, "olsonTimeZone": data.location }, this.setTimeZoneResponseHandler, this.setTimeZoneErrorHandler);
            },

            /*
             Handles sse event message which is a response from a base station as the result of successfully setting a mode.
             */
            setTimeZoneResponseHandler: function (data) {
                if (!(data.action === "is")) { //not expected action
                    // $window.alert("unexpected action in set mode response");
                }
            },

            /*
             Handles timeout or other condition.
             */
            setTimeZoneErrorHandler: function () {
                // $window.alert("error setting TimeZone");
            },

            setAutoUpdate: function (deviceId, data) {
                $log.debug("setting autoUpdateEnabled: " + data);
                this.setSubresource(deviceId, 'basestation', {"autoUpdateEnabled": data}, this.setAutoUpdateResponseHandler, this.setAutoUpdateErrorHandler);
            },

            /*
             Handles sse event message which is a response from a base station as the result of successfully setting a mode.
             */
            setAutoUpdateResponseHandler: function (data) {
                if (!(data.action === "is")) { //not expected action
                    // $window.alert("unexpected action in set mode response");
                }
            },

            /*
             Handles timeout or other condition.
             */
            setAutoUpdateErrorHandler: function () {
                // $window.alert("error setting AutoUpdate");
            },

            //Anti Flicker
            setAntiFlickerMode: function (deviceId, data) {
                this.setSubresource(deviceId, 'basestation', {"antiFlicker": {"mode": data}}, this.setAntiFlickerResponseHandler, this.setAntiFlickerErrorHandler);
            },

            setAntiFlickerResponseHandler: function (data) {
                if (!(data.action === "is")) { //not expected action
                    // $window.alert("unexpected action in set mode response");
                }
            },

            setAntiFlickerErrorHandler: function () {
                // $window.alert("error setting AntiFlicker");
            },

            deleteRule: function (deviceId, data) {
                $log.debug("deleting rule: " + data);
                this.deleteResource(deviceId, 'rules/' + data, null, this.deleteRuleResponseHandler, this.deleteRuleErrorHandler);
            },

            /*
             Handles sse event message which is a response from a base station as the result of successfully deleting a Rule.
             */
            deleteRuleResponseHandler: function (data) {
                if (!(data.action === "deleted")) { //not expected action
                    // $window.alert("unexpected action in delete Rule response");
                } else {
                    if (!data.from) {
                        // $window.alert("unexpected no from property in delete Rule response");
                    } else {
                        var baseStation = devicesService.getDeviceById(data.from);
                        // todo: let's not have this length hard-coded, and fix similar with hard-coded 'rules' etc
                        var ruleId = data.resource.split('/')[1];

                        schedulingService.broadcastRuleDeleted();
                    }
                }
            },

            /*
             Handles timeout or other condition.
             */
            deleteRuleErrorHandler: function () {
                // .alert("error deleting Rule");
            },

            /*
             Renames camera or base station
             */
            renameDevice: function (device) {

                var config = {
                    "method": "PUT",
                    "url": urlService.getRenameDeviceUrl(),
                    "data": {
                        "deviceId": device.deviceId,
                        "deviceName": device.deviceName,
                        "parentId": (device.parentId || device.deviceId)
                    },
                    "timeout": 30000,
                    "headers": {"Authorization": userService.ssoToken}
                };
                $log.debug("calling rename device with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        $log.debug("got result:" + JSON.stringify(result));
                    });

                return promise;
            },

            restartBaseStation: function (deviceId) {
                var config = {
                    "method": "POST",
                    "url": urlService.getRestartDeviceUrl(),
                    "data": {
                        "deviceId": deviceId
                    },
                    "headers": {"Authorization": userService.ssoToken }
                };

                $log.debug("calling restart base station with config:" + JSON.stringify(config));
                var promise = $http(config).
                    then(function (result) {
                        $log.debug("got restart base station result: " + JSON.stringify(result));
                        if(!result.data || !result.data.success) {
                            return $q.reject(result.data);
                        }
                    });

                return promise;
            }
        };
    })

    .factory('cameraSettingsService', function ($rootScope, $http, $window, $log, $timeout, devicesService, transactionService, baseStationService, userService, utilService, urlService, appProperties, offlineService) {

        return {

            // holds timeouts for deviceIds of cameras with position mode set to active
            positionModeActive: {},
            gettingCameraSettings: null,

            refreshData: function () {
                devicesService.getDevices();
            },

            /*
             Handles sse event message which is a response from a base station as the result of successfully getting all camera settings.
             */
            getAllCameraSettingsResponseHandler: function (data) {
                this.gettingCameraSettings = false;
                if (!(data.action === "is")) { //not expected action
                    // $window.alert("unexpected action in get all camera settings response");
                } else if(!offlineService.checkTransId(data)) {
                    return;
                }
                else {
                    try {
                        _.each(data.properties, function (cameraProperties) {
                            var camera = devicesService.getCameraById(cameraProperties.serialNumber);
                            camera && ( camera.properties = cameraProperties);
                        });
                    } catch (e) {

                        // try again after syncing base station to server
                        var baseStation = devicesService.getDeviceById(data.from);
                        baseStationService.syncBaseStation(baseStation.deviceId).then(function () {
                            devicesService.getDevices().then(function () {
                                _.each(data.properties, function (cameraProperties) {
                                    var camera = devicesService.getCameraById(cameraProperties.serialNumber);
                                    if (!camera) {
                                        $log.error("No camera found in list from web server corresponding to device from base station with deviceId: " + cameraProperties.deviceId);
                                    } else {
                                        $log.info("Base station synced with backend");
                                        camera.properties = cameraProperties;
                                    }
                                })
                            })
                        })
                    }

                    $rootScope.$broadcast(appProperties._RESOURCE_UPDATE_);
                }
            },

            /*
             Handles timeout or other condition.
             */
            getAllCameraSettingsErrorHandler: function (result) {
                $log.debug("Timeout getting camera settings");
                this.gettingCameraSettings = false;
                var bsId = result && result.to;
                if (!bsId) {
                    return;
                } else if(!offlineService.checkTransId(result)) {
                    return;
                }

                _.each(devicesService.devices, function (device) {
                    if (device && device.deviceType == appProperties.CAMERA_DEVICE_TYPE && device.parentId == bsId) {
                        if (!device.properties) {
                            device.properties = {};
                        }
                        device.properties.connectionState = 'unavailable';
                    }
                });
            },

            /*
             Handles sse event message which is a response from a base station as the result of successfully setting camera settings.
             */
            updateSettingsResponseHandler: function (data) {
                if (!(data.action === "is")) { //not expected action
                    // $window.alert("unexpected action in update camera settings response");
                } else {
                    if (!data.from) {
                        // $window.alert("unexpected no 'from' property in update settings response");
                    } else if (data.hasOwnProperty('error')) {
                        $log.error('got error updating settings:' + JSON.stringify(data.error));
                        // $window.alert('got error updating settings:' + JSON.stringify(data.error));
                        $rootScope.$broadcast('show_error', {
                            data:
                                (data.error.code == 4006 ? {message: 'The camera is busy and can not perform requested action.'} : data.error)
                        });
                    } else {
                        var subresourceString = 'cameras/';
                        if (data.resource.match(/^cameras\//)) {  // else throw error
                            var camera = devicesService.getDeviceById(data.resource.substring(subresourceString.length));
                            for (var property in data.properties) {
                                camera.properties[property] = data.properties[property];
                            }
                            if(data.properties && angular.isNumber(data.properties["brightness"])) {
                                $rootScope.$broadcast(appProperties.appEvents.BRIGHTNESS_UPDATED, camera.deviceId);
                            }
                        }
                        $rootScope.$broadcast(appProperties._RESOURCE_UPDATE_);
                    }
                }
            },

            /*
             Calls notify to update all camera settings of a given base station.

             @param deviceId the deviceId of the base station which came online
             */
            getBaseStationCameraSettings: function (deviceId) {
                $log.info('Base station came on line, getting all camera settings');
                baseStationService.getBaseStationResource(deviceId, 'cameras', this.getBaseStationCameraSettingsResponseHandler, this.getBaseStationCameraSettingsErrorHandler);
            },

            /*
             Handles sse event message which is a response from a base station as the result of successfully getting all camera settings.
             */
            getBaseStationCameraSettingsResponseHandler: function (data) {
                if (!(data.action === "is")) { //not expected action
                    // $window.alert("unexpected action in get all camera settings response");
                } else {
                    try {
                        _.each(data.properties, function (cameraProperties) {
                            var camera = devicesService.getCameraById(cameraProperties.serialNumber);
                            camera && (camera.properties = cameraProperties);
                        });
                    } catch (e) {
                        // try again after syncing base station to server
                        var baseStation = devicesService.getDeviceById(data.from);
                        baseStationService.syncBaseStation(baseStation.deviceId).then(function () {
                            devicesService.getDevices().then(function () {
                                _.each(data.properties, function (cameraProperties) {
                                    var camera = devicesService.getCameraById(cameraProperties.serialNumber);
                                    if (!camera) {
                                        $log.error("No camera found in list from web server corresponding to device from base station with deviceId: " + cameraProperties.deviceId);
                                    } else {
                                        $log.info("Base station synced with backend");
                                        camera.properties = cameraProperties;
                                    }
                                })
                            })
                        })
                    }

                    $rootScope.$broadcast(appProperties._RESOURCE_UPDATE_);
                }
            },

            /*
             Handles timeout or other condition.
             */
            getBaseStationCameraSettingsErrorHandler: function () {
                // $window.alert("error getting camera settings, please call customer support");
            },

            /*
             This method updates any number of settings on the camera device.

             @param deviceId the device id of the base station
             @param settings a list of one or more key value pair properties to be set for the camera
             */
            updateSettings: function (deviceId, cameraId, settings) {
                $log.debug("updating camera settings");
                var promise = baseStationService.setSubresource(deviceId, 'cameras/' + cameraId, settings,
                    this.updateSettingsResponseHandler, this.updateSettingsErrorHandler);

                return promise;
            },

            /*
             Handles timeout or other condition.
             */
            updateSettingsErrorHandler: function (result) {
                // $window.alert("error updating camera settings, please call customer support");
            },

            /*
             Tells whether or not camera is in position mode.

             @param deviceId the string value of the device id
             @return boolean true or false
             */
            isPositionMode: function (deviceId) {
                return this.positionModeActive[deviceId];
            },

            /*
             Sets position mode on.  After setting on, sets timer to turn off after specified
             amount of time.  Used by camera service when streaming camera to use the special position
             stream mode to stream.
             */
            togglePositionMode: function (deviceId) {
                if(this.isPositionMode(deviceId)) {
                    $timeout.cancel(this.positionModeActive[deviceId]);
                    this.positionModeActive[deviceId] = null;
                }
                else {
                    var that = this;
                    this.positionModeActive[deviceId] = $timeout(function () {
                        that.positionModeActive[deviceId] = null;
                    }, 5*60000);
                }
            }
        };
    })


    /*
     Handles billing flow logic, directs the presentation of quotations, and calls the
     different change plan methods of servicePlanService.

     */
    .factory('billingFlowService', function ($q, $state, $rootScope, $modal, $log, appProperties, servicePlanService, setupService, utilService) {

        return {

            params: null,
            inProgress: false,

            /*
             Monolithic billing event processing method.   Presents payment confirmation dialog and then on confirm
             attempts to make the payment.

             @param fromPlanId:  the old plan id
             @param toPlanId:  the selected plan id to purchase
             @param freePlanId the free plan id for reference in making correct backend call
             */
            processBillingEvent: function (params) {

                var showProgress = true;
                var defer = $q.defer(); //defer.resolve(quotation) : defer.reject({cancel : true});
                this.params = params;

                    var that = this;
                    this.inProgress = showProgress;
                    this.makePayment().then(function () {
                        // reset these on success
                        that.params = null;
                        that.inProgress = false;
                        return defer.resolve();
                    }, function (result) { // either no payment information, error making payment or user cancelled
                        $log.debug('Billing error: ' + JSON.stringify(result));
                        that.inProgress = false;
                        var error;
                        if(result && result.error) {
                            error = {data: result};
                        }
                        if(result && result.data) {
                            error = result;
                        }

                        return defer.reject(error);
                    });

                return defer.promise;
            },

            /*
             Calls the appropriate change plan method in servicePlanService.  In most cases this will
             result in a payment but in some a refund (for cancel service call).  If there is no billing
             information attempts to capture the billing information by transitioning to billing information
             view.

             */
            makePayment: function () {
                var deferred = $q.defer();
                var that = this;
                        this.handleQuotation().then(function () {
                            servicePlanService.changePlan(that.params).then(function () {
                                $log.info('payment or refund successful');
                                return deferred.resolve();
                            }, function (result) {
                                $log.info('payment or refund FAILED');
                                return deferred.reject(result.data);
                            });
                        }, function (result) { // user did not confirm payment
                            if (setupService.setupPending) {
                                // make sure no plan is selected as the user clicked cancel
                                setupService.servicePlanSelected = null;
                                //$state.go('servicePlan');
                            }
                            return deferred.reject(result);
                        });

                return deferred.promise;
            },


            /*
             Determines what type of quotation to display, if any.  Transitions to next
             state based on if there is a quotation, quotation type, and response to quotation
             dialog.
             */
            handleQuotation: function () {
                var deferred = $q.defer();
                    var that = this;
                    servicePlanService.getQuotation(this.params).then(function (quotation) {
                            var style = quotation.html.match(/<\s*style[^>]*>.*?<\s*\/style>/)[0];
                            var body = quotation.html.match(/<\s*body[^>]*>(.*?)<\s*\/body>/)[1];

                            var template = 'partials/confirmPaymentDialog.html';
                            if (that.params.cancel) {
                                template = 'partials/confirmCancelPlanDialog.html';
                            }
                            var pre = window["_ACCOUNT_"] ? "AcctMgr_":"";
                            utilService.gaSend(pre + (that.params.cancel ? "Subscription_CancelServiceQuote_web": "Subscription_ChangeServiceQuote_web"));
                            var modalInstance = $modal.open({
                                template: style + body,
                                windowTemplateUrl: template,
                                backdrop: 'static'
                            });
                            //   User confirmed the payment.
                            modalInstance.result.then(function (result) {
                                $log.info('Quotation confirm closed');
                                return result == 'ok' ? deferred.resolve(quotation) : deferred.reject({cancel : true});
                            }, function (result) {
                                that.inProgress = false;
                                return deferred.reject();
                            });

                        },
                        function (result) {
                            return deferred.reject(result);
                        });

                return deferred.promise;
            }
        }
    })


    /*
     Service used by service selection and billing controllers.

     */
    .factory('servicePlanService', function ($log, $window, $http, $q, $filter, appProperties, urlService, userService, setupService) {

        return {

            // list of service plan offerings
            servicePlans: null,

            // default plan id
            freePlanId: null,

            // the service plan the user selected in select service plan view
            selectedServicePlan: null,

            // all plans and addons user has purchased
            purchasedPlans: null,

            // save promise for getting offers
            getOffersPromise: null,

            // the billing info for user
            billingInfo: null,

            // payment id per user needed by billing provider to make payments
            paymentId: null,

            // set electronic coupons here
            coupons: [],

            isFreePlan: function (servicePlan) {
                return servicePlan.planType === appProperties.FREE_PLAN_TYPE;
            },

            isPaidServicePlan: function (servicePlan) {
                return servicePlan.planType === appProperties.PAID_PLAN_TYPE;
            },

            isStoragePlan: function (servicePlan) {
                return servicePlan.planType === appProperties.STORAGE_PLAN_TYPE;
            },

            /*
             Gets list of service plan offerings
             */
            getOffers: function () {

                var config = {
                    method: "GET",
                    url: urlService.getOffersUrl(),
                    timeout: 30000,
                    headers: {Authorization: userService.ssoToken ? userService.ssoToken : ""}
                };
                $log.debug("calling get service plan offers with config:" + JSON.stringify(config));
                var that = this;
                // initial GET call to get the device id
                var promise = $http(config).then(function (result) {
                    if (result.data.success == true) {
                        that.servicePlans = $filter('orderBy')(result.data.data,["-groupNumber", "-amount"]);
                        var freePlan = _.find(that.servicePlans, function (servicePlan) {
                            return that.isFreePlan(servicePlan);
                        });
                        that.freePlanId = freePlan.planId;
                    } else {
                        console.log('  get offers  result  =', result);
                        $log.warn("Get offers error:" + result.data.data.code + result.data.data.message);
                        return $q.reject(result.data);
                    }
                });

                return promise;
            },

            getOffersV1: function () {

                var config = {
                    method: "GET",
                    url: urlService.getOffersV1Url(),
                    timeout: 30000,
                    headers: {Authorization: userService.ssoToken ? userService.ssoToken : ""}
                };
                $log.debug("calling get service plan offers with config:" + JSON.stringify(config));
                var that = this;
                // initial GET call to get the device id
                var promise = $http(config).then(function (result) {
                    if (result.data.success == true) {
                        return result.data;
                    } else {
                        $log.warn("Get offers error:" + result.data.data.code + result.data.data.message);
                        return $q.reject(result.data);
                    }
                });

                return promise;
            },

            /*
             Gets list of service plan offerings
             */
            getOffersDetails: function () {

                var config = {
                    method: "GET",
                    url: urlService.getOffersDetailsUrl(),
                    headers: {Authorization: userService.ssoToken ? userService.ssoToken : ""}
                };
                $log.debug("get offers detail with config: " + JSON.stringify(config));
                var that = this;
                // initial GET call to get the device id
                var promise = $http(config).then(function (result) {
                    if (result.data.success == true) {
                        return result.data;
                    } else {
                        return $q.reject(result.data);
                    }
                });

                return promise;
            },

            /*
             Gets all the purchased plans from server.
             */
            getPurchasedPlans: function () {
                var config = {
                    method: "GET",
                    url: urlService.getServicePlanUrl(),
                    timeout: 30000,
                    headers: {Authorization: userService.ssoToken}
                };
                $log.debug("calling get service plan with config:" + JSON.stringify(config));
                var that = this;

                // initial GET call to get the device id
                var promise = $http(config).then(function (result) {
                    if (result.data.success == true) {
                        that.purchasedPlans = result.data.data;
                    }
                    else {
                        return $q.reject(result.data);
                    }
                });

                return promise;
            },


            /*
             Gets the currently active purchased or free plan.  Searchses through the array of purchasedObjects to find
             the plan.  The plan is either of planType 'SERVICE' or 'BASIC'.  If there is neither type then should be
             friend user without own cameras.
             */
            getServicePlan: function () {
                if (!this.purchasedPlans) {
                    // return _.findWhere(this.servicePlans, {planType: appProperties.FREE_PLAN_TYPE});
                    return null;
                }
                var plans = _.filter(this.purchasedPlans, function (plan) {
                    return plan['planType'] &&
                        (plan['planType'] === appProperties.FREE_PLAN_TYPE || plan['planType'] === appProperties.PAID_PLAN_TYPE)
                });

                if (plans.length == 0) {
                    return null;
                } else if (plans.length > 1) {
                    return _.findWhere(plans, {planType: appProperties.PAID_PLAN_TYPE});
                } else {
                    return plans[0];
                }
            },

            getStorageServicePlan: function () {
                if (!this.purchasedPlans) {
                    return null;
                }
                var plans = _.filter(this.purchasedPlans, function (plan) {
                    return plan['planType'] && plan['planType'] === appProperties.STORAGE_PLAN_TYPE;
                });

                if (plans.length == 0) {
                    return null;
                } else if (plans.length > 1) {
                    // throw "Can not have more than one plan"
                    $log.warn('More than one storage plan returned from get purchased plans');
                    return _.findWhere(plans, {planType: appProperties.STORAGE_PLAN_TYPE});
                } else {
                    return plans[0];
                }
            },


            /*
             Gets billing from billing service for given planId.
             */
            getBilling: function () {
                var config = {
                    method: "GET",
                    url: urlService.getPaymentBillingUrl(this.paymentId || userService.paymentId),
                    timeout: 30000,
                    headers: {Authorization: userService.ssoToken ? userService.ssoToken : "",
                        "Content-Type": "application/json"}
                };
                $log.debug("calling get billing with config:" + JSON.stringify(config));
                var that = this;

                var promise = $http(config).then(function (result) {
                    if (result.data.success == true) {
                        that.billingInfo = result.data.data;
                        return result.data.data;
                    } else {
                        // $window.alert('Get billing error:' + result.data.code + ', ' + result.data.message);
                        $log.warn("server returned error:" + result.data.code + result.data.message);
                        return $q.reject(result.data);
                    }
                });

                return promise;
            },


            /*
             Modify billing with billing service for given planId.

             @param: billingData, as per hmsweb api wiki:
             http://kira.netgear.com/projects/phoenix/wiki/Phoenix_Plan_Management#Modify-Billing

             */
            modifyBilling: function (billingData) {
                var config = {
                    method: "PUT",
                    data: billingData,
                    url: urlService.getModifyBillingUrl(this.paymentId || userService.paymentId),
                    timeout: 30000,
                    headers: {Authorization: userService.ssoToken ? userService.ssoToken : "",
                        "Content-Type": "application/json"}
                };
                $log.debug("calling modify billing with config:" + JSON.stringify(config));
                var that = this;

                var promise = $http(config).then(function (result) {
                    if (result.data.success == true) {
                        $log.info('Successfully modified billing data');
                        // that.billingInfo = result.data.data;
                    } else {
                        //$window.alert('Get billing error:' + result.data.code + ', ' + result.data.message);
                        $log.warn("server returned error:" + result.data.data.code + result.data.data.message);
                        return $q.reject(result.data);
                    }
                    return result;
                });

                return promise;
            },


            /*
             Creates free plan account on billing service.

             DEPRECATED to be removed
             */
            createAccount: function (planId, modelId) {

                var planData = {
                    planId: planId,
                    modelId: modelId
                };

                var config = {
                    method: "POST",
                    url: urlService.getCreatePaymentAccountUrl(),
                    data: planData,
                    timeout: 30000,
                    headers: {Authorization: userService.ssoToken ? userService.ssoToken : ""}
                };
                $log.debug("calling create free service plan with config:" + JSON.stringify(config));
                var that = this;

                // initial GET call to get the device id
                var promise = $http(config).then(function (result) {
                    if (result.data.success == true) {
                        return result.data.data;
                    } else {
                        // $window.alert('Create free service plan error:' + result.data.code + ', ' + result.data.message);
                        $log.warn("server returned error:" + result.data.code + result.data.message);
                    }
                });

                return promise;
            },


            /*
             Gets quotation from billing service for given planIds.
             */
            getQuotation: function (params) {
                var data = {}, url;
                if (!params.cancel) {
                    if(params.setupPlan) {
                        data.planIds = [params.setupPlan.planId];
                        if(params.setupPlan.couponCode) {
                            data.coupons = [params.setupPlan.couponCode];
                        }
                    }
                    else {
                        data = {
                            planIds: params.toPlanId,
                            coupons: this.coupons
                        };
                    }
                    url = urlService.getChangeQuotationUrl(this.paymentId || userService.paymentId);
                }
                else {
                    url = urlService.getCancelQuotationUrl(this.paymentId || userService.paymentId);
                }

                var config = {
                    method: "POST",
                    url: url,
                    data: data,
                    timeout: 30000,
                    headers: {Authorization: userService.ssoToken ? userService.ssoToken : ""}
                };
                $log.debug("calling get quotation with config:" + JSON.stringify(config));
                var that = this;

                // initial GET call to get the device id
                var promise = $http(config).then(function (result) {
                    if (result.data.success == true) {
                        return result.data.data;
                    } else {
                        // $window.alert('Get quotation error:' + result.data.code + ', ' + result.data.message);
                        $log.warn("server returned error: " + JSON.stringify(result.data));
                        return $q.reject(result.data);
                    }
                });

                return promise;
            },


            /*
             Changes plan with billing service for given planId.   Current implementation is a facade for the four different
             change plan api calls on hmsweb.  The different requirements of these four apis are as follows:

             - create plan:  POST /users/payment/plans/{paymentId}
             {
             planId: planId,
             serialNumber: serialNumber,
             coupon: coupon // optional
             }
             - change plan:  PUT /users/payment/plans/{paymentId}
             {
             newPlanId: planId,
             serialNumber: serialNumber,
             coupon: coupon // optional
             }
             - renew plan:  POST /users/payment/plans/{paymentId}/renew
             {
             planId: planId
             }

             - cancel plans:  PUT /users/payment/plans/{paymentId}/cancel
             {
             planId: planId
             }

             The four different server apis differ in the request method, request body and the url.
             If the input parameters are not valid, an error is thrown.
             */
            changePlan: function (params) {
                var data = {}, url;
                if(!params.cancel) {
                    if(params.setupPlan) {
                        data.planIds = [params.setupPlan.planId];
                        if(params.setupPlan.couponCode) {
                            data.coupons = [params.setupPlan.couponCode];
                        }
                    }
                    else {
                        if (!params.toPlanId.length) {
                            var ar = [];
                            ar.push(params.toPlanId);
                            params.toPlanId = ar;
                        }
                        data = {
                            planIds: params.toPlanId,
                            coupons: this.coupons
                        };
                    }
                    url = urlService.getChangePlanUrl(this.paymentId || userService.paymentId);
                }
                else {
                    url = urlService.getCancelPlanUrl(this.paymentId || userService.paymentId);
                }
                var config = {
                    method: 'PUT',
                    url: url,
                    data: data,
                    timeout: 30000,
                    headers: {Authorization: userService.ssoToken ? userService.ssoToken : ""}
                };
                $log.debug("calling changePlan with config:" + JSON.stringify(config));
                var that = this;
                var promise = $http(config).then(function (result) {
                    if (result.data.success == true) {
                        return result.data.success;
                    } else {
                        $log.warn("server returned error: " + JSON.stringify(result.data));
                        return $q.reject(result.data);
                    }
                });

                return promise;
            },

            changeRenew: function (renew) {
                var config = {
                    method: "PUT",
                    data: {
                        "autoRenew": renew
                    },
                    url: urlService.getPaymentRenewUrl(this.paymentId || userService.paymentId),
                    timeout: 30000,
                    headers: {Authorization: userService.ssoToken ? userService.ssoToken : "",
                        "Content-Type": "application/json"}
                };
                $log.debug("calling modify renew with config:" + JSON.stringify(config));
                var that = this;

                var promise = $http(config).then(function (result) {
                    if (result.data.success == true) {
                        $log.info('Successfully modified renew');
                    } else {
                        $log.warn("Modify renew error, server returned: " + result.data.data.code + result.data.data.message);
                        return $q.reject(result.data);
                    }
                    return result;
                });

                return promise;
            }
        };
    })

    .factory('devicesService', function ($rootScope, $http, $log, $window, $q, $filter, $injector, localStorage, appProperties, setupService, urlService, loginService, userService) {

        return {
            // the list of registered devices (in database) for this user
            devices: null,
            allDevices: [],

            // friend base station ids, found from friended devices, always updated in getDevices call
            friendedBaseStations: [],

            // the list of registered and unregistered devices on the xCloud
            presentDevices: null,

            // hash for last camera time
            lastTimeHash: {},

            // hash of uiState of cameras
            uiStateHash: {},

            getDevicesPromise: null,
            initDevicesPromise: null,

            // calls server for list of registered and unregistered device Id's associated with this IP number
            queryPresentDevices: function () {

                var config = {
                    "method": "GET",
                    "url": urlService.getQueryPresentDevicesUrl(),
                    "timeout": 30000,
                    "headers": {"ContentType": "application/json"}
                };
                $log.debug("calling query present devices with config:" + JSON.stringify(config));
                var that = this;

                // initial GET call to get the device id
                var promise = $http(config).then(function (result) {
                    if (result.data.success == true) {
                        that.presentDevices = result.data.data.items;
                        // save the token for the system setup service
                        // setupService.registrationToken = result.data.data.registrationToken;
                    } else {
                        //$window.alert('Query present devices error:' + data.code + ', ' + data.message);
                        $log.warn("server returned error:" + result.data.data.code + result.data.data.message);
                        return $q.reject(result.data);
                    }
                });

                return promise;
            },

            // attempts to claim the device from server
            claimDevice: function (xCloudId, deviceId, timeZoneCtrl) {

                var timeZone = angular.copy(timeZoneCtrl);
                // remove attributes server can't handle
                if (timeZone.ui) {
                    delete timeZone.ui;
                }
                if (setupService['timeZone'] && setupService.timeZone.ui) {
                    delete setupService.timeZone.ui;
                }

                var config = {
                    method: "POST",
                    url: urlService.getClaimDeviceUrl(),
                    data: {xCloudId: xCloudId || setupService.selectedBaseStation._id,
                        deviceId: deviceId || setupService.selectedBaseStation.hardwareId,
                        timeZone: timeZone || setupService.timeZone},
                    timeout: 30000,
                    headers: {Authorization: userService.ssoToken}
                };
                $log.debug("calling claim device with config:" + JSON.stringify(config));
                var that = this;

                var promise = $http(config).then(function (result) {
                    if (result.data.success == true) {
                        setupService.baseStationClaimed = true;
                        if(!userService.paymentId) {
                            userService.setPaymentId(result.data.data.paymentId);
                        }
                    } else {
                        // $window.alert('Claim base station error:' + result.data.code + ', ' + result.data.message);
                        $log.warn("server returned error:" + result.data.code + result.data.message);
                        return $q.reject(result.data);
                    }
                });

                return promise;
            },


            // calls server for list of registered device ids
            getDevices: function (loadLastDate) {
                if (this.getDevicesPromise) {
                    return this.getDevicesPromise;
                }

                var config = {
                    "method": "GET",
                    "url": urlService.getDevicesUrl() + '?t=' + (new Date().getTime().toString()),
                    "timeout": 35000,
                    "headers": {"Authorization": userService.ssoToken}
                };
                $log.debug("getting devices, config:" + JSON.stringify(config));
                // var uri = urlService.getDevicesUrl();
                var that = this;
                this.getDevicesPromise = $http(config).
                    then(function (result) {
                        that.getDevicesPromise = null;
                        if(result.data && result.data.success) {
                            that.parseGetDevicesResponse(result.data, loadLastDate);
                            that.extractFriendedBaseStations();
                        }
                        else {
                            $log.error("get devices error, server returned: " + JSON.stringify(result.data));
                            result && result.data &&  result.data.data.message && ($rootScope.$broadcast('show_error', result.data));
                            return $q.reject(result.data);
                        }
                    }, function (result) {
                        that.getDevicesPromise = null;
                        return $q.reject(result.data);
                    });

                return this.getDevicesPromise;
            },

            initDevices: function (loadLastDate) {
                if(this.devices) {
                    return $q.when(1);
                }
                if (this.initDevicesPromise) {
                    return this.initDevicesPromise;
                }
                var that = this;
                this.initDevicesPromise = this.getDevices(loadLastDate).then(
                    function () {
                        $injector.get('gatewayPollingService').start();
                    }
                )["finally"](function () {
                    that.initDevicesPromise = null;
                });
                return this.initDevicesPromise;
            },

            getBaseStations: function () {
                return _.filter(this.devices, function (bs) {
                    return bs.deviceType == appProperties.BASE_STATION_DEVICE_TYPE && (bs.state == appProperties.PROVISIONED_STATE || bs.state == appProperties.SYNCED_STATE);
                });
            },

            getBaseStationById: function (id) {
                return _.findWhere(this.devices, {deviceId: id});
            },

            /*
             Creates array of device Id's for the friended base stations as found in devices list.
             */
            extractFriendedBaseStations: function () {
                var that = this;
                var result = _.reduce(this.devices, function (memo, device) {
                    if (device.parentId && !_.findWhere(that.devices, {deviceId: device.parentId}) && !_.contains(memo, device.parentId)) {  // friended camera
                        memo.push(device.parentId);
                    }
                    return memo;
                }, []);
                this.friendedBaseStations = _.map(result, function (id) {
                    return { deviceId: id, properties: {}};
                });
            },

            /*
             Checks if currently logged in user has access to their own cameras or base stations.
             */
            hasOwnDevices: function () {
                return _.some(this.devices, function (device) {
                    return device.userId === device.owner.ownerId;
                })
            },

            /*
            Checks if all devices have userRole === 'USER'
            */
            isPureUser: function () {
                return _.every(this.devices, function (device) {
                    return device.userRole === 'USER';
                })
            },

            updateLastDate: function (camera) {
                var config = {
                    "method": "GET",
                    "url": camera.presignedLastImageUrl,
                    "timeout": 30000
                };
                var that = this;
                $http(config).then(
                    function (result) {
                        if (result.headers('Last-Modified')) {
                            that.lastTimeHash[camera.deviceId] = new Date(result.headers('Last-Modified')).getTime();
                        }
                    },
                    function () {
                        that.lastTimeHash[camera.deviceId] = camera.lastModified;
                    }
                );
            },

            // calls server to get a single device
            getDevice: function (id) {

                var config = {
                    "method": "GET",
                    "url": urlService.getDevicesUrl(id),
                    "timeout": 5000,
                    "headers": {"Authorization": userService.ssoToken}
                };
                $log.debug("getting device, config:" + JSON.stringify(config));
                // var uri = urlService.getDevicesUrl();
                var that = this;
                var promise = $http(config).
                    then(function (result) {
                        that.parseGetDeviceResponse(result.data);
                    });

                return promise;
            },

            /* Return all devices attached to given base station.

             */
            getBaseStationDevices: function (deviceId) {
                // just return the device for this id if it's a gateway device
                // todo:  commented out following line as it was incorrect does this break other parts
                // if (!this.getDeviceById(deviceId).parentId) return new Array(deviceId);

                return _.filter(this.devices, function (device) {
                    return device.parentId == deviceId
                })
            },

            parseGetDevicesResponse: function (data, loadLastDate) {
                if (data.success == true) {
                    if(data.data.length) {
                        // fixme: remove when hmswed stopped return wrong updateAvailable
                        _.each(data.data, function (dev) {
                            if(dev && !dev.properties) { dev.properties = {}}

                            if(dev && dev.properties && dev.deviceType == "basestation") {
                                delete dev.properties.updateAvailable;
                                delete dev.properties.timeZone;
                                delete dev.properties.olsonTimeZone;
                            }
                        });
                    }
                    if(data.data.length < this.allDevices.length) {
                        this.allDevices = _.filter(this.allDevices, function(device){
                            return _.findWhere(data.data, {deviceId: device.deviceId});
                        });
                    }
                    _.each(data.data, function (device) { // fix properties on incoming objects ...
                        if(device.deviceType == 'basestation' && device.state == appProperties.DEACTIVATED_STATE) {
                            var bs = _.findWhere(this.allDevices, {deviceId: device.deviceId});
                            if(bs) {
                                bs.state = appProperties.DEACTIVATED_STATE;
                            }
                            return;
                        }
                        var currentDevice = _.findWhere(this.allDevices, {deviceId: device.deviceId});
                        // fix the incoming device object to have the properties obtained from base station
                        if(!currentDevice) {
                            this.allDevices.push(device);
                        }
                        else {
                            //angular.extend(currentDevice, device);
                            for (var property in device) {
                                if (property == 'properties') {
                                    delete device[property].olsonTimeZone;
                                    angular.extend(currentDevice[property], device[property]);
                                }
                                else if (device.hasOwnProperty(property)) {
                                    currentDevice[property] = device[property];
                                }
                            }
                        }
                    }, this);
                    this.devices = $filter('orderBy')(_.filter(this.allDevices, function (device) {
                        return device.state != appProperties.REMOVED_STATE && device.state != appProperties.DEACTIVATED_STATE;
                    }), "displayOrder");
                    if (this.devices && this.devices.length) {
                        for (var i = 0; i < this.devices.length; ++i) {
                            if (this.devices[i].deviceType === 'camera') {
                                this.uiStateHash[this.devices[i].deviceId] =
                                {
                                    play: false,
                                    record: false,
                                    micLevel: 0,
                                    showBright: false
                                };
                                loadLastDate && (this.updateLastDate(this.devices[i]));
                            }
                        }
                    }
                    //$injector.get('libraryService').setCameras(this.getAllCameraIds());
                    $log.debug("got devices:" + JSON.stringify(data));
                } else {
                    $log.warn('Error:' + data.code + ', ' + data.message);
                    // $window.alert('Error:' + data.code + ', ' + data.message);
                }
            },

            parseGetDeviceResponse: function (data) {
                if (data.success == true) {
                    var device = this.getDeviceById(data.data.deviceId);

                    if (device) { // update if device already present
                        for (var property in data.data) {
                            if (property == 'properties') {
                                angular.extend(device[property], data.data[property]);
                            }
                            else if (data.data.hasOwnProperty(property)) {
                                device[property] = data.data[property];
                            }
                        }
                    } else { // add new device device not present (this is an error)
                        $log.warn('adding device which was not present!');
                        if (data.data.deviceType === 'camera') {
                            this.uiStateHash[data.data.deviceId] = {
                                play: false,
                                record: false,
                                micLevel: 0,
                                showBright: false
                            };
                        }
                        this.devices.push(data.data);
                    }
                    this.updateLastDate(device || this.getDeviceById(data.data.deviceId));
                    $log.debug("got device:" + JSON.stringify(data));
                } else {
                    $log.warn('Error: ' + data.data.code + ', ' + data.data. message);
                    $rootScope.$broadcast('show_error', data);
                    // $window.alert('Error:' + data.code + ', ' + data.message);
                }

            },


            /*
             Returns all of the cameras.
             @return an array containing devices of camera type
             */
            getAllCameras: function () {
                if (this.devices) {
                    return _.where(this.devices, {
                        deviceType: appProperties.CAMERA_DEVICE_TYPE,
                        state: appProperties.PROVISIONED_STATE
                    });
                }

                return [];
            },

            /*
             Returns all of the owned cameras.

             @return an array containing devices of camera type
             */
            getOwnCameras: function () {
                return _.filter(this.devices, function (device) {
                    return device.deviceType == appProperties.CAMERA_DEVICE_TYPE
                        && device.userId === device.owner.ownerId;
                })
            },

            // returns array of all camera ids
            getAllCameraIds: function () {
                var result = [];
                if (this.allDevices) {
                    for (var i = 0; i < this.allDevices.length; i++) {
                        if (this.allDevices[i].deviceType == appProperties.CAMERA_DEVICE_TYPE) {
                            result.push(this.allDevices[i].deviceId);
                        }
                    }
                }

                return result;
            },

            // returns array of cameras has any records
            getAvailableCameraIds: function () {
                var result = [];
                if (this.allDevices) {
                    for (var i = 0; i < this.allDevices.length; i++) {
                        if ((this.allDevices[i].deviceType == appProperties.CAMERA_DEVICE_TYPE && this.allDevices[i].state == appProperties.PROVISIONED_STATE) ||
                            (this.allDevices[i].deviceType == appProperties.CAMERA_DEVICE_TYPE && this.allDevices[i].mediaObjectCount)) {
                            result.push(this.allDevices[i].deviceId);
                        }
                    }
                }
                return result;
            },

            // returns string device name given string device id
            getDeviceName: function (deviceId) {
                var device = this.getDeviceById(deviceId);
                return device ? device.deviceName : '';
            },

            /*
             Returns array of all devices whose parent id is the given one.

             @param deviceId a string containing the parent (e.g. gateway device) id servial number
             */
            findByParentId: function (deviceId) {
                return _.where(this.devices, { parentId: deviceId});
            },

            // return the device object for the given device id
            getDeviceById: function (deviceId) {
                return _.findWhere(this.allDevices, {deviceId: deviceId});
            },

            // return the camera device object for the given device id
            getCameraById: function (deviceId) {
                return _.findWhere(this.allDevices, {deviceId: deviceId, deviceType: appProperties.CAMERA_DEVICE_TYPE});
            },

            // returns string camera ownser id given string cameraId
            getCameraOwner: function (cameraId) {
                var found = false;
                var index = 0;
                var result = null;
                while (!found && index < this.allDevices.length) {
                    if (this.allDevices[index].deviceId == cameraId) {
                        result = this.allDevices[index].userId;
                        found = true;
                    } else {
                        index++;
                    }
                }
                return result;
            },

            loadSessionData: function () {
            },

            clearSessionData: function () {
                this.devices = null;
                this.allDevices = [];
                this.friendedBaseStations = [];
            }
        };
    })

    /*
     /calendar/:month/:favorites/:cameraId
     month format:  YYYYMM
     */
    .factory('calendarService', function ($state, appProperties, metadataService, libraryService, userService, localStorage, devicesService) {
        return {
            // string YYYYMM
            month: null,
            calendarVals: null,
            weeks: null,

            /*
             Set the month to string in format YYYYMM, defaults to current month
             if no month given.  Saves month to local storage.
             */
            setDefaultMonth: function () {
                var today = new Date();
                var month = today.getMonth() + 1;
                var year = today.getFullYear();
                if (month < 10) {
                    this.month = year.toString() + '0' + month.toString();
                } else {
                    this.month = year.toString() + month.toString();
                }

                this.persistMonth();
            },

            decrementMonth: function () {
                var monthVal = new Number(this.month.substring(4)) - 1;

                if (monthVal <= 0) {
                    var yearVal = new Number(this.month.substring(0, 4)) - 1;
                    this.month = yearVal.toString() + '12';
                } else if (monthVal < 10) {
                    this.month = this.month.substring(0, 4) + '0' + monthVal.toString();
                } else {
                    this.month = this.month.substring(0, 4) + monthVal.toString();
                }
            },

            incrementMonth: function () {
                var monthVal = new Number(this.month.substring(4)) + 1;

                if (monthVal > 12) {
                    var yearVal = new Number(this.month.substring(0, 4)) + 1;
                    this.month = yearVal.toString() + '01';
                } else if (monthVal < 10) {
                    this.month = this.month.substring(0, 4) + '0' + monthVal.toString();
                } else {
                    this.month = this.month.substring(0, 4) + monthVal.toString();
                }
            },

            /*
             Given month return local millisecond time at beginning of month.
             If month not provided defaults to present date.

             @param month in format 'YYYYMM'
             */
            getFromDate: function (month) {
                var d = new Date(0);
                if (month && (typeof month === 'string') && (month.length === 6)) {
                    d.setUTCFullYear(new Number(month.substring(0, 4)));
                    d.setUTCMonth(new Number(month.substring(4, 6)) - 1);
                }
                d.setUTCDate(1);
                d.setUTCHours(0);
                d.setUTCMinutes(0);
                d.setUTCSeconds(0);
                d.setUTCMilliseconds(0);
                return d.getTime() + d.getTimezoneOffset() * 60 * 1000;
            },

            /*
             Given month of form YYYYMM return local millisecond time at end of month.
             If month not provided defaults to present date.

             @param month in format 'YYYYMM'
             */
            getToDate: function (month) {
                var d = new Date(0);
                if (month && (typeof month === 'string') && (month.length === 6)) {
                    d.setUTCFullYear(new Number(month.substring(0, 4)));
                    d.setUTCMonth(new Number(month.substring(4, 6)) - 1);
                    d.setUTCDate(this.getLastDayOfMonth(month));
                }
                d.setUTCHours(23);
                d.setUTCMinutes(59);
                d.setUTCSeconds(59);
                d.setUTCMilliseconds(999);
                return d.getTime() + d.getTimezoneOffset() * 60 * 1000;
            },

            getFirstDateOfMonth: function (month) {
                month = (month == null) ? this.month : month;
                var d = new Date(0);
                d.setUTCMonth(month.substring(4) - 1);
                d.setUTCFullYear(month.substring(0, 4));
                var result = new Date(d.getTime() + 10000);
                return result;
            },

            refreshData: function () {
                if (!userService.ssoToken) {
                    // this is for testing comment out when getting real data
                    this.setCalendarVals();
                    this.setWeeks();
                } else {
                    var that = this;
                    var promise = metadataService.getMetadata(this.getStartOfMonthDateString(this.month), this.getEndOfMonthDateString(this.month));
                    promise.then(function () {

                        that.setCalendarVals();
                        that.setWeeks();
                    })

                    return promise;
                }
            },

            /*
             Get the first month's metadata.
             */
            getFirst: function () {
                if (!userService.ssoToken) {
                    // this is for testing comment out when getting real data
                    this.setCalendarVals();
                    this.setWeeks();
                } else {
                    var that = this;
                    var promise = metadataService.getFirstMetadata();
                    promise.then(function () {
                        // set the month
                        var dateString = _.sample(_.keys(metadataService.metadata));
                        if (dateString && dateString.length == 8) {
                            that.month = dateString.substring(0, 6);
                        }
                        that.setCalendarVals();
                        that.setWeeks();
                    })

                    return promise;
                }
            },

            /*
             Given month string in format 'YYYYMM' return day date string in format 'YYYYMMDD' for first day of that month.
             */
            getStartOfMonthDateString: function (month) {
                return month + '01';
            },

            /*
             Given month string in format 'YYYYMM' return day date string in format 'YYYYMMDD' for last day of that month.
             */
            getEndOfMonthDateString: function (month) {
                return month + this.getLastDayOfMonth(month);
            },

            /*
             Creates calendar object entries for each day.  Assumes month already set.
             */
            setCalendarVals: function () {
                var arr = [];
                var len = this.getLastDayOfMonth(this.month);
                var currentDay = this.getFirstDateOfMonth();
                for (var i = 1; i <= len; i++) {
                    var obj = {
                        "dayOfMonth": i,
                        "dayOfWeek": currentDay.getUTCDay(),
                        "numLibraryRecordings": this.getNumRecordingsOnDay(this.month + (i < 10 ? '0' + i : i))
                    };
                    if (this.getNumRecordingsOnDay(this.month + (i < 10 ? '0' + i : i))) {
                        this.lastRecordingDay = this.getDayDate(i);
                    }
                    arr.push(obj);
                    // increment current day pointer
                    currentDay.setTime(currentDay.getTime() + 1000 * 3600 * 24);
                }
                this.calendarVals = arr;
                this.persistCalendarVals();
            },

            /*
             Returns the last day of month on which there were recordings, or the last day of
             the month if there are no saved recordings for the month.
             */
            getMostRecentRecordingsDay: function () {
                var lastDay = this.getLastDayOfMonth(this.month);
                var day = this.getLastDayOfMonth(this.month) + 1;
                while (--day) {
                    if (this.getNumRecordingsOnDay(this.getDayDate(day))) {
                        return day;
                    }
                }

                // no recordings in month, return last day
                return day + 1;
            },

            /*
             Returns the last day of month on which there were recordings, or the last day of
             the month if there are no saved recordings for the month.
             */
            getFirstRecordingsDay: function () {
                var day = 1;
                do {
                    var d = this.month + (day < 10 ? '0' + day : day.toString());
                    if (this.getNumRecordingsOnDay(d)) {
                        return d;
                    }
                    day++;
                } while (day != 32);

                // no recordings in month, return first day
                return this.month + '01';
            },

            // given numeric day of month (1-31) returns date string 'YYYYMMDD'
            getDayDate: function (day) {
                return (day < 10) ? this.month + '0' + day.toString() : this.month + day.toString();
            },

            setWeeks: function () {
                var weeks = [];
                var startedFill = false;
                var filled = false;
                var currentDay = 1;
                var lastDayOfMonth = this.calendarVals.length;
                while (!filled) {
                    var week = [];
                    for (var i = 0; i < 7; i++) {
                        if (!filled && this.calendarVals[currentDay - 1].dayOfWeek == i) {
                            week.push(this.calendarVals[currentDay - 1]);
                            startedFill = true;
                        } else {
                            week.push({
                                "dayOfMonth": null,
                                "dayOfWeek": i,
                                "numLibraryRecordings": null
                            });
                        }
                        if (startedFill) {
                            currentDay++;
                        }

                        if (currentDay > lastDayOfMonth) {
                            filled = true;  // done filling calendar
                        }
                    }
                    weeks.push(week);

                }
                this.weeks = weeks;
                this.persistWeeks();
            },

            /*
             Given month string of form YYYYMM return the last day of month (28-31) as a number.
             */
            getLastDayOfMonth: function (month) {
                var result = 0;
                switch (Number(month.substring(4)) - 1) {
                    case 1:
                        if (Number(month.substring(0, 4)) % 4 == 0) {
                            result = 29;
                        } else {
                            result = 28;
                        }
                        break;
                    case 3:
                    case 5:
                    case 8:
                    case 10:
                        result = 30;
                        break;
                    default:
                        result = 31;
                }

                return result;
            },

            /* From the list of metadata calculate the number of recordings in library for that day (number) to display in the
             calendar view.  Takes into account the current favorites filter setting.  Note that the day passed
             in starts at 0 but the days in the record start at 1.
             */
            getNumRecordingsOnDay: function (day) {
                var result;
                if (metadataService.metadata != null) {
                    result = 0;
                    if (metadataService.metadata[day]) {  // if the day exists result != 0
                        for (var deviceId in metadataService.metadata[day]) {
                            if (_.findWhere(libraryService.selectedCameras, {deviceId: deviceId})) {
                                if (metadataService.metadata[day].hasOwnProperty(deviceId)) {
                                    if (libraryService.favorites.value == "all") {
                                        result += (metadataService.metadata[day][deviceId].favorite + metadataService.metadata[day][deviceId].nonFavorite);
                                    } else if (libraryService.favorites.value == "only") {
                                        result += metadataService.metadata[day][deviceId].favorite;
                                    } else { // all except favorites ...
                                        result += metadataService.metadata[day][deviceId].nonFavorite;
                                    }
                                }
                            }
                        }
                    }
                }

                return result;
            },

            persistMonth: function () {
                localStorage.setItem('month', this.month);
            },

            persistCalendarVals: function () {
                localStorage.setItem('calendarVals', JSON.stringify(this.calendarVals));
            },

            persistWeeks: function () {
                localStorage.setItem('weeks', JSON.stringify(this.weeks));
            },

            loadSessionData: function () {
                if (localStorage['month']) this.month = localStorage['month'];
                if (localStorage['calendarVals']) this.calendarVals = JSON.parse(localStorage['calendarVals']);
                if (localStorage['weeks']) this.weeks = JSON.parse(localStorage['weeks']);
            },

            clearSessionData: function () {
                this.month = null
                this.calendarVals = null;
                this.weeks = null;
                if (localStorage['month']) localStorage.removeItem('month');
                if (localStorage['calendarVals']) localStorage.removeItem('calendarVals');
                if (localStorage['weeks']) localStorage.removeItem('weeks');
            },

            createStateParams: function () {
                this.setDefaultMonth();
                this.stateParams = {
                    month: this.month,
                    day: this.getDayDate(new Date().getDate()),
                    favorites: appProperties.favoritesOptions[0].value,
                    cameraIds: appProperties.CAMERAS_ALL_SELECTED
                };
            },

            gotoCalendarView: function (recycled) {
                if (!this.stateParams) {
                    this.createStateParams();
                }
                if (recycled) {
                    $state.go('calendar.recycled', this.stateParams);
                } else {
                    $state.go('calendar.day', this.stateParams);
                }
            }
        };
    })

    .factory('metadataService', function ($http, $log, $window, urlService, localStorage, userService, dayService) {

        return {

            // the list of devices for this user
            metadata: null,

            getMetadata: function (from, to) {

                var data = {"dateFrom": from, "dateTo": to};
                var config = {
                    "method": "post",
                    "url": urlService.getMetadataUrl(),
                    "data": data,
                    "timeout": 5000,
                    "headers": {"Authorization": userService.ssoToken}
                };

                var that = this;
                $log.debug("config:" + JSON.stringify(config));
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got metadata:" + JSON.stringify(result.data.data));
                            that.metadata = result.data.data.meta;
                            that.persistMetadata();
                        } else {
                            $log.warn("metadata query success false");
                            // $window.alert('Error:' + result.data.data.code + ', ' + result.data.data.message);
                        }
                    });

                return promise;
            },

            getFirstMetadata: function (notSave) {

                var config = {
                    "method": "get",
                    "url": urlService.getMetadataUrl(),
                    "timeout": 5000,
                    "headers": {"Authorization": userService.ssoToken,
                        "ContentType": "application/json"}
                };

                var that = this;
                $log.debug("config:" + JSON.stringify(config));

                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got metadata:" + JSON.stringify(result.data.data));
                            if(!notSave) {
                                that.metadata = result.data.data.meta;
                                that.persistMetadata();
                            }
                            else {
                                return result.data.data.dateFrom;
                            }
                        } else {
                            $log.warn("metadata query success false");
                            // $window.alert('Error:' + result.data.data.code + ', ' + result.data.data.message);
                        }
                    });

                return promise;
            },

            persistMetadata: function () {
                localStorage.setItem('metadata', JSON.stringify(this.metadata));
            },

            loadSessionData: function () {
                if (localStorage['metadata']) this.metadata = JSON.parse(localStorage['metadata']);
            },

            clearSessionData: function () {
                this.metadata = null;
                if (localStorage['metadata']) localStorage.removeItem('metadata');
            }
        };
    })


    /*
     Contains code and data common to the different library views, including calendar, recordings, and recording view.
     Enables filtering functionality based upon favorites and camera ID's.

     */
    .factory('libraryService', function ($window, devicesService, appProperties, localStorage) {

        return {
            favorites: null,
            cameras: null,
            selectedCameras: [],

            /*
             Set favorites to one of the favoritesOptions values ('all', 'only', or 'non')
             */
            setFavorites: function (favorites) {
                if (!favorites) {
                    return;
                }
                // default arguments is a favorites object so check if it's the value
                if (typeof favorites == "string") {
                    for (var i = 0; i < appProperties.favoritesOptions.length; i++) {
                        if (appProperties.favoritesOptions[i].value == favorites) {
                            this.favorites = appProperties.favoritesOptions[i];
                        }
                    }
                } else {
                    this.favorites = favorites;
                }
                // unrecognized favorites value set a default
                if ((typeof favorites == "string") && (typeof this.favorites == "undefined")) {
                    this.favorites = appProperties.favoritesOptions[0];
                }
                this.persistFavorites();
            },

            /*
             Set initial values for library service, favorites and cameras.
             */
            initialize: function () {
                this.favorites = appProperties.favoritesOptions[0];
                var cameraIds = devicesService.getAllCameraIds();
                this.setCameras(cameraIds);
                this.setSelectedCamerasFromIds(cameraIds);
            },


            /*
             Takes array of cameraIds and creates array of camera objects.
             Each object contains a cameraId and cameraName property.
             */
            setCameras: function (cameraIds) {
                this.cameras = [];
                for (var i = 0; i < cameraIds.length; i++) {
                    this.cameras.push({
                        "deviceId": cameraIds[i],
                        "cameraName": devicesService.getDeviceName(cameraIds[i]),
                        "ownerId": devicesService.getCameraOwner(cameraIds[i])
                    });
                }
                this.persistCameras();
            },

            setSelectedCameras: function (cameras) {
                this.selectedCameras = cameras;
                this.persistSelectedCameras();
            },

            /*
             Given array of camera ids set selected camera ids for those ids already in cameras array.
             */
            setSelectedCamerasFromIds: function (cameraIds) {

                var result = [];
                var cameras = _.where(devicesService.allDevices, {
                    deviceType: appProperties.CAMERA_DEVICE_TYPE
                });
                for (var i = 0; i < cameraIds.length; i++) {
                    for (var j = 0; j < cameras.length; j++) {
                        if (cameras[j].deviceId == cameraIds[i]) {
                            result.push(cameras[j]);
                        }
                    }
                }
                this.selectedCameras = result;
                this.persistSelectedCameras();
            },

            // returns a comma separated string of the selected cameraIds
            getSelectedCameraIds: function () {
                var iDs = [];
                for (var i = 0; i < this.selectedCameras.length; i++) {
                    iDs.push(this.selectedCameras[i].deviceId);
                }

                return iDs.join(",");
            },

            persistFavorites: function () {
                localStorage.setItem('favorites', JSON.stringify(this.favorites));
            },

            persistCameras: function () {
                localStorage.setItem('cameras', JSON.stringify(this.cameras));
            },

            persistSelectedCameras: function () {
                localStorage.setItem('selectedCameras', JSON.stringify(this.selectedCameras));
            },

            loadSessionData: function () {
                if (localStorage['favorites']) this.favorites = JSON.parse(localStorage['favorites']);
                if (localStorage['cameras']) this.cameras = JSON.parse(localStorage['cameras']);
                if (localStorage['selectedCameras']) this.selectedCameras = JSON.parse(localStorage['selectedCameras']);
            },

            clearSessionData: function () {
                this.favorites = null;
                this.cameras = null;
                this.selectedCameras = null;
                if (localStorage['favorites']) localStorage.removeItem('favorites');
                if (localStorage['cameras']) localStorage.removeItem('cameras');
                if (localStorage['selectedCameras']) localStorage.removeItem('selectedCameras');
            }
        }
    })

    /*

     /day/:day/:favorite/:cameraId

     form of day:  YYYYMMDD
     */
    .factory('dayService', function ($filter, userService, libraryService, recordingsService, localStorage) {
        return {
            day: null,
            millisecondsInDay: 24 * 3600 * 1000,

            /*
             Given a month string in format 'YYYYMM' set the default day string in YYYYMMDD format.
             */
            setDefaultDay: function (month) {
                var today = new Date();
                var day = today.getDate(); // 1-31
                this.setDay(month + (day < 10 ? '0' + day : day));

                this.persistDay();
            },

            /*
             Set the day string in YYYYMMDD format.
             */
            setDay: function (day) {
                // todo: validate the day is of form 'YYYYMMDD'
                this.day = day;
                this.persistDay();
            },

            /*
             Returns default date of today in format 'YYYYMMDD'
             */
            getToday: function () {
                return $filter('date')(new Date(), "yyyyMMdd");
            },

            decrementDay: function () {
                var dayVal = new Number(this.day.substring(6)) - 1;

                if (dayVal <= 0) {
                    var monthVal = new Number(this.day.substring(4, 6)) - 1;
                    var yearVal = new Number(this.day.substring(0, 4));
                    if (monthVal <= 0) {
                        yearVal--;
                        monthVal = 12;
                        var month = yearVal.toString() + monthVal.toString();
                        // update the route so the back link will go to the new month
                        dayVal = this.getLastDayOfMonth(month);
                        this.day = month + dayVal.toString();
                    } else if (monthVal < 10) {
                        var month = yearVal.toString() + '0' + monthVal.toString();
                        // update the route so the back link will go to the new month
                        dayVal = this.getLastDayOfMonth(month);
                        this.day = month + dayVal.toString();
                    } else {
                        var month = yearVal.toString() + monthVal.toString();
                        // update the route so the back link will go to the new month
                        dayVal = this.getLastDayOfMonth(month);
                        this.day = month + dayVal.toString();
                    }
                } else if (dayVal < 10) {
                    this.day = this.day.substring(0, 6) + '0' + dayVal.toString();
                } else {
                    this.day = this.day.substring(0, 6) + dayVal.toString();
                }
                this.persistDay();
            },

            incrementDay: function () {
                var dayVal = new Number(this.day.substring(6)) + 1;
                var endOfCurrentMonth = this.getLastDayOfMonth(this.day.substring(0, 6));

                if (dayVal > endOfCurrentMonth) { // dayVal becomes first of next month
                    var monthVal = new Number(this.day.substring(4, 6)) + 1;
                    var yearVal = new Number(this.day.substring(0, 4));
                    if (monthVal > 12) { // month is jan
                        yearVal++;
                        this.day = yearVal.toString() + '01' + '01';
                    } else if (monthVal < 10) {
                        this.day = yearVal.toString() + '0' + monthVal.toString() + '01';
                    } else {
                        this.day = yearVal.toString() + monthVal.toString() + '01';
                    }
                } else if (dayVal < 10) {
                    this.day = this.day.substring(0, 6) + '0' + dayVal.toString();
                } else {
                    this.day = this.day.substring(0, 6) + dayVal.toString();
                }
                this.persistDay();
            },

            refreshData: function () {
                return recordingsService.getRecordings(this.day, this.day);
            },

            persistDay: function () {
                localStorage.setItem('day', this.day);
            },

            getLastDayOfMonth: function (month) {
                var result = 0;
                switch (Number(month.substring(4)) - 1) {
                    case 1:
                        if (Number(month.substring(0, 4)) % 4 == 0) {
                            result = 29;
                        } else {
                            result = 28;
                        }
                        break;
                    case 3:
                    case 5:
                    case 8:
                    case 10:
                        result = 30;
                        break;
                    default:
                        result = 31;
                }

                return result;
            },

            loadSessionData: function () {
                if (localStorage['day']) this.day = localStorage['day'];
            },

            clearSessionData: function () {
                this.day = null;
                if (localStorage['day']) {
                    localStorage.removeItem("day");
                }
            }
        };
    })

    .factory('recordingsService', function ($http, $q, $log, $window, $filter, $injector, $rootScope, appProperties, libraryService, urlService, localStorage, baseStationService, userService, devicesService) {

        return {

            // the recordingsData query result
            // recordingData: null,
            // the list of devices for this user
            recordings: null,
            recycled: null,
            current: null,
            libraryState: null,

            /*    Get's library info
             */
            getLibraryState: function () {
                var config = {
                    "method": "GET",
                    "url": urlService.getLibraryStateUrl(),
                    "timeout": 30000,
                    data: '',
                    "headers": {"Authorization": userService.ssoToken, 'Content-Type': 'application/json; charset=UTF-8'}
                };

                var that = this;
                that.recycled = [];
                $log.debug("getting library info: " + JSON.stringify(config));
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got library info: " + JSON.stringify(result.data.data));
                            that.libraryState = result.data.data;
                        } else {
                            $log.warn("library info query success false");
                            return $q.reject(result.data);
                        }
                    });

                return promise;
            },

            /*    Get's the recordings for the current day.
             */
            getRecordings: function (from, to) {
                var recordingsData;
                var data = {"dateFrom": from, "dateTo": to};

                var config = {
                    "method": "POST",
                    "url": urlService.getRecordingsUrl(),
                    "data": data,
                    "timeout": 30000,
                    "headers": {"Authorization": userService.ssoToken}
                };

                var that = this;
                $log.debug("getting recordings, data:" + JSON.stringify(data));
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got recordings:" + JSON.stringify(result.data.data));
                            //that.recordings = $filter('orderBy')(result.data.data, 'utcCreatedDate', true);
                            var recs = _.sortBy(result.data.data, function (recording) {
                                return -$filter('toBSTime')(recording.utcCreatedDate, recording.timeZone);
                            });
                            //_.each(recs, function(recording) {
                            //    recording.id = recording.utcCreatedDate + recording.deviceId;
                            //});

                            that.recordings = recs;
                            that.persistRecordings();
                        } else {
                            $log.warn("recordings query success false");
                            // $window.alert('Error:' + result.data.data.code + ', ' + result.data.data.message);
                        }
                    });

                return promise;
            },

            /*    Get's all recycle recordings
             */
            getRecycleRecordings: function () {
                var config = {
                    "method": "GET",
                    "url": urlService.getRecycleUrl(),
                    "timeout": 55000,
                    "headers": {"Authorization": userService.ssoToken}
                };

                var that = this;
                that.recycled = [];
                $log.debug("getting recordings, data:" + JSON.stringify(config));
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("got recordings:" + JSON.stringify(result.data.data));
                            that.recycled = result.data.data;
                            angular.forEach(that.recycled, function (value, key) {
                                that.recycled[key].recordingNumber = key;
                            });
                        } else {
                            $log.warn("recordings query success false");
                            $rootScope.$broadcast('show_error', { data: { message: 'Request for recycled recordings failed!' }});
                            return $q.reject(result.data);
                        }
                    });

                return promise;
            },

            /*
             Object factory to create an empty favorite object to send to server for changing recordings attributes
             */

            createFavoriteObject: function () {
                var result = {};
                result.utcCreatedDate = null;
                result.createdDate = null;
                result.deviceId = null;

                return result;
            },

            /*
             Putrequest to server to favorite an array of recordings.  Takes two arrays, selected which is
             an array of booleans indicating whether the corresponding element in the recordings array is
             selected.
             */
            favoriteRecordings: function (selected, recordings) {
                var collection = [];
                for (var i = 0; i < selected.length; i++) {
                    if (angular.isDefined(selected[i])) {
                        var favoriteObject = this.createFavoriteObject();
                        favoriteObject.createdDate = recordings[i].createdDate;
                        favoriteObject.deviceId = recordings[i].deviceId;
                        favoriteObject.utcCreatedDate = recordings[i].utcCreatedDate;
                        collection.push(favoriteObject);
                    }
                }
                var data = {};
                data.data = collection;
                var config = {
                    "method": "POST",
                    "url": urlService.getFavoriteUrl(),
                    "data": data,
                    "timeout": 30000,
                    "headers": {"Authorization": userService.ssoToken}
                };
                $log.debug("setting favorites, sending data:" + JSON.stringify(config));
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("favorites set successfully");
                        } else {
                            $log.warn("favorites not sent");
                            // $window.alert('Error code from server:' + result.data.data.code + ', ' + result.data.data.message);
                        }
                    });

                return promise;
            },

            /*
             Put request to server to recycle an array of recordings.  Takes two arrays, selected which is
             an array of booleans indicating whether the corresponding element in the recordings array is
             selected.  This is like favoriting but don't set recycle for favorites.
             */
            recycleRecordings: function (recordings) {
                var collection = [];
                angular.forEach(recordings, function (recording) {
                    if (recording.selected && !this.isFavorite(recording)) {
                        var editObject = {
                            createdDate: recording.createdDate,
                            deviceId: recording.deviceId,
                            utcCreatedDate: recording.utcCreatedDate
                        };
                        collection.push(editObject);
                    }
                }, this);

                var config = {
                    "method": "POST",
                    "url": urlService.getRecycleUrl(),
                    "data": { data: collection },
                    "headers": {"Authorization": userService.ssoToken}
                };

                $log.debug("setting recycle, sending data:" + JSON.stringify(config));
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("recycle settings successful");

                        } else {
                            $log.warn("recycle operation not sent");
                            return $q.reject(result.data);
                            // $window.alert('Error code from server:' + result.data.data.code + ', ' + result.data.data.message);

                        }
                    });

                return promise;
            },

            shareRecordings: function () {
                var collection = [];
                if(this.selectMode) {
                    _.each(this.recordings, function (recording) {
                        if (recording.selected) {
                            collection.push({
                                "deviceId": recording.deviceId,
                                "utcCreatedDate": recording.utcCreatedDate,
                                "createdDate": recording.createdDate,
                                "timeZone": recording.timeZone,
                                "mediaDuration": recording.mediaDuration,
                                "name": recording.name,
                                "contentType": recording.contentType
                            });
                        }
                    });
                }
                else {
                    collection.push({
                        "deviceId": this.current.deviceId,
                        "utcCreatedDate": this.current.utcCreatedDate,
                        "createdDate": this.current.createdDate,
                        "timeZone": this.current.timeZone,
                        "mediaDuration": this.current.mediaDuration,
                        "name": this.current.name,
                        "contentType": this.current.contentType
                    });
                }

                var config = {
                    "method": "POST",
                    "url": urlService.getShareUrl(),
                    "data": { sharedMediaList: collection },
                    "headers": {"Authorization": userService.ssoToken}
                };

                $log.debug("setting share, sending data:" + JSON.stringify(config));
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("share settings successful");
                            return result.data;
                        } else {
                            $log.warn("share operation not sent");
                            return $q.reject(result.data);
                            // $window.alert('Error code from server:' + result.data.data.code + ', ' + result.data.data.message);

                        }
                    });

                return promise;
            },

            getSharedRecordings: function (token) {

                var config = {
                    "method": "GET",
                    "url": urlService.getShareUrl() + "/" + token,
                    "headers": {"Authorization": userService.ssoToken || ""}
                };

                $log.debug("setting share, sending data:" + JSON.stringify(config));
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("share settings successful");
                            return result.data;
                        } else {
                            $log.warn("share operation not sent");
                            return $q.reject(result.data);
                            // $window.alert('Error code from server:' + result.data.data.code + ', ' + result.data.data.message);

                        }
                    });

                return promise;
            },

            /*
             Put request to server to restore recycle an array of recordings.  Takes array of recordings.
             */
            restoreRecordings: function (recordings) {
                var collection = [];
                angular.forEach(recordings, function (recording) {
                    if (recording.selected) {
                        var editObject = {
                            createdDate: recording.createdDate,
                            deviceId: recording.deviceId,
                            utcCreatedDate: recording.utcCreatedDate
                        };
                        collection.push(editObject);
                    }
                });

                var config = {
                    "method": "PUT",
                    "url": urlService.getRecycleUrl(),
                    "data": { data: collection },
                    "headers": {"Authorization": userService.ssoToken}
                };

                $log.debug("restore recycled, sending data:" + JSON.stringify(config));
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("restore recycled successful");
                        } else {
                            $log.warn("restore recycled operation not sent");
                            // $window.alert('Error code from server:' + result.data.data.code + ', ' + result.data.data.message);
                            return $q.reject(result.data);
                        }
                    });

                return promise;
            },

            /*
             Put request to server to recycle all recordings.
             */
            deleteAllRecordings: function () {
                var config = {
                    "method": "DELETE",
                    "url": urlService.getRecycleAllUrl(),
                    data: '',
                    "headers": {"Authorization": userService.ssoToken, 'Content-Type': 'application/json; charset=UTF-8'}
                };

                $log.debug("delete all recordings, sending data:" + JSON.stringify(config));
                var promise = $http(config).
                    then(function (result) {
                        if (result.data.success == true) {
                            $log.debug("recycle all successful");

                        } else {
                            $log.warn("recycle all operation not sent");
                            // $window.alert('Error code from server:' + result.data.data.code + ', ' + result.data.data.message);
                        }
                    });

                return promise;
            },

            /*
             Returns the next content item according to the value of the favorites filtering
             preference and not including recycled.

             todo:  If the user clicks/swipes next at the
             end of the recordings list for the current
             day rolls over to the next day.
             This can be done by using dayService.incrementDay refreshData then going to first content item.
             */
            getNextContent: function (index, stateParams) {
                var found = false;
                var oldIndex = index;
                var content = null;
                var camIds = stateParams.cameraIds == appProperties.CAMERAS_ALL_SELECTED
                    ? devicesService.getAvailableCameraIds()
                    : stateParams.cameraIds.split(',');

                while (index < this.recordings.length - 1 && !found) {
                    index++;
                    //if (index >= this.recordings.length) break;
                    content = this.recordings[index];
                    // don't show recycled content unless in recycled bin
                    if (content.recycle) continue;
                    if ((libraryService.favorites.value == "only" && !this.isFavorite(content)) ||
                        (libraryService.favorites.value == "non" && this.isFavorite(content)) ||
                        (camIds && _.indexOf(camIds, content.deviceId) == -1)) {
                        continue;
                    } else {// found it
                        found = true;
                    }
                }
                return found ? content : this.recordings[oldIndex];
            },


            /*
             Returns the previous content item according to the value of the favorites filtering
             preference and not including recycled.

             todo:  If the user clicks/swipes previous at the
             beginning of the recordings list for the
             current day rolls back to the next day.
             This can be done by using dayService.decrementDay refreshData then going to first content item.
             */
            getPreviousContent: function (index, stateParams) {
                var found = false;
                var oldIndex = index;
                var content = null;
                var camIds = stateParams.cameraIds == appProperties.CAMERAS_ALL_SELECTED
                    ? devicesService.getAvailableCameraIds()
                    : stateParams.cameraIds.split(',');

                while (index > 0 && !found) {
                    index--;
                    //if (index <= 0) break;
                    content = this.recordings[index];
                    // don't show recycled content unless in recycled bin
                    if (content.recycle) continue;
                    if ((libraryService.favorites.value == "only" && !this.isFavorite(content)) ||
                        (libraryService.favorites.value == "non" && this.isFavorite(content)) ||
                        (camIds && _.indexOf(camIds, content.deviceId) == -1)) {
                        continue;
                    } else {// found it
                        found = true;
                    }
                }

                return found ? content : this.recordings[oldIndex];
            },

            persistRecordings: function () {
                for (var recordingNumber = 0; recordingNumber < this.recordings.length; recordingNumber++) {
                    this.recordings[recordingNumber].recordingNumber = recordingNumber;
                }
                localStorage.setItem('recordings', JSON.stringify(this.recordings));
            },

            loadSessionData: function () {
                if (localStorage['recordings']) this.recordings = JSON.parse(localStorage['recordings']);
            },

            clearSessionData: function () {
                this.recordings = null;
                this.selectMode = false;
                if (localStorage['recordings']) localStorage.removeItem('recordings');
            },

            setCurrent: function (rec) {
                this.current = rec;
            },

            isFavorite: function (recording) {
                return recording && recording.currentState == appProperties.FAVORITE_STATE;
            },

            toggleFavorite: function (recording) {
                recording.currentState = (recording.currentState == appProperties.FAVORITE_STATE ? appProperties.NEW_STATE : appProperties.FAVORITE_STATE);
                return recording;
            }

        };
    })

    .factory('uiService', function ($rootScope, $modal, $state, userService) {

        return {
            scope: $rootScope.$new(true),

            info: function (message) {
                this.scope.infoMessage = message;
                var modalInstance = $modal.open({
                    templateUrl: 'partials/infoDialog.html',
                    backdrop: true,
                    scope: this.scope
                });
                return modalInstance.result;
            },

            processBSUpdate : function (bs) {
                if(this.scope.bs) { return;}
                if(!userService.ignoreUpdates && bs.userRole == 'OWNER' && bs.properties && bs.properties.updateAvailable && !bs.properties.autoUpdateEnabled) {
                    this.scope.notifiedBS || (this.scope.notifiedBS = []);
                    var hash = bs.deviceId + bs.properties.updateAvailable.version;
                    if(this.scope.notifiedBS.indexOf(hash) != -1) { return; }
                    this.scope.bs = bs;
                    this.scope.notifiedBS.push(hash);
                    var that = this;
                    if(!this.scope.remindChanged) {
                        this.scope.remindChanged = this.remindChanged;
                    }
                    this.scope.remindUpdate = true;
                    var modalInstance = $modal.open({
                        templateUrl: 'partials/confirmBSUpgradeDialog.html',
                        backdrop: 'static',
                        scope: this.scope
                    });
                    modalInstance.result.then(function () {
                            $state.go('settings.baseStation.update', {baseStationId: bs.deviceId});
                        })["finally"](function () {
                        that.scope.bs = null;
                    });
                }
            },

            remindChanged: function () {
                userService.setIgnoreUpdates(!this.remindUpdate);
            }
        };

    })

    .factory('offlineService', function ($rootScope, $http, $timeout, $state, $filter, $injector) {

        return {
            isOffline: false,

            startTime: new Date().getTime(),

            init: function () {
                this.startTime = new Date().getTime();
            },

            checkOffline: function () {
                var url = '/img2/drag_header.png?t=' + new Date().getTime();
                var that = this;
                if(!this.promise) {
                    this.promise = $http({
                        "method": "GET",
                        "url": url,
                        "timeout": 30000
                    }).then(function (result) {
                        that.isOffline = false;
                    }, function (result) {
                        that.isOffline = true;
                        $injector.get('userService').setFromLogout();
                        $injector.get('logoutService').logout(true).then(function () {
                            $state.go('login');
                        });
                        $timeout(function () {
                            $rootScope.$broadcast('show_error', {data: {message: $filter("i18n")("error_no_internet_connection")}});
                        }, 500);
                    }).finally(function () {
                        that.promise = null;
                    });
                }
            },

            checkTransId: function (payload) {
                if(this.startTime) {
                    if(payload.resource == "mediaUploadNotification" || payload.resource == "diagnostics") {
                        return true;
                    }
                    var transId = payload.transId && payload.transId.split('!');
                    var transTime = transId && parseInt(transId[2], 10);
                    return transTime > this.startTime;
                }
                return false;
            }
        };

    })

    .factory('beforeUnload', ['$window', function($window, billingFlowService) {
        var _leavingPageText = "Arlo is processing your request.";
        var _leavingPageText2 = "Are you sure you want to leave without finishing?";
        return {
            init: function(top, bottom) {
                _leavingPageText = top || _leavingPageText;
                _leavingPageText2 = bottom || _leavingPageText2;

                $window.onbeforeunload = function(e){
                    return (_leavingPageText + "\n" + _leavingPageText2);
                }
            } // end init
        } // end return

    }])

    .factory('sessionExpire', function ($rootScope, $state, $timeout, appProperties, userService, loginService, logoutService) {
            var service = {
                timeout: null,
                time: 30 * 60000,

                init: function () {
                    service.timeout = $timeout(service.checkExpire, service.time);
                    $rootScope.$on(appProperties.appEvents.BODY_CLICK, function () {
                        $timeout.cancel(service.timeout);
                        service.timeout = $timeout(service.checkExpire, service.time);
                    });
                },
                checkExpire: function () {
                    if (!$state.current.authenticate) {
                        $timeout.cancel(service.timeout);
                        service.timeout = $timeout(service.checkExpire, service.time);
                    }
                    else if (userService.isLoggedIn()) {
                        loginService.redirectError = "Session expired. Please relog-in.";
                        logoutService.logout()["finally"](function () {
                            userService.setFromLogout();
                            $state.go("login");
                        });
                    }
                }
            };
            return service;
    })

    .factory('webRTC', function ($rootScope, $state, $timeout, appProperties, userService, loginService, logoutService) {
            function success() {console.log("Success")};
            function failure(error) {console.log("Failure=" + error.name + error.message)};
            var service = {
                PeerConnection: window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection,
                SessionDescription: window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription,
                getUserMedia: navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia,
                streamAudio: function () {
                    var config = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
                    var pc = new service.PeerConnection(config);
                    service.getUserMedia (
                        {
                            "audio":true,
                            "video":false
                        },
                        function(localMediaStream) {
                            pc.addStream(localMediaStream);
                            pc.createOffer(
                                function(desc) {
                                    pc.setLocalDescription(desc, success, failure);
                                    console.log(pc.localDescription.sdp);
                                    //window.setTimeout(function() {socket.send("sdp-offer: " + pc.localDescription.sdp);}, 1000)
                                },
                                failure
                            );
                        },
                        failure
                    );
                }
            };
            return service;
    });

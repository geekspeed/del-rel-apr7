'use strict';

/* Filters */
angular.module('arloApp.filters', []).
    filter('interpolate', ['version', function (version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }]).

    filter('monthText',function (calendarNamesService) {
        return function (month) {
            if(!month) { return ''; }

            var monthVal = new Number(month.substring(4)) - 1;
            var out = calendarNamesService.getCalendar().MONTH[monthVal] + ", " + month.substring(0, 4);
            return out;
        }
    }).

    filter('dayText',function (calendarNamesService) {
        return function (day) {
            var monthVal = new Number(day.substring(4, 6)) - 1;
            var out = calendarNamesService.getCalendar().MONTH[monthVal] + " " + day.substring(6) + ", " + day.substring(0, 4);
            return out;
        }
    }).

    // time display for recording video player
    filter('secToString',function () {
        return function (input) {
            function z(n) {
                return (n < 10 ? '0' : '') + n;
            }

            var seconds = Math.floor(input % 60);
            var hours = Math.floor(input / 3600);
            var minutes = Math.floor((input - (hours * 3600)) / 60);
            return (z(hours) + ':' + z(minutes) + ':' + z(seconds));
        };
    }).

    filter('ownDevices',function () {
        return function (devices) {
            return _.reduce(devices, function (memo, device) {
                if (device.userId === device.owner.ownerId) {  // owned camera
                    memo.push(device.parentId);
                }
                return memo;
            }, []);
        }
    }).

    // returns an array of recordings filtered by favorites selection drop-down for ng-repeat
    filter('favorites',function (libraryService, routeService, dayService, recordingsService) {
        return function (recordings, scope) {
            if (recordings == 'undefined' || recordings == null) return;
            var result = [];
            for (var i = 0; i < recordings.length; i++) {
                var recording = recordings[i];
                if (!scope.favorites || scope.favorites.value == "all") {
                    result.push(recording);
                } else if (scope.favorites.value == "only" && recordingsService.isFavorite(recording)) {
                    result.push(recording);
                } else if (scope.favorites.value == "non" && !recordingsService.isFavorite(recording)) {
                    result.push(recording);
                }
            }

            // fixme: what the reason to save favorites in filter?
            //libraryService.setFavorites(scope.favorites);
            routeService.currentDayRoute = routeService.getDayRoute(dayService.day);
            return result;
        }

    }).
    // returns an array of recordings with recycled filtered out for ng-repeat
    // todo: delete filter as deprecated
    filter('recycled',function (libraryService, routeService, dayService) {
        return function (recordings, scope) {
            if (recordings == 'undefined' || recordings == null) return;
            var result = [];
            for (var i = 0; i < recordings.length; i++) {
                var recording = recordings[i];
                if (!recording.recycle) {
                    result.push(recording);
                }
            }
            // libraryService.setFavorites(scope.favorites);
            // routeService.currentDayRoute = routeService.getDayRoute(dayService.day);
            return result;
        }

    }).

    filter('toUTC', function () {
        return function (milliseconds) {
            return milliseconds + 60 * 1000 * (new Date().getTimezoneOffset());
        }
    }).

    filter('toBSTime', function () {
        return function (milliseconds, timeZone) {
            try {
                return milliseconds ? (milliseconds + 60 * 1000 * (new Date().getTimezoneOffset() - (new timezoneJS.Date(milliseconds, timeZone).getTimezoneOffset()))) : '';
            }
            catch (e) {
                return milliseconds;
            }
        }
    }).

    filter('motionLevel', function (appProperties, camerasService) {
        return function (camera) {
            if (!camera || !camerasService.isCameraOnline(camera) || camera.properties.activityState == appProperties.CAMERA_SETTINGS_ACTIVITYSTATE_ACTIVESTREAM) {
                return appProperties.CSS_CAMERA_MOTION_DISABLED;
            } else if (camerasService.isMotionActive(camera)) {
                return appProperties.CSS_CAMERA_MOTION_ACTIVE;
            } else if (camerasService.isCameraArmed(camera)) {
                return appProperties.CSS_CAMERA_MOTION_ARMED;
            }
            return appProperties.CSS_CAMERA_MOTION_DISABLED;
        }
    }).

    filter('batteryLevel', function (appProperties) {
        return function (camera) {
            var level;
            if (!camera || !camera.properties || !camera.properties.hasOwnProperty("batteryLevel")) {
                level = 100;
            }
            //else if(camera.properties.connectionState == appProperties.CAMERA_CONNECTION_STATE_BATTERY_CRITICAL) {
            //    level = 0;
            //}
            else {
                level = camera.properties.batteryLevel;
            }

            if (level > 60) {
                return '3';
            }
            else if (level > 15) {
                return '2';
            }
            else if (level > 0) {
                return '1';
            }

            return '0';
        }
    }).

    filter('signalLevel', function () {
        return function (camera) {
            var level;
            if (!camera || !camera.properties || !camera.properties.signalStrength) {
                level = 4;
            } else if (camera.properties.signalStrength == -1) {
                level = 1;
            } else {
                level = camera.properties.signalStrength;
            }

            return level;
        }
    }).

    filter('brightLevel', function () {
        return function (camera) {
            if (camera && camera.properties.brightness) {
                if (camera.properties.brightness < 0) {
                    return 0;
                }
                else if (camera.properties.brightness > 0) {
                    return 2;
                }
            }
            return 1;
        }
    }).

    filter('planAmount', function (servicePlanService) {
        return function (servicePlan) {
            if(servicePlanService.isFreePlan(servicePlan)) {
                return "Free";
            }
            return (servicePlan.term == '1' ? 'Monthly ' : (servicePlan.term == '12' ? 'Annual ' : '')) + (servicePlan.planCurrencyAmount || servicePlan.amount);
        }
    }).

    filter('storageSize', function () {
        return function (size) {
            if(size == 0) return 0;
            var k = 1024;
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            var i = Math.floor(Math.log(size) / Math.log(k));
            return (size / Math.pow(k, i)) + ' ' + sizes[i];
        }
    });

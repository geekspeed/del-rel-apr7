'use strict';

/* Directives */
angular.module('arloApp.directives', [])
    .directive('scheduleHours', ['$window', '$timeout', 'calendarNamesService', function ($window, $timeout, calendarNamesService) {
        return {
            link: function (scope, element, attrs) {

                var names = calendarNamesService.getCalendar().AMPMS;
                // get the context for hours label region
                var canvas = element[0];
                var context = canvas.getContext("2d");

                context.fillStyle = "#fff";
                context.fillRect(0, 0, 70, 720);

                // write the times
                context.font = "12px MorebiRounded-Regular, Arial";
                context.strokeStyle = "#ccc";
                context.lineWidth = 1;

                var w = angular.element($window);
                scope.$watch(function () {
                    return {
                        'w': w[0].innerWidth + '-' + w[0].innerHeight
                    };
                }, function (newValue, oldValue) {
                    drawHours();
                }, true);
                scope.$watch("baseStation.scheduleOn", function (newValue, oldValue) {
                    if(newValue) {
                        $timeout(drawHours, 100);
                    }
                }, true);

                w.bind('resize', function (event) {
                    scope.$apply();
                });
                function drawHours() {
                    canvas.height = element[0].offsetHeight;
                    for (var j = 1; j < 24; j++) {
                        var h= Math.ceil(j*canvas.height/24);
                        var timeText;
                        if (j <= 11) {
                            timeText = j + " " + names[0];
                        } else if (j == 12) {
                            timeText = j + " " + names[1];
                        } else if (j > 12) {
                            timeText = (j - 12) + " " + names[1];
                        }
                        context.fillText(timeText, 20, h + 1);
                        context.moveTo(65, h - 1);
                        context.lineTo(70, h - 1);
                        context.stroke();
                    }
                }
                //$timeout(drawHours, 100);
            }
        }
    }])

    .directive('mode', [function () {

        var handleDragStart = function (event) {

            (event.originalEvent || event).dataTransfer.effectAllowed = 'move';
            var dataInfo = {
                modeId: event.currentTarget.getAttribute('mode-id')
            };
            try {
                event.dataTransfer.setData('text/plain', JSON.stringify(dataInfo));
            }
            catch(e) {
                event.dataTransfer.setData('text', JSON.stringify(dataInfo));
            }
        };

        var handleDragEnd = function (event) {
            event.preventDefault();
        };


        return {
            restrict: 'A',

            link: function (scope, element, attrs) {

                element.bind('dragstart', handleDragStart);
                element.bind('dragend', handleDragEnd);

            }
        }


    }])

     /*
     Takes a daySchedule object which is of form:

     daySchedule = {
     day: 'someDayOfWeek',
     schedule: [
     {
     startTime: time (in milliseconds),
     modeId: 'abc',
     color: '#abcdef'
     },
     ...

     ]
     }

     where schedule is sorted ascending on the startTime.
     */
    .directive('daySchedule', ['$window', '$log', '$timeout', 'calendarNamesService', function ($window, $log, $timeout, calendarNamesService) {

        return {
            restrict: 'A',
            scope: {
                daySchedule: '=',
                modes: '='
            },

            link: function (scope, element, attrs) {
                var names = calendarNamesService.getCalendar().AMPMS;
                var numMillisecondsInDay = 24 * 3600 * 1000;
                var canvas = element[0];
                var context = canvas.getContext("2d");

                var colors = ['#06a94e', '#666666'];
                // gives an array of all the mode ids to help index colors
                var modeIds = _.pluck(scope.modes, 'id');
                var movingSeparator = false;
                // starting values of separator bar when move performed
                var separatorStartX, separatorStartY;
                // range of allowed movement for separator bar
                var separatorMinY, separatorMaxY;
                // modes above and below separator during move
                var upperScheduleItem, lowerScheduleItem;
                var upperScheduleItemDeleted = false, lowerScheduleItemDeleted = false;

                var w = angular.element($window);
                scope.$watch(function () {
                    return {
                        'w': w[0].innerWidth + '-' + w[0].innerHeight
                    };
                }, function (newValue, oldValue) {
                    $timeout(drawSchedule, 0);
                }, true);

                scope.$watch("$parent.$parent.baseStation.scheduleOn", function (newValue, oldValue) {
                    if(newValue) {
                        $timeout(drawSchedule, 0);
                    }
                }, true);

                w.bind('resize', function (event) {
                    scope.$apply();
                });

                element.bind('dragenter', function (event) {

                    return false;
                });

                element.bind('dragover', function (event) {
                    if (event.preventDefault) {
                        event.preventDefault();
                    }

                    if (event.stopPropagation) {
                        event.stopPropagation();
                    }

                    event.dataTransfer.dropEffect = 'move';

                    return false;
                });


                element.bind('drop', function (event) {
                    if (event.preventDefault) {
                        event.preventDefault();
                    }

                    if (event.stopPropagation) {
                        event.stopPropagation();
                    }

                    var mouseX = eventX(event);
                    var mouseY = eventY(event);
                    var data;
                    try {
                        data = JSON.parse(event.dataTransfer.getData('text/plain'));
                    }
                    catch (e) {
                        data = JSON.parse(event.dataTransfer.getData('text'));
                    }
                    if(!data || !data.modeId) {
                        return;
                    }
                    var newModeId = data.modeId;

                    var existingModeId = getExistingModeId(mouseX, mouseY);

                    if (newModeId !== existingModeId) { // only if this is a new mode

                        $log.debug("schedule before modifying:" + JSON.stringify(scope.daySchedule));

                        addNewMode(mouseX, mouseY, existingModeId, newModeId);
                        flattenSchedule();
                        $log.debug("schedule modified:" + JSON.stringify(scope.daySchedule));
                    }

                    return false;
                });


                /*
                 Adds new mode in the existing region, either in upper half or in lower half, depending on
                 whether drop happened above or below midline of region mode occupies.

                 */
                function addNewMode(x, y, existingModeId, newModeId) {

                    var index;
                    var sy = 0, ey;
                    for (var i = 0; i < scope.daySchedule.schedule.length; i++) {
                        if (scope.daySchedule.schedule.length === i + 1) {
                            ey = canvas.height;
                        } else {
                            ey = pixels(scope.daySchedule.schedule[i + 1].startTime);
                        }
                        if ((sy <= y) && (ey > y)) {

                            index = i;
                            break;
                        }
                        // remember starting point of next rectangle is ending point of previous
                        sy = ey;
                    }
                    var midline = (sy + ey) / 2;
                    // get color of added mode
                    var color = colors[ _.indexOf(modeIds, newModeId) % colors.length];

                    if (y < midline) {
                        if (index && scope.daySchedule.schedule[index - 1].modeId === newModeId) { // add to previous regions since the same mode
                            // modify start time of existing mode
                            scope.daySchedule.schedule[index].startTime = milliseconds(midline);
                            // extend start time of existing mode in previous region since same mode as new mode
                            //scope.daySchedule.schedule[index - 1].startTime = milliseconds(sy);
                        } else {
                            // modify start time of existing mode
                            scope.daySchedule.schedule[index].startTime = milliseconds(midline);
                            // add the new mode
                            scope.daySchedule.schedule.push({modeId: newModeId, startTime: milliseconds(sy), color: color});
                        }
                    } else {  // add to upper half of region
                        if ((index !== scope.daySchedule.schedule.length - 1) && scope.daySchedule.schedule[index + 1].modeId === newModeId) {// add to next regions since the same mode
                            // extend start time of existing mode in next region since same mode as new mode
                            scope.daySchedule.schedule[index + 1].startTime = milliseconds(midline);
                        } else {
                            // add the new mode
                            scope.daySchedule.schedule.push({modeId: newModeId, startTime: milliseconds(midline), color: color});
                        }
                    }

                    // sort the schedule on the start times
                    scope.daySchedule.schedule = _.sortBy(scope.daySchedule.schedule, function (item) {
                        return item.startTime;
                    });
                };


                /*
                 Determine the mode id of the region where the new mode id was dropped.
                 */
                function getExistingModeId(x, y) {
                    var sy = 0, ey;
                    for (var i = 0; i < scope.daySchedule.schedule.length; i++) {
                        if (scope.daySchedule.schedule.length === i + 1) {
                            ey = canvas.height;
                        } else {
                            ey = pixels(scope.daySchedule.schedule[i + 1].startTime);
                        }
                        if ((sy <= y) && (ey > y)) {
                            return scope.daySchedule.schedule[i].modeId;
                        }
                        // remember starting point of next rectangle is ending point of previous
                        sy = ey;
                    }
                }


                /*
                 Converts time in milliseconds to pixels.
                 */
                function pixels(time) {
                    var height = canvas.height;
                    return Math.floor(time * height / numMillisecondsInDay);
                };

                /*
                 Converts pixels to milliseconds.
                 */
                function milliseconds(pixels) {
                    var height = canvas.height;
                    return pixels < 0 ? 0 : Math.floor(pixels * numMillisecondsInDay / height);
                };


                function drawSchedule() {

                    canvas.width = element.parent()[0].offsetWidth;
                    canvas.height = element.parent()[0].offsetHeight;
                    // fill in the different regions with colors corresponding to the modes
                    var sx = 0, sy = 0, ex = canvas.width, ey;
                    for (var i = 0; i < scope.daySchedule.schedule.length; i++) {

                        if (scope.daySchedule.schedule.length === i + 1) {
                            ey = canvas.height;
                        } else {
                            ey = pixels(scope.daySchedule.schedule[i + 1].startTime);
                        }
                        context.beginPath();
                        context.fillStyle = scope.daySchedule.schedule[i].color;
                        context.fillRect(sx, sy, ex, ey);

                        // remember starting point of next rectangle is ending point of previous
                        sy = ey;

                        context.stroke();
                    }

                    // draw thin time marking lines
                    context.strokeStyle = "#ccc";

                    for (var j = 1; j < 24; j++) {
                        var h= Math.ceil(j*canvas.height/24);
                        context.beginPath();
                        context.moveTo(0, h - 1);
                        context.lineTo(canvas.width, h - 1);
                        context.lineWidth = 1;
                        context.stroke();
                    }

                    // fill in the mode name and time text
                    context.font = "bold 12px MorebiRounded-Regular, Arial";
                    context.fillStyle = "white";
                    var namex = 8, timex = 8, namey, timey;
                    var startTime, endTime;
                    for (var i = 0; i < scope.daySchedule.schedule.length; i++) {

                        if (scope.daySchedule.schedule.length == i + 1) {
                            var t = pixels(scope.daySchedule.schedule[i].startTime);
                            timey = (i == 0 ? Math.floor(canvas.height  / 2) : Math.floor(t + (canvas.height - t) / 2));
                            startTime = scope.daySchedule.schedule[i].startTime;
                            endTime = milliseconds(canvas.height);
                        } else {
                            timey = Math.floor(pixels(scope.daySchedule.schedule[i + 1].startTime + scope.daySchedule.schedule[i].startTime) / 2);
                            startTime = scope.daySchedule.schedule[i].startTime;
                            endTime = scope.daySchedule.schedule[i + 1].startTime;
                        }
                        if(timey - pixels(scope.daySchedule.schedule[i].startTime) > 10) {
                            context.fillText(getTimeText(startTime) + ' - ' + getTimeText(endTime - 60000), timex, timey);
                        }
                        namey = timey += 20;

                        if(timey - pixels(scope.daySchedule.schedule[i].startTime) > 40) {
                            context.fillText(_.findWhere(scope.modes, {id: scope.daySchedule.schedule[i].modeId}).name, namex, namey);
                        }
                        context.stroke();
                    }

                    // draw thick separator lines separating the modes
                    context.strokeStyle = "#000";
                    context.lineWidth = 6;
                    for (var i = 1; i < scope.daySchedule.schedule.length; i++) {


                        sy = ey = pixels(scope.daySchedule.schedule[i].startTime);
                        context.beginPath();
                        context.moveTo(sx, sy);
                        context.lineTo(ex, ey);
                        context.stroke();
                    }

                };

                /*
                 Takes time in milliseconds since midnight and returns a time in clock time format, eg:

                 "12:00am", or "9:00am", or "8:57pm"

                 */
                function getTimeText(time) {

                    // convert times to nearest minute
                    time = Math.floor(time / (1000 * 60));
                    var text = '';

                    if (time == 0) {
                        text = '12' + names[0];
                    } else if ((0 < time) && (time < 12 * 60)) { // before 12 noon
                        text = Math.floor(time / 60) + ':' + (time % 60 < 10 ? '0' + time % 60 : time % 60) + names[0];
                    } else if ((12 * 60 <= time) && (time < 13 * 60)) {  // in noon hour
                        text = '12:' + (time % 60 < 10 ? '0' + time % 60 : time % 60) + names[1];
                    } else if ((time >= 13 * 60) && (time < 24 * 60)) {
                        text = Math.floor(time / 60) - 12 + ':' + (time % 60 < 10 ? '0' + time % 60 : time % 60) + names[1];
                    } else if (time == 24 * 60) {
                        text = '12' + names[1];
                    }

                    return text;
                };


                /*
                 Change cursor shape when mouse is over one of the separators.
                 */
                element.on('mousemove', function (event) {
                    var mouseX = eventX(event);
                    var mouseY = eventY(event);

                    if (inSeparator(mouseX, mouseY) || movingSeparator) {  // separator location doesn't get updated until end of move
                        element.addClass('separator');

                        if (movingSeparator) { // update the schedule and canvas

                            // snap two separators together if within three pixels distance
                            if ((mouseY > separatorMinY + 3) && (mouseY < separatorMaxY - 3)) { // separator still within bounds
                                if(!lowerScheduleItem) {
                                    debugger;
                                }
                                lowerScheduleItem.startTime = milliseconds(mouseY);

                                // we need to add back the deleted schedule item if we're moving back out again
                                if (upperScheduleItemDeleted) {
                                    scope.daySchedule.schedule.push(upperScheduleItem);
                                    scope.daySchedule.schedule = _.sortBy(scope.daySchedule.schedule, function (item) {
                                        return item.startTime;
                                    });
                                    upperScheduleItemDeleted = false;

                                    //console.log("undeleted upper schedule item");
                                } else if (lowerScheduleItemDeleted) {
                                    scope.daySchedule.schedule.push(lowerScheduleItem);
                                    scope.daySchedule.schedule = _.sortBy(scope.daySchedule.schedule, function (item) {
                                        return item.startTime;
                                    });
                                    lowerScheduleItemDeleted = false;

                                    //console.log("undeleted lower schedule item");

                                }

                            } else if ((mouseY <= separatorMinY + 3) && !upperScheduleItemDeleted) { // deleting upper schedule item
                                lowerScheduleItem.startTime = milliseconds(separatorMinY);
                                // upperScheduleItem.startTime = milliseconds(separatorMinY);

                                scope.daySchedule.schedule = _.without(scope.daySchedule.schedule, upperScheduleItem);

                                upperScheduleItemDeleted = true;
                                //console.log("deleted upper schedule item");


                            } else if ((mouseY >= separatorMaxY - 3) && !lowerScheduleItemDeleted) { // deleting lower schedule item
                                lowerScheduleItem.startTime = milliseconds(separatorMaxY);

                                scope.daySchedule.schedule = _.without(scope.daySchedule.schedule, lowerScheduleItem);

                                lowerScheduleItemDeleted = true;
                                //console.log("deleted lower schedule item");


                            } else {
                                // don't do anything for now
                            }
                            drawSchedule();
                            event.preventDefault();
                            return false;
                        }
                    } else {
                        element.removeClass('separator');
                    }
                });

                /*
                 Start moving separator when down mouse is over one of the separators.
                 */
                element.on('mousedown', function (event) {
                    var mouseX = eventX(event);
                    var mouseY = eventY(event);

                    if (!inSeparator(mouseX, mouseY)) {  // return if not in separator region
                        return;
                    }

                    // start moving separator
                    movingSeparator = true;
                    upperScheduleItem = getUpperScheduleItem(mouseY);
                    lowerScheduleItem = getLowerScheduleItem(mouseY);
                    if(!upperScheduleItem || !lowerScheduleItem) {
                        //debugger;
                    }
                    upperScheduleItemDeleted = false;
                    lowerScheduleItemDeleted = false;
                    separatorMinY = separatorMin(mouseY);
                    separatorMaxY = separatorMax(mouseY);
                    event.preventDefault();
                    return false;
                });

                /*
                 End moving separator when mouse up is over one of the separators.
                 */
                angular.element(document.body).on('mouseup', function (event) {
                //element.on('mouseup', function (event) {
                    if(!movingSeparator) { return; }
                    var mouseX = eventX(event);
                    var mouseY = eventY(event);
                    movingSeparator = false;

                    if(!upperScheduleItem || !lowerScheduleItem) { return; }

                    if ((upperScheduleItem.startTime == lowerScheduleItem.startTime) &&
                        (lowerScheduleItem.startTime == milliseconds(separatorMinY))) { // deleting upperScheduleItem

                        flattenSchedule(upperScheduleItem);
                    }

                    if ((upperScheduleItem.startTime == lowerScheduleItem.startTime) &&
                        (lowerScheduleItem.startTime == milliseconds(separatorMaxY))) { // deleting lowerScheduleItem

                        flattenSchedule(lowerScheduleItem);
                    }

                });

                function flattenSchedule(removedItem) {
                    removedItem && (scope.daySchedule.schedule = _.without(scope.daySchedule.schedule, removedItem));
                    // remove adjacent duplicate mode ids (can happen from one day to next)
                    var tmp = [];
                    _.each(scope.daySchedule.schedule, function (element, index) {
                        if ((index == 0) || (tmp[tmp.length - 1].modeId !== element.modeId)) {
                            tmp.push(element);
                        }
                    });
                    scope.daySchedule.schedule = tmp;
                    drawSchedule();
                };

                /*
                 Determines if event is within the separator bar, probably x is not needed.
                 */
                function inSeparator(x, y) {

                    for (var i = 1; i < scope.daySchedule.schedule.length; i++) {
                        var separatorYStart = pixels(scope.daySchedule.schedule[i].startTime) - 3;
                        var separatorYEnd = pixels(scope.daySchedule.schedule[i].startTime) + 3;
                        if(separatorYStart < y && separatorYEnd > y) { return true;}
                    }

                    return false;
                }

                /*
                 Given a y value in some separator determine the minimum value allowed for y.
                 */
                function separatorMin(y) {
                    for (var i = 1; i < scope.daySchedule.schedule.length; i++) {
                        var separatorYStart = pixels(scope.daySchedule.schedule[i].startTime) - 3;
                        var separatorYEnd = pixels(scope.daySchedule.schedule[i].startTime) + 3;
                        if ((separatorYStart < y) && (separatorYEnd > y)) {
                            return pixels(scope.daySchedule.schedule[i - 1].startTime);
                        }
                    }
                };

                /*
                 Given a y value in some separator determine the maximum value allowed for y.
                 */
                function separatorMax(y) {
                    for (var i = 1; i < scope.daySchedule.schedule.length; i++) {
                        var separatorYStart = pixels(scope.daySchedule.schedule[i].startTime) - 3;
                        var separatorYEnd = pixels(scope.daySchedule.schedule[i].startTime) + 3;
                        if ((separatorYStart < y) && (separatorYEnd > y)) {
                            if (i === scope.daySchedule.schedule.length - 1) { // if last separator just can't move out of box
                                return canvas.height;
                            } else {
                                return pixels(scope.daySchedule.schedule[i + 1].startTime);
                            }
                        }
                    }
                }

                /*
                 Given some y value inside of a separator return the schedule item above that separator.
                 */
                function getUpperScheduleItem(y) {
                    var item = _.find(scope.daySchedule.schedule, function (item) {
                        return (item.startTime < milliseconds(3 + y)) && (item.startTime > milliseconds(y - 3))
                    });
                    var index = _.indexOf(scope.daySchedule.schedule, item);
                    return scope.daySchedule.schedule[index - 1];
                };


                /*
                 Given some y value inside of a separator return the schedule item below that separator.
                 */
                function getLowerScheduleItem(y) {
                    var item = _.find(scope.daySchedule.schedule, function (item) {
                        return (item.startTime < milliseconds(y + 3)) && (item.startTime > milliseconds(y - 3))
                    });
                    var index = _.indexOf(scope.daySchedule.schedule, item);
                    return scope.daySchedule.schedule[index];
                };


                function eventX(event) {
                    var target  = event.target || event.srcElement,
                        rect    = target.getBoundingClientRect(),
                        offsetX = event.clientX - rect.left;

                    return offsetX;

                    if (!event.offsetX) {
                        var x = event.pageX - canvas.offsetLeft;
                        return x;
                    } else {
                        return event.offsetX;
                    }
                };

                function eventY(event) {
                    var target  = event.target || event.srcElement,
                        rect    = target.getBoundingClientRect(),
                        offsetY  = event.clientY - rect.top;

                    return offsetY;
                };
            }
        }
    }])

     .directive('brightness', ['$window', function ($window) {

        return {
            restrict: 'A',

            scope: {
                widgetX: '@',
                imageUrl: '@',
                brightness: '='
            },


            link: function (scope, element, attrs) {

                // size in pixels of x dimension of widget, used for overall scaling

                // the html element on which all of this is defined
                var canvas = element[0];
                var context = canvas.getContext("2d");

                var lastImage = new Image();
                // lastImage.crossOrigin = '';
                lastImage.src = scope.imageUrl;
                lastImage.addEventListener('load', drawInitialImage);

                // lastImage.crossOrigin = 'https://vzs3-dev.s3.amazonaws.com/crossdomain.xml';


                var width = Math.round(scope.widgetX);
                var height;
                if (!lastImage.height || !lastImage.width) {
                    height = scope.widgetX * 9 / 16 // 16 : 9 aspect ratio as default
                } else {
                    height = Math.round(lastImage.height * (scope.widgetX / lastImage.width));
                }

                // var brightnessFilter = filterCanvas(brightness);

                scope.$watch('imageUrl', function () {
                    if (!scope.imageUrl) {
                        lastImage.src = null;
                        return;
                    }
                    // update the image if another url is selected
                    lastImage.src = scope.imageUrl;
                    drawInitialImage();
                });

                function drawInitialImage() {
                    drawRectangle();
                }

                function drawRectangle() {

                    // don't draw if no image
                    if (!lastImage.src) return;

                    canvas.setAttribute('width', width);
                    canvas.setAttribute('height', height);

                    // context.globalAlpha = 0.2;
                    // context.drawImage(lastImage, 0, 0, width, height);

                    setPercent(50);
                    // brightnessFilter(50);
                    /*
                     setTimeout(function () {
                     setPercent(50);
                     }, 3000)
                     */
                }


                function setPercent(delta) {
                    if (canvas.width > 0 && canvas.height > 0) {
                        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

                        var d = imageData.data;
                        for (var i = 0; i < d.length; i += 4) {
                            d[i] += delta;     // red
                            d[i + 1] += delta; // green
                            d[i + 2] += delta; // blue
                        }

                        context.putImageData(imageData, 0, 0);
                        context.drawImage(lastImage, 0, 0, width, height);
                    }
                };

                // apply a filter to the image data contained in the canvas object
                function filterCanvas(filter) {
                    if (canvas.width > 0 && canvas.height > 0) {
                        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                        filter(imageData);
                        context.putImageData(imageData, 0, 0);
                    }
                };

                // filter that brightens an image by adding a fixed value
                // to each color component
                // a javascript closure is used to parameterize the filter
                // with the delta value
                function brightness(delta) {
                    return function (pixels, args) {
                        var d = pixels.data;
                        for (var i = 0; i < d.length; i += 4) {
                            d[i] += delta;     // red
                            d[i + 1] += delta; // green
                            d[i + 2] += delta; // blue
                        }
                        return pixels;
                    };
                };


            }
        }


    }])

    /*
     Directive to invert an image.
     */
    .directive('invert', ['$window', function ($window) {

        return {
            restrict: 'A',

            scope: {
                widgetX: '@',
                imageUrl: '@',
                flip: '=',
                mirror: '='
            },


            link: function (scope, element, attrs) {

                // size in pixels of x dimension of widget, used for overall scaling

                // the html element on which all of this is defined
                var canvas = element[0];
                var context = canvas.getContext("2d");

                var lastImage = new Image();
                lastImage.src = scope.imageUrl;
                lastImage.addEventListener('load', drawInitialImage);
                var width = Math.round(scope.widgetX);
                var height;
                if (!lastImage.height || !lastImage.width) {
                    height = scope.widgetX * 9 / 16 // 16 : 9 aspect ratio as default
                } else {
                    height = Math.round(lastImage.height * (scope.widgetX / lastImage.width));
                }


                scope.$watch('imageUrl', function () {
                    if (!scope.imageUrl) {
                        lastImage.src = null;
                        return;
                    }
                    // update the image if another url is selected
                    lastImage.src = scope.imageUrl;
                    drawInitialImage();
                });

                function drawInitialImage() {
                    drawRectangle();
                }

                function drawRectangle() {

                    // don't draw if no image
                    if (!lastImage.src) return;

                    if (scope.flip) {

                        canvas.setAttribute('width', width);
                        canvas.setAttribute('height', height);
                        context.drawImage(lastImage, 0, 0, width, height);

                        invert();

                    } else {
                        canvas.setAttribute('width', width);
                        canvas.setAttribute('height', height);
                        context.drawImage(lastImage, 0, 0, width, height);
                    }
                }

                function invert() {
                    context.save();
                    // context.setTransform(1, 0, 0, 1, 0, 0);
                    context.translate(width / 2, height / 2);
                    context.rotate(Math.PI);
                    // canvas.setAttribute('width', width);
                    // canvas.setAttribute('height', height);
                    context.drawImage(lastImage, -width / 2, -height / 2, width, height);
                    context.restore();
                }

                /*
                 Inverts the method when user clicks on image.
                 */
                element.on('click', function (event) {
                    scope.flip = scope.flip ? false : true;
                    scope.mirror = scope.flip;

                    drawRectangle();

                })


            }
        }


    }])

    /*
     Contains logic for setting/resizing/moving a zoom box within an imaged displayed in canvas element.  If the passed
     zoom region exceeds the size of the image, scales the region size to 80% of the image.  After mouse up rescales
     (reverses the scaling) the zoom coordinates to actual.  Uses two-way binding provided by Angular to dynamically
     set the coordinates of the zoom region directly from the user mouse actions.

     As per hardware team, the following are the limits on zoom region.
     Minimum X size 384
     Minimum Y size 216
     Maximum X size 1280
     Maximum Y size 720

     @param imageUrl the url of the image to be displayed
     @param tlX, tlY, brX, brY the top-left and bottom-right coordinates of the bounding zoom box
     */
    .directive('zoomDisplay', ['$window', '$log', '$rootScope', 'appProperties', function ($window, $log, $rootScope, appProperties) {

        return {
            restrict: 'A',

            scope: {
                imageUrl: '@',
                tlX: '=',
                tlY: '=',
                brX: '=',
                brY: '=',
                widgetRule: '=',
                cameraId: '='
            },

            link: function (scope, element, attrs) {
                // size in pixels of x dimension of widget, used for overall scaling
                // todo:  make this configurable and then dynamically configurably
                var HANDLE_SIZE = 16;
                var DRAW_INTERVAL = 16;  // a little more than 60fps
                // the html element on which all of this is defined
                var canvas;
                var height;
                var width;
                var maxHeight = 720;
                var maxWidth = 1280;

                var minZoomX = 384;
                var minZoomY = 216;
                var maxZoomX = 1280;
                var maxZoomY = 720;
                var minZoomRule = 144;

                var lastImage = new Image();
                lastImage.src = scope.imageUrl || "/img2/camera_thumb.png";
                canvas = element[0];
                var scaledZoom = {tlX: null, tlY: null, brX: null, brY: null};
                var scaleX, scaleY;
                // keep track of browser reloads and when tlX, tlY, etc. first come into scope
                var reloadFlag = true;
                (scope.brX > maxZoomX) && (scope.brX = 1280);
                (scope.brY > maxZoomY) && (scope.brY = 720);
                lastImage.addEventListener('load', function () {
                        scaleZoom(scaledZoom, scope);
                        drawInitialImage();
                });

                lastImage.addEventListener('error', function () {
                    // debugger;
                    $log.debug('error loading full frame snapshot');
                    lastImage.src && ($rootScope.$broadcast(appProperties.appEvents.TAKE_SNAPSHOT, scope.cameraId));
                    lastImage.src = "/img2/camera_thumb.png";
                });

                scope.$watch('tlX', function () {
                    if ((typeof scope.tlX != 'undefined') && reloadFlag) {
                        (scope.brX > maxZoomX) && (scope.brX = 1280);
                        (scope.brY > maxZoomY) && (scope.brY = 720);
                        scaleZoom(scaledZoom, scope);
                        drawInitialImage();
                        // don't go here again until tlX, tlX, etc. go out of scope
                        reloadFlag = false;
                    }
                });

                scope.$watch('imageUrl', function () {
                    // update the image if another url is selected
                    lastImage.src = scope.imageUrl || "/img2/camera_thumb.png";
                    $log.debug('calling drawInitialImage from watch imageUrl handler');
                    if (typeof scope.tlX != 'undefined') {
                        scaleZoom(scaledZoom, scope);
                        drawInitialImage();
                    }
                });

                var w = angular.element($window);
                scope.$watch(function () {
                    return {
                        'w': w[0].innerWidth
                    };
                }, function (newValue, oldValue) {
                    width = element.parent()[0].offsetWidth;
                        height = Math.round(9 * width / 16);
                        scaleZoom(scaledZoom, scope);
                        drawInitialImage();
                }, true);

                w.bind('resize', function (event) {
                    scope.$apply();
                });

                var dragStartX = null;
                var dragStartY = null;
                var dragEndX = null;
                var dragEndY = null;
                var dragVector = {dx: 0, dy: 0};
                var inDrag = false;
                var inResize = false;
                var inResizeTop = false;

                // only work with scaled coordinates for the zoom box
                function scaleZoom(zoom, scope) {
                    // todo: fix me why are height and width not defined as numbers here
                    if (!width || !height) {
                        return;
                        //width = scope.widgetX;
                        //height = Math.floor(scope.widgetX * 9 / 16);
                    }

                    scaleX = 1;
                    scaleY = 1;
                    scaleX = width / maxWidth;
                    scaleY = height / maxHeight;

                    zoom.tlX = Math.floor(scope.tlX * scaleX);
                    zoom.tlY = Math.floor(scope.tlY * scaleY);
                    zoom.brX = Math.floor(scope.brX * scaleX);
                    zoom.brY = Math.floor(scope.brY * scaleY);
                };

                /*
                 Set the zoom coordinates on the scope attributes.  Called at the end (mouse up event) of box resizing
                 or box moving.
                 */
                function setZoom(tlX, tlY, brX, brY) {
                    if(scope.widgetRule) {
                        scope.tlX = Math.floor(tlX / scaleX);
                        scope.tlY = Math.floor(tlY / scaleY);
                        scope.brX = Math.floor(brX / scaleX);
                        scope.brY = Math.floor(brY / scaleY);
                    }
                    else {
                        scope.tlX = Math.floor(tlX / scaleX / 16) * 16;
                        scope.tlY = Math.floor(tlY / scaleY / 9) * 9;
                        scope.brX = Math.floor(brX / scaleX / 16) * 16;
                        scope.brY = Math.floor(brY / scaleY / 9) * 9;
                    }
                };

                function drawInitialImage() {
                    drawHilitedRectangle(scaledZoom.tlX, scaledZoom.tlY, scaledZoom.brX, scaledZoom.brY);
                }

                element.on('mousedown', function (event) {
                    event.preventDefault();
                    dragStartX = eventX(event);
                    dragStartY = eventY(event);

                    if (inZoomRegion(dragStartX, dragStartY)) { // start drag
                        inDrag = true;
                    } else if (inHandleRegion(dragStartX, dragStartY)) {
                        inResize = true;
                        inResizeTop = inTlHandle(dragStartX, dragStartY);
                    }

                });

                element.on('dblclick', function (event) {
                    event.preventDefault();
                    scope.tlX = 0;
                    scope.tlY = 0;
                    scope.brX = maxZoomX;
                    scope.brY = maxZoomY;

                    scaleZoom(scaledZoom, scope);
                    drawInitialImage();

                });


                element.on('mousemove', function (event) {
                    // don't do anything if not in drag operation
                    if (!inDrag && !inResize) return;

                    dragEndX = eventX(event);
                    dragEndY = eventY(event);
                    dragVector.dx = dragEndX - dragStartX;
                    dragVector.dy = dragEndY - dragStartY;
                    dragStartX = dragEndX;
                    dragStartY = dragEndY;
                    if (inResize) {
                        if(!scope.widgetRule) {
                            dragVector.dy = 9 * dragVector.dx / 16;
                        }
                        doResize();
                    } else if (inDrag) {
                        doDrag();
                    }
                });

                angular.element(document.body).on('mouseup', function (event) {
                    if (!inDrag && !inResize) return;

                    inDrag = false;
                    inResize = false;
                });

                function eventX(event) {
                    if (!event.offsetX) {
                        var x = event.layerX;
                        return x;
                    } else {
                        return event.offsetX;
                    }
                }

                function eventY(event) {
                    if (!event.offsetY) {
                        var y = event.layerY;
                        return y;
                    } else {
                        return event.offsetY;
                    }
                }

                function doDrag() {
                    var newTlX = scaledZoom.tlX + dragVector.dx, newTlY = scaledZoom.tlY + dragVector.dy,
                        newBrX = scaledZoom.brX + dragVector.dx, newBrY = scaledZoom.brY + dragVector.dy;

                    if (rectangleInOuterRegion(newTlX, newTlY, newBrX, newBrY)) {
                        // set the actual zoom coordinates at end of drag (move) operation
                        setZoom(newTlX, newTlY, newBrX, newBrY);
                        scaledZoom.tlX = newTlX, scaledZoom.tlY = newTlY, scaledZoom.brX = newBrX, scaledZoom.brY = newBrY;
                        drawInitialImage();
                    }
                }

                function doResize() {
                    var newTlX = scaledZoom.tlX, newTlY = scaledZoom.tlY, newBrX = scaledZoom.brX, newBrY = scaledZoom.brY;
                    if (inResizeTop) {
                        newTlX += dragVector.dx;
                        newTlY += dragVector.dy;
                    } else {
                        newBrX += dragVector.dx;
                        newBrY += dragVector.dy;
                    }

                    if (rectangleInOuterRegion(newTlX, newTlY, newBrX, newBrY)
                        && minMaxDimensionsObserved(newTlX, newTlY, newBrX, newBrY)) {
                        // set the actual zoom coordinates at end of resize operation
                        setZoom(newTlX, newTlY, newBrX, newBrY);
                        scaledZoom.tlX = newTlX, scaledZoom.tlY = newTlY, scaledZoom.brX = newBrX, scaledZoom.brY = newBrY;
                        drawInitialImage();
                    }
                }

                function minMaxDimensionsObserved(tlX, tlY, brX, brY) {
                    tlX /= scaleX, tlY /= scaleY, brX /= scaleX, brY /= scaleY;
                    var result = (brX-tlX) >= (scope.widgetRule ? minZoomRule : minZoomX) && (brX-tlX) <= maxZoomX && (brY-tlY) >= (scope.widgetRule ? minZoomRule : minZoomY) && (brY-tlY) <= maxZoomY;

                    return result;
                }

                function rectangleInOuterRegion(tlX, tlY, brX, brY) {
                    if (tlX < 0 || tlY < 0) return false;
                    var height = Math.round(lastImage.height * (width / lastImage.width));
                    if (brX > width || brY > height) return false;

                    // if here, it's in region
                    return true;
                }

                /*
                 Returns true if event inside the zoomed region, and not in the handle.
                 */
                function inZoomRegion(x, y) {
                    return between(x, scaledZoom.tlX, scaledZoom.brX) && between(y, scaledZoom.tlY, scaledZoom.brY) && !inHandleRegion(x, y);
                }

                /*
                 Returns true if event inside the non-zoomed region, and not in the handle.
                 */
                function inOuterRegion(x, y) {
                    return !inZoomRegion(x, y) && !inHandleRegion(x, y);
                }

                /*
                 Returns true if event inside the handle region.
                 */
                function inHandleRegion(x, y) {
                    return inTlHandle(x, y) || inBrHandle(x, y);
                }

                /*
                 Returns true if event inside the top left handle.
                 */
                function inTlHandle(x, y) {
                    return between(x, scaledZoom.tlX, scaledZoom.tlX + HANDLE_SIZE) && between(y, scaledZoom.tlY, scaledZoom.tlY + HANDLE_SIZE);
                }

                /*
                 Returns true if event inside the bottom right handle.
                 */
                function inBrHandle(x, y) {
                    return between(x, scaledZoom.brX - HANDLE_SIZE, scaledZoom.brX) && between(y, scaledZoom.brY - HANDLE_SIZE, scaledZoom.brY);
                }

                /*
                 Returns true if the integer u is in [v, w]
                 */
                function between(u, v, w) {
                    return (u >= v) && (u <= w);
                }

                function drawHilitedRectangle(x1, y1, x2, y2) {
                    // don't draw if no image
                    if (!lastImage.src) {
                        return;
                    }

                    canvas.setAttribute('width', width);
                    canvas.setAttribute('height', height);
                    var context = canvas.getContext("2d");
                    context.globalAlpha = 0.2;
                    context.drawImage(lastImage, 0, 0, width, height);
                    context.globalAlpha = 1.0;
                    context.lineWidth = 3;
                    context.strokeStyle = '#06a94e';
                    context.beginPath();
                    context.moveTo(x1, y1);
                    context.lineTo(x2, y1);
                    context.lineTo(x2, y2);
                    context.lineTo(x1, y2);
                    context.closePath();
                    context.stroke();
                    context.save();
                    context.clip();
                    context.drawImage(lastImage, 0, 0, width, height);
                    context.restore();
                    context.fillStyle = "#0f6d35";
                    context.fillRect(x1, y1, HANDLE_SIZE, HANDLE_SIZE);
                    context.fillRect(x2 - HANDLE_SIZE, y2 - HANDLE_SIZE, HANDLE_SIZE, HANDLE_SIZE);
                }

            }
        }
    }])


    /*
     Places default image in event of image loading error.
     */
    .directive('defaultImage', function ($log) {
        var defaultImage = {
            link: function postLink(scope, element, attrs) {
                element.bind('error', function () {
                    $log.warn('default image set on error');
                    angular.element(this).attr('src', attrs.defaultImage);
                });
            }
        }

        return defaultImage;
    })

    .directive('passwordVerify', [function () {
        return {
            require: 'ngModel',
            scope: {
                passwordVerify: '='
            },
            link: function (scope, element, attrs, ctrl) {
                scope.ctrl = ctrl;
                scope.$watch("passwordVerify+ctrl.$viewValue", function (value) {
                    if (value || value == "") {
                        ctrl.$setValidity('newPasswordVerify', (scope.passwordVerify || "") == scope.ctrl.$viewValue);
                    }
                });
            }
        }
    }])

    .directive('cardNumber', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                var validateModel = function (ccNumber) {
                    var valid = ccNumber && ccNumber.match(/^[\d]{16}$/);
                    if (valid) {

                        var digits = ccNumber.split('');
                        var lastDigit = digits.pop();
                        digits = digits.reverse();

                        var sum = _.reduce(digits, function (memo, number, index) {
                            if ((index + 1) % 2) {
                                number *= 2;
                                number = number > 9 ? number - 9 : number;
                            }
                            return memo += parseInt(number);
                        }, 0);
                        valid = ((10 - (sum % 10)) % 10) === parseInt(lastDigit);
                    }
                    ngModel.$setValidity('cardNumber', valid);
                    return ccNumber;
                };

                var validateDom = function (ccNumber) {
                    var valid = ccNumber && ccNumber.match(/^[\d]{16}$/);
                    if (valid) {

                        var digits = ccNumber.split('');
                        var lastDigit = digits.pop();
                        digits = digits.reverse();

                        var sum = _.reduce(digits, function (memo, number, index) {
                            if ((index + 1) % 2) {
                                number *= 2;
                                number = number > 9 ? number - 9 : number;
                            }
                            return memo += parseInt(number);
                        }, 0);
                        valid = ((10 - (sum % 10)) % 10) === parseInt(lastDigit);
                    }
                    ngModel.$setValidity('cardNumber', valid);
                    return ccNumber;
                };
                //For DOM - > model validation
                ngModel.$parsers.unshift(validateModel);

                ngModel.$formatters.unshift(validateDom);
            }
        };
    })

    .directive('cardCvv', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                var validateModel = function (ccNumber) {
                    var valid = ccNumber && ccNumber.match(/^[\d]{3,4}$/);
                    ngModel.$setValidity('cardCvv', valid);
                    return ccNumber;
                };
                var validateDom = function (ccNumber) {
                    var valid = ccNumber && ccNumber.match(/^[\d]{3,4}$/);
                    ngModel.$setValidity('cardCvv', valid);
                    return ccNumber;
                };
                //For DOM - > model validation
                ngModel.$parsers.unshift(validateModel);

                ngModel.$formatters.unshift(validateDom);
            }
        };
    })

    .directive('cardExpiration', [function () {
        return {

            require: 'ngModel',

            scope: {
                monthVerify: '='
            },

            link: function (scope, element, attrs, ctrl) {
                scope.$watch(function () {
                    var combined;

                    if (scope.monthVerify || ctrl.$viewValue) {
                        combined = scope.monthVerify + '_' + ctrl.$viewValue;
                    }
                    return combined;
                }, function (combined) {
                    var expYear = ctrl.$viewValue;
                    if (!expYear || ctrl.$error.required || scope.$parent.cardInformationForm.cc_exp_mm.$error.required || scope.monthVerify == "0") {
                        ctrl.$setValidity('cardExpiration', true);
                        return ctrl.$viewValue;
                    }
                    var valid = expYear.match(/^[\d]{4}$/);

                    if (valid) {
                        var today = new Date();
                        var month = today.getUTCMonth() + 1;
                        var year = today.getUTCFullYear();
                        var expMonth = parseInt(scope.monthVerify);
                        valid = (100 * ctrl.$viewValue + expMonth) >= (100 * year + month);
                    }
                    if (!valid) {
                        scope.$parent.cardInformationForm.cc_exp_mm.$setViewValue(scope.$parent.cardInformationForm.cc_exp_mm.$viewValue);
                    }
                    scope.$parent.cardInformationForm.cc_exp_mm.$setValidity('cardExpiration', valid);
                    return ctrl.$viewValue;
                })

            }

        }
    }])

    // todo: refactor duplicate code
    .directive('emailUsed', function ($timeout, userService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                var stop_timeout;
                return scope.$watch(function () {

                    return ngModel.$modelValue;
                }, function (email) {
                    $timeout.cancel(stop_timeout);

                    if (!email || ngModel.$error.email || ngModel.$error.emailArlo || email == attrs.emailUsed) {
                        ngModel.$setValidity('used', true);
                        return;
                    }

                    stop_timeout = $timeout(function () {
                        userService.checkEmailUsage(email).then(
                            function (result) {
                                return ngModel.$setValidity('used', ngModel.$pristine || !result.data.arlo);
                            },
                            function (result) {
                                return ngModel.$setValidity('used', true);
                            });
                    }, 400);
                });
            }
        };
    })

    .directive('emailUnknown', function ($timeout, userService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                var stop_timeout;
                return scope.$watch(function () {
                    return ngModel.$modelValue;
                }, function (email) {
                    $timeout.cancel(stop_timeout);

                    if (!email || ngModel.$error.email) {
                        ngModel.$setValidity('unknown', true);
                        return;
                    }

                    stop_timeout = $timeout(function () {
                        userService.checkEmailUsage(email).then(
                            function (result) {
                                return ngModel.$setValidity('unknown', result.data.data.used);
                            },
                            function (result) {
                                return ngModel.$setValidity('unknown', true);
                            });
                    }, 400);
                });
            }
        };
    })

    .directive('friendUnique', function ($timeout, friendsService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                var stop_timeout;

                return scope.$watch(function (scope) {
                    return ngModel.$modelValue;
                }, function (email, scope) {
                    // $timeout.cancel(stop_timeout);
                    if (!email || ngModel.$error.email) {
                        ngModel.$setValidity('unique', true);
                        return;
                    }

                    // stop_timeout = $timeout(function () {
                    var existingFriend = _.findWhere(friendsService.friends, {email: email});
                    if (existingFriend) {
                        return ngModel.$setValidity('unique', false);
                    } else {
                        return ngModel.$setValidity('unique', true);
                    }
                    // }, 400);
                });
            }
        };
    })

    .directive('toggle', [function () {

        return {
            restrict: 'A',
            scope: {
                model: '='
            },

            link: function (scope, element, attrs) {
                scope.$watch('model.value', function (value) {

                    if (scope.model.value === scope.$id) {
                        scope.selected = 'active';
                    } else {
                        scope.selected = ''; // remove the active class
                    }

                });

                scope.toggleMe = function () {
                    scope.model.value = scope.$id;
                };

            }

        };
    }])

    .directive('autoFillFix', [function () {

        return function (scope, elem, attrs) {
            // Fixes Chrome bug: https://groups.google.com/forum/#!topic/angular/6NlucSskQjY
            elem.prop('method', 'POST');

            // Fix autofill issues where Angular doesn't know about autofilled inputs
            if (attrs.ngSubmit) {
                setTimeout(function () {
                    elem.unbind('submit').bind('submit', function (e) {
                        e.preventDefault();
                        elem.find('input').triggerHandler('change');
                        scope.$apply(attrs.ngSubmit);
                    });
                }, 0);
            }
        };
    }])

    .directive('empty', [function () {
        return function (scope, elem, attrs) {
            scope.$watch(function () {
                if (!elem.val().length) {
                    return elem.addClass("empty");
                } else {
                    return elem.removeClass("empty");
                }
            }, true);
        };
    }])

    .directive('sliderDrag', function ($document) {
        return function (scope, element, attr) {
            var startX = 0, x = 0, screenStart = 0 , screenEnd = 0,
                ctrlScope = scope;

            element.on('mousedown', function (event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                var pWidth = element.parent()[0].offsetWidth - 20;
                var proc = parseFloat(element.css('left'));
                screenStart = event.pageX - proc * pWidth / 100;
                screenEnd = screenStart + pWidth;
                startX = event.pageX - x;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
                $document.on('mouseleave', mouseup);
            });

            function mousemove(event) {
                var proc;
                if (event.pageX < screenStart) {
                    proc = 0;
                }
                else if (event.pageX > screenEnd) {
                    proc = 100;
                }
                else {
                    proc = 100 * (event.pageX - screenStart) / (screenEnd - screenStart);
                }

                if (ctrlScope.setSliderPosition) {
                    ctrlScope.setSliderPosition(proc);
                    ctrlScope.$apply();
                }

                if (ctrlScope.setPercent) {
                    ctrlScope.setPercent(proc, attr.sliderDrag);
                    ctrlScope.$apply();
                }
            }

            function mouseup() {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
                $document.unbind('mouseleave', mouseup);
            }
        }
    })

    .directive('recordingVideo', function ($document, $timeout, $filter) {
        return function (scope, element, attr) {
            element.on('timeupdate', function (event) {
                if (scope.$root.$$phase != '$apply') {
                    scope.$apply(function () {
                        scope.time = element[0].currentTime;
                        scope.timePercent = element[0].duration ? 100 * (element[0].currentTime / element[0].duration) : 0;
                    });
                }
            });

            element.on('ended', function (event) {
                element[0].pause();
                scope.$apply(function () {
                    scope.playing = false;
                });
            });

            element.on('loadedmetadata', function (event) {
                scope.$apply(function () {
                    scope.time = 0;
                    scope.duration = element[0].duration;
                    scope.timePercent = 0;
                    scope.isLoadingVideo = false;
                    scope.play();
                });
            });
        }
    })

    .directive('recordingBox', ['$window', '$timeout', function ($window, $timeout) {
        return {
            link: function (scope, element, attrs) {
                var w = angular.element($window);
                scope.$watch(function () {
                    return {
                        'w': w[0].innerHeight
                    };
                }, function (newValue, oldValue) {
                    changeSize();
                }, true);

                w.bind('resize', function (event) {
                    scope.$apply();
                });
                function changeSize() {
                    var value = w[0].innerHeight;
                    var height = value - (attrs.hasOwnProperty("recordingShared") ? 160 : 274);
                    element.css('height', height + "px");
                    element.css('width', 1.7778*(height)+"px");
                    //height: calc(100vh - 274px);
                    //width: calc(1.7778*(100vh - 274px)); /* 110 + 60 + 16+ 88*/
                };
                $timeout(changeSize);
            }
        };
    }])

    .directive('requiredTip', function ($filter) {
        return {
            replace: true,
            restrict: 'E',
            template: "<div class='required-tip'>{{'label_required_fields' | i18n}}</div>"
        };
    })

    .directive('cameraThumbnail', function ($document, $timeout) {
        return function (scope, element, attr) {
            element.on('error', function (event) {
                element[0].src = "/img2/camera_thumb.png";
            });
        };
    })

    .directive('cameraZoom', function ($document, $timeout, appProperties) {
        return function (scope, element, attr) {
            var zoom = 1, step = 0.2, maxZoom = 10, offsetX = 0, offsetY = 0, startX, startY,
                startOffsetX, startOffsetY;
            var el;
            $timeout(function () {
                el = angular.element(document.getElementById(attr.cameraZoom));
                applyCSS();
            });
            element.on('wheel', function (e) {
                e.preventDefault();

                var delta = e.deltaY || e.detail || e.wheelDelta;
                var direct = delta / Math.abs(delta);
                zoom = (direct > 0 ? zoom + step: zoom - step);
                if (zoom < 1) {
                    zoom = 1;
                }
                else if(zoom > maxZoom) {
                    zoom = maxZoom;
                }
                else {
                    applyCSS();
                }
            });
            element.on('mousedown', function (event) {
                // Prevent default dragging of selected content
                startX = event.screenX;
                startY = event.screenY;

                if(zoom == 1) {
                    return;
                }
                element.addClass("arlo-move");
                event.preventDefault();
                startOffsetX = offsetX;
                startOffsetY = offsetY;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
                $document.on('mouseleave', mouseup);
            });
            element.on('click', elclick);

            function mousemove(event) {
                offsetX = startOffsetX + 100*(event.screenX - startX)/element[0].clientWidth/zoom;
                offsetY = startOffsetY + 100*(event.screenY - startY)/element[0].clientHeight/zoom;
                applyCSS();
            }

            function elclick(event) {
                if(Math.abs(event.screenX - startX) < 3 && Math.abs(event.screenY - startY) < 3) {
                    scope.$apply(function () {
                        if(scope.playing) {
                            scope.pause();
                        }
                        else {
                            scope.play();
                        }
                    });
                }
            }

            function mouseup(event) {
                element.removeClass("arlo-move");
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
                $document.unbind('mouseleave', mouseup);
            }

            function fixOffset() {
                var maxOffset = 50 * (zoom - 1) / zoom;
                if(offsetX < -maxOffset) {
                    offsetX = -maxOffset;
                }
                else if(offsetX > maxOffset) {
                    offsetX = maxOffset;
                }
                if(offsetY < -maxOffset) {
                    offsetY = -maxOffset;
                }
                else if(offsetY > maxOffset) {
                    offsetY = maxOffset;
                }
            }

            function applyCSS() {
                fixOffset();

                var css = "scale(" + zoom + ") translate(";
                css += offsetX + "%,";
                css += offsetY + "%)";

                el.css('transform', css);
            }
        };
    })

    .directive('sortable', function ($document, $timeout, $log, $filter) {

        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                ngModel: '='
            },

            link: function (scope, element, attr, ngModel) {
//                if (scope.ngModel.length < 2) {
//                    return;
//                }
                scope.$watch('ngModel', function (value) {
                    //$log.info("sortable model changed: ", JSON.stringify(value));
                    if (value && value.length > 1) {
                        $timeout(function () {
                            element.updateSortable();
                        }, 100);
                    }

                }, true);
                var res = element.sortable();
                res.on('sortupdate', function (event, sort) {
                    scope.$apply(function () {
                        // reorder cameras
                        var m = $filter('orderBy')(ngModel.$modelValue, 'displayOrder');
                        if (sort.oldIndex < sort.newIndex) {
                            m[sort.oldIndex].displayOrder = sort.newIndex + 1;
                            for (var i = sort.oldIndex + 1; i < sort.newIndex + 1; i++) {
                                m[i].displayOrder = i;
                            }
                        }
                        else if (sort.oldIndex > sort.newIndex) {
                            m[sort.oldIndex].displayOrder = sort.newIndex + 1;
                            for (var i = sort.newIndex; i < sort.oldIndex; i++) {
                                m[i].displayOrder = i + 2;
                            }
                        }
                        scope.$parent.sortDevices();
                        scope.$parent.compareSoortedDevices();
                    });
                });

            }
        };
    })

    .directive('recordTimer', function () {

        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                model: '=ngModel'
            },

            link: function (scope, element, attr, ngModel) {
                scope.isRunning = false;
                scope.interval = 1000;
                function tick() {

                    scope.millis = new Date() - scope.startTime;
                    var adjustment = scope.millis % 1000;

                    calculateTime();

                    // not using $timeout for a reason. Please read here - https://github.com/siddii/angular-timer/pull/5
                    scope.timeoutId = setTimeout(function () {
                        tick();
                        scope.$digest();
                    }, scope.interval - adjustment);
                };
                function calculateTime() {

                    var millis = Math.floor(scope.millis / 1000);
                    var seconds = Math.floor(millis % 60);
                    var hours = Math.floor(millis / 3600);
                    var minutes = Math.floor((millis - (hours * 3600)) / 60);

                    //add leading zero if number is smaller than 10
                    var sseconds = seconds < 10 ? '0' + seconds : seconds;
                    var mminutes = minutes < 10 ? '0' + minutes : minutes;
                    var hhours = hours < 10 ? '0' + hours : hours;
                    element.text(hhours + ':' + mminutes + ':' + sseconds);
                };

                scope.start = function () {
                    scope.startTime = new Date();
                    tick();
                    scope.isRunning = true;
                };

                scope.stop = function () {
                    if (scope.timeoutId) {
                        clearTimeout(scope.timeoutId);
                    }
                    scope.timeoutId = null;
                    scope.isRunning = false;
                };

                element.bind('$destroy', function () {
                    scope.stop();
                });

                scope.$parent.$watch(attr.ngModel, function (value) {
                    if (!scope.isRunning && value) {
                        scope.start();
                    }
                    else if (scope.isRunning && !value) {
                        scope.stop();
                    }
                }, true);
            }
        };
    })

    .directive('bodyEvents', function ($rootScope, appProperties) {
        return function (scope, element, attr) {
            element.on('click', function (event) {
                $rootScope.$broadcast(appProperties.appEvents.BODY_CLICK, event);
            });
        };
    })

    .directive('scrollTop', function ($rootScope, $uiViewScroll, appProperties) {
        return function (scope, element, attr) {
            $rootScope.$on(appProperties.appEvents.SCROLL_TOP, function (event) {
                $uiViewScroll(element);
            });
        };
    })

    .directive('emailArlo', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                var regex = /^(?!.{191})[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/;
                var validateModel = function (email) {
                    var valid = email && email.match(regex);
                    ngModel.$setValidity('emailArlo', valid);
                    return email;
                };
                var validateDom = function (email) {
                    var valid = email && email.match(regex);
                    ngModel.$setValidity('emailArlo', valid);
                    return email;
                };
                //For DOM - > model validation
                ngModel.$parsers.unshift(validateModel);

                ngModel.$formatters.unshift(validateDom);
            }
        };
    })

    .directive('selectRecording', function () {
        return function (scope, element, attr) {
            element.on('click', function (event) {
                scope.$parent.selectRecording(scope.recording.recordingNumber);
                if(scope.recording.selected) {
                    element.addClass('vlist-preview-selected');
                }
                else {
                    element.removeClass('vlist-preview-selected');
                }
                scope.$parent.$apply();
            });
        };
    })

    .directive('selectAllRecordings', function ($rootScope) {
        return function (scope, element, attr) {
            $rootScope.$on("selectAllRecordings", function (event) {
                var recordings = scope.$parent.getRecordings();
                for (var i = 0; i < recordings.length; i++) {
                    if (!scope.$parent.isFriendRecording(recordings[i]))
                        element.children().children().eq(i).addClass('vlist-preview-selected');
                }
            });
        };
    })

    .directive('selectAllRecycleRecordings', function () {
        return function (scope, element, attrs) {
            scope.$on("selectAllRecycleRecordings", function (event) {
                element.children().children().children().addClass('vlist-preview-selected');
            });
        };
    })

    .directive('unselectAllRecycleRecordings', function () {
        return function (scope, element) {
            scope.$on("unselectAllRecycleRecordings", function (event) {
                element.children().children().children().removeClass('vlist-preview-selected');
            });
        }
    })

    .directive('recycleModeTrigger', function () {
        return function (scope, element) {
            scope.$on("recycleModeEnable", function (event) {
                scope.recycleModeEnable = true
            });
            scope.$on("recycleModeDisable", function (event) {
                scope.recycleModeEnable = false
            });
        }
    })

    .directive('footerButtons', function ($timeout, $filter) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                function getTextWidth(text, font) {
                    // re-use canvas object for better performance
                    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
                    var context = canvas.getContext("2d");
                    context.font = font || "12px MorebiRounded-Regular, Arial";
                    var metrics = context.measureText(text);
                    return Math.ceil(metrics.width);
                };

                function updateWidth() {
                    var width = _.max(attrs.hasOwnProperty("selectBar") ? [getTextWidth($filter("i18n")("select_bar_label_favorite")),
                            getTextWidth($filter("i18n")("select_bar_label_share")),
                            getTextWidth($filter("i18n")("select_bar_label_download")),
                            getTextWidth($filter("i18n")("select_bar_label_delete")), 30] :
                            [getTextWidth($filter("i18n")("navigation_label_mode")),
                        getTextWidth($filter("i18n")("navigation_label_cameras")),
                        getTextWidth($filter("i18n")("navigation_label_library")),
                        getTextWidth($filter("i18n")("navigation_label_settings")), 30]
                        );
                    _.each(element.children(), function (elem) {
                        angular.element(elem.children[0]).css("width", width+"px");
                    });
                };

                scope.$on('localizeResourcesUpdated', function() {
                    updateWidth();
                });
                updateWidth();
            }
        };
    })

    .directive('scrollPosition', function ($document) {
        return function (scope, element, attr) {
            element.on('scroll', function (event) {
                scope.scrollTopPosition(event.target.scrollTop)
            });
        }
    })

    .directive('offers', function ($rootScope, $filter) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$on("offers", function (type, data) {
                    element.html(data);
                    var links = element.find("a");
                    _.each(links, function (link) {
                        var href = link.href;
                        if(href.indexOf("planId")!= -1){
                            var params = href.split("?")[1].split("&");
                            var plan = {};
                            _.each(params, function (param){
                                var props = param.split("=");
                                plan[props[0]] = props[1];
                            });
                            angular.element(link).on("click", function (event) {
                                $rootScope.$broadcast("plan_selected", plan);
                                event.preventDefault();
                            });
                            link.href = "";
                        }
                    });
                })
            }
        };
    })

    .directive('sharedPlayer', ['$window', '$timeout', function ($window, $timeout) {
        return {
            link: function (scope, element) {
                var w = angular.element($window);
                var p = element.parent()[0];
                scope.$watch(function () {
                    return {
                        "w": "" + w[0].innerHeight + w[0].innerWidth
                    };
                }, function () {
                    changeSize();
                }, true);

                w.bind("resize", function () {
                    scope.$apply();
                });

                function changeSize() {

                    var h = p.clientHeight;
                    var w = p.clientWidth;
                    if(h > w) {
                        element.css("width", "");
                        element.css("margin-left", "");
                        return;
                    }
                    w = 0.7*w;
                    h = h - 88;
                    if(w/h > 16/9) {
                        var newW = (16* h / 9 - 10);
                        newW = (newW > 220 ? newW : 220);
                        element.css("width", newW + "px");
                        element.css("margin-left", (w - newW - 1) + "px");
                    }
                    else {
                        element.css("width", "");
                        element.css("margin-left", "");
                    }
                };
                $timeout(changeSize, 500);
            }
        };
    }])

    .directive('noSpace', function(){
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    var transformedInput = inputValue.replace(/^[\s\u00A0u2028u2029]+/g, '');
                    if (transformedInput != inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return transformedInput;
                });
            }
        };
    })
;



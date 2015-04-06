'use strict';

/* Services */

angular.module('arloApp.services.calendarNamesService', [])
    .factory('calendarNamesService', function (appProperties, $location, utilService) {
        return {
            getCalendar: function () {
                if(this.calendar) { return this.calendar;}
                var lang = utilService.getLang();
                this.calendar = this.cal[lang];
                if(!this.calendar) {
                    this.calendar = this.cal.en;
                }
                return this.calendar;
            },
            cal: {
                "en": {
                    "AMPMS": [
                        "AM",
                        "PM"
                    ],
                    "DAY": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday"
                    ],
                    "MONTH": [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December"
                    ],
                    "SHORTDAY": [
                        "Sun",
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat"
                    ],
                    "SHORTMONTH": [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec"
                    ]
                },
                "de": {
                    "AMPMS": [
                    "vorm.",
                    "nachm."
                ],
                    "DAY": [
                        "Montag",
                        "Dienstag",
                        "Mittwoch",
                        "Donnerstag",
                        "Freitag",
                        "Samstag",
                        "Sonntag"
                    ],
                    "MONTH": [
                        "Januar",
                        "Februar",
                        "M\u00e4rz",
                        "April",
                        "Mai",
                        "Juni",
                        "Juli",
                        "August",
                        "September",
                        "Oktober",
                        "November",
                        "Dezember"
                    ],
                    "SHORTDAY": [
                        "So.",
                        "Mo.",
                        "Di.",
                        "Mi.",
                        "Do.",
                        "Fr.",
                        "Sa."
                    ],
                    "SHORTMONTH": [
                        "Jan.",
                        "Feb.",
                        "M\u00e4rz",
                        "Apr.",
                        "Mai",
                        "Juni",
                        "Juli",
                        "Aug.",
                        "Sep.",
                        "Okt.",
                        "Nov.",
                        "Dez."
                    ]},
                "fr": {
                    "AMPMS": [
                    "AM",
                    "PM"
                ],
                    "DAY": [
                        "lundi",
                        "mardi",
                        "mercredi",
                        "jeudi",
                        "vendredi",
                        "samedi",
                        "dimanche"
                    ],
                    "MONTH": [
                        "janvier",
                        "f\u00e9vrier",
                        "mars",
                        "avril",
                        "mai",
                        "juin",
                        "juillet",
                        "ao\u00fbt",
                        "septembre",
                        "octobre",
                        "novembre",
                        "d\u00e9cembre"
                    ],
                    "SHORTDAY": [
                        "dim.",
                        "lun.",
                        "mar.",
                        "mer.",
                        "jeu.",
                        "ven.",
                        "sam."
                    ],
                    "SHORTMONTH": [
                        "janv.",
                        "f\u00e9vr.",
                        "mars",
                        "avr.",
                        "mai",
                        "juin",
                        "juil.",
                        "ao\u00fbt",
                        "sept.",
                        "oct.",
                        "nov.",
                        "d\u00e9c."
                    ]},
                "it": {
                    "AMPMS": [
                    "AM",
                    "PM"
                ],
                    "DAY": [
                        "luned\u00ec",
                        "marted\u00ec",
                        "mercoled\u00ec",
                        "gioved\u00ec",
                        "venerd\u00ec",
                        "sabato",
                        "domenica"
                    ],
                    "MONTH": [
                        "gennaio",
                        "febbraio",
                        "marzo",
                        "aprile",
                        "maggio",
                        "giugno",
                        "luglio",
                        "agosto",
                        "settembre",
                        "ottobre",
                        "novembre",
                        "dicembre"
                    ],
                    "SHORTDAY": [
                        "dom",
                        "lun",
                        "mar",
                        "mer",
                        "gio",
                        "ven",
                        "sab"
                    ],
                    "SHORTMONTH": [
                        "gen",
                        "feb",
                        "mar",
                        "apr",
                        "mag",
                        "giu",
                        "lug",
                        "ago",
                        "set",
                        "ott",
                        "nov",
                        "dic"
                    ]},
                "ru": {
                    "AMPMS": [
                    "AM",
                    "PM"
                ],
                    "DAY": [
                        "\u043f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a",
                        "\u0432\u0442\u043e\u0440\u043d\u0438\u043a",
                        "\u0441\u0440\u0435\u0434\u0430",
                        "\u0447\u0435\u0442\u0432\u0435\u0440\u0433",
                        "\u043f\u044f\u0442\u043d\u0438\u0446\u0430",
                        "\u0441\u0443\u0431\u0431\u043e\u0442\u0430",
                        "\u0432\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435"
                    ],
                    "MONTH": [
                        "\u044f\u043d\u0432\u0430\u0440\u044c",
                        "\u0444\u0435\u0432\u0440\u0430\u043b\u044c",
                        "\u043c\u0430\u0440\u0442",
                        "\u0430\u043f\u0440\u0435\u043b\u044c",
                        "\u043c\u0430\u044f",
                        "\u0438\u044e\u043d\u044c",
                        "\u0438\u044e\u043b\u044c",
                        "\u0430\u0432\u0433\u0443\u0441\u0442",
                        "\u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044c",
                        "\u043e\u043a\u0442\u044f\u0431\u0440\u044c",
                        "\u043d\u043e\u044f\u0431\u0440\u044c",
                        "\u0434\u0435\u043a\u0430\u0431\u0440\u044c"
                    ],
                    "SHORTDAY": [
                        "\u0432\u0441",
                        "\u043f\u043d",
                        "\u0432\u0442",
                        "\u0441\u0440",
                        "\u0447\u0442",
                        "\u043f\u0442",
                        "\u0441\u0431"
                    ],
                    "SHORTMONTH": [
                        "\u044f\u043d\u0432.",
                        "\u0444\u0435\u0432\u0440.",
                        "\u043c\u0430\u0440\u0442\u0430",
                        "\u0430\u043f\u0440.",
                        "\u043c\u0430\u044f",
                        "\u0438\u044e\u043d\u044f",
                        "\u0438\u044e\u043b\u044f",
                        "\u0430\u0432\u0433.",
                        "\u0441\u0435\u043d\u0442.",
                        "\u043e\u043a\u0442.",
                        "\u043d\u043e\u044f\u0431.",
                        "\u0434\u0435\u043a."
                    ]},
                "ja": {
                    "AMPMS": [
                        "\u5348\u524d",
                        "\u5348\u5f8c"
                    ],
                    "DAY": [
                        "\u65e5\u66dc\u65e5",
                        "\u6708\u66dc\u65e5",
                        "\u706b\u66dc\u65e5",
                        "\u6c34\u66dc\u65e5",
                        "\u6728\u66dc\u65e5",
                        "\u91d1\u66dc\u65e5",
                        "\u571f\u66dc\u65e5"
                    ],
                    "MONTH": [
                        "1\u6708",
                        "2\u6708",
                        "3\u6708",
                        "4\u6708",
                        "5\u6708",
                        "6\u6708",
                        "7\u6708",
                        "8\u6708",
                        "9\u6708",
                        "10\u6708",
                        "11\u6708",
                        "12\u6708"
                    ],
                    "SHORTDAY": [
                        "\u65e5",
                        "\u6708",
                        "\u706b",
                        "\u6c34",
                        "\u6728",
                        "\u91d1",
                        "\u571f"
                    ],
                    "SHORTMONTH": [
                        "1\u6708",
                        "2\u6708",
                        "3\u6708",
                        "4\u6708",
                        "5\u6708",
                        "6\u6708",
                        "7\u6708",
                        "8\u6708",
                        "9\u6708",
                        "10\u6708",
                        "11\u6708",
                        "12\u6708"
                    ]
                },
                "sv": {
                    "AMPMS": [
                        "fm",
                        "em"
                    ],
                    "DAY": [
                        "s\u00f6ndag",
                        "m\u00e5ndag",
                        "tisdag",
                        "onsdag",
                        "torsdag",
                        "fredag",
                        "l\u00f6rdag"
                    ],
                    "MONTH": [
                        "januari",
                        "februari",
                        "mars",
                        "april",
                        "maj",
                        "juni",
                        "juli",
                        "augusti",
                        "september",
                        "oktober",
                        "november",
                        "december"
                    ],
                    "SHORTDAY": [
                        "s\u00f6n",
                        "m\u00e5n",
                        "tis",
                        "ons",
                        "tors",
                        "fre",
                        "l\u00f6r"
                    ],
                    "SHORTMONTH": [
                        "jan.",
                        "feb.",
                        "mars",
                        "apr.",
                        "maj",
                        "juni",
                        "juli",
                        "aug.",
                        "sep.",
                        "okt.",
                        "nov.",
                        "dec."
                    ]
                }
            }

        };
    });
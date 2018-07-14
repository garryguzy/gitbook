'use strict';

var Immutable = require('immutable');
var moment = require('moment');

module.exports = Immutable.Map({
    // Format a date
    // ex: 'MMMM Do YYYY, h:mm:ss a
    date: function date(time, format) {
        return moment(time).format(format);
    },


    // Relative Time
    dateFromNow: function dateFromNow(time) {
        return moment(time).fromNow();
    }
});
//# sourceMappingURL=defaultFilters.js.map
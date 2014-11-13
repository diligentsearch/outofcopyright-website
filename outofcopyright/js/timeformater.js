/*!
 * timeformater.js Copyright(c) 2014 Wu Yuntao
 * https://github.com/WuYuntaoTheGreat/timeformatter
 * Released under the MIT License.
 * vim: set ai et ts=4 sw=4 cc=80 nu:
 */

/*
 * The formatter class
 */
function TimeFormatter(lang){
    lang = lang || 'en';
    var _re = /[yMLdEeHhamsZ]+/g;
    this.res = TimeFormatter.resources[lang];
    this.resKeys = {};

    /*
     * Pad the given number by '0' (zero), to 'size' width.
     */
    function _pad (n, size) {
        var zeros = "00000000";
        size = size > zeros.length ? zeros.length : size;
        n = n + '';
        return zeros.substring(0, size - n.length) + n;
    }

    /* 
     * Get ISO 8601 format timezone offset
     */
    function _getTimezoneOffset (d) {
        var tzo = d.getTimezoneOffset();
        var sign = tzo < 0 ? '+' : '-';
        tzo = Math.abs(tzo);
        return sign 
            + _pad(Math.floor(tzo / 60), 2)
            + ':'
            + _pad(Math.floor(tzo % 60), 2);
    }
    this.localTimezoneOffset = _getTimezoneOffset(new Date());

    /*
     * Sort the keys of an associative array
     */
    function _sortKeys (obj) {
        var keys = [];
        for (var k in obj){
            keys.push(k);
        }
        return keys.sort();
    }
    for (var k in this.res){
        this.resKeys[k] = _sortKeys(this.res[k]);
    }

    /*
     * Get localized string of given number, and required length.
     */
    this.getResourceOf = function(n, kind, len){
        var r = this.res[kind];
        var rk = this.resKeys[kind];

        var i = rk.length - 1;
        while(i > 0){
            if (len >= rk[i]) break; 
            i--;
        }

        return r[rk[i]][n];
    };

    /*
     * Format one mark using given Date object.
     */
    this.formatMark = function (d, mark) {
        var len = mark.length;
        var val = null;

        switch (mark[0]){
            case 'y': 
                return (d.getFullYear() + '').substring(len >= 4 ? 0 : 2);
            case 'M': 
                return this.getResourceOf(d.getMonth(), 'M', len);
            case 'L': 
                return _pad(d.getMonth() + 1, len);
            case 'd': 
                return _pad(d.getDate(), len);
            case 'E': 
                return this.getResourceOf(d.getDay(), 'E', len);
            case 'e': 
                return _pad(d.getDay(), len);
            case 'H':
                return _pad(d.getHours(), len);
            case 'h': 
                return _pad(d.getHours() % 12, len);
            case 'a': 
                return this.getResourceOf(d.getHours() < 12 ? 0 : 1, 'a', len);
            case 'm': 
                return _pad(d.getMinutes(), len);
            case 's': 
                return _pad(d.getSeconds(), len);
            default:
                throw 'Should not happen';
        }
    };


    /*
     * The real format function.
     */
    this.format = function (d, pattern) {
        if (pattern === undefined){
            pattern = d;
            d = new Date();
        }

        if (typeof d === 'string'){
            d = new Date(d);
        }

        var decoArr = pattern.split(_re);
        var markArr = pattern.match(_re);
        var result  = decoArr[0];

        var i;
        for (i = 0; i < markArr.length; i++){
            result += this.formatMark(d, markArr[i]) + decoArr[i + 1];
        }
        return result;
    };

}

/*
 * Resources
 */
TimeFormatter.resources = {
    'en': {
        'M' : {
            1: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
            3: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec'],
            5: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December']
        },
        'E' : {
            1: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            3: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            5: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                'Friday', 'Saturday']
        },
        'a' : {
            1: ['a', 'p'],
            2: ['am', 'pm']
        }
    }
};

/*
 * Export the formatter object.
 */
if(typeof module != 'undefined'){
    TimeFormatter.resources['zh'] = require('../lang/zh');
    module.exports = timeformater = function(lang){
        return new TimeFormatter(lang);
    }
}
/**
 * Created by 78462 on 2017/3/5.
 */
(function(global, utils) {
    'use strict';

    var q = utils.q, watch = utils.watch, on = utils.on;

    function V(options) {
        this.eles = {};
        this.funcs = options.funcs;
        this.eventer = options.eventer;
        this.template = options.template;
        this.initRootEle(options.el);
        this.initEles(options.eles);
        this.bindDataListener(options.data);
        this.bindEvent(options.eventsMap);
        this.provideInterface(options.api);
        this.init = options.init;
    }

    V.prototype.q = function(selector) {
        return q.call(this.el, selector);
    };

    V.prototype.initRootEle = function(el) {
        if (typeof el === 'string') {
            this.el = q(el);
        } else if (options.el instanceof Element) {
            this.el = el;
        } else {
            return console.error('el is must be a selector or Element');
        }
    };

    V.prototype.initEles = function(eles) {
        var arr;
        for (var key in eles) {
            arr = eles[key].split(' ');
            this.eles[key] = arr[1] ? this.q(arr[0])[parseInt(arr[1])] : this.q(eles[key]);
        }
    };

    V.prototype.bindDataListener = function(data) {
        for (var key in data) {
            watch(this, key, data[key].type, data[key].init, data[key].callback, data[key].extend);
        }
    };

    V.prototype.bindEvent = function(map) {
        var arr,
            type,
            selector;
        for (var key in map) {
            arr = key.split(' ');
            type = arr[0];
            selector = arr[1];
            on(this.el, type, selector, this.funcs[map[key]]);
        }
    };

    V.prototype.provideInterface = function(map) {
        for (var key in map) {
            if (typeof map[key] === 'string') {
                this.eventer.on(key, this.funcs[map[key]]);
            } else {
                this.eventer.on(key, map[key]);
            }
        }
    };

    V.prototype.render = function (str, obj) {
        var newStr = str.replace(/{{([\s\w\.\s]*)}}/g, function(str, key) {
            var keys = key.trim().split('.'),
                value = obj[keys.shift()];
            if (value == null) {
                return '';
            }
            for (var i = 0; i < keys.length; i++) {
                value = value[keys[i]];
                if (value == null) {
                    return '';
                }
            }
            return value.toString();
        });
        return newStr;
    };

    V.prototype.exec = function(name, data) {
        this.eventer.emit(name, data);
    };

    global.V = V;

})(this, utils);
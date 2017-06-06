/**
 * Created by 78462 on 2017/3/5.
 */
(function(global) {
    'use strict';

    /*****
     * 获取DOM元素
     * @param selector
     * @returns {*}
     */

    function q(selector) {
        var flag = selector.slice(0, 1),
            ele = selector.substring(1);
        if (flag === '#') {
            return document.getElementById(ele);
        } else if (flag === '.') {
            if (this !== window) {
                return this.getElementsByClassName(ele);
            }
            return document.getElementsByClassName(ele);
        } else if (flag === '[') {
            if (this !== window) {
                return this.querySelectorAll(selector);
            }
            return document.querySelectorAll(selector);
        } else {
            if (this !== window) {
                return this.getElementsByTagName(selector);
            }
            return document.getElementsByTagName(selector);
        }
    }

    /*****
     *
     * @param value 需要转化成json格式的字符串
     * @returns {*}
     */

    function zh(value) {
        if (typeof value === 'string') {
            try {
                value = JSON.parse(value);
            } catch(e) {
                console.log(e);
            }
        }
        return value;
    }

    /******
     *
     * @constructor 事件构造器
     */

    function Eventer() {
        var key = 0;
        this.events = {};
        this.getKey = function() {
            return key++;
        };
    }

    Eventer.prototype.on = function(eventName, callback) {
        var key = this.getKey();
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push({
            key: key,
            func: callback
        });
        return key;
    };

    Eventer.prototype.emit = function(eventName, _) {
        var events = this.events[eventName],
            args = Array.prototype.slice.call(arguments, 1),
            i, m;

        if (!events) {
            return;
        }
        for (i = 0, m = events.length; i < m; i++) {
            events[i].func.apply(null, args);
        }
    };

    Eventer.prototype.remove = function(eventName, key) {
        if (this.events[eventName] && this.events[eventName].length) {
            if (key === undefined) {
                return this.events[eventName] = [];
            }
            var index = this.findIndex(this.events[eventName], key);
            index > -1 ? this.events[eventName].splice(index, 1) : void 0;
        }
    };

    Eventer.prototype.findIndex = function(arr, key) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].key === key) {
                return i;
            }
        }
        return -1;
    };

    /***
     * 数据监测，强制约定值的类型
     * @param obj 属性挂载的对象
     * @param propName 需要监听的属性名
     * @param type 需要监听的属性类型
     * @param init 需要监听的属性的初始值
     * @param callback 当监听的属性值改变时的回调函数
     * @returns {*}
     */

    function watch(obj, propName, type, init, callback, extend) {
        var oldValue = init, proxy;
        if (typeof type !== 'string') {
            return console.error('type must be string and the value must be string, boolean, number, object, array, function');
        }
        type = type.toLowerCase();
        if (type !== 'string' && type !== 'boolean' && type !== 'number' && type !== 'object' && type !== 'array' && type !== 'no limit') {
            return console.error('type must be string and the value must be string, boolean, number, object, array, function or no limit');
        }
        if (type !== 'no limit') {
            if (typeof init !== type && !(init instanceof Array && type === 'array')) {
                return console.error('the init value type not equal expected type');
            }
        }
        if (typeof extend !== 'object' && extend !== undefined) {
            return console.error('the extend is not a object');
        }
        //对初始值进行扩展
        assign();
        try {
            Object.defineProperty(obj, propName, {

                get: function() {
                    return oldValue;
                },
                set: function(newValue) {
                    if (oldValue === newValue) {
                        return;
                    }
                    if (type !== 'no limit') {
                        if (typeof newValue !== type && !(newValue instanceof Array && type === 'array')) {
                            return console.error('the value type not equal expected type');
                        }
                    }
                    proxy = oldValue;
                    oldValue = newValue;
                    //当回调函数返回false时，认为该次赋值有误，恢复到上一次的值
                    if (callback(newValue, oldValue) === false) {
                        oldValue = proxy;
                    } else {
                        proxy = newValue;
                        assign();
                    }
                },

                enumerable: true,
                configurable: true
            });
        } catch (error) {
            console.dir(error);
            console.log("browser not supported.");
        }

        function assign() {
            if (extend === undefined) {
                return;
            }
            for (var key in extend) {
                oldValue[key] = extend[key];
            }
        }
    }

    /******
     * DOM事件绑定与事件代理
     * @returns {*}
     */

    function on() {
        var length = arguments.length,
            ele = arguments[0],
            type = arguments[1],
            selector, callback;
        if (!(ele instanceof Element || ele === document || ele === window)) {
            return console.error('ele is not a Element !');
        }
        if (length === 3) {
            if (typeof arguments[2] === 'function') {
                addEvent(ele, type, arguments[2]);
            } else {
                console.error('callback is not a function');
            }
        } else if (length === 4) {
            if (typeof arguments[3] === 'function') {
                selector = arguments[2];
                callback = arguments[3];
                addEvent(ele, type, function (e) {
                    proxyEvent(e, callback);
                });
            } else {
                console.error('callback is not a function');
            }
        }

        function proxyEvent(e, callback) {
            e = e || window.event;
            var src = e.target || e.srcElement;
            var currentTarget = e.currentTarget;
            var target = match(currentTarget, src, selector);
            if (target instanceof Element) {
                if (callback) {
                    callback.call(target, e);
                }
            }

            function match(ancestor, child, selector) {
                var flag = selector.charAt(0);
                var result = false;
                if (ancestor === child || child.parentNode === null) {
                    return false;
                }
                if (flag === '#') {
                    result = child.id === selector.slice(1);
                } else if (flag === '.') {
                    result = (' ' + child.className + ' ').indexOf(' ' + selector.slice(1) + ' ') !== -1;
                } else if (flag === '[') {
                    var arr = selector.slice(1, -1).split('=');
                    result = arr[1] ? child.getAttribute(arr[0]) === arr[1] : child.getAttribute(arr[0]) !== null;
                } else {
                    result = child.tagName.toLowerCase() === selector.toLowerCase();
                }
                if (result) {
                    return child;
                }
                return match(ancestor, child.parentNode, selector);
            }
        }

        function addEvent(ele, type, callback) {
            if (typeof ele.addEventListener === 'function') {
                ele.addEventListener(type, callback);
            } else {
                ele.attachEvent('on' + type, function (e) {
                    callback(fixEvent(e));
                });
            }

            function fixEvent(event) {
                event.preventDefault = fixEvent.preventDefault;
                event.stopPropagation = fixEvent.stopPropagation;
                return event;
            }

            fixEvent.preventDefault = function () {
                this.returnValue = false;
            };
            fixEvent.stopPropagation = function () {
                this.cancelBubble = true;
            };
        }
    }

    /**
     * 判断元素是否含有某个类
     * @param ele
     * @param value
     * @returns {boolean}
     */

    function hasClass(ele, value) {
        var result = ' ' + ele.className + ' ';
        var target = ' ' + value + ' ';
        return result.indexOf(target) > -1;
    }

    /*****
     * 移除目标元素上的某个类，类值为value
     * @param ele
     * @param value
     * @returns {string}
     */

    function removeClass(ele, value) {
        var result = ' ' + ele.className + ' ';
        var target = ' ' + value + ' ';
        while (result.indexOf(target) > -1) {
            result = result.replace(target, ' ');
        }
        ele.className = value ? result.trim() : '';
    }

    /******
     * 给目标元素添加一个类，类值为value
     * @param ele
     * @param value
     */

    function addClass(ele, value) {
        var result = ' ' + ele.className + ' ';
        var target = ' ' + value + ' ';
        result.indexOf(target) < 0 ? ele.className = (result + value).trim() : void 0;
    }

    function show(ele) {
       removeClass(ele, 'hide');
    }

    function hide(ele) {
        addClass(ele, 'hide');
    }

    /***
     * 将字段转化成小驼峰格式
     * @param value
     * @returns {*}
     */

    function camel(value) {
        var arr = value.split('-');
        var len = arr.length;
        if (len === 1) {
            return value;
        }
        for (var i = 1; i < len; i ++) {
            arr[i] = arr[i][0].toUpperCase() + arr[i].slice(1);
        }
        return arr.join('');
    }

    /**
     * 用于控制函数执行，当多次调用时，推迟到最后一次调用后的某一个时间段执行
     * @param func 需要执行的函数
     * @param wait 间隔时间
     * @returns {Function}
     */

    function debounce(func, wait) {
        var timeout, context, args, timestamp, result;

        var later = function() {
            var last = new Date() - timestamp;
            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                result = func.apply(context, args);
                context = args = null;
            }
        };

        return function() {
            timestamp = new Date();
            if (!timeout) {
                context = this;
                args = arguments;
                timeout = setTimeout(later, wait);
            }

            return result;
        };
    }

    /***
     * 用于控制函数执行，某个时间段内只执行一次
     * @param func 需要执行的函数
     * @param wait 间隔时间
     * @returns {Function}
     */

    function throttle(func, wait) {
        var timeout, context, args, result;

        var later = function() {
            timeout = null;
            result = func.apply(context, args);
            context = args = null;
        };

        return function() {
            if (!timeout) {
                context = this;
                args = arguments;
                timeout = setTimeout(later, wait);
            }

            return result;
        };
    }

    /***
     * 序列化时间
     * @param time
     * @param flag 这个参数代表当间隔时间超过一天后是否需要显示小时和分钟
     * @returns {*}
     */

    function serializeTime(time, flag) {
        var now = new Date(),
            old = new Date(time),
            interval = now - old,
            result,
            day = 24 * 60 * 60 * 1000,
            week = 7 * day;
        if (interval < day && now.getDate() === old.getDate()) {
            return formatTime(old, 'hh:mm');
        } else if (interval < week) {
            switch (old.getDay()) {
                case 0:
                    result = '星期日';
                    break;
                case 1:
                    result = '星期一';
                    break;
                case 2:
                    result = '星期二';
                    break;
                case 3:
                    result = '星期三';
                    break;
                case 4:
                    result = '星期四';
                    break;
                case 5:
                    result = '星期五';
                    break;
                case 6:
                    result = '星期六';
                    break;
            }
        } else if (old.getFullYear() === now.getFullYear()) {
            result = formatTime(old, 'mm-dd');
        } else {
            result = formatTime(old, 'yy-mm-dd');
        }
        if (flag) {
            result += formatTime(old, 'hh:mm');
        }
        return result;
    }

    function formatTime(time, flag) {
        var arr = flag.split(' '),
            arr1 = [],
            arr2 = [];
        time = new Date(time);
        arr.forEach(function(item) {
            if (item.indexOf('-') !== -1) {
                item.split('-').forEach(function(item) {
                    var month ,day;
                    item = item.toLocaleLowerCase();
                    switch (item) {
                        case 'yy':
                            arr1.push(time.getFullYear() + '');
                            break;
                        case 'mm':
                            month = time.getMonth() + 1 + '';
                            month = month < 10 ? '0' + month : month;
                            arr1.push(month);
                            break;
                        case 'dd':
                            day = time.getDate() + '';
                            day = day < 10 ? '0' + day : day;
                            arr1.push(day);
                    }
                });
            } else if (item.indexOf(':') !== -1) {
                item.split(':').forEach(function(item) {
                    var hour, minute, seconds;
                    item = item.toLocaleLowerCase();
                    switch (item) {
                        case 'hh':
                            hour = time.getHours() + '';
                            hour = hour < 10 ? '0' + hour : hour;
                            arr2.push(hour);
                            break;
                        case 'mm':
                            minute = time.getMinutes() + '';
                            minute = minute < 10 ? '0' + minute : minute;
                            arr2.push(minute);
                            break;
                        case 'ss':
                            seconds = time.getHours() + '';
                            seconds = seconds < 10 ? '0' + seconds : seconds;
                            arr2.push(item.getDate() + '');
                    }
                });
            }
        });
        return arr1.join('-') + ' ' + arr2.join(':');
    }

    function findIndex(arr, target) {
        var index = -1;
        arr.some(function(item, i) {
            if (typeof target !== 'function') {
                if (item === target) {
                    index = i;
                    return true;
                }
            } else {
                var result = target(item, index, arr);
                if (result) {
                    index = i;
                    return true;
                }
            }
        });
        return index;
    }

    function find(arr, target) {
        return arr[findIndex(arr, target)];
    }

    function remove(arr, target) {
        var index = findIndex(arr, target);
        if (index !== -1) {
            return Array.prototype.splice.call(arr, index, 1);
        }
    }

    function assign(obj) {
        var arg = Array.prototype.slice.call(arguments, 1);
        if (arg.length === 0) {
            return obj;
        }
        arg.forEach(function(item) {
            for (var key in item) {
                if (item.hasOwnProperty(key)) {
                    obj[key] = item[key];
                }
            }
        });
        return obj;
    }


    var utils = {};

    utils.q = q;
    utils.zh = zh;
    utils.Eventer = Eventer;
    utils.watch = watch;
    utils.on = on;
    utils.show = show;
    utils.hide = hide;
    utils.hasClass = hasClass;
    utils.removeClass = removeClass;
    utils.addClass = addClass;
    utils.camel = camel;
    utils.debounce = debounce;
    utils.throttle = throttle;
    utils.serializeTime = serializeTime;
    utils.formatTime = formatTime;
    utils.findIndex = findIndex;
    utils.find = find;
    utils.assign = assign;
    utils.remove = remove;

    global.utils = utils;

})(this);
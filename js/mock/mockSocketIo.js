/**
 * Created by 78462 on 2017/4/9.
 */
(function(global, utils) {

    'use strict';

    var serverEvents = {},
        clientEvents = {},
        serverEvents1 = {},
        clientEvents1 = {},
        server, client;

    server = {
        on: function(eventName, callback) {
            serverEvents[eventName] = serverEvents[eventName] || [];
            serverEvents[eventName].push(callback);
        },
        once: function(eventName, callback) {
            serverEvents1[eventName] = serverEvents1[eventName] || [];
            serverEvents1[eventName].push(callback);
        },
        emit: function(eventName, _) {
            var events = clientEvents[eventName],
                events1 = clientEvents1[eventName],
                args = Array.prototype.slice.call(arguments, 1);
            if (!events) {
                return;
            }
            events.forEach(function(item) {
                item.apply(null, args);
            });
            if (!events1) {
                return;
            }
            events1.forEach(function(item) {
                item.apply(null, args);
            });
            events1 = [];
        }
    };

    client = {
        on: function(eventName, callback) {
            clientEvents[eventName] = clientEvents[eventName] || [];
            clientEvents[eventName].push(callback);
        },
        once: function(eventName, callback) {
            clientEvents1[eventName] = clientEvents1[eventName] || [];
            clientEvents1[eventName].push(callback);
        },
        emit: function(eventName, _) {
            var events = serverEvents[eventName],
                events1 = serverEvents1[eventName],
                args = Array.prototype.slice.call(arguments, 1);
            if (!events) {
                return;
            }
            events.forEach(function(item) {
                item.apply(null, args);
            });
            if (!events1) {
                return;
            }
            events1.forEach(function(item) {
                item.apply(null, args);
            });
            events1 = [];
        }
    };

    global.io = {
        listen: function() {
            return server;
        },
        connect: function() {
            return client;
        }
    };
})(this, utils);
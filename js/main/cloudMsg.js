/**
 * Created by 78462 on 2017/3/6.
 */
;
(function(global, uitls, app) {

    'use strict';

    var mask = app.mask, show = utils.show, hide = utils.hide;
    var vm = new V({
        el: '#cloud-msg-container',
        eles: {
            content: '.content 0'
        },
        data: {
            show: {
                type: 'boolean',
                init: false,
                callback: function(value) {
                    value ? show(vm.el) : hide(vm.el);
                }
            },
            content: {
                type: 'array',
                init: [],
                extend: {
                    push: function(item) {
                        var lastTime = this.slice(-1)[0].time;
                        if (item.time - lastTime > config.timeout) {
                            vm.eles.content.insertAdjacentHTML('beforeEnd', app.funcs.getMsgEle({
                                type: 'timeMsg',
                                time: item.time
                            }));
                        }
                        vm.eles.content.insertAdjacentHTML('beforeEnd', app.funcs.getMsgEle(item));
                        Array.prototype.push.call(this, item);
                    }
                },
                callback: function(value) {
                    var str = '', lastTime = 0, timeout = config.timeout;
                    value.forEach(function(item, index) {
                        if (index === 0 || item.time - lastTime > timeout) {
                            str += app.funcs.getMsgEle({
                                type: 'timeMsg',
                                time: item.time
                            });
                        }
                        lastTime = item.time;
                        str += app.funcs.getMsgEle(item);
                    });
                    if (str === '') {
                        str += app.funcs.getMsgEle({
                            type: 'systemMsg',
                            content: '暂无消息'
                        });
                    }
                    vm.eles.content.innerHTML = str;
                }
            }
        },
        funcs: {
            hide: function() {
                vm.show = false;
            },
            show: function() {
                vm.show = true;
                vm.exec('chatWindow-hide');
            },
            fetch: function(obj) {
                app.funcs.getCloudMsg(obj);
            },
            refresh: function(content) {
                vm.content = content;
                vm.funcs.show();
            },
            showChatWindow: function() {
                vm.exec('chatWindow-show');
            }
        },
        eventsMap: {
            'click .close': 'showChatWindow'
        },
        api: {
            'cloudMsg-show': 'show',
            'cloudMsg-hide': 'hide',
            'cloudMsg-fetch': 'fetch',
            'cloudMsg-refresh': 'refresh'
        },
        eventer: app.eventer
    });

})(this, utils, app);
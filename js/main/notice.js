/**
 * Created by 78462 on 2017/3/6.
 */
;
(function(global, uitls, app) {

    'use strict';

    var mask = app.mask, show = utils.show, hide = utils.hide, q = utils.q, serializeTime = utils.serializeTime;
    var vm = new V({
        el: '#notice',
        eles: {
            tabs: '.tab',
            contents: '.content',
            systemNotice: '#system-notice',
            customNotice: '#custom-notice'
        },
        data: {
            show: {
                type: 'boolean',
                init: false,
                callback: function(value) {
                    value ? show(vm.el) : hide(vm.el);
                }
            },
            active: {
                type: 'string',
                init: 'system-notice',
                callback: function(value) {
                    [].forEach.call(vm.eles.tabs, function(item) {
                        item.getAttribute('data-notice') === value ? utils.addClass(item, 'active') : utils.removeClass(item, 'active');
                    });
                    [].forEach.call(vm.eles.contents, function(item) {
                        item.id === value ? show(item) : hide(item);
                    });
                }
            },
            systemNotice: {
                type: 'array',
                init: [],
                extend: {
                    push: function(item) {
                        var obj = {
                            name: item.name,
                            time: serializeTime(item.time, 'hh:mm'),
                            content: item.content
                        };
                        obj.avatar = item.avatar || item.type === 'p2p' ? data.defaultAvatar : (item.type === 'group' ? data.defaultGroupAvatar : data.defaultTeamAvatar);

                        vm.eles.systemNotice.insertAdjacentHTML('afterBegin', vm.render(vm.template.systemNoticeItem, obj));
                        Array.prototype.push.call(this, item);
                    }
                },
                callback: function(value) {
                    var str = '';
                    value.forEach(function(item) {
                        var obj = {
                            name: item.name,
                            time: serializeTime(item.time, 'hh:mm'),
                            content: item.content
                        };
                        obj.avatar = item.avatar || item.type === 'p2p' ? data.defaultAvatar : (item.type === 'group' ? data.defaultGroupAvatar : data.defaultTeamAvatar);
                        str += vm.render(vm.template.systemNoticeItem, obj);
                    });
                    vm.eles.systemNotice.innerHTML = str;
                }
            },
            customNotice: {
                type: 'array',
                init: [],
                extend: {
                    push: function(item) {
                        var obj = {
                            name: item.name,
                            time: serializeTime(item.time, 'hh:mm'),
                            content: item.content
                        };
                        obj.avatar = item.avatar || item.type === 'p2p' ? data.defaultAvatar : (item.type === 'group' ? data.defaultGroupAvatar : data.defaultTeamAvatar);

                        vm.eles.systemNotice.insertAdjacentHTML('afterBegin', vm.render(vm.template.systemNoticeItem, obj));
                        Array.prototype.push.call(this, item);
                    }
                },
                callback: function(value) {
                    var str = '';
                    value.forEach(function(item) {
                        var obj = {
                            name: item.name,
                            time: serializeTime(item.time, 'hh:mm'),
                            content: item.content
                        };
                        obj.avatar = item.avatar || item.type === 'p2p' ? data.defaultAvatar : (item.type === 'group' ? data.defaultGroupAvatar : data.defaultTeamAvatar);
                        str += vm.render(vm.template.customNoticeItem, obj);
                    });
                    vm.eles.customNotice.innerHTML = str;
                }
            }
        },
        template: {
            systemNoticeItem: q('#notice-system-item-template').innerHTML,
            customNoticeItem: q('#notice-custom-item-template').innerHTML
        },
        funcs: {
            hide: function() {
                mask.show = vm.show = false;
            },
            show: function() {
                mask.show = vm.show = true;
            },
            switchActive: function() {
                vm.active = this.getAttribute('data-notice');
            },
            clear: function() {
                vm.active === 'system-notice' ? vm.systemNotice = [] : vm.customNotice = [];
            },
            operate: function() {
                this.parentNode.innerHTML = '已' + this.getAttribute('data-operate');
            }
        },
        eventsMap: {
            'click .icon-close': 'hide',
            'click [data-notice]': 'switchActive',
            'click .trash': 'clear',
            'click .operate': 'operate'
        },
        api: {
            'notice-show': 'show',
            'notice-hide': 'hide'
        },
        eventer: app.eventer
    });

    vm.eventer.on('init', function() {
        vm.systemNotice.push({
            name: 'user1、user2等人',
            avatar: null,
            content: '233邀请你入群',
            type: 'group',
            time: new Date()
        });
    });

})(this, utils, app);
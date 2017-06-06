/**
 * Created by 78462 on 2017/3/6.
 */
;
(function(global, uitls, app) {

    'use strict';

    var mask = app.mask, show = utils.show, hide = utils.hide, q = utils.q;
    var vm = new V({
        el: '#blacklist',
        eles: {
            list: '.list 0'
        },
        data: {
            show: {
                type: 'boolean',
                init: false,
                callback: function(value) {
                    value ? show(vm.el) : hide(vm.el);
                }
            },
            list: {
                type: 'array',
                init: [],
                extend: {
                    push: function(user) {
                        var info = app.funcs.getBlacklistMemberInfo(user.account);
                        vm.eles.list.insertAdjacentHTML('beforeEnd', vm.render(vm.template.item, {
                            name: user.noteName || info.nickName,
                            account: user.account,
                            avatar: info.avatar || data.defaultAvatar
                        }));
                        Array.prototype.push.call(this, user);
                    },
                    remove: function(account) {
                        var ele = q.call(vm.eles.list, '[data-account=' + account + ']')[0];
                        vm.eles.list.removeChild(ele);
                        var index = utils.findIndex(vm.list, account);
                        Array.prototype.splice.call(vm.list, index, 1);
                    }
                },
                callback: function(value) {
                    var array = [];
                    value.forEach(function(user) {
                        var info = app.funcs.getBlacklistMemberInfo(user.account);
                        var obj = {
                            name: user.noteName || info.nickName,
                            account: user.account,
                            avatar: info.avatar || data.defaultAvatar
                        };
                        array.push(vm.render(vm.template.item, obj));
                    });
                    vm.eles.list.innerHTML = array.join('');
                }
            }
        },
        template: {
            item: q('#blacklist-item-template').innerHTML
        },
        funcs: {
            hide: function() {
                mask.show = vm.show = false;
            },
            show: function() {
                mask.show = vm.show = true;
            },
            add: function(account) {
                app.funcs.addBlacklist(account);
            },
            remove: function(account) {
                app.funcs.removeBlacklist(account);
            },
            removeUser: function() {
                var account = this.parentNode.getAttribute('data-account');
                vm.funcs.remove(account);
            }
        },
        eventsMap: {
            'click .close': 'hide',
            'click .btn-ok': 'removeUser'
        },
        api: {
            'blacklist-show': 'show',
            'blacklist-hide': 'hide',
            'blacklist-add': 'add',
            'blacklist-remove': 'remove'
        },
        eventer: app.eventer,
        init: function() {
            vm.list = data.blacklist;
        }
    });

    app.eventer.on('init', function() {
        typeof vm.init === 'function' ? vm.init() : void 0;
    });

})(this, utils, app);
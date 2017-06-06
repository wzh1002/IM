/**
 * Created by 78462 on 2017/3/6.
 */
;
(function(global, uitls, app) {

    'use strict';

    var mask = app.mask, show = utils.show, hide = utils.hide, q = utils.q,
        hasClass = utils.hasClass, addClass = utils.addClass, removeClass = utils.removeClass;
    var vm = new V({
        el: '#create-group-container',
        eles: {
            count: '#add-user-count',
            addedList: '#added-list',
            userList: '.user-list 0'
        },
        data: {
            show: {
                type: 'boolean',
                init: false,
                callback: function(value) {
                    value ? show(vm.el) : hide(vm.el);
                }
            },
            count: {
                type: 'number',
                init: 0,
                callback: function(value) {
                    vm.eles.count.innerHTML = value;
                }
            },
            userList: {
                type: 'array',
                init: [],
                callback: function(value) {
                    var templateArray = [];
                    value.forEach(function(obj) {
                        templateArray.push(vm.render(vm.template.add, obj));
                    });
                    vm.eles.userList.innerHTML = templateArray.join('');
                }
            },
            added: {
                type: 'array',
                init: [],
                extend: {
                    push: function(account) {
                        var obj = {};
                        vm.userList.some(function(user) {
                            if (user.account === account) {
                                obj = user;
                                return true;
                            }
                        });
                        vm.eles.addedList.insertAdjacentHTML('beforeEnd', vm.render(vm.template.added, obj));
                        vm.count++;
                        Array.prototype.push.call(this, account);
                    },
                    remove: function(account) {
                        var target = q.call(vm.eles.addedList, '[data-account=' + account + ']')[0];
                        vm.eles.addedList.removeChild(target);
                        vm.count--;
                        var index = utils.findIndex(this, account);
                        Array.prototype.splice.call(this, index, 1);
                    }
                },
                callback: function(value) {
                    var array = [],
                        count = 0;
                    value.forEach(function(obj) {
                        count++;
                        array.push(vm.render(vm.template.added, obj));
                    });
                    vm.count = count;
                    vm.eles.addedList.innerHTML = array.join('');
                }
            }
        },
        template: {
            add: q('#create-group-add-template').innerHTML,
            added: q('#create-group-added-template').innerHTML
        },
        funcs: {
            hide: function() {
                mask.show = vm.show = false;
            },
            show: function(obj) {
                if (obj === undefined) {
                    return;
                }
                vm.operate = obj.operate || 'add';
                vm.type = obj.type || 'group';
                vm.account = obj.account;
                vm.funcs.refresh();
                mask.show = vm.show = true;
            },
            refresh: function() {
                var added = [];
                if (vm.operate === 'add') {
                    var group = vm.type === 'group' ? app.funcs.findGroup(vm.account) : app.funcs.findTeam(vm.account);
                    group !== null ? added = group.members : void 0;
                }
                vm.added = [];
                vm.userList = data.friends.map(function(user) {
                    var exist = false;
                    added.some(function(account) {
                        if (user.account === account) {
                            return exist = true;
                        }
                    });
                    return {
                        avatar: user.avatar || data.defaultAvatar,
                        name: user.noteName || user.nickName,
                        account: user.account,
                        status: exist ? 'cur2' : ''
                    };
                });

            },
            addUser: function() {
                if (hasClass(this, 'cur2')) {
                    return;
                }
                var account = this.parentNode.getAttribute('data-account');
                if (hasClass(this, 'cur')) {
                    removeClass(this, 'cur');
                    vm.added.remove(account);
                } else {
                    addClass(this, 'cur');
                    vm.added.push(account);
                }
            },
            add: function() {
                if (vm.operate === 'add') {
                    vm.type === 'group' ? app.funcs.addGroupMember(vm.account, [].concat(vm.added))
                    : app.funcs.addTeamMember(vm.account, [].concat(vm.added));
                } else {
                    vm.type === 'group' ? app.funcs.createGroup(data.account, [data.account].concat(vm.added))
                    : app.funcs.createTeam(data.account, [data.account].concat(vm.added));
                }
                vm.funcs.hide();
            }
        },
        eventsMap: {
            'click .icon-close': 'hide',
            'click .close': 'hide',
            'click .icon-radio': 'addUser',
            'click .add': 'add'
        },
        api: {
            'createGroup-show': 'show',
            'createGroup-hide': 'hide'
        },
        eventer: app.eventer
    });

})(this, utils, app);
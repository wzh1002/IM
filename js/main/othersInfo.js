/**
 * Created by 78462 on 2017/3/6.
 */
;
(function(global, uitls, app) {

    'use strict';

    var mask = app.mask, show = utils.show, hide = utils.hide, addClass = utils.addClass, removeClass = utils.removeClass;
    var vm = new V({
        el: '#others-info',
        eles: {
            avatar: '.avatar 0',
            name: '.nick-name 0',
            gender: '.gender 0',
            account: '.u-account 0',
            nickName: '.u-nickName 0',
            noteName: '.note 0',
            birthday: '.u-birthday 0',
            tel: '.u-tel 0',
            email: '.u-email 0',
            sign: '.u-sign 0',
            blacklist: '.blacklist 0',
            mutelist: '.mutelist 0'
        },
        data: {
            show: {
                type: 'boolean',
                init: false,
                callback: function(value) {
                    value ? show(vm.el) : hide(vm.el);
                }
            },
            blacklist: {
                type: 'boolean',
                init: false,
                callback: function(value) {
                    value ? utils.removeClass(vm.eles.blacklist, 'off') : utils.addClass(vm.eles.blacklist, 'off');
                }
            },
            mutelist: {
                type: 'boolean',
                init: false,
                callback: function(value) {
                    value ? utils.removeClass(vm.eles.mutelist, 'off') : utils.addClass(vm.eles.mutelist, 'off');
                }
            },
            avatar: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.avatar.src = value || data.defaultAvatar;
                }
            },
            gender: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.gender.className = value ?  'gender' + ' ' + value : 'gender';
                }
            },
            name: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.name.innerHTML = value;
                }
            },
            account: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.account.innerHTML = '账号：' + value;
                }
            },
            nickName: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.nickName.innerHTML = '昵称：' + value;
                }
            },
            noteName: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.noteName.value = value || '';
                }
            },
            birthday: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.birthday.innerHTML = value || '--';
                }
            },
            email: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.email.innerHTML = value || '--';
                }
            },
            tel: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.tel.innerHTML = value || '--';
                }
            },
            sign: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.sign.innerHTML = value || '--';
                }
            }
        },
        funcs: {
            hide: function() {
                mask.show = vm.show = false;
            },
            show: function(obj) {
                mask.show = vm.show = true;
                if (obj === undefined) {
                    return;
                }
                var user = app.funcs.findFriend(obj.account);
                if (!user) {
                    addClass(vm.el, 'no-friend');
                    user = app.funcs.findGroupUser(obj.account);
                } else {
                    removeClass(vm.el, 'no-friend');
                }
                user ? vm.funcs.refresh(user) : app.client.emit('othersInfo-getUser', obj.account);
            },
            refresh: function(user) {
                for (var key in vm) {
                    if (typeof vm[key] === 'string') {
                        vm[key] = '';
                    }
                }
                for (key in user) {
                    vm[key] = user[key] || '';
                }
                vm.name = user.noteName || user.nickName;
                vm.blacklist = app.funcs.isBlacklist(vm.account);
            },
            addFriend: function() {
                app.funcs.addFriend(vm.account);
                vm.funcs.hide();
            },
            deleteFriend: function() {
                var result = confirm('确定要删除');
                if (result) {
                    app.funcs.deleteFriend(vm.account);
                    vm.funcs.hide();
                }
            },
            updateNoteName: function() {
                var value = vm.eles.noteName.value;
                if (vm.noteName === value) {
                    return;
                }
                vm.noteName = value;
                app.funcs.updateNoteName(data.account, vm.account, value);
            },
            refreshNoteName: function() {
                vm.name = vm.noteName;
            },
            toggleBlacklist: function() {
                vm.blacklist = !vm.blacklist;
                vm.blacklist ? vm.exec('blacklist-add', vm.account) : vm.exec('blacklist-remove', vm.account);
            },
            toggleMutelist: function() {
                vm.mutelist = !vm.mutelist;
            },
            openChatWindow: function() {
                vm.exec('othersInfo-hide');
                vm.exec('chatWindow-show', {
                    type: 'p2p',
                    account: vm.account
                });
            }
        },
        eventsMap: {
            'click .close': 'hide',
            'click .toggle-blacklist': 'toggleBlacklist',
            'click .toggle-mutelist': 'toggleMutelist',
            'click .chat': 'openChatWindow',
            'click .del': 'deleteFriend',
            'click .add': 'addFriend',
            'click .save': 'updateNoteName'
        },
        api: {
            'othersInfo-show': 'show',
            'othersInfo-hide': 'hide',
            'othersInfo-refresh': 'refresh',
            'othersInfo-refreshNoteName': 'refreshNoteName'
        },
        eventer: app.eventer
    });

})(this, utils, app);
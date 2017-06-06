/**
 * Created by 78462 on 2017/3/6.
 */
;
(function(global, uitls, app) {

    'use strict';

    var mask = app.mask, show = utils.show, hide = utils.hide;
    var vm = new V({
        el: '#user-dialog',
        eles: {
            search: '[name=search] 0',
            info: '.info 0',
            avatar: '.avatar 0',
            nickName: '.nick-name 0',
            account: '.account 0',
            tip: '.tip 0'
        },
        data: {
            show: {
                type: 'boolean',
                init: false,
                callback: function(value) {
                    value ? show(vm.el) : hide(vm.el);
                }
            },
            avatar: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.avatar.src = value;
                }
            },
            account: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.account.innerHTML = value;
                }
            },
            nickName: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.nickName.innerHTML = value;
                }
            }
        },
        funcs: {
            hide: function() {
                mask.show = vm.show = false;
            },
            show: function() {
                mask.show = vm.show = true;
            },
            searchUser: function() {
                var account = vm.eles.search.value,
                    result;
                if (account === data.account) {
                    return vm.funcs.refresh({
                        success: false,
                        msg: '别看了，就是你自己'
                    });
                }
                if (result = app.funcs.getBlacklistMemberInfo(account)) {
                    return vm.funcs.refresh({
                        success: true,
                        data: {
                            account: result.account,
                            nickName: result.nickName,
                            avatar: result.avatar || data.defaultAvatar,
                            relation: 'blacklist'
                        }
                    });
                }
                if (result = app.funcs.findFriend(account)) {
                     vm.funcs.refresh({
                        success: true,
                        data: {
                            account: result.account,
                            nickName: result.nickName,
                            avatar: result.avatar || data.defaultAvatar,
                            relation: 'friend'
                        }
                    });
                } else {
                    app.client.emit('searchUser', {
                        account: account
                    });
                }
            },
            add: function() {
                app.funcs.addFriend(vm.account);
                vm.funcs.close();
            },
            refresh: function(result) {
                if (result.success) {
                    vm.el.className = 'dialog' + ' ' + result.data.relation;
                    vm.nickName = result.data.nickName;
                    vm.account = result.data.account + '';
                    vm.avatar = result.data.avatar;
                } else {
                    vm.el.className = 'dialog' + ' ' + 'done';
                    vm.eles.tip.innerHTML = result.msg;
                }
            },
            close: function() {
                vm.funcs.returnSearch();
                vm.funcs.hide();
            },
            returnSearch: function() {
                vm.el.className = 'dialog';
                vm.eles.search.value = '';
            },
            openChatWindow: function() {
                vm.funcs.hide();
                vm.exec('chatWindow-show', {
                    type: 'p2p',
                    account: vm.account
                });
            },
            removeBlacklist: function() {
                app.funcs.removeBlacklist(vm.account);
                vm.funcs.close();
            }
        },
        eventsMap: {
            'click .close': 'close',
            'click .done': 'close',
            'click .search': 'searchUser',
            'click .back': 'returnSearch',
            'click .chat': 'openChatWindow',
            'click .add': 'add',
            'click .remove-blacklist': 'removeBlacklist'
        },
        api: {
            'userDialog-show': 'show',
            'userDialog-hide': 'close',
            'userDialog-refresh': 'refresh'
        },
        eventer: app.eventer
    });

})(this, utils, app);
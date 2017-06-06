/**
 * Created by 78462 on 2017/3/6.
 */
;
(function(global, uitls, app) {

    'use strict';

    var mask = app.mask, show = utils.show, hide = utils.hide, find = utils.find;
    var vm = new V({
        el: '#group-dialog',
        eles: {
            search: '[name=search] 0',
            info: '.info 0',
            avatar: '.avatar 0',
            groupName: '.group-name 0',
            account: '.account 0'
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
            groupName: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.groupName.innerHTML = value;
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
            searchGroup: function() {
                var account = vm.eles.search.value;
                if (!vm.funcs.isNumber(account)) {
                    return alert('群id必须是数字');
                }
                account = parseInt(account);
                var result = app.funcs.findGroup(account),
                    type = 'group';
                if (!result) {
                    result =app.funcs.findTeam(account);
                    type = 'team';
                }
                if (result) {
                    vm.funcs.refresh({
                        success: true,
                        data: {
                            account: result.account,
                            groupName: result.name,
                            avatar: result.avatar || type === 'group' ? data.defaultGroupAvatar : data.defaultTeamAvatar,
                            relation: 'friend'
                        }
                    });
                } else {
                    app.client.emit('searchGroup', {
                        account: account
                    });
                }
            },
            refresh: function(result) {
                if (result.success) {
                    vm.el.className = 'dialog' + ' ' + result.data.relation;
                    vm.groupName = result.data.groupName;
                    vm.account = result.data.account + '';
                    vm.avatar = result.data.avatar;
                } else {
                    vm.el.className = 'dialog' + ' ' + 'done';
                }
            },
            returnSearch: function() {
                vm.el.className = 'dialog';
                vm.eles.search.value = '';
            },
            close: function() {
                vm.funcs.returnSearch();
                vm.funcs.hide();
            },
            isNumber: function(value) {
                var reg = /^\+?[1-9][0-9]*$/;
                return reg.test(value);
            },
            openChatWindow: function() {
                vm.funcs.hide();
                vm.exec('chatWindow-show', {
                    type: 'group',
                    account: vm.account
                });
            }
        },
        eventsMap: {
            'click .close': 'close',
            'click .done': 'close',
            'click .search': 'searchGroup',
            'click .back': 'returnSearch',
            'click .chat': 'openChatWindow'
        },
        api: {
            'groupDialog-show': 'show',
            'groupDialog-hide': 'close',
            'groupDialog-refresh': 'refresh'
        },
        eventer: app.eventer
    });

})(this, utils, app);
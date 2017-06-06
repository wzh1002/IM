/**
 * Created by 78462 on 2017/3/6.
 */
;
(function(global, uitls, app) {

    'use strict';

    var show = utils.show, hide = utils.hide, q = utils.q, remove = utils.remove;
    var vm = new V({
        el: '#group-info-container',
        eles: {
            memberList: '#group-member-list',
            nameCtn: '.group-name-ctn 0',
            name: '.group-name 0',
            nameInput: '#group-name-input',
            infoCtn: '.group-info-ctn 0',
            info: '.group-info 0',
            infoInput: '#group-info-input',
            radios: '[type=radio]',
            radio0: '[name=radio-0]',
            radio1: '[name=radio-1]',
            radio2: '[name=radio-2]',
            radio3: '[name=radio-3]',
            avatar: '.avatar 0',
            account: '.account 0',
            items: '.item',
            btnCtn: '.btns 0'
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
                    push: function(account) {
                        if (this !== vm.funcs.getCurrentMember()) {
                            return;
                        }
                        var user = app.funcs.findFriend(account) || app.funcs.getMemberInfo(account),
                            str,
                            obj = {};
                        obj.name = user.noteName || user.nickName;
                        obj.account = account;
                        obj.avatar = user.avatar || data.defaultAvatar;
                        str = vm.owner === data.account ? vm.render(vm.template.ownerMember, obj) : vm.render(vm.template.member, obj);
                        vm.eles.memberList.insertAdjacentHTML('beforeEnd', str);

                        Array.prototype.push.call(this, account);
                    },
                    remove: function(account) {
                        if (this !== vm.funcs.getCurrentMember()) {
                            return;
                        }
                        if (account !== data.account) {
                            var ele = q.call(vm.eles.memberList, '[data-account=' + account + ']')[0];
                            vm.eles.memberList.removeChild(ele);
                        } else {

                        }

                        remove(this, account);
                    }
                },
                callback: function(value) {
                    if (value !== vm.funcs.getCurrentMember()) {
                        return;
                    }
                    var memberArray = [];
                    if (vm.invite) {
                        memberArray.push(vm.template.plus);
                    } else if (vm.type === 'team') {
                        memberArray.push(vm.template.plus);
                    }
                    value.forEach(function(account) {
                        var user = app.funcs.findFriend(account) || app.funcs.getMemberInfo(account),
                            obj = {};
                        obj.name = user.noteName || user.nickName;
                        obj.account = account;
                        obj.avatar = user.avatar || data.defaultAvatar;
                        if (vm.owner === account) {
                            return memberArray.push(vm.render(vm.template.owner, obj));
                        }
                        if (vm.owner === data.account) {
                            return memberArray.push(vm.render(vm.template.ownerMember, obj));
                        }
                        memberArray.push(vm.render(vm.template.member, obj));
                    });
                    vm.eles.memberList.innerHTML = memberArray.join('');
                }
            },
            name: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.name.innerHTML = value;
                    if (vm.eles.nameInput.value !== value) {
                        vm.eles.nameInput.value = value;
                    }
                }
            },
            account: {
                type: 'number',
                init: 0,
                callback: function(value) {
                    vm.eles.account.innerHTML = value;
                }
            },
            type: {
                type: 'string',
                init: 'group',
                callback: function(value) {
                    value === 'group' ? utils.removeClass(vm.el, 'team') : utils.addClass(vm.el, 'team');
                }
            },
            info: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.info.innerHTML = value;
                    if (vm.eles.infoInput.value !== value) {
                        vm.eles.infoInput.value = value;
                    }
                }
            },
            avatar: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.avatar.src = value;
                }
            }
        },
        template: {
            plus: q('#group-info-plus-template').innerHTML,
            owner: q('#group-info-owner-template').innerHTML,
            ownerMember: q('#group-info-owner-member-template').innerHTML,
            member: q('#group-info-member-template').innerHTML
        },
        funcs: {
            hide: function() {
                vm.show = false;
            },
            show: function(obj) {
                if (obj !== undefined) {
                    vm.funcs.refresh(obj);
                }
                vm.show = true;
                vm.exec('chatWindow-hide');
            },
            refresh: function(obj) {
                if (obj.account !== vm.account) {
                    var group;
                    if (obj.type === 'group') {
                        group = app.funcs.findGroup(obj.account);
                    } else if (obj.type === 'team') {
                        group = app.funcs.findTeam(obj.account);
                    } else {
                        return console.error('the type is not exist');
                    }
                    if (group === null) {
                        return console.error('the group is not exist');
                    }
                    vm.account = obj.account;
                    vm.type = obj.type;
                    vm.avatar = group.avatar || vm.type === 'group' ? data.defaultGroupAvatar : data.defaultTeamAvatar;

                    var permissions = group.permissions || {
                                verify: 1,
                                invite: 0,
                                modify: 0,
                                verifyed: 0
                            },
                        owner = group.owner === data.account;

                    vm.owner = group.owner;
                    vm.invite = permissions.invite === 1 || owner;
                    vm.modify = permissions.modify === 1 || owner;
                    vm.list = group.members;

                    this.refreshFooter(owner);

                    vm.name = group.name || '';
                    vm.info = group.des || '';
                }
            },
            refreshFooter: function(owner) {
                if (vm.type === 'group') {
                    var permission = app.funcs.findGroup(vm.account).permissions;
                    if (owner === false) {
                        [].forEach.call(vm.eles.radios, function(radio) {
                            radio.disabled = true;
                        });
                        if (vm.modify !== 1) {
                            utils.removeClass(vm.eles.nameInput.parentNode.children[0], 'owner');
                            utils.removeClass(vm.eles.infoInput.parentNode.children[0], 'owner');
                        }
                        hide(vm.eles.btnCtn.children[1]);
                        show(vm.eles.btnCtn.children[0]);
                        vm.eles.btnCtn.children[0].innerHTML = '退出该群';
                    } else {
                        [].forEach.call(vm.eles.radios, function(radio) {
                            radio.disabled = false;
                        });
                        utils.addClass(vm.eles.nameInput.parentNode.children[0], 'owner');
                        utils.addClass(vm.eles.infoInput.parentNode.children[0], 'owner');
                        hide(vm.eles.btnCtn.children[0]);
                        show(vm.eles.btnCtn.children[1]);
                    }
                    [].forEach.call(vm.eles.items, function(item, index) {
                        if (index > 1) {
                            show(item);
                        }
                    });
                    [].forEach.call(vm.eles.radio0, function(item) {
                        if (item.value == permission.verify) {
                            item.checked = true;
                        }
                    });
                    [].forEach.call(vm.eles.radio1, function(item) {
                        if (item.value == permission.invite) {
                            item.checked = true;
                        }
                    });
                    [].forEach.call(vm.eles.radio2, function(item) {
                        if (item.value == permission.modify) {
                            item.checked = true;
                        }
                    });
                    [].forEach.call(vm.eles.radio3, function(item) {
                        if (item.value == permission.verifyed) {
                            item.checked = true;
                        }
                    });
                } else {
                    if (owner) {
                        utils.addClass(vm.eles.nameInput.parentNode.children[0], 'owner');
                    }
                    [].forEach.call(vm.eles.items, function(item, index) {
                        if (index > 1) {
                            hide(item);
                        }
                    });
                    hide(vm.eles.btnCtn.children[1]);
                    show(vm.eles.btnCtn.children[0]);
                    vm.eles.btnCtn.children[0].innerHTML = '退出讨论组';
                }
            },
            showChatWindow: function() {
                vm.exec('chatWindow-show');
            },
            addUser: function() {
                vm.exec('createGroup-show', {
                    operate: 'add',
                    type: vm.type,
                    account: vm.account
                });
            },
            getCurrentMember: function() {
                return app.funcs.find({
                    type: vm.type,
                    account: vm.account
                }).members || [];
            },
            remove: function() {
                var account = this.getAttribute('data-account');
                if (account === data.account) {
                    return;
                }
                vm.type === 'group' ? app.funcs.removeGroupMember(vm.account, [account]) : app.funcs.removeTeamMember(vm.account, [account]);
            },
            editName: function() {
                if (vm.modify) {
                    utils.addClass(vm.eles.nameCtn, 'edit');
                    vm.eles.nameInput.focus();
                }
            },
            editInfo: function() {
                if (vm.modify) {
                    utils.addClass(vm.eles.infoCtn, 'edit');
                    vm.eles.infoInput.focus();
                }
            },
            showName: function() {
                utils.removeClass(vm.eles.nameCtn, 'edit');
                if (vm.name === this.value) {
                    return;
                }
                vm.name = this.value;
                vm.type === 'group' ? app.funcs.updateGroupName({
                    account: vm.account,
                    value: vm.name
                }) : app.funcs.updateTeamName({
                    account: vm.account,
                    value: vm.name
                });
            },
            showInfo: function() {
                utils.removeClass(vm.eles.infoCtn, 'edit');
                if (vm.info === this.value) {
                    return;
                }
                vm.info = this.value;
                app.funcs.updateGroupDes({
                    account: vm.account,
                    value: vm.info
                });
            },
            existGroup: function() {
                var result = vm.type === 'group' ? confirm('确定要退出该群？') : confirm('确定要退出讨论组？');
                if (result) {
                    vm.type === 'group' ? app.funcs.existGroup(vm.account) : app.funcs.existTeam(vm.account);
                }
            },
            dissolveGroup: function() {
                var result = confirm('确定要解散该群？');
                if (result) {
                    app.funcs.dissolveGroup(vm.account);
                }
            },
            onRemoveGroup: function(obj) {
                if (obj.account === vm.account) {
                    vm.funcs.hide();
                }
            },
            updateAuthentication: function() {
                app.funcs.updateAuthentication({
                    account: vm.account,
                    value: parseInt(this.value)
                });
            },
            updateInvitePermissions: function() {
                app.funcs.updateInvitePermissions({
                    account: vm.account,
                    value: parseInt(this.value)
                });
            },
            updateModifyPermissions: function() {
                app.funcs.updateModifyPermissions({
                    account: vm.account,
                    value: parseInt(this.value)
                });
            },
            updateBeAuthentication: function() {
                app.funcs.updateBeAuthentication({
                    account: vm.account,
                    value: parseInt(this.value)
                });
            }
        },
        eventsMap: {
            'click .close': 'showChatWindow',
            'click .add-item': 'addUser',
            'click .edit-name': 'editName',
            'click .edit-info': 'editInfo',
            'click .exist-group': 'existGroup',
            'click .dissolve-group': 'dissolveGroup',
            'click [data-account]': 'remove',
            'click [name=radio-0]': 'updateAuthentication',
            'click [name=radio-1]': 'updateInvitePermissions',
            'click [name=radio-2]': 'updateModifyPermissions',
            'click [name=radio-3]': 'updateBeAuthentication',
            'focusout #group-name-input': 'showName',
            'focusout #group-info-input': 'showInfo'
        },
        api: {
            'groupInfo-show': 'show',
            'groupInfo-hide': 'hide',
            'groupInfo-onRemoveGroup': 'onRemoveGroup'
        },
        eventer: app.eventer
    });

})(this, utils, app);
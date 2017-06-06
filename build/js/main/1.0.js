/**
 * Created by 78462 on 2017/3/6.
 */
(function(global, utils, io) {

    'use strict';

    var watch = utils.watch, q = utils.q, Eventer = utils.Eventer, show = utils.show, hide = utils.hide,
        on = utils.on, find = utils.find, findIndex = utils.findIndex, remove = utils.remove, assign = utils.assign;
    var user = config.account;
    var app = {
        client: io.connect(),
        eventer: new Eventer(),
        mask: {
            el: q('#mask')
        },
        exec: function(name, data) {
            this.eventer.emit(name, data);
        },
        funcs: {
            getUserInfo: function(account) {
                app.client.emit('getUserInfo', {
                    account: account
                });
            },
            getBlacklistMemberInfo: function(account) {
                return find(data.blacklistMembersInfo, function(user) {
                    return user.account === account;
                });
            },
            getGroupMembersInfo: function(account) {
                var group = app.funcs.findGroup(account),
                    result = [];
                group.members.forEach(function(account) {
                    result.push(data.groupsMembersInfo[account]);
                });
                return result;
            },
            getTeamMembersInfo: function(account) {
                var team = app.funcs.findTeam(account),
                    result = [];
                team.members.forEach(function(account) {
                    result.push(data.groupsMembersInfo[account]);
                });
                return result;
            },
            getMemberInfo: function(account) {
                return data.groupsMembersInfo[account];
            },
            getCloudMsg: function(obj) {
                app.client.emit('getCloudMsg', obj);
            },
            findGroupUser: function(account) {
                return global.data.groupsMembersInfo[account];
            },
            find: function(obj) {
                var type = obj.type,
                    name;
                name = type === 'p2p' ? 'friends' : (type === 'group' ? 'groups' : type === 'session' ? 'sessions' : 'teams');
                return find(global.data[name], function(item) {
                        return item.account === obj.account;
                    }) || null;
            },
            findFriend: function(account) {
                return app.funcs.find({
                    type: 'p2p',
                    account: account
                });
            },
            findGroup: function(account) {
                return app.funcs.find({
                    type: 'group',
                    account: account
                });
            },
            findTeam: function(account) {
                return app.funcs.find({
                    type: 'team',
                    account: account
                });
            },
            findSession: function(account) {
                return app.funcs.find({
                    type: 'session',
                    account: account
                });
            },
            addGroupMember: function(account, members) {
                app.client.emit('addGroupMember', {
                    account: account,
                    members: members
                });
            },
            removeGroupMember: function(account, members) {
                app.client.emit('removeGroupMember', {
                    account: account,
                    members: members
                });
            },
            addTeamMember: function(account, members) {
                app.client.emit('addTeamMember', {
                    account: account,
                    members: members
                });
            },
            removeTeamMember: function(account, members) {
                app.client.emit('removeTeamMember', {
                    account: account,
                    members: members
                });
            },
            createGroup: function(owner, members) {
                app.client.emit('createGroup', {
                    owner: owner,
                    members: members
                });
            },
            existGroup: function(account) {
                app.client.emit('existGroup', {
                    account: account,
                    target: data.account
                });
            },
            existTeam: function(account) {
                app.client.emit('existTeam', {
                    account: account,
                    target: data.account
                });
            },
            dissolveGroup: function(account) {
                app.client.emit('dissolveGroup', {
                    account: account
                });
            },
            createTeam: function(owner, members) {
                app.client.emit('createTeam', {
                    owner: owner,
                    members: members
                });
            },
            addFriend: function(account) {
                app.client.emit('addFriend', {
                    account: user,
                    target: account
                });
            },
            deleteFriend: function(account) {
                app.client.emit('deleteFriend', {
                    account: user,
                    target: account
                });
            },
            isBlacklist: function(account) {
                return findIndex(data.blacklist, function(item) {
                    return item.account === account;
                }) !== -1;
            },
            addBlacklist: function(account) {
                app.client.emit('addBlacklist', {
                    account: user,
                    target: account
                });
            },
            removeBlacklist: function(account) {
                app.client.emit('removeBlacklist', {
                    account: user,
                    target: account
                });
            },
            updateNoteName: function(owner, target, noteName) {
                app.client.emit('updateNoteName', {
                    owner: owner,
                    target: target,
                    noteName: noteName
                });
            },
            updateUserInfo: function(obj) {
                app.client.emit('updateUserInfo', obj);
            },
            updateGroupName: function(obj) {
                app.client.emit('updateGroupName', obj);
            },
            updateTeamName: function(obj) {
                app.client.emit('updateTeamName', obj);
            },
            updateGroupDes: function(obj) {
                app.client.emit('updateGroupDes', obj);
            },
            updateAuthentication: function(obj) {
                app.client.emit('updateAuthentication', obj);
            },
            updateInvitePermissions: function(obj) {
                app.client.emit('updateInvitePermissions', obj);
            },
            updateModifyPermissions: function(obj) {
                app.client.emit('updateModifyPermissions', obj);
            },
            updateBeAuthentication: function(obj) {
                app.client.emit('updateBeAuthentication', obj);
            },
            sendMsg: function(obj) {
                app.client.emit('msg', obj);
            }
        },
        initClient: function(client) {
            var _this = this;

            client.on('init', function(obj) {
                global.data = obj;
                _this.exec('init');
            });

            client.on('refreshCloudMsg', function(obj) {
                var content = obj === null ? [] : obj.messages.map(function(item) {
                    item.type = item.type || obj.type;
                    return item;
                });
                _this.exec('cloudMsg-refresh', content);
            });

            client.on('updateGroupsMembersInfo', function(obj) {
                utils.assign(data.groupsMembersInfo, obj);
                _this.exec('groupInfo-update');
            });

            client.on('searchGroupResult', function(obj) {
                _this.exec('groupDialog-refresh', obj);
            });

            client.on('searchUserResult', function(obj) {
                _this.exec('userDialog-refresh', obj);
            });

            client.on('addGroup', function(obj) {
                data.groups.push(obj);
            });

            client.on('addTeam', function(obj) {
                data.teams.push(obj);
            });

            client.on('addGroupMember', function(obj) {
                var group = _this.funcs.findGroup(obj.account);
                if (group === null) {
                    return;
                }
                obj.members.forEach(function(account) {
                    group.members.push(account);
                });
            });

            client.on('addTeamMember', function(obj) {
                var team = _this.funcs.findTeam(obj.account);
                if (team === null) {
                    return;
                }
                obj.members.forEach(function(account) {
                    team.members.push(account);
                });
            });

            client.on('removeGroupMember', function(obj) {
                var group = _this.funcs.findGroup(obj.account);
                if (group === null) {
                    return;
                }
                obj.members.forEach(function(account) {
                    group.members.remove(account);
                });
            });

            client.on('removeTeamMember', function(obj) {
                var team = _this.funcs.findTeam(obj.account);
                if (team === null) {
                    return;
                }
                obj.members.forEach(function(account) {
                    team.members.remove(account);
                });
            });

            client.on('removeGroup', function(obj) {
                data.groups.remove(obj.account);
                _this.exec('groupInfo-onRemoveGroup', obj);
                _this.exec('chatWindow-onRemoveGroup', obj);
                _this.exec('chatPanel-updateGroup', obj);
            });

            client.on('removeTeam', function(obj) {
                data.teams.remove(obj.account);
                _this.exec('groupInfo-onRemoveGroup', obj);
                _this.exec('chatWindow-onRemoveGroup', obj);
                _this.exec('chatPanel-updateGroup', obj);
            });

            client.on('addFriend', function(obj) {
                data.friends.push(obj);
            });

            client.on('deleteFriend', function(obj) {
                data.friends.remove(obj.target);
            });

            client.on('addBlacklist', function(obj) {
                data.blacklistMembersInfo.push(app.funcs.findFriend(obj.account) || app.funcs.findGroupUser(obj.account));
                data.blacklist.push(obj);
            });

            client.on('removeBlacklist', function(obj) {
                remove(data.blacklistMembersInfo, function(item) {
                    return item.account === obj.account;
                });
                data.blacklist.remove(obj.account);
            });

            client.on('refreshOthersInfo', function(obj) {
                _this.exec('othersInfo-refresh', obj);
            });

            client.on('updateUserInfo', function(obj) {
                assign(data, obj);
                _this.exec('chatPanel-refreshNickName');
            });

            client.on('updateNoteName', function(obj) {
                var info = find(data.friends, function(user) {
                    return user.account === obj.target;
                });
                info.noteName = obj.noteName;
                alert('修改备注名成功!');
                _this.exec('chatPanel-updateNoteName', obj);
                _this.exec('othersInfo-refreshNoteName');
            });

            client.on('updateGroupName', function(obj) {
                var group = _this.funcs.findGroup(obj.account);
                group.name = obj.value;
                _this.exec('chatPanel-updateGroupName', obj);
            });

            client.on('updateTeamName', function(obj) {
                var team = _this.funcs.findTeam(obj.account);
                team.name = obj.value;
                _this.exec('chatPanel-updateTeamName', obj);
            });

            client.on('updateGroupDes', function(obj) {
                var group = _this.funcs.findGroup(obj.account);
                group.des = obj.value;
            });

            client.on('updateAuthentication', function(obj) {
                var group = _this.funcs.findGroup(obj.account);
                group.permissions.verify = obj.value;
            });

            client.on('updateInvitePermissions', function(obj) {
                var group = _this.funcs.findGroup(obj.account);
                group.permissions.invite = obj.value;
            });

            client.on('updateModifyPermissions', function(obj) {
                var group = _this.funcs.findGroup(obj.account);
                group.permissions.modify = obj.value;
            });

            client.on('updateBeAuthentication', function(obj) {
                var group = _this.funcs.findGroup(obj.account);
                group.permissions.verifyed = obj.value;
            });

            client.on('msg', function(obj) {
                _this.exec('chatPanel-updateSession', obj);
            });
        },
        init: function() {
            watch(app.mask, 'show', 'boolean', false, function(value) {
                value ? show(app.mask.el) : hide(app.mask.el);
            });
            this.initClient(this.client);
            this.funcs.getUserInfo(user);
        }
    };

    app.eventer.on('loaded', function() {
        if (typeof app.init === 'function') {
            app.init();
            app.init = null;
        }
    });
    on(window, 'load', function() {
        app.exec('loaded');
    });
    global.app = app;

})(this, utils, io);
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
/**
 * Created by 78462 on 2017/3/6.
 */
;
(function(global, uitls, app) {

    'use strict';
    var show = utils.show, hide = utils.hide, q = utils.q, serializeTime = utils.serializeTime,
        remove = utils.remove, find = utils.find;
    var data;
    var vm = new V({
        el: '#chat-panel',
        eles: {
            header: '.header 0',
            navs: '.nav-tab',
            panels: '.panel-item',
            sessions: '#sessions',
            friends: '#friends',
            groups: '#groups',
            teams: '#teams',
            items: '.item'
        },
        data: {
            nav: {
                type: 'string',
                init: 'group-wrapper',
                callback: function(value) {
                    [].forEach.call(vm.eles.navs, function(item) {
                        item.className = item.getAttribute('data-nav') === value ? 'nav-tab tc active' : 'nav-tab tc';
                    });
                    [].forEach.call(vm.eles.panels, function(item) {
                        item.id === value ? show(item) : hide(item);
                    });
                }
            },
            friends: {
                type: 'array',
                init: [],
                extend: {
                    push: function(item) {
                        var str = vm.render(vm.template.friendItem,{
                            account: item.account,
                            name: item.noteName || item.nickName,
                            avatar: item.avatar || data.defaultAvatar
                        });
                        vm.eles.friends.insertAdjacentHTML('beforeEnd', str);
                        Array.prototype.push.call(this, item);
                    },
                    remove: function(account) {
                        var ele = q.call(vm.eles.friends, '[data-account=' + account + ']')[0];
                        if (ele instanceof Element) {
                            vm.eles.friends.removeChild(ele);
                        }
                        remove(this, function(item) {
                            return item.account === account;
                        });
                    }
                },
                callback: function(value) {
                    var str = '';
                    value.forEach(function(item) {
                        str += vm.render(vm.template.friendItem,{
                            account: item.account,
                            name: item.noteName || item.nickName,
                            avatar: item.avatar || data.defaultAvatar
                        })
                    });
                    vm.eles.friends.innerHTML = str;
                }
            },
            groups: {
                type: 'array',
                init: [],
                extend: {
                    push: function(item) {
                        var str = vm.render(vm.template.groupItem, {
                            account: item.account,
                            type: 'group',
                            avatar: item.avatar || data.defaultGroupAvatar,
                            name: item.name || null
                        });
                        vm.eles.groups.insertAdjacentHTML('beforeEnd', str);
                        Array.prototype.push.call(this, item);
                    },
                    remove: function(account) {
                        var ele = q.call(vm.eles.groups, '[data-account="' + account + '"]')[0];
                        if (ele instanceof Element) {
                            vm.eles.groups.removeChild(ele);
                        }
                        remove(this, function(item) {
                            return item.account === account;
                        });
                    }
                },
                callback: function(value) {
                    var str = '';
                    value.forEach(function(item) {
                        str += vm.render(vm.template.groupItem, {
                            account: item.account,
                            type: 'group',
                            avatar: item.avatar || data.defaultGroupAvatar,
                            name: item.name || null
                        });
                    });
                    if (str) {
                        str = '<p class="item-title">高级群</p>' + str;
                        vm.eles.groups.innerHTML = str;
                    }
                }
            },
            teams: {
                type: 'array',
                init: [],
                extend: {
                    push: function(item) {
                        var str = vm.render(vm.template.teamItem, {
                            account: item.account,
                            type: 'team',
                            avatar: item.avatar || data.defaultTeamAvatar,
                            name: item.name || null
                        });
                        vm.eles.teams.insertAdjacentHTML('beforeEnd', str);
                        Array.prototype.push.call(this, item);
                    },
                    remove: function(account) {
                        var ele = q.call(vm.eles.teams, '[data-account="' + account + '"]')[0];
                        if (ele instanceof Element) {
                            vm.eles.teams.removeChild(ele);
                        }
                        remove(this, function(item) {
                            return item.account === account;
                        });
                    }
                },
                callback: function(value) {
                    var str = '';
                    value.forEach(function(item) {
                        str += vm.render(vm.template.groupItem, {
                            account: item.account,
                            type: 'team',
                            avatar: item.avatar || data.defaultTeamAvatar,
                            name: item.name || null
                        });
                    });
                    if (str) {
                        str = '<p class="item-title">讨论组</p>' + str;
                        vm.eles.teams.innerHTML = str;
                    }
                }
            },
            sessions: {
                type: 'array',
                init: [],
                extend: {
                   push: function(item) {
                       var obj = {}, account;
                       if (item.type === 'p2p') {
                           account = app.funcs.findFriend(item.account) || app.funcs.findGroupUser(item.account);
                           obj.name = account.noteName || account.nickName;
                           obj.avatar = account.avatar || data.defaultAvatar;
                       } else {
                           if (account = app.funcs.findGroup(item.account)) {
                               obj.name = account.name;
                               obj.avatar = account.avatar || data.defaultGroupAvatar;
                           } else if (account = app.funcs.findTeam(item.account)) {
                               obj.name = account.name;
                               obj.avatar = account.avatar || data.defaultTeamAvatar;
                               obj.type = 'team';
                           } else {
                               obj.name = item.account;
                               obj.avatar = data.defaultTeamAvatar;
                           }
                       }
                       obj.type = obj.type || item.type;
                       obj.account = item.account;
                       obj.updateTime = serializeTime(item.updateTime);
                       obj.lastMessage = item.messages[item.messages.length - 1].content;
                       obj.unRead = item.unRead;
                       vm.eles.sessions.insertAdjacentHTML('afterBegin', vm.render(vm.template.sessionItem, obj));

                       Array.prototype.push.call(this, item);
                   }
                },
                callback: function(value) {
                    var array = [],
                        account;
                    value.forEach(function(item) {
                        var obj = {};
                        if (item.type === 'p2p') {
                            account = app.funcs.findFriend(item.account) || app.funcs.findGroupUser(item.account);
                            obj.name = account.noteName || account.nickName;
                            obj.avatar = account.avatar || data.defaultAvatar;
                        } else {
                            if (account = app.funcs.findGroup(item.account)) {
                                obj.name = account.name;
                                obj.avatar = account.avatar || data.defaultGroupAvatar;
                            } else if (account = app.funcs.findTeam(item.account)) {
                                obj.name = account.name;
                                obj.avatar = account.avatar || data.defaultTeamAvatar;
                                obj.type = 'team';
                            } else {
                                obj.name = item.account;
                                obj.avatar = data.defaultTeamAvatar;
                            }
                        }
                        obj.type = obj.type || item.type;
                        obj.account = account.account;
                        obj.updateTime = serializeTime(item.updateTime);
                        obj.lastMessage = item.messages[item.messages.length - 1].content;
                        obj.unRead = item.unRead;
                        array.push(vm.render(vm.template.sessionItem, obj));
                    });
                    vm.eles.sessions.innerHTML = array.join('');
                }
            }
        },
        template: {
            header: q('#chat-panel-header-template').innerHTML,
            sessionItem: q('#chat-panel-session-item-template').innerHTML,
            friendItem: q('#chat-panel-friend-item-template').innerHTML,
            groupItem: q('#chat-panel-group-item-template').innerHTML,
            teamItem: q('#chat-panel-team-item-template').innerHTML
        },
        funcs: {
            switchTab: function() {
                vm.nav = this.getAttribute('data-nav');
            },
            showMyInfo: function() {
                vm.exec('myInfo-show');
            },
            showBlacklist: function() {
                vm.exec('blacklist-show');
            },
            showUserDialog: function() {
                vm.exec('userDialog-show');
            },
            showGroupDialog: function() {
                vm.exec('groupDialog-show');
            },
            showNotice: function() {
                vm.exec('notice-show');
            },
            showOthersInfo: function(data) {
                vm.exec('othersInfo-show', data);
            },
            showLogoutDialog: function() {
                vm.exec('logoutDialog-show');
            },
            createGroup: function() {
                vm.exec('createGroup-show', {
                    operate: 'create',
                    type: 'group'
                });
            },
            createTeam: function() {
                vm.exec('createGroup-show', {
                    operate: 'create',
                    type: 'team'
                });
            },
            showChatWindow: function(data) {
                vm.exec('chatWindow-show', data);
            },
            clickItem: function(event) {
                var src = event.target || event.srcElement;
                var type = this.getAttribute('data-type');
                if (src.tagName === 'IMG' && type === 'p2p') {
                    return vm.funcs.showOthersInfo({
                        account: this.getAttribute('data-account')
                    });
                }
                if (!type) {
                    return;
                }
                var account = this.getAttribute('data-account');
                vm.funcs.showChatWindow({
                    type: type,
                    account: type === 'p2p' ? account : parseInt(account)
                });
                [].forEach.call(vm.eles.items, function(item) {
                    utils.removeClass(item, 'active');
                });
                utils.addClass(this, 'active');

                var session = q.call(vm.eles.sessions, '[data-account="' + account + '"]')[0];
                if (session) {
                    q.call(session, '.item-count')[0].innerHTML = '';
                }
            },
            renderHeader: function() {
                vm.eles.header.insertAdjacentHTML('beforeEnd', vm.render(vm.template.header, data));
            },
            updateNoteName: function(obj) {
                var session = q.call(vm.eles.sessions, '[data-account=' + obj.target + ']')[0];
                if (session) {
                    q.call(session, '.item-nick-name')[0].innerHTML = obj.noteName;
                }
                var friend = q.call(vm.eles.friends, '[data-account=' + obj.target + ']')[0];
                if (friend) {
                    q.call(friend, '.item-single-row')[0].innerHTML = obj.noteName;
                }
            },
            updateGroupName: function(obj) {
                var session = q.call(vm.eles.sessions, '[data-account="' + obj.account + '"]')[0];
                if (session) {
                    q.call(session, '.item-nick-name')[0].innerHTML = obj.value;
                }
                var group = q.call(vm.eles.groups, '[data-account="' + obj.account + '"]')[0];
                if (group) {
                    q.call(group, '.item-single-row')[0].innerHTML = obj.value;
                }
            },
            updateTeamName: function(obj) {
                var session = q.call(vm.eles.sessions, '[data-account="' + obj.account + '"]')[0];
                if (session) {
                    q.call(session, '.item-nick-name')[0].innerHTML = obj.value;
                }
                var team = q.call(vm.eles.teams, '[data-account="' + obj.account + '"]')[0];
                if (team) {
                    q.call(team, '.item-single-row')[0].innerHTML = obj.value;
                }
            },
            updateGroup: function(obj) {
                var session = q.call(vm.eles.sessions, '[data-account="' + obj.account + '"]')[0];
                if (session) {
                    q.call(session, '.item-nick-name')[0].innerHTML = obj.account;
                    q.call(session, 'img')[0].src = data.defaultTeamAvatar;
                }
            },
            updateSession: function(obj) {
                var ele, session;
                if (obj.to === data.account) {
                    ele = q.call(vm.eles.sessions, '[data-account="' + obj.from + '"]')[0];
                    session = find(data.sessions, function(session) {
                        return session.account === obj.from;
                    });
                } else {
                    ele = q.call(vm.eles.sessions, '[data-account="' + obj.to + '"]')[0];
                    session = find(data.sessions, function(session) {
                        return session.account === obj.to;
                    });
                }
                if (ele) {
                    q.call(ele, '.item-last-msg')[0].innerHTML = obj.content;
                    q.call(ele, '.item-time')[0].innerHTML = serializeTime(obj.time);
                    session.messages.push(obj);
                    vm.funcs.placeToTop(ele);
                } else {
                    session = {
                        account: obj.to === data.account ? obj.from : obj.to,
                        type: typeof obj.to === 'number' ? 'group' : 'p2p',
                        updateTime: obj.time,
                        messages: [{
                            content: obj.content,
                            from: obj.from,
                            time: obj.time,
                            type: obj.type
                        }]
                    };
                    data.sessions.push(session);
                    vm.exec('chatWindow-refreshContent', {
                        content: session.messages
                    });
                }
            },
            placeToTop: function(ele) {
                var parent = ele.parentNode;
                parent.insertBefore(ele, parent.childNodes[0]);
            },
            refreshNickName: function() {
                vm.eles.nickName.innerHTML = data.nickName;
            }
        },
        eventsMap: {
            'click .nav-tab': 'switchTab',
            'click .pencil': 'showMyInfo',
            'click #show-blacklist': 'showBlacklist',
            'click #add-friend': 'showUserDialog',
            'click #search-group': 'showGroupDialog',
            'click #show-notice': 'showNotice',
            'click .item': 'clickItem',
            'click #logout': 'showLogoutDialog',
            'click #create-group': 'createGroup',
            'click #create-team': 'createTeam'
        },
        api: {
            'chatPanel-updateNoteName': 'updateNoteName',
            'chatPanel-updateGroupName': 'updateGroupName',
            'chatPanel-updateTeamName': 'updateTeamName',
            'chatPanel-updateGroup': 'updateGroup',
            'chatPanel-updateSession': 'updateSession',
            'chatPanel-refreshNickName': 'refreshNickName'
        },
        eventer: app.eventer,
        init: function() {
            data = global.data;
            this.funcs.renderHeader();
            vm.sessions = data.sessions;
            vm.friends = data.friends;
            vm.groups = data.groups;
            vm.teams = data.teams;
            vm.eles.nickName = q('#nick-name');
        }
    });

    vm.eventer.on('init', function() {
        typeof vm.init === 'function' ? vm.init() : void 0;
    });

})(this, utils, app);
/**
 * Created by 78462 on 2017/3/6.
 */
;
(function(global, uitls, app) {

    'use strict';

    var show = utils.show, hide = utils.hide, q = utils.q, serializeTime = utils.serializeTime;
    var data;
    var emojiArray = ['angry', 'anguished', "astonished", "disappointed",
        "blush", "bowtie",  "cold_sweat", "confounded", "confused",
        "cry", "crying_cat_face",
        "relieved", "satisfied",
        "relaxed", "scream", "scream_cat", "see_no_evil",
        "dizzy_face", "expressionless", "fearful",
        "flushed", "frowning", "full_moon_with_face",
        "grin", "grinning", "heart_eyes", "heart_eyes_cat",
        "hushed", "innocent", "joy", "joy_cat",
        "kissing", "kissing_cat", "kissing_heart",
        "neutral_face", "open_mouth", "pensive", "persevere",
        "rage", "pouting_cat", "sleeping", "sleepy", "smile",
        "kissing_smiling_eyes", "laughing", "mask", "smile_cat", "smiling_imp", "smirk",
        "smiley", "smirk_cat", "sob", "stuck_out_tongue", "weary", "wink", "worried", "yum",
        "sweat_smile", "sweat", "triumph", "unamused",
        "heart", "heavy_exclamation_mark",
        "stuck_out_tongue_closed_eyes", "stuck_out_tongue_winking_eye", "sun_with_face",
        "sunglasses", "tired_face",
        "pill", "v",  "point_up_2", "point_up", "point_down",
        "point_left", "point_right", "poop", "pray", "raised_hands",
        "tada",
        "\\+1", "-1", "balloon", "bicyclist", "beer",
        "bomb", "bouquet", "broken_heart", "clap", "crown", "fire", "ghost", "gift", "gift_heart"];
    var vm = new V({
        el: '#chat-window',
        eles: {
            avatar: '#chat-window-avatar',
            name: '#chat-window-name',
            cloudMsg: '#cloud-msg',
            groupInfo: '#group-info',
            content: '.content 0',
            choseFile: '.file 0',
            msgInput: '.msg-input 0',
            emoji: '.icon-emoji 0',
            mask: '.chat-mask 0'
        },
        data: {
            show: {
                type: 'boolean',
                init: false,
                callback: function(value) {
                    value ? show(vm.el) : hide(vm.el);
                }
            },
            type: {
                type: 'string',
                init: '',
                callback: function(value) {
                    value === 'p2p' ? hide(vm.eles.groupInfo) : show(vm.eles.groupInfo);
                }
            },
            name: {
                type: 'string',
                init: 'null',
                callback: function(value) {
                    vm.eles.name.innerHTML = value || 'null';
                }
            },
            avatar: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.avatar.src = value !== vm.type ? value : (vm.type === 'p2p' ? data.defaultAvatar : (vm.type === 'group' ? data.defaultGroupAvatar : data.defaultTeamAvatar));
                }
            },
            content: {
                type: 'array',
                init: [],
                extend: {
                    push: function(item) {
                        var lastItem = this[this.length - 1],
                            lastTime = 0;
                        if (item.to === vm.account || item.type === 'p2p' && item.from === vm.account) {
                            if (lastItem === undefined) {
                                vm.eles.content.innerHTML = '';
                            } else {
                                lastTime = lastItem.time;
                            }
                            if (item.time - lastTime > config.timeout) {
                                vm.eles.content.insertAdjacentHTML('beforeEnd', vm.funcs.getMsgEle({
                                    type: 'timeMsg',
                                    time: item.time
                                }));
                            }
                            vm.eles.content.insertAdjacentHTML('beforeEnd', vm.funcs.getMsgEle(item));
                        }
                        Array.prototype.push.call(this, item);
                    }
                },
                callback: function(value) {
                    var str = '', lastTime = 0, timeout = config.timeout;
                    value.forEach(function(item, index) {
                        if (index === 0 || item.time - lastTime > timeout) {
                            str += vm.funcs.getMsgEle({
                                type: 'timeMsg',
                                time: item.time
                            });
                        }
                        lastTime = item.time;
                        str += vm.funcs.getMsgEle(item);
                    });
                    if (str === '') {
                        str += vm.funcs.getMsgEle({
                            type: 'systemMsg',
                            content: '暂无消息'
                        });
                    }
                    vm.eles.content.innerHTML = str;
                }
            }
        },
        template: {
            timeMsg: q('#time-msg-template').innerHTML,
            systemMsg: q('#system-msg-template').innerHTML,
            meMsg: q('#me-msg-template').innerHTML,
            othersGroupMsg: q('#others-group-msg-template').innerHTML,
            othersP2pMsg: q('#others-p2p-msg-template').innerHTML
        },
        funcs: {
            hide: function() {
                vm.show = false;
            },
            show: function(obj) {
                if (obj === undefined && vm.account === undefined) {
                    return;
                }
                vm.funcs.refresh(obj);
                vm.show = true;
                vm.exec('groupInfo-hide');
                vm.exec('cloudMsg-hide');
            },
            refresh: function(obj) {
                if (typeof obj === 'object' && vm.account !== obj.account) {
                    var result = app.funcs.find(obj) || app.funcs.findGroupUser(obj.account);
                    vm.type = obj.type;
                    vm.account = obj.account;
                    if (result) {
                        vm.avatar = result.avatar || obj.type;
                        vm.name = obj.type === 'p2p' ? result.noteName || result.nickName : result.name;
                        hide(vm.eles.mask);
                    } else {
                        vm.avatar = data.defaultTeamAvatar;
                        vm.name = obj.account + '';
                        show(vm.eles.mask);
                    }
                    var session = app.funcs.findSession(obj.account);
                    if (session) {
                        vm.content = session.messages;
                    } else {
                        vm.content = [];
                    }
                }
            },
            refreshContent: function(obj) {
                vm.content = obj.content;
            },
            showCloudMsg: function() {
                if (vm.type === 'p2p') {
                    vm.exec('cloudMsg-fetch', {
                        from: data.account,
                        to: vm.account
                    });
                } else {
                    vm.exec('cloudMsg-fetch', {
                        to: vm.account
                    });
                }
            },
            showGroupInfo: function() {
                vm.exec('groupInfo-show', {
                    account: vm.account,
                    type: vm.type
                });
            },
            showOthersInfo: function() {
                if (vm.type === 'p2p') {
                    vm.exec('othersInfo-show', {
                        account: vm.account
                    });
                } else {
                    vm.exec('othersInfo-show', {
                        account: this.getAttribute('data-account')
                    });
                }
            },
            openFile: function() {
                vm.eles.choseFile.click();
            },
            sendMsg: function() {
                var content = vm.eles.msgInput.value;
                if (content == false) {
                    return;
                }
                var obj = {
                    type: vm.type,
                    from: data.account,
                    to: vm.account,
                    time: new Date().getTime(),
                    content: content
                };
                app.funcs.sendMsg(obj);
                vm.eles.msgInput.value = '';
            },
            quickSendMsg: function(event) {
                if (event.keyCode === 13) {
                    vm.funcs.sendMsg();
                    event.preventDefault();
                }
            },
            getMsgEle: function(item) {
                var str, user,
                    emojiReg = /\[(\w+)\]/g;
                switch (item.type) {
                    case 'timeMsg':
                        str = vm.render(vm.template.timeMsg, {
                            time: serializeTime(item.time, true)
                        });
                        break;
                    case 'systemMsg':
                        str = vm.render(vm.template.systemMsg, item);
                        break;
                    case 'p2p':
                        if (item.from === data.account) {
                            str = vm.render(vm.template.meMsg, {
                                avatar: data.avatar || data.defaultAvatar,
                                content: item.content
                            });
                        } else {
                            user = app.funcs.findFriend(item.from) || app.funcs.findGroupUser(item.from);
                            str = vm.render(vm.template.othersP2pMsg, {
                                avatar: user.avatar || data.defaultAvatar,
                                content: item.content
                            });
                        }
                        break;
                    case 'group' || 'team' :
                        if (item.from === data.account) {
                            str = vm.render(vm.template.meMsg, {
                                avatar: data.avatar || data.defaultAvatar,
                                content: item.content
                            });
                        } else {
                            user = app.funcs.findGroupUser(item.from);
                            str = vm.render(vm.template.othersGroupMsg, {
                                name: user.noteName || user.nickName,
                                avatar: user.avatar || data.defaultAvatar,
                                content: item.content,
                                account: item.from
                            });
                        }
                }
                str = str.replace(emojiReg, function(str, key) {
                    var exist;
                    emojiArray.some(function(item) {
                        if (item === key) {
                            return exist = true;
                        }
                    });
                    if (exist == true) {
                        return '<i data-des="' + key + '"class="emoji emoji_' + key + '"></i>';
                    }
                    return '[' + key + ']';
                });
                return str;
            },
            onRemoveGroup: function(obj) {
                if (obj.account === vm.account) {
                    vm.account = null;
                    vm.funcs.hide();
                }
            }
        },
        eventsMap: {
            'click #cloud-msg': 'showCloudMsg',
            'click #group-info': 'showGroupInfo',
            'click [data-operate=showOthersInfo]': 'showOthersInfo',
            'click .icon-file': 'openFile',
            'click .send': 'sendMsg',
            'keydown .msg-input': 'quickSendMsg'
        },
        api: {
            'chatWindow-show': 'show',
            'chatWindow-hide': 'hide',
            'chatWindow-onRemoveGroup': 'onRemoveGroup',
            'chatWindow-refreshContent': 'refreshContent'
        },
        eventer: app.eventer,
        init: function() {
            data = global.data;
            app.funcs.getMsgEle = vm.funcs.getMsgEle;
            new Emoji({
                array: emojiArray,
                input: this.eles.msgInput,
                emojiButton: this.eles.emoji
            }).init();
        }
    });

    vm.eventer.on('init', function() {
        typeof vm.init === 'function' ? vm.init() : void 0;
    });


})(this, utils, app);
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
/**
 * Created by 78462 on 2017/4/7.
 */
(function(global, utils) {

    'use strict';

    var on = utils.on, q = utils.q;

    /**
     *  array 表情组
     *  input 输入框
     *  emojiButton 开关emoji表情的按钮
     */
    function Emoji(option) {
        this.array = option.array;
        this.input = option.input;
        this.emojiButton = option.emojiButton;
        this.containerStyle = option.containerStyle || {
                position: 'absolute',
                top: '-270px',
                left: '39px',
                width: '500px',
                height: '300px',
                'z-index': '100',
                background: '#ffffff',
                border: '1px solid #ccc',
                'box-sizing': 'content-box'
            };
    }

    Emoji.prototype = {
        init: function () {
            this.loadEmoji();
            this.bindEvent();
        },
        bindEvent: function () {
            var _this = this;
            on(this.emojiContainer, 'click', '.emojiContainer', function(event) {
                var description = this.children[0].getAttribute('data-des');
                _this.input.value += '[' + description + ']';
                event.stopPropagation();
            });
            on(_this.emojiButton, 'click', function(event) {
                _this.emojiContainer.style.display = _this.emojiContainer.style.display === 'block' ? 'none' : 'block';
                event.stopPropagation();
            });
            on(document, 'click', function(event) {
                _this.emojiContainer.style.display = 'none';
            });
        },
        loadEmoji: function () {
            var emoji = [], i, key,
                data = this.array,
                style = 'display:none;',
                len = data.length;
            this.emojiContainer = document.createElement("div");
            for (i = 0; i < len; i++) {
                emoji.push('<span class="emojiContainer"><i data-des="' + data[i] + '"class="emoji emoji_' + data[i] + '"></i></span>');
            }
            for (key in this.containerStyle) {
                style += key + ':' + this.containerStyle[key] + ';';
            }
            this.emojiContainer.innerHTML = '<div style="overflow:auto;width:' + (this.containerStyle.width || 0) +
                ';height:' + (this.containerStyle.height || 0) + ';">' + emoji.join('') + '</div>';
            this.emojiContainer.setAttribute("id", "emojiContainer");
            this.emojiContainer.setAttribute('style', style);
            this.emojiButton.parentNode.appendChild(this.emojiContainer);
        }
    };

    global.Emoji = Emoji;
})(this, utils);
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
/**
 * Created by 78462 on 2017/3/6.
 */
;
(function(global, uitls, app) {

    'use strict';

    var mask = app.mask, show = utils.show, hide = utils.hide;
    var vm = new V({
        el: '#logout-dialog',
        eles: {

        },
        data: {
            show: {
                type: 'boolean',
                init: false,
                callback: function(value) {
                    value ? show(vm.el) : hide(vm.el);
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
            logout: function() {

            }
        },
        eventsMap: {
            'click .close': 'hide',
            'click .logout': 'logout'
        },
        api: {
            'logoutDialog-show': 'show',
            'logoutDialog-hide': 'hide'
        },
        eventer: app.eventer
    });

})(this, utils, app);
/**
 * Created by 78462 on 2017/3/6.
 */
;
(function(global, uitls, app) {

    'use strict';

    var mask = app.mask, show = utils.show, hide = utils.hide;
    var vm = new V({
        el: '#modify-avatar-card',
        eles: {
            choseAvatar: '#chose-avatar',
            avatars: 'img',
            choseFileContainer: '.chose-file-container 0'
        },
        data: {
            show: {
                type: 'boolean',
                init: false,
                callback: function(value) {
                    value ? show(vm.el) : hide(vm.el);
                    show(vm.eles.choseFileContainer);
                    [].forEach.call(vm.eles.avatars, function(item) {
                        hide(item);
                        item.src = '';
                    });
                }
            },
            src: {
                type: 'string',
                init: '',
                callback: function(value) {
                    hide(vm.eles.choseFileContainer);
                    [].forEach.call(vm.eles.avatars, function(item) {
                        show(item);
                        item.src = value;
                    });
                }
            }
        },
        funcs: {
            hide: function() {
                mask.show = vm.show = false;
                vm.exec('myInfo-show');
            },
            show: function() {
                vm.exec('myInfo-hide');
                mask.show = vm.show = true;
            },
            choseAvatar: function() {
                vm.eles.choseAvatar.click();
            },
            changeAvatar: function() {
                if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
                    alert('The File APIs are not fully supported in this browser.');
                    return;
                }
                if (this.files[0] === undefined) {
                    return;
                }
                var reader = new FileReader();
                reader.onload = function(e) {
                    vm.src = e.target.result;
                };
                reader.readAsDataURL(this.files[0]);
            }
        },
        eventsMap: {
            'click .close': 'hide',
            'click .chose-avatar': 'choseAvatar',
            'change #chose-avatar': 'changeAvatar'
        },
        api: {
            'modifyAvatar-show': 'show',
            'modifyAvatar-hide': 'hide'
        },
        eventer: app.eventer
    });


})(this, utils, app);
/**
 * Created by 78462 on 2017/3/6.
 */
;
(function(global, uitls, app) {

    'use strict';

    var mask = app.mask, show = utils.show, hide = utils.hide, camel = utils.camel, q = utils.q, assign = utils.assign;
    var temporaryInfo = {};
    var vm = new V({
        el: '#my-info',
        eles: {
            userInfo: '.user-info 0',
            choseAvatar: '#chose-avatar',
            gender: '.gender 0',
            genderInput: '[data-des=gender] 0',
            nickName: '.nick-name 0',
            nickNameInput: '[data-des=nick-name] 0',
            birthday: '.u-birthday 0',
            birthdayInput: '[data-des=birthday] 0',
            email: '.u-email 0',
            emailInput: '[data-des=email] 0',
            tel: '.u-tel 0',
            telInput: '[data-des=tel] 0',
            sign: '.u-sign 0',
            signInput: '[data-des=sign] 0',
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
            edit: {
                type: 'boolean',
                init: false,
                callback: function(value) {
                    value ? utils.addClass(vm.eles.userInfo, 'edit') : utils.removeClass(vm.eles.userInfo, 'edit') ;
                }
            },
            account: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.account.innerHTML = '账号：' + value;
                }
            },
            gender: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.gender.className = value ?  'gender' + ' ' + value : 'gender';
                    vm.eles.genderInput.value = value;
                }
            },
            nickName: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.nickName.innerHTML = value || '--';
                    vm.eles.nickNameInput.value = value;
                }
            },
            birthday: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.birthday.innerHTML = value || '--';
                    vm.eles.birthdayInput.value = value;
                }
            },
            email: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.email.innerHTML = value || '--';
                    vm.eles.emailInput.value = value;
                }
            },
            tel: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.tel.innerHTML = value || '--';
                    vm.eles.telInput.value = value;
                }
            },
            sign: {
                type: 'string',
                init: '',
                callback: function(value) {
                    vm.eles.sign.innerHTML = value || '--';
                    vm.eles.signInput.value = value;
                }
            }
        },
        funcs: {
            hide: function() {
                mask.show = vm.show = false;
            },
            show: function() {
                mask.show = vm.show = true;
                vm.funcs.refresh();
            },
            modifyAvatar: function() {
                vm.exec('modifyAvatar-show');
            },
            storageInfo: function() {
                var prop = camel(this.getAttribute('data-des'));
                temporaryInfo[prop] = this.value;
            },
            clearInfo: function() {
                temporaryInfo = {};
            },
            updateInfo: function() {
                assign(vm, temporaryInfo);
                app.funcs.updateUserInfo({
                    account: data.account,
                    info: temporaryInfo
                });
            },
            operate: function() {
                var type = this.classList[1];
                vm.edit = !vm.edit;
                if (type === 'operate-cancel') {
                    vm.funcs.clearInfo();
                } else if (type === 'operate-save') {
                    vm.funcs.updateInfo();
                }
            },
            refresh: function() {
                vm.account = data.account || '';
                vm.nickName = data.nickName || '';
                vm.gender = data.gender || '';
                vm.birthday = data.birthday || '';
                vm.tel = data.tel || '';
                vm.email = data.email || '';
                vm.sign = data.sign || '';
            }
        },
        eventsMap: {
            'click .close': 'hide',
            'click #modify-avatar': 'modifyAvatar',
            'change [data-des]': 'storageInfo',
            'click .operate-btn': 'operate'
        },
        api: {
            'myInfo-show': 'show',
            'myInfo-hide': 'hide'
        },
        eventer: app.eventer
    });

})(this, utils, app);
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
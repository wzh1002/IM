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
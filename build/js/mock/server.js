/**
 * Created by 78462 on 2017/4/9.
 */
(function(global, utils) {

    'use strict';

    var serverEvents = {},
        clientEvents = {},
        serverEvents1 = {},
        clientEvents1 = {},
        server, client;

    server = {
        on: function(eventName, callback) {
            serverEvents[eventName] = serverEvents[eventName] || [];
            serverEvents[eventName].push(callback);
        },
        once: function(eventName, callback) {
            serverEvents1[eventName] = serverEvents1[eventName] || [];
            serverEvents1[eventName].push(callback);
        },
        emit: function(eventName, _) {
            var events = clientEvents[eventName],
                events1 = clientEvents1[eventName],
                args = Array.prototype.slice.call(arguments, 1);
            if (!events) {
                return;
            }
            events.forEach(function(item) {
                item.apply(null, args);
            });
            if (!events1) {
                return;
            }
            events1.forEach(function(item) {
                item.apply(null, args);
            });
            events1 = [];
        }
    };

    client = {
        on: function(eventName, callback) {
            clientEvents[eventName] = clientEvents[eventName] || [];
            clientEvents[eventName].push(callback);
        },
        once: function(eventName, callback) {
            clientEvents1[eventName] = clientEvents1[eventName] || [];
            clientEvents1[eventName].push(callback);
        },
        emit: function(eventName, _) {
            var events = serverEvents[eventName],
                events1 = serverEvents1[eventName],
                args = Array.prototype.slice.call(arguments, 1);
            if (!events) {
                return;
            }
            events.forEach(function(item) {
                item.apply(null, args);
            });
            if (!events1) {
                return;
            }
            events1.forEach(function(item) {
                item.apply(null, args);
            });
            events1 = [];
        }
    };

    global.io = {
        listen: function() {
            return server;
        },
        connect: function() {
            return client;
        }
    };
})(this, utils);
/**
 * Created by 78462 on 2017/4/3.
 */
;
(function(global, utils, io) {

    'use strict';

    var find = utils.find, findIndex = utils.findIndex, remove = utils.remove, assign = utils.assign, on = utils.on;
    var teamCount = 2, groupCount = 1000000004;
    var initData = {
        defaultAvatar: '../../img/default-avatar.png',
        defaultGroupAvatar: '../../img/group.png',
        defaultTeamAvatar: '../../img/team.png',
        users: [
            {
                account: 'user1',
                nickName: '233',
                avatar: '../../img/notice.png',
                gender: 'male',
                birthday: '1995-10-10',
                tel: '13007506620',
                email: '784623601@qq.com'
            },
            {
                account: 'user2',
                nickName: 'user2',
                gender: 'male',
                avatar: '../../img/search-group.png',
                birthday: '2014-02-14'
            },
            {
                account: 'shady1128',
                nickName: 'shadow',
                gender: 'female',
                avatar: null
            },
            {
                account: 'shmily2004',
                nickName: 'shmily',
                avatar: null
            },
            {
                account: 'user3',
                nickName: 'user3',
                avatar: null,
                sign: 'test'
            },
            {
                account: 'user4',
                nickName: 'user4',
                avatar: null
            },
            {
                account: 'user5',
                nickName: 'username5',
                avatar: null
            },
            {
                account: 'xt112233',
                nickName: '111',
                avatar: null
            }
        ],
        friends: [
            {
                account: 'user1',
                friends: [
                    {
                        account: 'shady1128'
                    },
                    {
                        account: 'shmily2004',
                        noteName: '???'
                    },
                    {
                        account: 'user2',
                        noteName: 'test'
                    },
                    {
                        account: 'user4'
                    },
                    {
                        account: 'user5'
                    }
                ]
            }
        ],
        blacklists: [
            {
                account: 'user1',
                blacklist: [
                    {
                        account: 'user3',
                        noteName: '?',
                        friend: true
                    }
                ]
            }
        ],
        groups: [
            {
                account: 1000000001,
                name: 'user1、user2等人',
                owner: 'user1',
                des: '',
                permissions: {
                    verify: 1,
                    invite: 0,
                    modify: 0,
                    verifyed: 0
                },
                members: [
                    'user1',
                    'user2',
                    'xt112233'
                ]
            },
            {
                account: 1000000002,
                name: 'group',
                owner: 'user1',
                des: '',
                permissions: {
                    verify: 1,
                    invite: 0,
                    modify: 0,
                    verifyed: 0
                },
                members: [
                    'user1',
                    'user3'
                ]
            },
            {
                account: 1000000003,
                name: '233、user2等人',
                owner: 'user2',
                des: '',
                permissions: {
                    verify: 1,
                    invite: 0,
                    modify: 0,
                    verifyed: 0
                },
                members: [
                    'user2',
                    'user3'
                ]
            },
            {
                account: 1000000004,
                name: '233、user2等人',
                owner: 'user2',
                des: '',
                permissions: {
                    verify: 1,
                    invite: 0,
                    modify: 0,
                    verifyed: 0
                },
                members: [
                    'user2',
                    'user1'
                ]
            }
        ],
        teams: [
            {
                account: 1,
                name: '讨论组',
                owner: 'user1',
                members: [
                    'user1',
                    'user2',
                    'user3'
                ]
            },
            {
                account: 2,
                name: 'user1、user2、user3等人',
                owner: 'user1',
                members: [
                    'user1',
                    'user2',
                    'user3'
                ]
            }
        ],
        messages: [
            {
                type: 'p2p',
                from: 'user2',
                to: 'user1',
                unRead: 1,
                updateTime: 1491208689012,
                messages: [
                    {
                        content: 'what are you doing',
                        time: 1491208489012
                    },
                    {
                        content: 'hello world!',
                        time: 1491208587512
                    },
                    {
                        content:  '????',
                        time: 1491208689012
                    }
                ]
            },
            {
                type: 'p2p',
                from: 'user1',
                to: 'user2',
                unRead: 0,
                updateTime: 1491208589012,
                messages: [
                    {
                        content: 'hay',
                        time: 1491208589012
                    }
                ]
            },
            {
                type: 'group',
                from: 'xt112233',
                to: 1000000001,
                updateTime: 1491208942511,
                messages: [
                    {
                        content: 'hello world',
                        time: 1491208942511
                    }
                ]
            },
            {
                type: 'group',
                from: 'user1',
                to: 1000000001,
                updateTime: 1491208932167,
                messages: [
                    {
                        content: '你好',
                        time: 1491208932167
                    }
                ]
            }
        ]
    };
    var dataBase = initData;

    var staticApi = {
        getInitData: function(account) {
            var _this = this;
            if (typeof dataBase !== 'object') {
                return null;
            }
            var obj = {
                    defaultAvatar: dataBase.defaultAvatar,
                    defaultGroupAvatar: dataBase.defaultGroupAvatar,
                    defaultTeamAvatar: dataBase.defaultTeamAvatar,
                    friends: _this.getFriendsInfoByUser(account),
                    groups: _this.getGroupsByUser(account),
                    teams: _this.getTeamsByUser(account),
                    sessions: _this.getSessionByUser(account),
                    blacklist: _this.getBlacklistByUser(account) || [],
                    blacklistMembersInfo: _this.getBlacklistMembersInfo(account)
                },
                user = this.getUser(account);
            obj.groupsMembersInfo = (function() {
                var result = {},
                    groups = obj.groups,
                    teams = obj.teams;

                groups.forEach(function(item){
                    item.members.forEach(function(account) {
                        result[account] = _this.getUser(account);
                    });
                });
                teams.forEach(function(item) {
                    item.members.forEach(function(account) {
                        result[account] = _this.getUser(account);
                    });
                });
                return result;
            })();
            return JSON.parse(JSON.stringify(utils.assign(obj, user)));
        },
        getUser: function(account) {
            return find(dataBase.users, function(item) {
                return item.account == account;
            });
        },
        getFriendsInfoByUser: function(account) {
            var result = [],
                friends = this.getFriendsByUser(account),
                _this = this;
            friends.forEach(function(user) {
                var info = {},
                    obj = _this.getUser(user.account);
                for (var key in obj) {
                    if (key !== 'friends') {
                        info[key] = obj[key];
                    }
                }
                info.noteName = user.noteName;
                result.push(info)
            });
            return result;
        },
        getFriendsByUser: function(account) {
            var obj = find(dataBase.friends, function(item) {
                return item.account === account;
            });
            if (obj && obj.friends) {
                return obj.friends;
            }
        },
        getBlacklistByUser: function(account) {
            var obj = find(dataBase.blacklists, function(item) {
                return item.account === account;
            });
            if (obj && obj.blacklist) {
                return obj.blacklist;
            }
        },
        getGroupsByUser: function(account) {
            var groups = [];
            dataBase.groups.forEach(function(item) {
                var result = find(item.members, account);
                if (result) {
                    groups.push(item);
                }
            });
            return groups;
        },
        getTeamsByUser: function(account) {
            var teams = [];
            dataBase.teams.forEach(function(item) {
                var result = find(item.members, account);
                if (result) {
                    teams.push(item);
                }
            });
            return teams;
        },
        getSessionByUser: function(account) {
            var sessions = [],
                _this = this,
                groups = _this.getGroupsByUser(account);
            dataBase.messages.forEach(function(item) {
                var obj, index;
                if (item.type === 'p2p') {
                    if (item.to === account) {
                        index = findIndex(sessions, function(session) {
                            return session.account === item.from;
                        });
                        obj = sessions[index] || {
                                account: item.from
                            };
                        obj.unRead = item.unRead;
                    } else if (item.from === account) {
                        index = findIndex(sessions, function(session) {
                            return session.account === item.to;
                        });
                        obj = sessions[index] || {
                                account: item.to
                            };
                    } else {
                        return;
                    }
                } else {
                    var exist = findIndex(groups, function(group) {
                        return group.account === item.to;
                    });
                    if (exist === -1) {
                        return;
                    }
                    index = findIndex(sessions, function(session) {
                        return session.account === item.to;
                    });
                    obj = sessions[index] || {
                            account: item.to
                        };
                }
                obj.type = obj.type || (typeof obj.account !== 'number' ? 'p2p' : (obj.account < 1000000000 ? 'team' : 'group'));
                obj.messages = obj.messages || [];
                item.messages.forEach(function(message) {
                    obj.messages.push({
                        from: item.from,
                        content: message.content,
                        time: message.time,
                        type: item.type
                    });
                });
                if (index === -1) {
                    sessions.push(obj);
                }
            });
            sessions.forEach(function(item) {
                item.messages.sort(function(a, b) {
                    return a.time - b.time;
                });
                item.updateTime = item.messages[item.messages.length - 1].time;
            });

            sessions.sort(function(a, b) {
                return b.updateTime - a.updateTime;
            });

            return sessions;
        },
        getCloudMsg: function(to, from) {
            var obj = {};
            if (from !== undefined) {
                obj.type = 'p2p';
                dataBase.messages.forEach(function(item) {
                    if ((item.from === from && item.to === to) || (item.to === from && item.from === to)) {
                        if (obj.account !== to) {
                            obj.account = to;
                            obj.messages = [];
                        }
                        item.messages.forEach(function(message) {
                            var msg = {
                                from: item.from,
                                content: message.content,
                                time: message.time,
                                type: message.type || item.type
                            };
                            obj.messages.push(msg);
                        });
                    }
                });
            } else {
                obj.type = 'group';
                dataBase.messages.forEach(function(item) {
                    if (item.to === to) {
                        if (obj.account !== to) {
                            obj.account = to;
                            obj.messages = [];
                        }
                        item.messages.forEach(function(message) {
                            obj.messages.push({
                                from: item.from,
                                content: message.content,
                                time: message.time,
                                type: message.type || item.type
                            });
                        });
                    }
                });
            }
            if (obj.messages) {
                obj.messages.sort(function(a, b) {
                    return a.time - b.time;
                });
                return obj;
            }
            return null;
        },
        getMessage: function(to, from) {
            return find(dataBase.messages, function(item) {
                return item.to === to && item.from === from;
            }) || null;
        },
        getGroup: function(account) {
            return find(dataBase.groups, function(item) {
                return item.account === account;
            }) || null;
        },
        getBlacklistMembersInfo: function(account) {
           var result = [],
               _this = this,
               blacklist = this.getBlacklistByUser(account);
            if (blacklist && blacklist.forEach) {
                blacklist.forEach(function(user) {
                    var info = _this.getUser(user.account);
                    result.push(info);
                });
            }
            return result;
        },
        getGroupPermission: function(account) {
            return this.getGroup(account).permissions;
        },
        getTeam: function(account) {
            return find(dataBase.teams, function(item) {
                return item.account === account;
            }) || null;
        },
        getTeamMembersInfo: function(account) {
            var result = [],
                _this = this;
            this.getTeam(account).members.forEach(function(user) {
                var info = _this.getUser(user);
                result.push({
                    account: info.account,
                    avatar: info.avatar,
                    nickName: info.nickName
                });
            });
            return result;
        },
        searchUser: function(account) {
            var result = this.getUser(account);
            if (result) {
                return {
                    success: true,
                    data: {
                        account: result.account,
                        nickName: result.nickName,
                        avatar: result.avatar || data.defaultAvatar,
                        relation: 'no-friend'
                    }
                };
            }
            return {
                success: false,
                msg: '该帐号不存在，请检查你输入的帐号是否正确'
            };
        },
        searchGroup: function(account) {
            var result = this.getGroup(account),
                type = 'group';
            if (!result) {
                result = this.getTeam(account);
                type = 'team';
            }
            if (result) {
                return {
                    success: true,
                    data: {
                        account: result.account,
                        groupName: result.name,
                        avatar: result.avatar || type === 'group' ? dataBase.defaultGroupAvatar : dataBase.defaultTeamAvatar,
                        relation: 'no-friend'
                    }
                };
            } else {
                return {
                    success: false
                };
            }
        },
        updateMessage: function(obj) {
            var session = this.getMessage(obj.to, obj.from);
            if (session !== null) {
                session.messages.push(obj);
                session.updateTime = obj.time;
            } else {
                dataBase.messages.push({
                    type: obj.type,
                    from: obj.from,
                    to: obj.to,
                    unRead: 0,
                    updateTime: obj.time,
                    messages: [
                        {
                            content: obj.content,
                            time: obj.time
                        }
                    ]
                });
            }
        },
        getFriendInfo: function(account, target) {
            var friends = this.getFriendsByUser(account);
            return find(friends, function(item) {
                    return item.account === target;
            });
        },
        isFriend: function(account, target) {
            return this.getFriendInfo(account, target) !== undefined;
        },
        addFriend: function(account, target, noteName) {
            var friends,
                obj = {
                    account: target
                };
            if (noteName) {
                obj.noteName = noteName;
            }
            if (friends = this.getFriendsByUser(account)) {
                friends.push(obj);
            } else {
                dataBase.friends.push({
                    account: account,
                    friends: [obj]
                });
            }
            if (friends = this.getFriendsByUser(target)) {
                friends.push({
                    account: account
                });
            } else {
                dataBase.friends.push({
                    account: target,
                    friends: [{
                        account: account
                    }]
                });
            }
        },
        removeFriend: function(account, target, flag) {
            var friends, blacklist, item;
            if (friends = this.getFriendsByUser(account)) {
                remove(friends, function(item) {
                    return item.account === target;
                });
            }
            if (friends = this.getFriendsByUser(target)) {
                remove(friends, function(item) {
                    return item.account === account
                });
            }
            if (flag === undefined) {
                if (blacklist = this.getBlacklistByUser(account)) {
                    if (item = find(blacklist, function(item) {return item.account === target})) {
                        item.friend = false;
                    }
                }
                if (blacklist = this.getBlacklistByUser(target)) {
                    if (item = find(blacklist, function(item) {return item.account === account})) {
                        item.friend = false;
                    }
                }
            }
        },
        addBlacklist: function(account, target, flag) {
            var blacklist = this.getBlacklistByUser(account),
                obj = {
                    account: target
                };
            if (flag) {
                var info = this.getFriendInfo(account, target);
                if (info.noteName) {
                    obj.noteName = info.noteName;
                }
                obj.friend = true;
            } else {
                obj.friend = false;
            }
            if (blacklist) {
                blacklist.push(obj);
            } else {
                dataBase.blacklists.push({
                    account: account,
                    blacklist: [obj]
                });
            }
            return obj;
        },
        removeBlacklist: function(account, target) {
            var blacklist = this.getBlacklistByUser(account);
            if (blacklist) {
                return remove(blacklist, function(item) {
                    return item.account === target;
                })[0];
            }
        },
        generateGroupName: function(members) {
            return members.join('、').slice(0 ,10) + '等人';
        },
        createGroup: function(owner, members) {
            var group = {
                account: ++groupCount,
                name: this.generateGroupName(members),
                owner: owner,
                des: '',
                permissions: {
                    verify: 1,
                    invite: 0,
                    modify: 0,
                    verifyed: 0
                },
                members: members
            };
            dataBase.groups.push(group);
            return group;
        },
        createTeam: function(owner, members) {
            var team = {
                account: ++teamCount,
                name: this.generateGroupName(members),
                owner: owner,
                des: '',
                members: members
            };
            dataBase.teams.push(team);
            return team;
        },
        addGroupMember: function(account, members) {
            var group = this.getGroup(account);
            if (group === null) {
                return;
            }
            group.members = group.members.concat(members);
            return group;
        },
        addTeamMember: function(account, members) {
            var team = this.getTeam(account);
            if (team === null) {
                return;
            }
            team.members = team.members.concat(members);
            return team;
        },
        removeGroupMember: function(account, members) {
            var group = this.getGroup(account);
            if (group === null) {
                return;
            }
            members.forEach(function(account) {
                remove(group.members, account);
            });
        },
        removeTeamMember: function(account, members) {
            var team = this.getTeam(account);
            if (team === null) {
                return;
            }
            members.forEach(function(account) {
                remove(team.members, account);
            });
        },
        existGroup: function(account, target) {
            var group = this.getGroup(account);
            if (group === null) {
                return;
            }
            remove(group.members, target);
        },
        existTeam: function(account, target) {
            var team = this.getTeam(account);
            if (team === null) {
                return;
            }
            remove(team.members, target);
            if (target === team.owner) {
                team.owner = team.members[0];
            }
        },
        dissolveGroup: function(account) {
            remove(dataBase.groups, function(item) {
                return item.account === account;
            });
        },
        updateNoteName: function(owner, target, noteName) {
            var friends = find(dataBase.friends, function(item) {
                return item.account === owner;
            });
            if (!friends) {
                return;
            }
            var friendInfo = find(friends.friends, function(item) {
                    return item.account === target;
                });
            friendInfo.noteName = noteName;
        },
        updateUserInfo: function(account, info) {
            var user = this.getUser(account);
            assign(user, info);
            return user;
        },
        updateGroupName: function(account, value) {
            var group = this.getGroup(account);
            group.name = value;
        },
        updateGroupDes: function(account, value) {
            var group = this.getGroup(account);
            group.des = value;
        },
        updateAuthentication: function(account, value) {
            var group = this.getGroup(account);
            group.permissions.verify = value;
        },
        updateInvitePermissions: function(account, value) {
            var group = this.getGroup(account);
            group.permissions.invite = value;
        },
        updateModifyPermissions: function(account, value) {
            var group = this.getGroup(account);
            group.permissions.modify = value;
        },
        updateBeAuthentication: function(account, value) {
            var group = this.getGroup(account);
            group.permissions.verifyed = value;
        },
        updateTeamName: function(account, value) {
            var team = this.getTeam(account);
            team.name = value;
        }
    };

    var mockServer = function() {
        var server = io.listen();

        server.on('getUserInfo', function(obj) {
            var userInfo = staticApi.getInitData(obj.account);
            server.emit('init', userInfo);
        });

        server.on('getCloudMsg', function(obj) {
            var cloudMsg = staticApi.getCloudMsg(obj.to, obj.from);
            server.emit('refreshCloudMsg', cloudMsg);
        });

        server.on('othersInfo-getUser', function(obj) {
            var result = staticApi.getUser(obj.account);
            server.emit('refreshOthersInfo', result);
        });

        server.on('searchUser', function(obj) {
            var result = staticApi.searchUser(obj.account);
            server.emit('searchUserResult', result);
        });

        server.on('searchGroup', function(obj) {
            var result = staticApi.searchGroup(obj.account);
            server.emit('searchGroupResult', result);
        });

        server.on('createGroup', function(obj) {
            var result = staticApi.createGroup(obj.owner, obj.members);
            server.emit('addGroup', result);
            var membersInfo = {};
            obj.members.forEach(function(account) {
                membersInfo[account] = staticApi.getUser(account);
            });
            server.emit('updateGroupsMembersInfo', membersInfo);
        });

        server.on('createTeam', function(obj) {
            var result = staticApi.createTeam(obj.owner, obj.members);
            server.emit('addTeam', result);
            var membersInfo = {};
            obj.members.forEach(function(account) {
                membersInfo[account] = staticApi.getUser(account);
            });
            server.emit('updateGroupsMembersInfo', membersInfo);
        });

        server.on('addGroupMember', function(obj) {
            staticApi.addGroupMember(obj.account, obj.members);
            server.emit('addGroupMember', obj);
            var membersInfo = {};
            obj.members.forEach(function(account) {
                membersInfo[account] = staticApi.getUser(account);
            });
            server.emit('updateGroupsMembersInfo', membersInfo);
        });

        server.on('addTeamMember', function(obj) {
            staticApi.addTeamMember(obj.account, obj.members);
            server.emit('addTeamMember', obj);
            var membersInfo = {};
            obj.members.forEach(function(account) {
                membersInfo[account] = staticApi.getUser(account);
            });
            server.emit('updateGroupsMembersInfo', membersInfo);
        });

        server.on('removeGroupMember', function(obj) {
            staticApi.removeGroupMember(obj.account, obj.members);
            server.emit('removeGroupMember', obj);
        });

        server.on('removeTeamMember', function(obj) {
            staticApi.removeTeamMember(obj.account, obj.members);
            server.emit('removeTeamMember', obj);
        });

        server.on('existGroup', function(obj) {
            staticApi.existGroup(obj.account, obj.target);
            server.emit('removeGroup', obj);
            var msg = {
                to: obj.account,
                type: 'systemMsg',
                content: '你退出了群',
                time: (new Date()).getTime()
            };
            staticApi.updateMessage(msg);
            server.emit('msg', msg);
        });

        server.on('existTeam', function(obj) {
            staticApi.existTeam(obj.account, obj.target);
            server.emit('removeTeam', obj);
            var msg = {
                to: obj.account,
                type: 'systemMsg',
                content: '你退出了讨论组',
                time: (new Date()).getTime()
            };
            staticApi.updateMessage(msg);
            server.emit('msg', msg);
        });

        server.on('dissolveGroup', function(obj) {
            staticApi.dissolveGroup(obj.account);
            server.emit('removeGroup', obj);
            var msg = {
                to: obj.account,
                type: 'systemMsg',
                content: '你解散了群',
                time: (new Date()).getTime()
            };
            staticApi.updateMessage(msg);
            server.emit('msg', msg);
        });

        server.on('addFriend', function(obj) {
            staticApi.addFriend(obj.account, obj.target);
            server.emit('addFriend',staticApi.getUser(obj.target));
        });

        server.on('deleteFriend', function(obj) {
            staticApi.removeFriend(obj.account, obj.target);
            server.emit('deleteFriend', obj);
        });

        server.on('addBlacklist', function(obj) {
            var isFriend = staticApi.isFriend(obj.account, obj.target);
            var result = staticApi.addBlacklist(obj.account, obj.target, isFriend);
            server.emit('addBlacklist', result);
            if (isFriend) {
                staticApi.removeFriend(obj.account, obj.target, true);
                server.emit('deleteFriend', obj);
            }
        });

        server.on('removeBlacklist', function(obj) {
            var user = staticApi.removeBlacklist(obj.account, obj.target);
            server.emit('removeBlacklist', {
                account: obj.target
            });
            if (user.friend) {
                staticApi.addFriend(obj.account, obj.target, user.noteName);
                var info = staticApi.getUser(obj.target);
                info.noteName = user.noteName;
                server.emit('addFriend', info);
            }
        });

        server.on('updateNoteName', function(obj) {
            staticApi.updateNoteName(obj.owner, obj.target, obj.noteName);
            server.emit('updateNoteName', obj);
        });

        server.on('updateUserInfo', function(obj) {
            var user = staticApi.updateUserInfo(obj.account, obj.info);
            server.emit('updateUserInfo', user);
        });

        server.on('updateGroupName', function(obj) {
            staticApi.updateGroupName(obj.account, obj.value);
            server.emit('updateGroupName', obj);
            var msg = {
                type: 'systemMsg',
                to: obj.account,
                content: '你修改了群名称',
                time: (new Date()).getTime()
            };
            staticApi.updateMessage(msg);
            server.emit('msg', msg);
        });

        server.on('updateTeamName', function(obj) {
            staticApi.updateTeamName(obj.account, obj.value);
            server.emit('updateTeamName', obj);
            var msg = {
                type: 'systemMsg',
                to: obj.account,
                content: '你修改了讨论组名称',
                time: (new Date()).getTime()
            };
            staticApi.updateMessage(msg);
            server.emit('msg', msg);
        });

        server.on('updateGroupDes', function(obj) {
            staticApi.updateGroupDes(obj.account, obj.value);
            server.emit('updateGroupDes', obj);
            var msg = {
                type: 'systemMsg',
                to: obj.account,
                content: '你更新群介绍为' + obj.value,
                time: (new Date()).getTime()
            };
            staticApi.updateMessage(msg);
            server.emit('msg', msg);
        });

        server.on('updateAuthentication', function(obj) {
            staticApi.updateAuthentication(obj.account, obj.value);
            server.emit('updateAuthentication', obj);
            var msg = {
                type: 'systemMsg',
                to: obj.account,
                content: '群身份验证模式更新为' + (obj.value === 0 ? '允许任何人加入' : (obj.value === 1 ? '需要验证消息' : '不允许任何人申请加入')),
                time: (new Date()).getTime()
            };
            staticApi.updateMessage(msg);
            server.emit('msg', msg);
        });

        server.on('updateInvitePermissions', function(obj) {
            staticApi.updateInvitePermissions(obj.account, obj.value);
            server.emit('updateInvitePermissions', obj);
            var msg = {
                type: 'systemMsg',
                to: obj.account,
                content: '邀请他人权限为' + (obj.value === 0 ?  '管理员' : '所有人'),
                time: (new Date()).getTime()
            };
            staticApi.updateMessage(msg);
            server.emit('msg', msg);
        });

        server.on('updateModifyPermissions', function(obj) {
            staticApi.updateModifyPermissions(obj.account, obj.value);
            server.emit('updateModifyPermissions', obj);
            var msg = {
                type: 'systemMsg',
                to: obj.account,
                content: '群资料修改权限为' + (obj.value === 0 ?  '管理员' : '所有人'),
                time: (new Date()).getTime()
            };
            staticApi.updateMessage(msg);
            server.emit('msg', msg);
        });

        server.on('updateBeAuthentication', function(obj) {
            staticApi.updateBeAuthentication(obj.account, obj.value);
            server.emit('updateBeAuthentication', obj);
            var msg = {
                type: 'systemMsg',
                to: obj.account,
                content: '被邀请他人权限为' + (obj.value === 0 ? '不需要验证' : '需要验证'),
                time: (new Date()).getTime()
            };
            staticApi.updateMessage(msg);
            server.emit('msg', msg);
        });

        server.on('msg', function(obj) {
            staticApi.updateMessage(obj);
            server.emit('msg', obj);
        });
    };

    mockServer();


    var name = 'IM';
    var store = {
        fetch: function() {
            var data = localStorage.getItem(name);
            if (data) {
                return JSON.parse(data);
            }
        },
        save: function(data) {
            localStorage.setItem(name, JSON.stringify(data));
        },
        clear: function() {
            localStorage.clear();
        }
    };

    on(window, 'load', function() {
        dataBase = store.fetch() || dataBase;
        global.mockServerDataBase = dataBase;
    });

    on(window, 'unload', function() {
        store.save(dataBase);
    });

    global.mockServerDataBase = dataBase;
})(this, utils, io);
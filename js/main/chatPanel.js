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
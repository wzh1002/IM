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
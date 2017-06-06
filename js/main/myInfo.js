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
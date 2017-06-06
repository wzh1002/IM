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
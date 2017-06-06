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
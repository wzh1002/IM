/**
 * Created by 78462 on 2017/3/7.
 */
(function(win) {
    var env = 'static';
    var config = {
        dev : {

        },
        'static': {
            timeout: 1000 * 60 * 2,
            account: 'user1'
        }
    };

    win.config = config[env];
})(window);
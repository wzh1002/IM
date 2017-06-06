/**
 * Created by 78462 on 2016/12/14.
 */
(function(global) {
    function ajax(obj) {
        var xhr = new XMLHttpRequest(),
            type = (obj.type || '').toLowerCase(),
            dataType = obj.dataType,
            contentType = obj.contentType || typeof obj.data === 'string' ? 'application/x-www-form-urlencoded; charset=UTF-8' : 'application/json',
            path,
            err = [],
            success = [];
        xhr.onreadystatechange = function() {
            var data;
            if (xhr.readyState === 4) {
                data = xhr.responseText;
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    if (dataType === undefined || dataType.toLocaleLowerCase() === 'json') {
                        data = zh(data);
                    }
                    typeof obj.success === 'function' ? obj.success(data, xhr) : void 0;
                    success.forEach(function(func) {
                        func(data, xhr);
                    });
                } else {
                    typeof obj.error === 'function' ? obj.error(data, xhr) : void 0;
                    err.forEach(function(func) {
                        func(data, xhr);
                    });
                }
            }
        };

        if (type === 'get') {
            path = obj.data ? addURIParams(obj.url, obj.data) : obj.url;
            xhr.open(type, path, true);
            xhr.send(null);
        } else if (type === 'post'){
            xhr.open(type, obj.url, true);
            xhr.setRequestHeader('Content-Type', contentType);
            xhr.send(JSON.stringify(obj.data));
        }


        function addURIParams(url, obj) {
            var arr = [];
            for (var name in obj) {
                arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(obj[name]));
            }
            if (arr.length > 0) {
                url += url.indexOf('?') === -1 ? '?' : '&';
                url += arr.join('&');        }
            return url;
        }

        function zh(value) {
            if (typeof value === 'string') {
                try {
                    value = JSON.parse(value);
                } catch(e) {
                    console.log(e);
                }
            }
            return value;
        }

        ajax.then = ajax.done = function(func) {
            success.push(func);
            return ajax;
        };

        ajax.fail = function(func) {
            err.push(func);
            return ajax;
        };

        return ajax;
    }

    ajax.get = function(url) {
        if (typeof arguments[1] !== 'object') {
            return this({
                url: url,
                type: 'get',
                success: arguments[1],
                error: arguments[2] || arguments[1]
            });
        }
        return this({
            url: url,
            type: 'get',
            data: arguments[1],
            success: arguments[2],
            error: arguments[3] || arguments[2]
        });
    };

    ajax.post = function(url, data) {
        if (typeof arguments[1] !== 'object') {
            return this({
                url: url,
                type: 'post',
                success: arguments[1],
                error: arguments[2] || arguments[1]
            });
        }
        return this({
            url: url,
            type: 'post',
            data: arguments[1],
            success: arguments[2],
            error: arguments[3] || arguments[2]
        });
    };

    global.ajax = ajax;
})(this);


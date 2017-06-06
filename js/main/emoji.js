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
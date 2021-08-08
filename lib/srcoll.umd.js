(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Scroll = factory());
}(this, (function () { 'use strict';

    var scrollBarWidth = (function () {
        var el = document.createElement('div');
        el.style.width = '100px';
        el.style.position = 'absolute';
        el.style.left = '-999px';
        el.style.top = '-999px';
        el.style.overflow = 'scroll';
        document.body.appendChild(el);
        return el.offsetWidth - el.clientWidth;
    })();
    var ScrollConfig = function ScrollConfig(config) {
        this.barSize = 8;
        this.barOffsetLeft = 0;
        this.barOffsetTop = 0;
        this.barBgColor = '#ffffff';
        this.barMinSize = 50;
        this.barBorderRadius = 5;
        this.barOpacity = 0.5;
        this.barOpacityDuration = 250;
        this.barOpacityDelay = 2000;
        this.barForeverShow = false;
        if (config)
            { this.assign(config); }
    };
    ScrollConfig.prototype.assign = function assign (config) {
        if (config) {
            if (config.barSize !== undefined)
                { this.barSize = config.barSize; }
            if (config.barOffsetLeft !== undefined)
                { this.barOffsetLeft = config.barOffsetLeft; }
            if (config.barOffsetTop !== undefined)
                { this.barOffsetTop = config.barOffsetTop; }
            if (config.barBgColor !== undefined)
                { this.barBgColor = config.barBgColor; }
            if (config.barMinSize !== undefined)
                { this.barMinSize = config.barMinSize; }
            if (config.barBorderRadius !== undefined)
                { this.barBorderRadius = config.barBorderRadius; }
            if (config.barOpacity !== undefined)
                { this.barOpacity = config.barOpacity; }
            if (config.barOpacityDuration !== undefined)
                { this.barOpacityDuration = config.barOpacityDuration; }
            if (config.barOpacityDelay !== undefined)
                { this.barOpacityDelay = config.barOpacityDelay; }
            if (config.barForeverShow !== undefined)
                { this.barForeverShow = config.barForeverShow; }
        }
    };

    var attribute = {
        'style': "display: block; position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; border: none; padding: 0px; margin: 0px; opacity: 0; z-index: -1000; pointer-events: none;",
        'type': 'text/html',
        'tabindex': '-1',
        'aria-hidden': 'true',
        'data': 'about:blank'
    };
    var resize = function (element, eventCallback) {
        var position = window.getComputedStyle(element).position;
        if (position === 'static' || position === '') {
            element.style.position = 'relative';
        }
        var objectElement = document.createElement('object');
        Object.keys(attribute).forEach(function (key) { return objectElement.setAttribute(key, attribute[key]); });
        objectElement.addEventListener('load', function () {
            var _a;
            var win = (_a = this.contentDocument) === null || _a === void 0 ? void 0 : _a.defaultView;
            win === null || win === void 0 ? void 0 : win.addEventListener('resize', function () {
                var obj = Object.create(null);
                obj.width = this.innerWidth;
                obj.height = this.innerHeight;
                eventCallback(obj);
            });
            var obj = Object.create(null);
            obj.width = win === null || win === void 0 ? void 0 : win.innerWidth;
            obj.height = win === null || win === void 0 ? void 0 : win.innerHeight;
            eventCallback(obj);
        });
        element.appendChild(objectElement);
    };

    if (scrollBarWidth === 0) {
        var style = ".__o-scroll-content::-webkit-scrollbar{width: 0;height: 0;}";
        var styleElement = document.createElement('style');
        styleElement.innerHTML = style;
        document.head.appendChild(styleElement);
    }
    var scrollWrapperStyle = 'width: 100%; height: 100%; overflow: hidden;';
    var scrollContentStyle = "overflow: auto;";
    var BarMap = {
        X: {
            key: 'height',
            direction: 'bottom',
            directionValue: 'barOffsetTop',
        },
        Y: {
            key: 'width',
            direction: 'right',
            directionValue: 'barOffsetLeft',
        }
    };
    var Scroll = function Scroll(el, options) {
        this.scrollWrapper = document.createElement('div');
        this.scrollContent = document.createElement('div');
        this.scrollContentInner = document.createElement('div');
        this.scrollBarX = document.createElement('div');
        this.scrollBarY = document.createElement('div');
        this.scrollX = true;
        this.scrollY = true;
        this.config = new ScrollConfig(Scroll.config);
        this.hasScrollX = false;
        this.hasScrollY = false;
        this.scrollTop = 0;
        this.scrollLeft = 0;
        this.scrollBottomCallback = null;
        this.scrollTopCallback = null;
        this.timeOutY = null;
        this.timeOutX = null;
        this.element = el;
        if (options) {
            this.config.assign(options);
        }
        this.init();
    };
    Scroll.setDefaultConfig = function setDefaultConfig (config) {
        Scroll.config.assign(config);
    };
    Scroll.prototype.initStyle = function initStyle () {
        this.scrollWrapper.setAttribute('style', scrollWrapperStyle);
        this.scrollContent.setAttribute('style', scrollContentStyle);
        this.setBarStyle(this.scrollBarX, 'X');
        this.setBarStyle(this.scrollBarY, 'Y');
        if (scrollBarWidth === 0)
            { this.scrollContent.className = '__o-scroll-content'; }
    };
    Scroll.prototype.setBarStyle = function setBarStyle (el, type) {
        var map = BarMap[type];
        el.style[map.key] = this.config.barSize + 'px';
        el.style[map.direction] = this.config[map.directionValue] + 'px';
        el.style.position = 'absolute';
        el.style.backgroundColor = this.config.barBgColor;
        el.style.borderRadius = this.config.barBorderRadius + 'px';
        el.style.opacity = this.config.barOpacity.toString();
        el.style.transition = "transition: opacity " + (this.config.barOpacityDuration / 1000) + "s;";
    };
    Scroll.prototype.init = function init () {
            var this$1$1 = this;

        this.setBarYMonseEvent();
        this.setBarXMouseEvent();
        var childNodes = Object.values(this.element.childNodes);
        for (var i = 0; i < childNodes.length; i++) {
            var el = childNodes[i];
            el.remove();
            this.scrollContentInner.appendChild(el);
        }
        this.scrollContent.appendChild(this.scrollContentInner);
        this.scrollWrapper.appendChild(this.scrollContent);
        this.element.appendChild(this.scrollWrapper);
        this.scrollX && this.element.appendChild(this.scrollBarX);
        this.scrollY && this.element.appendChild(this.scrollBarY);
        this.initStyle();
        resize(this.element, function (size) {
            this$1$1.width = size.width;
            this$1$1.height = size.height;
            this$1$1.setScrollSize();
        });
        resize(this.scrollContentInner, function (size) {
            this$1$1.setHasScroll();
            this$1$1.setBarHeight();
            this$1$1.setBarWidth();
            this$1$1.setScrollY();
            this$1$1.setScrollX();
        });
        this.scrollContent.addEventListener('scroll', function (event) {
            if (this$1$1.hasScrollY) {
                var top = this$1$1.scrollTop;
                this$1$1.setScrollY();
                if (top !== this$1$1.scrollTop) {
                    if (this$1$1.scrollContent.scrollHeight - this$1$1.scrollContent.scrollTop === this$1$1.scrollContent.clientHeight)
                        { this$1$1.scrollBottomCallback && this$1$1.scrollBottomCallback(); }
                    if (this$1$1.scrollTop === 0)
                        { this$1$1.scrollTopCallback && this$1$1.scrollTopCallback(); }
                }
            }
            if (this$1$1.hasScrollX)
                { this$1$1.setScrollX(); }
        });
    };
    Scroll.prototype.setScrollSize = function setScrollSize () {
        this.scrollContent.style.width = this.width + scrollBarWidth + 'px';
        this.scrollContent.style.height = this.height + scrollBarWidth + 'px';
    };
    Scroll.prototype.setScrollY = function setScrollY () {
            var this$1$1 = this;

        var scrollHeight = this.scrollContent.scrollHeight;
        if (!this.config.barForeverShow) {
            if (this.timeOutY)
                { clearTimeout(this.timeOutY); }
            this.timeOutY = window.setTimeout(function () {
                this$1$1.scrollBarY.style.opacity = '0';
            }, this.config.barOpacityDelay);
            this.scrollBarY.style.opacity = this.config.barOpacity.toString();
        }
        if (scrollHeight === 0) {
            this.scrollTop = 0;
            this.scrollBarY.style.top = '0';
            return this.scrollTop;
        }
        var sala = this.scrollContent.scrollTop / (scrollHeight - this.scrollContent.clientHeight);
        var barScrollHeight = this.scrollContent.offsetHeight - (this.hasScrollX ? this.config.barSize : 0) - this.barHeight - scrollBarWidth;
        this.scrollTop = sala * barScrollHeight;
        this.scrollBarY.style.top = this.scrollTop + 'px';
        return this.scrollTop;
    };
    Scroll.prototype.setScrollX = function setScrollX () {
            var this$1$1 = this;

        var scrollWidth = this.scrollContent.scrollWidth;
        if (!this.config.barForeverShow) {
            if (this.timeOutX)
                { clearTimeout(this.timeOutX); }
            this.timeOutX = window.setTimeout(function () {
                this$1$1.scrollBarX.style.opacity = '0';
            }, this.config.barOpacityDelay);
            this.scrollBarX.style.opacity = this.config.barOpacity.toString();
        }
        if (scrollWidth === 0) {
            this.scrollLeft = 0;
            this.scrollBarX.style.left = '0';
            return;
        }
        var sala = this.scrollContent.scrollLeft / (scrollWidth - this.scrollContent.clientWidth);
        var barScrollWidth = this.scrollContent.offsetWidth - (this.hasScrollY ? this.config.barSize : 0) - this.barWidth - scrollBarWidth;
        this.scrollLeft = sala * barScrollWidth;
        this.scrollBarX.style.left = this.scrollLeft + 'px';
    };
    Scroll.prototype.setHasScroll = function setHasScroll () {
        this.hasScrollX = this.scrollX && this.scrollContent.offsetWidth < this.scrollContent.scrollWidth;
        this.hasScrollY = this.scrollY && this.scrollContent.offsetHeight < this.scrollContent.scrollHeight;
        this.scrollBarX.style.display = this.hasScrollX ? '' : 'none';
        this.scrollBarY.style.display = this.hasScrollY ? '' : 'none';
    };
    Scroll.prototype.setBarHeight = function setBarHeight () {
        var scrollHeight = this.scrollContent.scrollHeight;
        var offsetHeight = this.scrollContent.offsetHeight;
        var barHeight = offsetHeight / scrollHeight * offsetHeight;
        if (barHeight < this.config.barMinSize)
            { barHeight = this.config.barMinSize; }
        this.barHeight = barHeight;
        this.scrollBarY.style.height = barHeight + 'px';
    };
    Scroll.prototype.setBarWidth = function setBarWidth () {
        var scrollWidth = this.scrollContent.scrollWidth;
        var offsetWidth = this.scrollContent.offsetWidth;
        var barWidth = offsetWidth / scrollWidth * offsetWidth;
        if (barWidth < this.config.barMinSize)
            { barWidth = this.config.barMinSize; }
        this.barWidth = barWidth;
        this.scrollBarX.style.width = barWidth + 'px';
    };
    Scroll.prototype.setBarYMonseEvent = function setBarYMonseEvent () {
            var this$1$1 = this;

        this.scrollBarY.addEventListener('mousedown', function (event) {
            var y = event.clientY;
            var top = this$1$1.scrollTop;
            var barScrollHeight = this$1$1.scrollContent.offsetHeight - (this$1$1.hasScrollX ? this$1$1.config.barSize : 0) - this$1$1.barHeight - scrollBarWidth;
            var userSelect = document.body.style.userSelect;
            document.body.style.userSelect = 'none';
            var move = function (event) {
                var t = event.clientY - y + top;
                var scrollTop = t / barScrollHeight * (this$1$1.scrollContent.scrollHeight - this$1$1.scrollContent.clientWidth);
                this$1$1.scrollContent.scrollTop = scrollTop;
            };
            var up = function () {
                document.body.style.userSelect = userSelect;
                document.removeEventListener('mouseup', up);
                document.removeEventListener('mousemove', move);
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });
    };
    Scroll.prototype.setBarXMouseEvent = function setBarXMouseEvent () {
            var this$1$1 = this;

        this.scrollBarX.addEventListener('mousedown', function (event) {
            var x = event.clientX;
            var left = this$1$1.scrollLeft;
            var barScrollWidth = this$1$1.scrollContent.offsetWidth - (this$1$1.hasScrollX ? this$1$1.config.barSize : 0) - this$1$1.barWidth - scrollBarWidth;
            var userSelect = document.body.style.userSelect;
            document.body.style.userSelect = 'none';
            var move = function (event) {
                var l = event.clientX - x + left;
                var scrollLeft = l / barScrollWidth * (this$1$1.scrollContent.scrollWidth - this$1$1.scrollContent.offsetWidth);
                this$1$1.scrollContent.scrollLeft = scrollLeft;
            };
            var up = function () {
                document.body.style.userSelect = userSelect;
                document.removeEventListener('mouseup', up);
                document.removeEventListener('mousemove', move);
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });
    };
    Scroll.prototype.onScrollTop = function onScrollTop (scrollTopCallback) {
        this.scrollTopCallback = scrollTopCallback;
    };
    Scroll.prototype.onScrollBottom = function onScrollBottom (scrollBottomCallback) {
        this.scrollBottomCallback = scrollBottomCallback;
    };
    Scroll.prototype.appendChild = function appendChild (el) {
        this.scrollContentInner.appendChild(el);
    };
    Scroll.config = new ScrollConfig();

    return Scroll;

})));

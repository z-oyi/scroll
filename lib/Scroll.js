import { scrollBarWidth, ScrollConfig } from "./utils";
import resize from '@oyi/resize';
if (scrollBarWidth === 0) {
    let style = `.__o-scroll-content::-webkit-scrollbar{width: 0;height: 0;}`;
    let styleElement = document.createElement('style');
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);
}
const scrollWrapperStyle = 'width: 100%; height: 100%; overflow: hidden;';
const scrollContentStyle = `overflow: auto;`;
const BarMap = {
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
class Scroll {
    constructor(el, options) {
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
    }
    static setDefaultConfig(config) {
        Scroll.config.assign(config);
    }
    initStyle() {
        this.scrollWrapper.setAttribute('style', scrollWrapperStyle);
        this.scrollContent.setAttribute('style', scrollContentStyle);
        this.setBarStyle(this.scrollBarX, 'X');
        this.setBarStyle(this.scrollBarY, 'Y');
        if (scrollBarWidth === 0)
            this.scrollContent.className = '__o-scroll-content';
    }
    setBarStyle(el, type) {
        let map = BarMap[type];
        el.style[map.key] = this.config.barSize + 'px';
        el.style[map.direction] = this.config[map.directionValue] + 'px';
        el.style.position = 'absolute';
        el.style.backgroundColor = this.config.barBgColor;
        el.style.borderRadius = this.config.barBorderRadius + 'px';
        el.style.opacity = this.config.barOpacity.toString();
        el.style.transition = `transition: opacity ${this.config.barOpacityDuration / 1000}s;`;
    }
    init() {
        this.setBarYMonseEvent();
        this.setBarXMouseEvent();
        let childNodes = Object.values(this.element.childNodes);
        for (let i = 0; i < childNodes.length; i++) {
            let el = childNodes[i];
            el.remove();
            this.scrollContentInner.appendChild(el);
        }
        this.scrollContent.appendChild(this.scrollContentInner);
        this.scrollWrapper.appendChild(this.scrollContent);
        this.element.appendChild(this.scrollWrapper);
        this.scrollX && this.element.appendChild(this.scrollBarX);
        this.scrollY && this.element.appendChild(this.scrollBarY);
        this.initStyle();
        resize(this.element, (size) => {
            this.width = size.width;
            this.height = size.height;
            this.setScrollSize();
        });
        resize(this.scrollContentInner, (size) => {
            this.setHasScroll();
            this.setBarHeight();
            this.setBarWidth();
            this.setScrollY();
            this.setScrollX();
        });
        this.scrollContent.addEventListener('scroll', (event) => {
            if (this.hasScrollY) {
                let top = this.scrollTop;
                this.setScrollY();
                if (top !== this.scrollTop) {
                    if (this.scrollContent.scrollHeight - this.scrollContent.scrollTop === this.scrollContent.clientHeight)
                        this.scrollBottomCallback && this.scrollBottomCallback();
                    if (this.scrollTop === 0)
                        this.scrollTopCallback && this.scrollTopCallback();
                }
            }
            if (this.hasScrollX)
                this.setScrollX();
        });
    }
    setScrollSize() {
        this.scrollContent.style.width = this.width + scrollBarWidth + 'px';
        this.scrollContent.style.height = this.height + scrollBarWidth + 'px';
    }
    setScrollY() {
        let scrollHeight = this.scrollContent.scrollHeight;
        if (!this.config.barForeverShow) {
            if (this.timeOutY)
                clearTimeout(this.timeOutY);
            this.timeOutY = window.setTimeout(() => {
                this.scrollBarY.style.opacity = '0';
            }, this.config.barOpacityDelay);
            this.scrollBarY.style.opacity = this.config.barOpacity.toString();
        }
        if (scrollHeight === 0) {
            this.scrollTop = 0;
            this.scrollBarY.style.top = '0';
            return this.scrollTop;
        }
        let sala = this.scrollContent.scrollTop / (scrollHeight - this.scrollContent.clientHeight);
        let barScrollHeight = this.scrollContent.offsetHeight - (this.hasScrollX ? this.config.barSize : 0) - this.barHeight - scrollBarWidth;
        this.scrollTop = sala * barScrollHeight;
        this.scrollBarY.style.top = this.scrollTop + 'px';
        return this.scrollTop;
    }
    setScrollX() {
        let scrollWidth = this.scrollContent.scrollWidth;
        if (!this.config.barForeverShow) {
            if (this.timeOutX)
                clearTimeout(this.timeOutX);
            this.timeOutX = window.setTimeout(() => {
                this.scrollBarX.style.opacity = '0';
            }, this.config.barOpacityDelay);
            this.scrollBarX.style.opacity = this.config.barOpacity.toString();
        }
        if (scrollWidth === 0) {
            this.scrollLeft = 0;
            this.scrollBarX.style.left = '0';
            return;
        }
        let sala = this.scrollContent.scrollLeft / (scrollWidth - this.scrollContent.clientWidth);
        let barScrollWidth = this.scrollContent.offsetWidth - (this.hasScrollY ? this.config.barSize : 0) - this.barWidth - scrollBarWidth;
        this.scrollLeft = sala * barScrollWidth;
        this.scrollBarX.style.left = this.scrollLeft + 'px';
    }
    setHasScroll() {
        this.hasScrollX = this.scrollX && this.scrollContent.offsetWidth < this.scrollContent.scrollWidth;
        this.hasScrollY = this.scrollY && this.scrollContent.offsetHeight < this.scrollContent.scrollHeight;
        this.scrollBarX.style.display = this.hasScrollX ? '' : 'none';
        this.scrollBarY.style.display = this.hasScrollY ? '' : 'none';
    }
    setBarHeight() {
        let scrollHeight = this.scrollContent.scrollHeight;
        let offsetHeight = this.scrollContent.offsetHeight;
        let barHeight = offsetHeight / scrollHeight * offsetHeight;
        if (barHeight < this.config.barMinSize)
            barHeight = this.config.barMinSize;
        this.barHeight = barHeight;
        this.scrollBarY.style.height = barHeight + 'px';
    }
    setBarWidth() {
        let scrollWidth = this.scrollContent.scrollWidth;
        let offsetWidth = this.scrollContent.offsetWidth;
        let barWidth = offsetWidth / scrollWidth * offsetWidth;
        if (barWidth < this.config.barMinSize)
            barWidth = this.config.barMinSize;
        this.barWidth = barWidth;
        this.scrollBarX.style.width = barWidth + 'px';
    }
    setBarYMonseEvent() {
        this.scrollBarY.addEventListener('mousedown', (event) => {
            let y = event.clientY;
            let top = this.scrollTop;
            let barScrollHeight = this.scrollContent.offsetHeight - (this.hasScrollX ? this.config.barSize : 0) - this.barHeight - scrollBarWidth;
            let userSelect = document.body.style.userSelect;
            document.body.style.userSelect = 'none';
            let move = (event) => {
                let t = event.clientY - y + top;
                let scrollTop = t / barScrollHeight * (this.scrollContent.scrollHeight - this.scrollContent.clientWidth);
                this.scrollContent.scrollTop = scrollTop;
            };
            let up = () => {
                document.body.style.userSelect = userSelect;
                document.removeEventListener('mouseup', up);
                document.removeEventListener('mousemove', move);
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });
    }
    setBarXMouseEvent() {
        this.scrollBarX.addEventListener('mousedown', (event) => {
            let x = event.clientX;
            let left = this.scrollLeft;
            let barScrollWidth = this.scrollContent.offsetWidth - (this.hasScrollX ? this.config.barSize : 0) - this.barWidth - scrollBarWidth;
            let userSelect = document.body.style.userSelect;
            document.body.style.userSelect = 'none';
            let move = (event) => {
                let l = event.clientX - x + left;
                let scrollLeft = l / barScrollWidth * (this.scrollContent.scrollWidth - this.scrollContent.offsetWidth);
                this.scrollContent.scrollLeft = scrollLeft;
            };
            let up = () => {
                document.body.style.userSelect = userSelect;
                document.removeEventListener('mouseup', up);
                document.removeEventListener('mousemove', move);
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });
    }
    onScrollTop(scrollTopCallback) {
        this.scrollTopCallback = scrollTopCallback;
    }
    onScrollBottom(scrollBottomCallback) {
        this.scrollBottomCallback = scrollBottomCallback;
    }
    appendChild(el) {
        this.scrollContentInner.appendChild(el);
    }
}
Scroll.config = new ScrollConfig();
export default Scroll;

export const scrollBarWidth = (function () {
    let el = document.createElement('div');
    el.style.width = '100px';
    el.style.position = 'absolute';
    el.style.left = '-999px';
    el.style.top = '-999px';
    el.style.overflow = 'scroll';
    document.body.appendChild(el);
    return el.offsetWidth - el.clientWidth;
})();
export class ScrollConfig {
    constructor(config) {
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
            this.assign(config);
    }
    assign(config) {
        if (config) {
            if (config.barSize !== undefined)
                this.barSize = config.barSize;
            if (config.barOffsetLeft !== undefined)
                this.barOffsetLeft = config.barOffsetLeft;
            if (config.barOffsetTop !== undefined)
                this.barOffsetTop = config.barOffsetTop;
            if (config.barBgColor !== undefined)
                this.barBgColor = config.barBgColor;
            if (config.barMinSize !== undefined)
                this.barMinSize = config.barMinSize;
            if (config.barBorderRadius !== undefined)
                this.barBorderRadius = config.barBorderRadius;
            if (config.barOpacity !== undefined)
                this.barOpacity = config.barOpacity;
            if (config.barOpacityDuration !== undefined)
                this.barOpacityDuration = config.barOpacityDuration;
            if (config.barOpacityDelay !== undefined)
                this.barOpacityDelay = config.barOpacityDelay;
            if (config.barForeverShow !== undefined)
                this.barForeverShow = config.barForeverShow;
        }
    }
}

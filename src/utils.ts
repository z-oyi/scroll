export const scrollBarWidth = (function ():number {
    let el = document.createElement('div')
    el.style.width = '100px'
    el.style.position = 'absolute'
    el.style.left = '-999px'
    el.style.top = '-999px'
    el.style.overflow = 'scroll'
    document.body.appendChild(el)
    return el.offsetWidth - el.clientWidth
})()

export interface scrollConfig {
    barSize?: number,
    barOffsetLeft?: number,
    barOffsetTop?: number,
    barBgColor?: string,
    barMinSize?: number,
    barBorderRadius?: number,
    barOpacity?: number,
    barOpacityDuration?: number,
    barOpacityDelay?: number,
    barForeverShow?: boolean
}

export class ScrollConfig {
    barSize = 8
    barOffsetLeft = 0
    barOffsetTop = 0
    barBgColor = '#ffffff'
    barMinSize = 50
    barBorderRadius = 5
    barOpacity = 0.5
    barOpacityDuration = 250
    barOpacityDelay = 2000
    barForeverShow = false
    constructor (config?: scrollConfig) {
        if (config) this.assign(config)
    }
    assign(config: scrollConfig) {
        if (config) {
            if (config.barSize !== undefined ) this.barSize = config.barSize
            if (config.barOffsetLeft !== undefined ) this.barOffsetLeft = config.barOffsetLeft
            if (config.barOffsetTop !== undefined ) this.barOffsetTop = config.barOffsetTop
            if (config.barBgColor !== undefined ) this.barBgColor = config.barBgColor
            if (config.barMinSize !== undefined ) this.barMinSize = config.barMinSize
            if (config.barBorderRadius !== undefined ) this.barBorderRadius = config.barBorderRadius
            if (config.barOpacity !== undefined ) this.barOpacity = config.barOpacity
            if (config.barOpacityDuration !== undefined ) this.barOpacityDuration = config.barOpacityDuration
            if (config.barOpacityDelay !== undefined ) this.barOpacityDelay = config.barOpacityDelay
            if (config.barForeverShow !== undefined ) this.barForeverShow = config.barForeverShow
        }
    }

}
import { scrollBarWidth, scrollConfig, ScrollConfig } from "./utils";
import resize from '@oyi/resize'

if (scrollBarWidth === 0) {
    let style = `.__o-scroll-content::-webkit-scrollbar{width: 0;height: 0;}`
    let styleElement = document.createElement('style')
    styleElement.innerHTML = style
    document.head.appendChild(styleElement)
}

const scrollWrapperStyle = 'width: 100%; height: 100%; overflow: hidden;'
const scrollContentStyle = `overflow: auto;`



type eventCallback = (() => void) | null
type TimeOut = number | null

interface BarMap {
    key: 'height' | 'width',
    direction: 'bottom' | 'right',
    directionValue: 'barOffsetTop' | 'barOffsetLeft',
}
interface BarKeyMap {
    X: BarMap,
    Y: BarMap
}

const BarMap: BarKeyMap = {
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
}

class Scroll {
    static config = new ScrollConfig()

    static setDefaultConfig (config: scrollConfig) {
        Scroll.config.assign(config)
    }

    private element: HTMLElement
    private scrollWrapper: HTMLDivElement = document.createElement('div')
    private scrollContent: HTMLDivElement = document.createElement('div')
    private scrollContentInner: HTMLDivElement = document.createElement('div')
    private scrollBarX: HTMLDivElement = document.createElement('div')
    private scrollBarY: HTMLDivElement = document.createElement('div')

    private width!: number
    private height!: number
    private scrollX: boolean = true
    private scrollY: boolean = true
    private config = new ScrollConfig(Scroll.config)


    private barHeight!: number
    private hasScrollX: boolean = false;
    private hasScrollY: boolean = false;
    private scrollTop: number = 0
    private scrollLeft: number = 0
    private barWidth!: number
    private scrollBottomCallback: eventCallback = null
    private scrollTopCallback: eventCallback = null
    private timeOutY: TimeOut = null
    private timeOutX: TimeOut = null
    

    constructor(el: HTMLElement, options?: scrollConfig) {
        this.element = el
        if (options) {
            this.config.assign(options)
        }
        this.init()
    }
    initStyle() {
        this.scrollWrapper.setAttribute('style', scrollWrapperStyle)
        this.scrollContent.setAttribute('style', scrollContentStyle)
        this.setBarStyle(this.scrollBarX, 'X')
        this.setBarStyle(this.scrollBarY, 'Y')
        if(scrollBarWidth === 0) this.scrollContent.className = '__o-scroll-content'
    }
    
    setBarStyle(el: HTMLDivElement, type: 'X' | 'Y') {
        let map:BarMap = BarMap[type]
        
        el.style[map.key] = this.config.barSize + 'px'
        el.style[map.direction] = this.config[map.directionValue] + 'px'
        el.style.position = 'absolute'
        el.style.backgroundColor = this.config.barBgColor
        el.style.borderRadius = this.config.barBorderRadius + 'px'
        el.style.opacity = this.config.barOpacity.toString()
        el.style.transition = `transition: opacity ${this.config.barOpacityDuration / 1000}s;`
    }

    init() {
        this.setBarYMonseEvent()
        this.setBarXMouseEvent()
        let childNodes = Object.values(this.element.childNodes)
        for(let i = 0; i < childNodes.length; i++) {
            let el = childNodes[i]
            el.remove()
            this.scrollContentInner.appendChild(el)
        }
        
        this.scrollContent.appendChild(this.scrollContentInner)
        this.scrollWrapper.appendChild(this.scrollContent)
        this.element.appendChild(this.scrollWrapper)
        // this.element.appendChild(this.scrollVirtual)

        this.scrollX && this.element.appendChild(this.scrollBarX)
        this.scrollY && this.element.appendChild(this.scrollBarY)

        this.initStyle()
        resize(this.element, (size) => {
            this.width = size.width
            this.height = size.height
            this.setScrollSize()
        })
        resize(this.scrollContentInner, (size) => {
            this.setHasScroll()
            this.setBarHeight()
            this.setBarWidth()
            this.setScrollY()
            this.setScrollX()
        })

        this.scrollContent.addEventListener('scroll', (event) => {
            if (this.hasScrollY) {
                let top = this.scrollTop
                this.setScrollY()
                if (top !== this.scrollTop) {
                    if (this.scrollContent.scrollHeight - this.scrollContent.scrollTop === this.scrollContent.clientHeight) this.scrollBottomCallback && this.scrollBottomCallback()
                    if (this.scrollTop === 0) this.scrollTopCallback && this.scrollTopCallback()
                }
            }
            if (this.hasScrollX) this.setScrollX()
            
        })

    }

    private setScrollSize () {
        this.scrollContent.style.width = this.width + scrollBarWidth + 'px'
        this.scrollContent.style.height = this.height + scrollBarWidth + 'px'
    }

    private setScrollY () {
        let scrollHeight = this.scrollContent.scrollHeight
        if (!this.config.barForeverShow) {

            if (this.timeOutY) clearTimeout(this.timeOutY)
            this.timeOutY = window.setTimeout(() => {
                this.scrollBarY.style.opacity = '0'
            }, this.config.barOpacityDelay)
            this.scrollBarY.style.opacity = this.config.barOpacity.toString()
        }
       
        if (scrollHeight === 0) {
            this.scrollTop = 0
            this.scrollBarY.style.top = '0'
            return this.scrollTop
        }
        let sala = this.scrollContent.scrollTop / (scrollHeight - this.scrollContent.clientHeight)
        let barScrollHeight = this.scrollContent.offsetHeight - (this.hasScrollX ? this.config.barSize : 0) - this.barHeight - scrollBarWidth
        this.scrollTop = sala * barScrollHeight
        this.scrollBarY.style.top = this.scrollTop + 'px'
        return this.scrollTop
    }

    private setScrollX () {
        let scrollWidth = this.scrollContent.scrollWidth

        if (!this.config.barForeverShow) {
            if (this.timeOutX) clearTimeout(this.timeOutX)
            this.timeOutX = window.setTimeout(() => {
                this.scrollBarX.style.opacity = '0'
            }, this.config.barOpacityDelay)
            this.scrollBarX.style.opacity = this.config.barOpacity.toString()
        }
        
        if (scrollWidth === 0) {
            this.scrollLeft = 0
            this.scrollBarX.style.left = '0'
            return
        }
        let sala = this.scrollContent.scrollLeft / (scrollWidth - this.scrollContent.clientWidth)
        let barScrollWidth = this.scrollContent.offsetWidth - (this.hasScrollY ? this.config.barSize : 0) - this.barWidth - scrollBarWidth
        this.scrollLeft = sala * barScrollWidth
        this.scrollBarX.style.left = this.scrollLeft + 'px'
    }

    private setHasScroll () {
        this.hasScrollX = this.scrollX && this.scrollContent.offsetWidth < this.scrollContent.scrollWidth
        this.hasScrollY = this.scrollY && this.scrollContent.offsetHeight < this.scrollContent.scrollHeight
        this.scrollBarX.style.display = this.hasScrollX ? '' : 'none'
        this.scrollBarY.style.display = this.hasScrollY ? '' : 'none'
    }

    private setBarHeight () {
        let scrollHeight = this.scrollContent.scrollHeight
        let offsetHeight = this.scrollContent.offsetHeight
        let barHeight = offsetHeight / scrollHeight * offsetHeight
        if (barHeight < this.config.barMinSize) barHeight = this.config.barMinSize
        this.barHeight = barHeight
        this.scrollBarY.style.height = barHeight + 'px'
    }

    private setBarWidth () {
        let scrollWidth = this.scrollContent.scrollWidth
        let offsetWidth = this.scrollContent.offsetWidth
        let barWidth = offsetWidth / scrollWidth * offsetWidth
        if (barWidth < this.config.barMinSize) barWidth = this.config.barMinSize
        this.barWidth = barWidth
        this.scrollBarX.style.width = barWidth + 'px'
    }

    private setBarYMonseEvent () {
        this.scrollBarY.addEventListener('mousedown', (event) => {
            let y = event.clientY
            let top = this.scrollTop
            let barScrollHeight = this.scrollContent.offsetHeight - (this.hasScrollX ? this.config.barSize : 0) - this.barHeight - scrollBarWidth
            let userSelect = document.body.style.userSelect
            document.body.style.userSelect = 'none'
            let move = (event:MouseEvent) => {
                let t = event.clientY - y + top
                let scrollTop = t / barScrollHeight * (this.scrollContent.scrollHeight - this.scrollContent.clientWidth)
                this.scrollContent.scrollTop = scrollTop
            }
            let up = () => {
                document.body.style.userSelect = userSelect
                document.removeEventListener('mouseup', up)
                document.removeEventListener('mousemove', move)
            }
            document.addEventListener('mousemove', move)
            document.addEventListener('mouseup', up)
        })
    }

    private setBarXMouseEvent () {
        this.scrollBarX.addEventListener('mousedown', (event) => {
            let x = event.clientX
            let left = this.scrollLeft
            let barScrollWidth = this.scrollContent.offsetWidth - (this.hasScrollX ? this.config.barSize : 0) - this.barWidth - scrollBarWidth
            let userSelect = document.body.style.userSelect
            document.body.style.userSelect = 'none'
            let move = (event:MouseEvent) => {
                let l = event.clientX - x + left
                let scrollLeft = l / barScrollWidth * (this.scrollContent.scrollWidth - this.scrollContent.offsetWidth)
                this.scrollContent.scrollLeft = scrollLeft
            }
            let up = () => {
                document.body.style.userSelect = userSelect
                document.removeEventListener('mouseup', up)
                document.removeEventListener('mousemove', move)
            }
            document.addEventListener('mousemove', move)
            document.addEventListener('mouseup', up)
        })
    }

    onScrollTop (scrollTopCallback: () => void) {
        this.scrollTopCallback = scrollTopCallback
    }

    onScrollBottom (scrollBottomCallback: () => void) {
        this.scrollBottomCallback = scrollBottomCallback
    }

    appendChild(el: Node) {
        this.scrollContentInner.appendChild(el)
    }
}

export default Scroll
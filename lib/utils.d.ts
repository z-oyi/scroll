export declare const scrollBarWidth: number;
export interface scrollConfig {
    barSize?: number;
    barOffsetLeft?: number;
    barOffsetTop?: number;
    barBgColor?: string;
    barMinSize?: number;
    barBorderRadius?: number;
    barOpacity?: number;
    barOpacityDuration?: number;
    barOpacityDelay?: number;
    barForeverShow?: boolean;
}
export declare class ScrollConfig {
    barSize: number;
    barOffsetLeft: number;
    barOffsetTop: number;
    barBgColor: string;
    barMinSize: number;
    barBorderRadius: number;
    barOpacity: number;
    barOpacityDuration: number;
    barOpacityDelay: number;
    barForeverShow: boolean;
    constructor(config?: scrollConfig);
    assign(config: scrollConfig): void;
}

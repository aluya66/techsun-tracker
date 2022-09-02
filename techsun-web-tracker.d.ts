/**
 * @server_url 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @project 项目名字
 */
interface DefaultOptons {
    markuser: string;
    markuv: string | undefined;
    loc: object | undefined;
    sys: object | undefined;
    server_url: string;
    project: string;
    historyTracker: boolean;
    hashTracker: boolean;
    delay: number;
    customer_id: string;
    channel: string;
    detail_id: string;
    event_id: string;
    event_type: string;
}
interface initOptions extends Partial<DefaultOptons> {
    server_url: string;
    project: string;
}

/**
 * Techusn web 埋点SDK
 * @class TechsunTracker
 */
declare class TechsunTracker {
    private data;
    private queue;
    private timer;
    private pages;
    constructor();
    init(options: initOptions): void;
    private markUv;
    setUserId<T extends DefaultOptons["customer_id"]>(userId: T): void;
    private captureHideEvents;
    private initPageUv;
    private pagePv;
    track(event_key: string, exact: object): void;
    private captureEvents;
    private report;
    private formatParams;
    private flush;
}
declare const _default: TechsunTracker;

export { _default as default };

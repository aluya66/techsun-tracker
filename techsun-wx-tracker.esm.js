const e = (e) => {
    e = e || 10;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789",
      o = t.length,
      a = "";
    for (let s = 0; s < e; s++) a += t.charAt(Math.floor(Math.random() * o));
    return a + new Date().getTime();
  },
  t = () => {
    for (var e = [], t = "0123456789abcdef", o = 0; o < 36; o++)
      e[o] = t.substr(Math.floor(16 * Math.random()), 1);
    return (
      (e[14] = "4"),
      (e[19] = t.substr((3 & e[19]) | 8, 1)),
      (e[8] = e[13] = e[18] = e[23] = "-"),
      e.join("")
    );
  };
var o = new (class {
  constructor(e) {
    (this.originPage = Page),
      (this.originApp = App),
      (this.wxRequest = wx.request),
      (this.timer = null),
      (this.pages = []),
      (this.queue = []),
      (this.commonData = {
        project: "asus-cn",
        markuser: "",
        markuv: "",
        channel: "",
        customer_id: "",
        loc: {},
        sys: {},
        delay: 1e3,
      });
  }
  init(e) {
    e
      ? (Object.assign(this.commonData, e || {}),
        e.server_url
          ? (e.project && (this.commonData.project = e.project),
            e.location && this._getLocation(),
            e.autoTrack &&
              (this._getSystem(), this._proxyApp(), this._proxyPage()))
          : console.error("请配置上报路径"))
      : console.error("初始化数据未配置");
  }
  _proxyApp() {
    const t = this;
    App = (o) => {
      const a = o.onShow || function () {};
      (o.onShow = function () {
        const o = e();
        return (
          wx.setStorage({ key: "techsun_wx_mark_user", data: o }),
          t.pages.push({ time: new Date().getTime(), page: "" }),
          (t.commonData.markuser = o),
          (t.commonData.markuv = t._markUv()),
          a.apply(this, arguments)
        );
      }),
        t.originApp(o);
    };
  }
  setUserId(e = "") {
    this.commonData.customer_id = e;
  }
  _proxyPage() {
    const e = this;
    Page = (t) => {
      const o = t.onShow || function () {};
      t.onShow = function () {
        return (
          e.commonData.markuser ||
            wx.getStorage({
              key: "techsun_wx_mark_user",
              success(t) {
                e.commonData.markuser = t;
              },
            }),
          e.commonData.markuv ||
            wx.getStorage({
              key: "techsun_wx_mark_uv",
              success(t) {
                e.commonData.markuv = t;
              },
            }),
          o.apply(this, arguments)
        );
      };
      const a = t.onPullDownRefresh || function () {};
      t.onPullDownRefresh = function () {
        return a.apply(this, arguments);
      };
      const s = t.onHide || function () {};
      (t.onHide = function () {
        let t = "",
          o = getCurrentPages();
        if (o && o.length) {
          t = o[o.length - 1].__route__;
        }
        if (
          (e.pages.push({ time: new Date().getTime(), page: t }),
          e.pages.length > 1)
        ) {
          const t = e.pages[e.pages.length - 2] || {},
            o = e.pages[e.pages.length - 1] || {},
            a = o.time - t.time;
          e.queue.push({
            event_key: "$wxPageView",
            string2: o.page,
            decimal1: a,
          }),
            e._reporter();
        }
        return s.apply(this, arguments);
      }),
        e.originPage(t);
    };
  }
  _getSystem() {
    wx.getSystemInfo({
      success: (e) => {
        this.commonData.sys = e;
      },
    });
  }
  _getLocation() {
    wx.getLocation({
      type: "wgs84",
      success: (e) => {
        this.commonData.loc = e;
      },
      fail: () => {
        console.error("请检查是否打开了GPS服务");
      },
    });
  }
  _markUv() {
    const t = new Date();
    let o = wx.getStorageSync("techsun_wx_mark_uv") || "";
    const a = wx.getStorageSync("techsun_wx_mark_uv_time") || "",
      s =
        t.getFullYear() +
        "/" +
        (t.getMonth() + 1) +
        "/" +
        t.getDate() +
        " 23:59:59";
    return (
      ((!o && !a) || t.getTime() > 1 * a) &&
        ((o = e()),
        wx.setStorage({ key: "techsun_wx_mark_uv", data: o }),
        wx.setStorage({
          key: "techsun_wx_mark_uv_time",
          data: new Date(s).getTime(),
        }),
        this.queue.push({ event_key: "$wxPageLoad" }),
        this._reporter()),
      o
    );
  }
  track(e, t, o) {
    this.queue.push({ event_key: e, detail_id: t, ...o }), this._reporter();
  }
  _reporter() {
    this.timer ||
      (this.timer = setTimeout(() => {
        this._flush();
      }, this.commonData.delay));
  }
  _flush() {
    if (this.queue.length > 0) {
      const e = this.queue.shift(),
        o = this;
      this.wxRequest({
        url: this.commonData.server_url,
        timeout: 3e4,
        method: "POST",
        data: {
          ...e,
          project: o.commonData.project,
          string3: o.commonData.markuser,
          event_time: new Date().getTime(),
          event_type: "track",
          detail_id: e.detail_id ? e.detail_id : "",
          customer_id: o.commonData.customer_id,
          channel: o.commonData.channel,
          event_id: t(),
        },
        success: () => {},
        fail: ({ errMsg: e }) => {
          console.error(e);
        },
        complete: () => {
          o._flush(), clearTimeout(o.timer), (o.timer = null);
        },
      });
    }
  }
})();
export { o as default };

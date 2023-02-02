!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define(t)
    : ((e =
        "undefined" != typeof globalThis
          ? globalThis
          : e || self).techsunWxTracker = t());
})(this, function () {
  "use strict";
  const e = (e) => {
      e = e || 10;
      var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789",
        s = t.length,
        a = "";
      for (let o = 0; o < e; o++) a += t.charAt(Math.floor(Math.random() * s));
      return a + new Date().getTime();
    },
    t = () => {
      for (var e = [], t = "0123456789abcdef", s = 0; s < 36; s++)
        e[s] = t.substr(Math.floor(16 * Math.random()), 1);
      return (
        (e[14] = "4"),
        (e[19] = t.substr((3 & e[19]) | 8, 1)),
        (e[8] = e[13] = e[18] = e[23] = "-"),
        e.join("")
      );
    };
  var s = new (class {
    constructor(e) {
      (this.originPage = Page),
        (this.originApp = App),
        (this.wxRequest = wx.request),
        (this.timer = null),
        (this.pages = []),
        (this.queue = []),
        (this.extendData = {}),
        (this.commonData = {
          project: "asus-cn",
          markuser: "",
          markuv: "",
          channel: "",
          customer_id: "",
          member_id: "",
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
      App = (s) => {
        const a = s.onShow || function () {};
        (s.onShow = function () {
          const s = e();
          return (
            wx.setStorage({ key: "techsun_wx_mark_user", data: s }),
            t.pages.push({ time: new Date().getTime(), page: "" }),
            (t.commonData.markuser = s),
            (t.commonData.markuv = t._markUv()),
            a.apply(this, arguments)
          );
        }),
          t.originApp(s);
      };
    }
    setUserId(e = "", t = "") {
      (this.commonData.customer_id = e), (this.commonData.member_id = t);
    }
    _proxyPage() {
      const e = this;
      Page = (t) => {
        const s = t.onShow || function () {};
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
            s.apply(this, arguments)
          );
        };
        const a = t.onPullDownRefresh || function () {};
        t.onPullDownRefresh = function () {
          return a.apply(this, arguments);
        };
        const o = t.onHide || function () {};
        (t.onHide = function () {
          let t = "",
            s = getCurrentPages();
          if (s && s.length) {
            t = s[s.length - 1].__route__;
          }
          if (
            (e.pages.push({ time: new Date().getTime(), page: t }),
            e.pages.length > 1)
          ) {
            const t = e.pages[e.pages.length - 2] || {},
              s = e.pages[e.pages.length - 1] || {},
              a = s.time - t.time;
            e.queue.push({ event_key: "$pageview", dim1: s.page, decimal1: a }),
              e.queue.push({ event_key: "$uniqueview", dim1: s.page }),
              e._reporter();
          }
          return o.apply(this, arguments);
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
      let s = wx.getStorageSync("techsun_wx_mark_uv") || "";
      const a = wx.getStorageSync("techsun_wx_mark_uv_time") || "",
        o =
          t.getFullYear() +
          "/" +
          (t.getMonth() + 1) +
          "/" +
          t.getDate() +
          " 23:59:59";
      return (
        ((!s && !a) || t.getTime() > 1 * a) &&
          ((s = e()),
          wx.setStorage({ key: "techsun_wx_mark_uv", data: s }),
          wx.setStorage({
            key: "techsun_wx_mark_uv_time",
            data: new Date(o).getTime(),
          }),
          this.queue.push({ event_key: "$wxPageLoad" }),
          this._reporter()),
        s
      );
    }
    track(e, t) {
      this.queue.push({ source: e, event_key: "$click", ...t }),
        this._reporter();
    }
    setPagePVData(e) {
      setTimeout(() => {
        this.extendData = { ...e };
      }, this.commonData.delay + 500);
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
          s = this,
          a = new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
          o = {
            ...e,
            project: s.commonData.project,
            string3: s.commonData.markuser,
            event_time:
              "$uniqueview" === e.event_key ? a : new Date().getTime(),
            event_type: "track",
            member_id: this.commonData.member_id,
            source: e.source ? e.source : "",
            detail_id:
              "$uniqueview" === e.event_key ? e.dim1 : this.data.customer_id,
            customer_id: s.commonData.customer_id,
            channel: s.commonData.channel,
            event_id:
              "$uniqueview" === e.event_key
                ? this.data.customer_id
                  ? this.data.customer_id
                  : this.data.markuser
                : t(),
          };
        ("$uniqueview" !== e.event_key && "$pageview" !== e.event_key) ||
          Object.assign(o, { ...s.extendData }),
          this.wxRequest({
            url: this.commonData.server_url,
            timeout: 3e4,
            method: "POST",
            data: { ...o },
            success: () => {},
            fail: ({ errMsg: e }) => {
              console.error(e);
            },
            complete: () => {
              s._flush(), clearTimeout(s.timer), (s.timer = null);
            },
          });
      } else this.extendData = {};
    }
  })();
  return s;
});

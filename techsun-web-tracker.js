!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define(t)
    : ((e =
        "undefined" != typeof globalThis
          ? globalThis
          : e || self).techsunTracker = t());
})(this, function () {
  "use strict";
  var e;
  !(function (e) {
    (e.markuser = "techsun_web_mark_user"),
      (e.markuv = "techsun_web_mark_uv"),
      (e.markuvtime = "techsun_web_mark_uv_time");
  })(e || (e = {}));
  const t = (e) => {
      const t = history[e];
      return function () {
        const i = t.apply(this, arguments),
          a = new Event(e);
        return window.dispatchEvent(a), i;
      };
    },
    i = (e) => {
      e = e || 10;
      var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789",
        i = t.length,
        a = "";
      for (let s = 0; s < e; s++) a += t.charAt(Math.floor(Math.random() * i));
      return a + new Date().getTime();
    },
    a = () => {
      for (var e = [], t = "0123456789abcdef", i = 0; i < 36; i++)
        e[i] = t.substr(Math.floor(16 * Math.random()), 1);
      return (
        (e[14] = "4"),
        (e[19] = t.substr((3 & e[19]) | 8, 1)),
        (e[8] = e[13] = e[18] = e[23] = "-"),
        e.join("")
      );
    };
  return new (class {
    data;
    queue;
    timer;
    pages;
    constructor() {
      (this.data = {
        historyTracker: !1,
        hashTracker: !1,
        project: "asus-cn",
        server_url: "",
        markuser: "",
        markuv: "",
        channel: "",
        customer_id: "",
        member_id: "",
        event_type: "",
        loc: {},
        sys: {},
        delay: 1500,
      }),
        (this.queue = []),
        (this.pages = []),
        (this.timer = null),
        (window.history.pushState = t("pushState")),
        (window.history.replaceState = t("replaceState"));
    }
    init(e) {
      e
        ? e.server_url
          ? ((this.data = Object.assign(this.data, e)),
            this.captureEvents(["load"], "initPageLoad"),
            this.data.historyTracker &&
              (this.captureEvents(
                ["pushState", "replaceState", "popstate"],
                "history-page"
              ),
              this.captureHideEvents("history-page")),
            this.data.hashTracker &&
              (this.captureEvents(
                ["hashchange", "pushState", "popstate"],
                "hash-page"
              ),
              this.captureHideEvents("hash-page")))
          : console.error("请配置上报路径")
        : console.error("初始化数据未配置");
    }
    markUv() {
      const t = new Date();
      let a = window.localStorage.getItem(e.markuv) || "",
        s = window.localStorage.getItem(e.markuvtime) || "",
        r = window.localStorage.getItem(e.markuser) || "";
      (this.data.markuser = r), (this.data.markuv = a);
      const n =
        t.getFullYear() +
        "/" +
        (t.getMonth() + 1) +
        "/" +
        t.getDate() +
        " 23:59:59";
      if (
        (r ||
          ((r = i()),
          (this.data.markuser = r),
          window.localStorage.setItem(e.markuser, r)),
        (!a && !s) || t.getTime() > 1 * Number(s))
      ) {
        a = i();
        const t = new Date(n).getTime() + "";
        window.localStorage.setItem(e.markuv, a),
          window.localStorage.setItem(e.markuvtime, t),
          (this.data.markuv = a),
          this.queue.push({ event_key: "$pageLoad" }),
          this.report();
      }
      return { markuser: r, markUv: a };
    }
    setUserId(e, t) {
      (this.data.customer_id = e), (this.data.member_id = t);
    }
    captureHideEvents(e, t) {
      let i,
        a,
        s,
        r = document;
      void 0 !== r.hidden
        ? ((i = "hidden"), (s = "visibilitychange"), (a = "visibilityState"))
        : void 0 !== r.mozHidden
        ? ((i = "mozHidden"),
          (s = "mozvisibilitychange"),
          (a = "mozVisibilityState"))
        : void 0 !== r.msHidden
        ? ((i = "msHidden"),
          (s = "msvisibilitychange"),
          (a = "msVisibilityState"))
        : void 0 !== r.webkitHidden &&
          ((i = "webkitHidden"),
          (s = "webkitvisibilitychange"),
          (a = "webkitVisibilityState"));
      const n = window.location;
      document.addEventListener(
        s,
        () => {
          r[a] !== i ? this.initPageUv(e, n) : this.pagePv(e, n, !0);
        },
        !1
      );
    }
    initPageUv(e, t) {
      this.pages.push({
        time: new Date().getTime(),
        page: "history-page" == e ? t.pathname : t.hash,
      }),
        this.markUv();
    }
    pagePv(e, t, i = !1) {
      this.pages.push({
        time: new Date().getTime(),
        page: "history-page" == e ? t.pathname : t.hash,
      });
      const a = this.pages[this.pages.length - 2] || {},
        s = (this.pages[this.pages.length - 1] || {}).time - a.time;
      this.queue.push({ event_key: "$pageView", string2: a.page, decimal1: s }),
        this.report(i);
    }
    track(e, t) {
      this.queue.push({ source: e, event_key: "$click", ...t }), this.report();
    }
    captureEvents(e, t, i) {
      e.forEach((e) => {
        window.addEventListener(e, (i) => {
          const a = window.location;
          "pageEnd" === t
            ? this.pagePv(t, a)
            : "load" === e
            ? this.initPageUv(t, a)
            : this.pagePv(t, a);
        });
      });
    }
    report(e) {
      e
        ? this.flush()
        : this.timer ||
          (this.timer = setTimeout(() => {
            this.flush();
          }, this.data.delay));
    }
    formatParams(e) {
      const t = [];
      for (const i in e)
        t.push(`${encodeURIComponent(i)}=${encodeURIComponent(e[i])}`);
      return t.join("&");
    }
    flush() {
      if (this.queue.length > 0) {
        const e = this.queue.shift(),
          t = {
            ...e,
            project: this.data.project,
            string3: this.data.markuser,
            event_time: new Date().getTime(),
            event_type: "track",
            member_id: this.data.member_id,
            source: e.source ? e.source : "",
            detail_id: this.data.customer_id,
            customer_id: this.data.customer_id,
            channel: this.data.channel,
            event_id: a(),
          };
        let i = new Blob([`${this.formatParams(Object.assign({}, t))}`], {
          type: "application/x-www-form-urlencoded",
        });
        if (navigator.sendBeacon) navigator.sendBeacon(this.data.server_url, i);
        else {
          const e = new XMLHttpRequest();
          e.open("POST", this.data.server_url, !1),
            e.setRequestHeader(
              "Content-Type",
              "application/json; charset=UTF-8"
            ),
            e.send(JSON.stringify(t));
        }
        this.flush(), clearTimeout(this.timer), (this.timer = null);
      }
    }
  })();
});

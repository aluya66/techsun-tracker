var e;
!(function (e) {
  (e.markuser = "techsun_web_mark_user"),
    (e.markuv = "techsun_web_mark_uv"),
    (e.markuvtime = "techsun_web_mark_uv_time");
})(e || (e = {}));
const t = (e) => {
    const t = history[e];
    return function () {
      const a = t.apply(this, arguments),
        i = new Event(e);
      return window.dispatchEvent(i), a;
    };
  },
  a = (e) => {
    e = e || 10;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789",
      a = t.length,
      i = "";
    for (let s = 0; s < e; s++) i += t.charAt(Math.floor(Math.random() * a));
    return i + new Date().getTime();
  },
  i = () => {
    for (var e = [], t = "0123456789abcdef", a = 0; a < 36; a++)
      e[a] = t.substr(Math.floor(16 * Math.random()), 1);
    return (
      (e[14] = "4"),
      (e[19] = t.substr((3 & e[19]) | 8, 1)),
      (e[8] = e[13] = e[18] = e[23] = "-"),
      e.join("")
    );
  };
var s = new (class {
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
    let i = window.localStorage.getItem(e.markuv) || "",
      s = window.localStorage.getItem(e.markuvtime) || "",
      r = window.localStorage.getItem(e.markuser) || "";
    (this.data.markuser = r), (this.data.markuv = i);
    const n =
      t.getFullYear() +
      "/" +
      (t.getMonth() + 1) +
      "/" +
      t.getDate() +
      " 23:59:59";
    if (
      (r ||
        ((r = a()),
        (this.data.markuser = r),
        window.localStorage.setItem(e.markuser, r)),
      (!i && !s) || t.getTime() > 1 * Number(s))
    ) {
      i = a();
      const t = new Date(n).getTime() + "";
      window.localStorage.setItem(e.markuv, i),
        window.localStorage.setItem(e.markuvtime, t),
        (this.data.markuv = i),
        this.queue.push({ event_key: "$pageLoad" }),
        this.report();
    }
    return { markuser: r, markUv: i };
  }
  setUserId(e, t) {
    (this.data.customer_id = e), (this.data.member_id = t);
  }
  captureHideEvents(e, t) {
    let a,
      i,
      s,
      r = document;
    void 0 !== r.hidden
      ? ((a = "hidden"), (s = "visibilitychange"), (i = "visibilityState"))
      : void 0 !== r.mozHidden
      ? ((a = "mozHidden"),
        (s = "mozvisibilitychange"),
        (i = "mozVisibilityState"))
      : void 0 !== r.msHidden
      ? ((a = "msHidden"),
        (s = "msvisibilitychange"),
        (i = "msVisibilityState"))
      : void 0 !== r.webkitHidden &&
        ((a = "webkitHidden"),
        (s = "webkitvisibilitychange"),
        (i = "webkitVisibilityState"));
    const n = window.location;
    document.addEventListener(
      s,
      () => {
        r[i] !== a ? this.initPageUv(e, n) : this.pagePv(e, n, !0);
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
  pagePv(e, t, a = !1) {
    this.pages.push({
      time: new Date().getTime(),
      page: "history-page" == e ? t.pathname : t.hash,
    });
    const i = this.pages[this.pages.length - 2] || {},
      s = (this.pages[this.pages.length - 1] || {}).time - i.time;
    this.queue.push({ event_key: "$pageView", string2: i.page, decimal1: s }),
      this.report(a);
  }
  track(e, t) {
    this.queue.push({ source: e, event_key: "$click", ...t }), this.report();
  }
  captureEvents(e, t, a) {
    e.forEach((e) => {
      window.addEventListener(e, (a) => {
        const i = window.location;
        "pageEnd" === t
          ? this.pagePv(t, i)
          : "load" === e
          ? this.initPageUv(t, i)
          : this.pagePv(t, i);
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
    for (const a in e)
      t.push(`${encodeURIComponent(a)}=${encodeURIComponent(e[a])}`);
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
          event_id: i(),
        };
      let a = new Blob([`${this.formatParams(Object.assign({}, t))}`], {
        type: "application/x-www-form-urlencoded",
      });
      if (navigator.sendBeacon) navigator.sendBeacon(this.data.server_url, a);
      else {
        const e = new XMLHttpRequest();
        e.open("POST", this.data.server_url, !1),
          e.setRequestHeader("Content-Type", "application/json; charset=UTF-8"),
          e.send(JSON.stringify(t));
      }
      this.flush(), clearTimeout(this.timer), (this.timer = null);
    }
  }
})();
export { s as default };

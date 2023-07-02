<!--
 * @Author: Gaolu
 * @Date: 2022-09-02 10:16:44
-->

### Techsun 埋点 SDK

    包含小程序埋点SDK、web端埋点SDK

### 项目结构

```
├── techsun-web-tracker.cjs.js //web 端
│
├── techsun-web-tracker.d.ts web 端
│
├── techsun-web-tracker.esm.js //web 端
│
├── techsun-web-tracker.js // web 端
│
├── techsun-wx-tracker.cjs.js //小程序端
│
├── techsun-wx-tracker.esm.js // 小程序端
│
└── techsun-wx-tracker.js // 小程序端
```

### 1、web 端

- npm 方式

  ```
    暂未提供、看需要
  ```

- 引入方式

  ```
    从仓库中下载代码按照对应模式引入

    示例：
     1、techsun-web-tracker.js 放入本地项目某目录下(例如：lib)
     import // require

  2、<script src="lib/techsun-web-tracker.js"></script> （在初始化前引入）


  ```

- 初始化

  ```
   techsunTracker.init({
        server_url: 'http://dev-cdp-02:50000',  //上报地址
        project: 'asus-cn',  // 固定
        channel: "", //从浏览器URL参数获取或者手动配置 见埋点文档渠道
        historyTracker: true, // 默认false, history模式 与hash 二选一
        hashTracker： fase, // 默认false,  hash模式，与history 二选一
        event_mark: '001',  // 选填 区分渠道
        parameter: {}, // 选填 拓展参数
  })
  ```
> 上述代码建议进行混淆处理

- 更新用户

  ```
    /*用户登录 */
    在初始化后判断缓存是否存在用户ID(此ID为使用者提供)
    如果存在则调用此方法更新用户id。
    不存在则忽略
    techsunTracker.setUserId("userId")
  ```

- 设置 PV UV 上报参数

  > 当前页面需要上报的参数，上报之后自动清空

  ```
  techsunTracker.setPagePVData({
     //自定义参数（根据埋点文档定义）
     路由地址和浏览时长不需要手动上报，SDK 会自动上报
  })

  ```

- 以 web 端会员中心埋点文档 "积分兑换" 埋点为例, 该埋点是事件埋点, 编码 ID 为 100000034，"web-会员中心-积分"，每个自定义事件的位置，按照埋点文件

  ```
     //SDK 初始化后, 收集页面事件
  techsunTracker.track(
      "100000034",
      {
        //如果有需要属性，则在此添加  todo...
      }
    )
  ```

### 2、小程序

- npm 方式

  ```
    暂未提供、看需要
  ```

- 引入方式

  ```
    从仓库中下载代码按照对应模式引入

    引入techsun-wx-tracker.js 放入本地项目某目录下(例如：lib)
  import techsunWxTrack from ".xx/techsun-wx-tracker";
  ```

初始化

> 在小程序 `app.js` 中 `App`前初始化

```
 techsunWxTrack.init({
  server_url: 'http://dev-cdp-02:50000',  //上报地址
  project: 'asus-cn',  // 固定
  channel: "", // 从跳转的参数中获取或者手动配置 见埋点文档渠道
  autoTrack: true, // 默认为true,开启自动检测页面浏览时长和浏览记录以及UV
  event_mark: '001',  // 选填 区分渠道
  parameter: {}, // 选填 拓展参数
})
```
> 上述代码建议进行混淆处理
> 上报地址需要在微信公众平台小程序管理配置合法域名。

- 更新用户

  ```
    在小程序初始化后判断缓存是否存在用户ID（(此ID为使用者提供)
    如果存在则调用此方法更新用户id。
    不存在则忽略

    techsunWxTrack.setUserId("userId")
  ```

- 设置 PV UV 上报参数

  > 当前页面需要上报的参数，上报之后自动清空

  ```
  TechsunWxTrack.setPagePVData({
     //自定义参数（根据埋点文档定义）
     路由地址和浏览时长不需要手动上报，SDK 会自动上报
  })

  ```

- 以小程序端会员中心埋点文档 "积分兑换" 埋点为例, 该埋点是事件埋点, 编码 ID 为 100000000，"小程序-会员中心-积分兑换"，每个自定义事件的位置，按照埋点文件

  ```
     //SDK 初始化后, 收集页面事件
        TechsunWxTrack.track(
          "100000000",
        {
          //..todo
        })
  ```

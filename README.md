<!--
 * @Author: Gaolu
 * @Date: 2022-09-02 10:16:44
-->

### Techsun 埋点 SDK

    包含小程序埋点SDK、web端埋点SDK

### 项目结构

├─ techsun-web-tracker.cjs.js //web 端
│
├─ techsun-web-tracker.d.ts web 端
│
├─ techsun-web-tracker.esm.js //web 端
│
├─ techsun-web-tracker.js // web 端
│
├─ techsun-wx-tracker.cjs.js //小程序端
│
├─ techsun-wx-tracker.esm.js // 小程序端
│
├─ techsun-wx-tracker.js // 小程序端

### 1、web 端

- npm 方式

  ```
    npm install techsun-web-tracker
    import techsunTracker from "techsun-web-tracker"
  ```

- 引入方式

  ```
    从仓库中下载代码按照对应模式引入

    示例：
     1、techsun-tracker.js 放入本地项目某目录下(例如：lib)
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
  })
  ```

- 更新用户

  ```
      techsunTracker.setUserId("userId")
  ```

- 自定义事件(示例：$enterPoint 自定义)

  ```
     //SDK 初始化后, 收集页面事件
  techsunTracker.track(
      "$enterPoint",
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
  import TechsunWxTrack from ".xx/techsun-wx-tracker";
  ```

- 初始化

  ```
   TechsunWxTrack.init({
    server_url: 'http://dev-cdp-02:50000',  //上报地址
    project: 'asus-cn',  // 固定
    channel: "", // 从跳转的参数中获取或者手动配置 见埋点文档渠道
    autoTrack: true, // 默认为true,开启自动检测页面浏览时长和浏览记录以及UV
  })
  ```

- 更新用户

  ```
      TechsunWxTrack.setUserId("userId")
  ```

- 自定义事件(示例：$enterPoint 自定义)

  ```
     //SDK 初始化后, 收集页面事件
  TechsunWxTrack.track(
      "$enterPoint",
      {
        //如果有需要属性，则在此添加  todo...
      }
    )
  ```

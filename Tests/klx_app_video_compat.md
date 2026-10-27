# 看理想 App 视频兼容

在原 App 模块基础上补充视频播放支持。已合并到原“看理想 APP端 VIP解锁 + 去广告”模块，Mac 已更新并启用原模块；独立兼容模块和两个中间测试模块已删除。网页模块保持当前设置。

## 实现范围

- 原生视频 section-detail：补齐当前单集及 video_list 的可播放状态，记录视频编号。
- 视频 play-token：从官方 section-detail 获取视频凭证，补齐原生 App 使用的节目、单集、媒体类型、时长等结构，并返回 HTTP 200。
- 官方已经成功的播放响应直接保留；非视频请求仍执行原 kanlixiang_vip.js，原文件完整保存在 runLegacy 内。
- 新增视频凭证请求只携带节目编号及 Accept 请求头，不转发账号令牌。
- 其余去广告、会员页面、下载、目录及资料页规则与 main 原模块逐行相同。

## 2026-10-27 实测

环境：Surge Mac 6.11.0，看理想 4.17.0（Mac 上的 iOS 兼容版）。

- 最好的侯孝贤：原生起播，点击进度跳至 34:53 后持续播放。
- 必有人站出来说：目录点击起播，原生进度到 00:22 / 01:26:02。
- 原生选集切换至“一生都只在讲一个故事”：00:09 / 01:52:21。
- 孔子、孟子的君子之学：儒家思想对如今的中国文化意味着什么，00:13 / 45:24。
- 同一节目内切换“1.1 简说孔子其人”：00:41 / 19:23。
- 原有音频“当文明内部长出怪物”：恢复播放，18:19 到 18:51，验证后暂停。
- Safari 页面“在文学中放大人生”刷新后仍在原播放器正常播放。
- 配置校验、适配脚本验证和网页回归验证均通过。

这属于抽样验证，不代表全部 51 个视频节目及手机端都已逐一实测。下载规则保留，本轮未重新下载验证。

## 安装与回退

安装地址：
https://raw.githubusercontent.com/Aioneas/Surge/main/Module/kanlixiang.app.sgmodule

原模块名称和订阅 URL 保持不变。已有设备更新原模块即可，不再需要额外安装 App 视频兼容模块。Mac 已完成更新，手机尚未直接操作。

如需回退，可通过 GitHub 历史恢复原模块版本。

视频适配已发布到 main 的 Script/klx_app_video_compat.js；Module/kanlixiang.app.sgmodule 已覆盖更新并补充描述。test/klx-video-736119 分支中旧 App 测试模块及 v1 至 v4 临时脚本已删除，网页相关文件保留。

## 本地验证

`node surge-video-app/verify.cjs`
`node surge-video-web/verify.cjs`

`legacy-vip.js` 为原始脚本；`adapter.js` 为新增部分；`klx_app_video_compat.js` 为完整运行脚本。


// 修复 Volantis 主题首页 <title> 重复的问题（「站点标题 - 站点标题」）
//
// 原因在主题的 generate_title 里：
//   themes/volantis/scripts/helpers/head/generate_title__keywords__description.js
//
//     let title = data.title
//     if (title) { s += `${title} - ` }   // 无条件加前缀
//     s += `${config.title}`              // 再拼站点标题
//
// 而首页的 title 是这样取的（同文件 init() 里）：
//     title = config.seo_title || config.title;
//
// 也就是说：首页 title 在没设 seo_title 时**就等于** config.title，
// 但生成时又多拼了一次前缀，于是变成「古道存的博客 - 古道存的博客」。
// 反过来把 config.title 留空，`if (title)` 不成立，就变成什么都不显示。
//
// 为什么不用直接改主题：themes/volantis 是 git 子模块
// （见 .gitmodules），改它不会进主仓库，部署平台拉下来还是原版主题。
//
// 为什么用过滤器而不是重新注册一个 generate_title：过滤器按优先级执行，
// 与脚本加载先后无关，结果稳定。主题自己也是用同样的手法去掉重复的
// description 标签（同文件 priority 99），这里用 100 确保在它之后运行。

hexo.extend.filter.register(
  'after_render:html',
  function (html) {
    const siteTitle = hexo.config.title;
    if (!siteTitle) return html;

    // generate_title 里对结果做过 escape_html，所以这里也要转义后再比对
    const esc = String(siteTitle)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    const doubled = `<title>${esc} - ${esc}</title>`;
    const single = `<title>${esc}</title>`;

    if (html.indexOf(doubled) === -1) return html;
    return html.split(doubled).join(single);
  },
  100,
);

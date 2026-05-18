(() => {
  // 移除 Mermaid 图表背景 - 使其透明
  const removeMermaidBg = () => {
    document.querySelectorAll(".mermaid svg").forEach((svg) => {
      // 移除背景矩形
      const bgRect = svg.querySelector("rect[fill]");
      if (bgRect) {
        bgRect.remove();
      }
      // 设置 SVG 背景为透明
      svg.style.backgroundColor = "transparent";
    });
  };

  // 初始化函数（Mermaid 10.6.1）
  const init = () => {
    if (typeof mermaid === "undefined") {
      // 重试
      setTimeout(init, 200);
    } else {
      // 配置 Mermaid 10.x - 优化外观以适配 Kratos-Rebirth 主题
      mermaid.initialize({
        startOnLoad: true,
        theme: "neutral",
        themeVariables: {
          primaryColor: "#f0f4ff",
          primaryTextColor: "#333",
          primaryBorderColor: "#ccc",
          lineColor: "#888",
          fontSize: "14px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
        securityLevel: "loose",
      });
      // 首次渲染 - 使用 contentLoaded() 或 contentLoaded
      if (mermaid.contentLoaded) {
        mermaid.contentLoaded();
      }
      // 初始化后移除背景
      setTimeout(removeMermaidBg, 300);
    }
  };

  // 页面更新时的重载函数（PJAX 后）
  const reload = () => {
    // Mermaid 10.x: 使用 contentLoaded()
    if (mermaid.contentLoaded) {
      mermaid.contentLoaded();
    }
    // 重载后移除背景
    setTimeout(removeMermaidBg, 300);
  };

  // 加载时初始化一次
  init();

  // 在 PJAX 之后重载（关键！解决刷新才能看到图的问题）
  window.addEventListener('pjax:complete', reload);
})();

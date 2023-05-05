const defaultList = {
  youku: "http://player.youku.com/embed/",
  bilibili: "http://player.bilibili.com/player.html?aid=",
  qq: "https://v.qq.com/txp/iframe/player.html?vid=",
  youtube: "https://www.youtube.com/embed/",
};

const renderVideo = (wrapperId, sourceId, type, videoMap) => {
  var el = document.querySelector("#" + wrapperId);
  if (type && videoMap[type]) {
    const url = videoMap[type];
    el.innerHTML = `<iframe height=450 width=640 align='center' src='${url}${sourceId}' frameborder=0 allowfullscreen></iframe>`;
  }
};

export default function videoPlugin(editor, options = {}) {
  const { codeBlockManager } = Object.getPrototypeOf(editor).constructor;
  const vList = options.vList || {};
  const videoMap = {
    ...defaultList,
    ...vList,
  };

  Object.keys(videoMap).forEach(type => {
    codeBlockManager.setReplacer(type, function(sourceId) {
      if (!sourceId) return
      var wrapperId =
        type +
        Math.random()
          .toString(36)
          .substr(2, 10)
      setTimeout(renderVideo.bind(null, wrapperId, sourceId, type, videoMap), 0)
      return `<div style="text-align: center" id="${wrapperId}"></div>`
    })
  })
}
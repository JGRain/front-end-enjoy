export const data = JSON.parse("{\"key\":\"v-8154d3b4\",\"path\":\"/vue/vue-multi-page/6-hot-reload.html\",\"title\":\"6. 热加载刷新\",\"lang\":\"en-US\",\"frontmatter\":{\"title\":\"6. 热加载刷新\"},\"headers\":[{\"level\":2,\"title\":\"Express 和 Webpack\",\"slug\":\"express-和-webpack\",\"link\":\"#express-和-webpack\",\"children\":[]},{\"level\":2,\"title\":\"webpack-dev-middleware\",\"slug\":\"webpack-dev-middleware\",\"link\":\"#webpack-dev-middleware\",\"children\":[]},{\"level\":2,\"title\":\"webpack-hot-middleware\",\"slug\":\"webpack-hot-middleware\",\"link\":\"#webpack-hot-middleware\",\"children\":[]},{\"level\":2,\"title\":\"实现热加载和页面刷新\",\"slug\":\"实现热加载和页面刷新\",\"link\":\"#实现热加载和页面刷新\",\"children\":[]}],\"git\":{\"updatedTime\":1564219474000,\"contributors\":[{\"name\":\"godbasin\",\"email\":\"wangbeishan@163.com\",\"commits\":1}]},\"filePathRelative\":\"vue/vue-multi-page/6-hot-reload.md\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}

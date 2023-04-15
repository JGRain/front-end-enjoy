import { defineAsyncComponent } from 'vue'

export default {
  enhance: ({ app }) => {    
      app.component("Adsense", defineAsyncComponent(() => import("/Users/rain/Documents/rain/doc/gitbook-design-patterns-in-jquery/docs/.vuepress/components/adsense.vue")))
  },
}

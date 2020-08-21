import '@/styles/main.scss'
import 'core-js/stable'
import 'font-awesome/scss/font-awesome.scss'
import moment from 'moment'
import 'template.data.gouv.fr/dist/main.css'
import Vue from 'vue'
import AsyncComputed from 'vue-async-computed'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import MailDirective from './directives/mail'
import SelectOnClickDirective from './directives/selectOnClick'
import ScrollService from './plugins/ScrollService'
import StateService from './plugins/StateService'
import router from './router'
import store from './store'


MailDirective(Vue)
SelectOnClickDirective(Vue)


Vue.use(AsyncComputed)
Vue.use(ScrollService)
Vue.use(StateService)
Vue.use(Vuelidate)

if (window._paq) {
  window._paq.push(['setCustomVariable', 2, 'version', 'VueJS', 'visit']) // eslint-disable-line
}

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.config.productionTip = false
moment.locale('fr')

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

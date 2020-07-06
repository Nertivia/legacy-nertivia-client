import Vue from 'vue'
import VueI18n from 'vue-i18n';
import en from '@/lang/en.json';
Vue.use(VueI18n)
export const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {en}
})
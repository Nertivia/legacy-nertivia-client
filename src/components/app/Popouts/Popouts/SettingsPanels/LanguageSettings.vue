<template>
  <div class="panel">
    <div class="desc">Change the language by selecting one below. Note that some of these translations may be incorrect. You can submit more languages or fix some translations at <a href="https://github.com/supertiger1234/Nertivia-Client/tree/master/src/lang" target="_blank" rel="noopener noreferrer">GitHub</a></div>
    <div class="lang-list">
      <div class="lang"  @click="changeLang(lang)" v-for="lang in langs" :class="{selected: currentLang === lang}" :key="lang">
        <img class="emoji" :src="langConsts[lang].emoji" />
        <div class="name">{{langConsts[lang].name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import path from 'path'
import { i18n } from '@/i18n';
export default {
  data() {
    return {
      currentLang: localStorage.getItem('lang') || "en",
      langs: [],
      langConsts: {
        en: {
          name: "English",
          emoji:  require(`@/assets/twemoji/1f1ec-1f1e7.svg`),
        },
        pl: {
          name: "Polish",
          emoji:  require(`@/assets/twemoji/1f1f5-1f1f1.svg`),
        },
        jp: {
          name: "Japanese",
          emoji:  require(`@/assets/twemoji/1f1ef-1f1f5.svg`),
        },
        de: {
          name: "German",
          emoji:  require(`@/assets/twemoji/1f1e9-1f1ea.svg`),
        },
        th: {
          name: "Thai",
          emoji:  require(`@/assets/twemoji/1f1f9-1f1ed.svg`),
        },
        ro: {
          name: "Romanian",
          emoji:  require(`@/assets/twemoji/1f1f7-1f1f4.svg`),
        },
        fi: {
          name: "Finnish",
          emoji:require(`@/assets/twemoji/1f1eb-1f1ee.svg`) 
        },
        ru: {
          name: "Russian",
          emoji:  require(`@/assets/twemoji/1f1f7-1f1fa.svg`),
        },
      }
    }
  },
  methods: {
    changeLang(lang) {
      this.currentLang = lang
      localStorage.setItem("lang", lang)
      if (lang === "en") {
        i18n.locale = "en";
        return;
      }
      import(`@/lang/${lang}.json`).then(msgs => {
        i18n.setLocaleMessage(lang, msgs.default);
        i18n.locale = lang;
      }).catch(() => {console.log("Invalid Language")})
    }
  },
  mounted() {
    if (!this.langConsts[this.currentLang]) {
      this.currentLang = "en";
    }
    this.langs = require.context('@/lang', true, /^.*\.json$/).keys().map(v => path.basename(v, '.json'))
  }

};
</script>

<style scoped lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.desc {
  opacity: 0.9;
  font-size: 16px;
  padding: 10px;
}
.lang {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  align-content: center;
  padding-left: 10px;
  padding-right: 10px;
  user-select: none;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
  &.selected {
    background: rgba(0, 0, 0, 0.4);
  }
}
.lang .name {
  margin-left: 5px;
}
a {
  color: #68aaff;
}
</style>

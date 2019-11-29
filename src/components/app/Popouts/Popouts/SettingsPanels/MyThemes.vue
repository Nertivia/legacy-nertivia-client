<template>
  <div class="container">
    <div class="editing" v-if="editing">
      <div class="bar">
        <input
          class="theme-name"
          v-model="name"
          type="text"
          placeholder="Theme name"
        />
        <div class="button" @click="saveButton">
          <div class="material-icons">save</div>
          Save & Apply
        </div>
        <div class="button" @click="closeButton">
          <div class="material-icons">clear</div>
          Close
        </div>
      </div>
      <!-- <prism-editor class="editor" v-model="code" language="css"></prism-editor> -->
      <codemirror
        class="editor"
        v-model="code"
        :options="cmOptions"
        @ready="onCmReady"
      />
      <div class="notice">
        <div class="material-icons">warning</div>
        <div class="notice-message">Warning: Pasting someone elses code could be dangerous.</div>
      </div>
    </div>
    <div class="managing" v-else>
      <div class="bar">
        <div class="button">
          <div class="material-icons">explore</div>
          Explore
        </div>
        <div class="button" @click="createButton">
          <div class="material-icons">add</div>
          Create
        </div>
      </div>
      <spinner v-if="!themes" />
      <div v-if="themes" class="themes-list">
        <div class="theme" v-for="theme in themes" :key="theme.id">
          <div
            class="name"
            :class="{ selected: selectedThemeID === theme.id }"
            @click="themeClick(theme.id)"
          >
            {{ theme.name }}
          </div>
          <div class="context" v-if="theme.id == selectedThemeID">
            <div class="button" @click="applyButton(theme.id)">
              <div class="material-icons">check</div>
              <div class="btn-name">Apply</div>
              </div>
            <div class="button" @click="editButton(theme.id)">
              <div class="material-icons">edit</div>
              <div class="btn-name">Edit</div>
              </div>
            <div class="button delete-button" @click="deleteButton(theme.id)">
              <div class="material-icons">delete</div>
              <div class="btn-name">Delete</div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import "prismjs";
// import "prismjs/themes/prism-twilight.css";
// const PrismEditor = () => import("vue-prism-editor");
// language js
import "codemirror/mode/css/css.js";

import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/css-hint";
// theme css
import "codemirror/theme/base16-dark.css";
import "codemirror/lib/codemirror.css";
import { codemirror } from "vue-codemirror";

import Spinner from "@/components/Spinner";

import config from "@/config.js";
import ThemeService from "@/services/ThemeService";
export default {
  components: {
    codemirror,
    Spinner
  },
  data() {
    return {
      saving: false,
      selectedThemeID: null,
      themes: null,
      editing: null,
      name: "",
      code: `/* Start writing your styles*/\n`,
      cmOptions: {
        // codemirror options
        tabSize: 2,
        mode: "text/css",
        theme: "base16-dark",
        lineNumbers: true,
        line: true
      }
    };
  },
  methods: {
    async fetchThemes() {
      this.themes = null;
      // fetch themes
      const {ok, result, error} = await ThemeService.getThemes();
      if (ok) {
        this.themes = result.data;
      }
    },
    createButton() {
      this.name = "Untitled"
      this.code = `/* Start writing your styles*/\n`;
      this.editing = true;
    },
    closeButton() {
      this.editing = false;
      this.fetchThemes();
    },
    themeClick(id) {
      if (this.selectedThemeID === id) {
        this.selectedThemeID = null;
      } else {
        this.selectedThemeID = id;
      }
    },
    onCmReady(cm) {
      cm.on("keypress", () => {
        cm.showHint({ completeSingle: false });
      });
    },
    async saveButton() {
      if (this.saving) {return}
      this.saving = true;
      const css = this.code;
      const name = this.name;
      if (typeof this.editing === 'string'){
        const response = await ThemeService.update({ name, css }, this.editing);
        this.applyButton(this.editing)
      } else {
        const response = await ThemeService.save({ name, css });
        this.editing = response.result.data.id;
        this.applyButton(response.result.data.id)
      }
      this.saving = false;
    },
    async applyButton(id) {
      const {ok, result, error} = await ThemeService.getTheme(id);
      if (ok) {
        this.code = result.data.css;
      }
      // save to local storage.
      localStorage.setItem('appliedThemeId', id);

      const styleEl = document.createElement("style");
      styleEl.classList.add('theme-' + id);
      styleEl.id = "theme";
      styleEl.innerHTML = this.code;

      const currentStyle = document.getElementById("theme");
      if (currentStyle) {
        currentStyle.outerHTML = styleEl.outerHTML;
      } else {
        document.head.innerHTML += styleEl.outerHTML;
      }
    },
    async editButton(id) {
      // fetch theme
      const {ok, result, error} = await ThemeService.getTheme(id);
      if (ok) {
        const {name, css} = result.data;
        this.name = name;
        this.code = css;
        this.editing = id;
      }
    },
    async deleteButton (id) {
      localStorage.removeItem('appliedThemeId');
      const themeEl = document.getElementById('theme');
      if (themeEl && themeEl.classList.contains('theme-' + id)) {
        document.getElementById('theme').outerHTML = ''
      }
      const {ok, result, error} = await ThemeService.delete(id);
      if (ok) {
        this.themes = this.themes.filter(t => t.id !== id);
      }
    },
  },
  async mounted() {
    this.fetchThemes();
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  }
};
</script>
<style scoped lang="scss">
.container {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}
.bar {
  display: flex;
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  height: 40px;
  flex-shrink: 0;
  .button {
    display: flex;
    flex-shrink: 0;
    align-content: center;
    align-items: center;
    height: 100%;
    user-select: none;
    cursor: pointer;
    padding-left: 5px;
    padding-right: 5px;
    &.end {
      margin: auto;
      margin-right: 0;
    }
    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
    .material-icons {
      margin-right: 5px;
    }
  }
}
.editing {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .theme-name {
    height: 20px;
    margin: 0;
  }
  .editor {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .notice {
    display: flex;
    align-items: center;
    align-content: center;
    background: rgb(255, 54, 54);
    height: 40px;
    flex-shrink: 0;
    padding-left: 5px;
    .notice-message {
      margin-left: 5px;
    }
  }
}

.themes-list {
  display: flex;
  flex-direction: column;
  .theme {
    display: flex;
    flex-direction: column;
    widows: 100%;
    min-height: 30px;
    flex-shrink: 0;
    cursor: pointer;
    user-select: none;
    color: rgb(230, 230, 230);
    transition: 0.2s;
    .name {
      flex-shrink: 0;
      display: flex;
      height: 100%;
      min-height: 30px;
      padding-left: 5px;
      flex: 1;
      align-items: center;
      transition: 0.2s;
      &:hover {
        color: white;
        background: rgba(0, 0, 0, 0.3);
      }
      &.selected {
        background: rgba(0, 0, 0, 0.5);
        color: white;
      }
    }
  }
  .context {
    display: flex;
    background: rgba(0, 0, 0, 0.6);
    .button {
      display: flex;
      margin: 5px;
      align-content: center;
      align-items: center;
      opacity: 0.8;
      transition: 0.2s;
      &:hover {
        opacity: 1;
      }
    }
    .delete-button {
      margin: auto;
      margin-right: 10px;
    }
  }
}
</style>

<style>
.CodeMirror-hints {
  background-color: #33332f !important;
  border-color: #232321 !important;
}
.CodeMirror-hint {
  color: #666 !important;
}
.CodeMirror-hint-active {
  background-color: transparent !important;
  color: #6cb5d9 !important;
}
.CodeMirror {
  height: 100% !important;
}
</style>

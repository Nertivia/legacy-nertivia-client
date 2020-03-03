<template>
  <div class="editing theme-editor">
    <div class="bar">
      <input
        class="theme-name"
        v-model="name"
        type="text"
        placeholder="Theme name"
      />
      <div class="button" @click="saveButton">
        <div class="material-icons">save</div>
        {{ savingStatus ? "Saving..." : "Save & Apply" }}
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
      <div class="notice-message">
        Warning: Pasting someone elses code could be dangerous.
      </div>
    </div>
  </div>
</template>

<script>
import "codemirror/mode/css/css.js";

import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/css-hint";
// theme css
import "codemirror/theme/base16-dark.css";
import "codemirror/lib/codemirror.css";
import { codemirror } from "vue-codemirror";

export default {
  components: { codemirror },
  props: ["themeName", "themeCode", "savingStatus"],
  data() {
    return {
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
  mounted() {
    if (this.themeName) {
      this.name = this.themeName;
    }
    if (this.themeCode) {
      this.code = this.themeCode;
    }
  },
  methods: {
    onCmReady(cm) {
      cm.on("keypress", () => {
        cm.showHint({ completeSingle: false });
      });
    },
    saveButton() {
      this.$emit("save", { name: this.name, css: this.code });
    },
    closeButton() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>
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
    overflow: hidden;
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

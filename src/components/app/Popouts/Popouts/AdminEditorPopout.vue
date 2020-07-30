<template>
  <div class="dark-background admin-editor-popout" @mousedown="backgroundClick">
    <div class="inner">
      <div class="details" v-if="details && details.updatedCss">
        <div class="item">Updated</div>
        <div class="item">Current</div>
      </div>
      <codemirror
        v-if="details"
        class="editor"
        :merge="!!details.updatedCss"
        :code="details.css"
        :options="cmOptions"
      />
      <div class="button" @click="applyButton">Apply</div>
    </div>
  </div>
</template>

<script>
const zip = () => import("@/utils/zip");

import "codemirror/mode/css/css.js";

import "codemirror/addon/merge/merge.js";
// merge css
import "codemirror/addon/merge/merge.css";
// google DiffMatchPatch
import DiffMatchPatch from "diff-match-patch";

window.diff_match_patch = DiffMatchPatch;
window.DIFF_DELETE = -1;
window.DIFF_INSERT = 1;
window.DIFF_EQUAL = 0;

// theme css
import "codemirror/theme/base16-dark.css";
import "codemirror/lib/codemirror.css";
import { codemirror } from "vue-codemirror";

import AdminService from "@/services/adminService";

export default {
  components: { codemirror },
  data() {
    return {
      details: null,
      code: null,
      cmOptions: {
        value: ``,
        origLeft: null,
        orig: ``,
        // codemirror options
        tabSize: 2,
        mode: "text/css",
        theme: "base16-dark",
        lineNumbers: true,
        line: true,
        readOnly: true,
        collapseIdentical: false,
        highlightDifferences: true
      }
    };
  },
  methods: {
    closeMenu() {
      this.$store.dispatch("setAllPopout", {
        show: false,
        type: null,
        id: null
      });
    },
    backgroundClick(e) {
      if (e.target.classList.contains("dark-background")) {
        this.closeMenu();
      }
    },
    applyButton() {
      const css = this.details.updatedCss || this.details.css;
      const styleEl = document.createElement("style");
      styleEl.id = "theme";
      styleEl.innerHTML = css;

      const currentStyle = document.getElementById("theme");
      if (currentStyle) {
        currentStyle.outerHTML = styleEl.outerHTML;
      } else {
        document.head.innerHTML += styleEl.outerHTML;
      }
    }
  },
  async mounted() {
    const { ok, result } = await AdminService.fetchTheme(this.popoutDetails.id);
    if (ok) {
      zip().then(utils => {
        this.cmOptions.orig = utils.unzip(result.data.css) || result.data.css;
        this.cmOptions.value =
          utils.unzip(result.data.updatedCss) || result.data.updatedCss;
        this.details = result.data;
        this.details.css = utils.unzip(this.details.css) || this.details.css;
      });
    }
  },
  computed: {
    popoutDetails() {
      return this.$store.getters.popouts.allPopout;
    }
  }
};
</script>

<style scoped lang="scss">
.dark-background {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.541);
  z-index: 111111;
  display: flex;
}
.inner {
  margin: auto;
  max-height: 460px;
  height: 100%;
  width: 800px;
  display: flex;
  flex-direction: column;
  color: white;
  overflow: hidden;
  box-shadow: 0px 0px 20px 5px #151515bd;
  background: linear-gradient(#0b4155, #01677e);
  border-radius: 4px;
}
.editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.button {
  padding: 10px;
  transition: 0.3s;
  display: inline;
  cursor: pointer;
  text-align: center;
  user-select: none;
  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }
}
.details {
  display: flex;
  .item {
    flex: 1;
    padding: 2px;
    &:nth-child(2) {
      margin-left: 45px;
    }
  }
}
</style>

<style>
.CodeMirror {
  height: 100% !important;
}
.CodeMirror-merge-pane {
  height: 100%;
}
.CodeMirror-merge-r-chunk {
  background: rgb(36, 36, 36);
}
.CodeMirror-merge-r-chunk-end {
  border-bottom: 1px solid rgb(66, 66, 66);
}
.CodeMirror-merge-r-chunk-start {
  border-top: 1px solid rgb(66, 66, 66);
}
</style>

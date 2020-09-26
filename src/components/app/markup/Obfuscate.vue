<template>
  <span class="obfuscate">
    <slot></slot>
  </span>
</template>

<script>
import windowProperties from "@/utils/windowProperties";
export default {
  props: ["text"],
  data: () => ({
    content: null,
    interval: null,
    letters: "1234567890abcdefghijklmnopqrstuvwxyz~!@#$&~!@#$&~!@#$&~!@#$&~"
  }),
  methods: {
    obfuscateText(text, offset = 0) {
      let arr = [];
      for (let i = 0; i < text.length; i++) {
        // if whitespace, keep whitespace
        if (/\s/.test(text.charAt(i))) {
          arr.push(text.charAt(i));
          continue;
        }
        let charCode =
          (text.charCodeAt(0) +
            Math.floor(Math.random() * 40) +
            offset +
            i * i) %
          this.letters.length;
        arr.push(this.letters.charAt(charCode));
      }
      return arr.join("");
    },
    obfuscateNodes(delta) {
      for (let node of this.textNodes) {
        if (!node.parentElement.dataset.originalValue) {
          node.parentElement.dataset.originalValue = node.textContent;
          if (!node.parentElement.hasAttribute("title")) {
            node.parentElement.setAttribute(
              "title",
              node.parentElement.dataset.originalValue
            );
          }
        }
        node.textContent = this.obfuscateText(node.textContent, delta);
      }
    },
    getTextNodes() {
      const walker = document.createTreeWalker(
        this.$el,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      let node;
      let nodes = [];
      while ((node = walker.nextNode())) {
        nodes.push(node);
      }
      return nodes;
    }
  },
  watch: {
    focused() {
      if (this.focused) this.interval = setInterval(this.obfuscateNodes, 60);
      else clearInterval(this.interval);
    }
  },
  computed: {
    focused() {
      return windowProperties.isfocused;
    },
    textNodes: function() {
      return this.getTextNodes();
    }
  },
  mounted() {
    this.content = this.obfuscateNodes();
    if (this.focused) this.interval = setInterval(this.obfuscateNodes, 60);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<style>
.obfuscate {
  white-space: pre-wrap;
  font-family: monospace;
  letter-spacing: 2px;
  line-height: 2px;
}
</style>

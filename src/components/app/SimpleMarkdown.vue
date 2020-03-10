<template>
  <div
    class="formatted-content"
    ref="content"
    @click="textClicked"
    v-html="markdown"
  ></div>
</template>

<script>
import messageFormatter from "@/utils/messageFormatter";

export default {
  props: {
    message: String
  },
  methods: {
    textClicked(event) {
      if (event.target.classList[0] === "mention") {
        const id = event.target.id.split("-")[1];
        this.$store.dispatch("setUserInformationPopout", id);
      }
    }
  },
  computed: {
    markdown: function() {
      return messageFormatter(this.message);
    }
  }
};
</script>

<style>
pre {
  padding: 0;
  margin: 0;
}

.codeblock {
  background-color: rgba(0, 0, 0, 0.46);
  border-radius: 4px;
  padding: 5px;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

img.emoji {
  object-fit: contain;
  height: 2em;
  width: 2em;
  margin: 1px;
  vertical-align: -9px;
}

.inline-code {
  background: rgba(0, 0, 0, 0.46);
}

.link {
  color: #68aaff;
}
.mention {
  background: rgba(0, 0, 0, 0.3);
  color: rgb(94, 164, 255);
  font-weight: bold;
  border-radius: 4px;
  padding: 3px;
  cursor: pointer;
  transition: 0.2s;
  display: inline-block;
  margin-top: 3px;
  margin-bottom: 3px;
}
.mention:hover {
  background: rgba(0, 0, 0, 0.6);
}
</style>

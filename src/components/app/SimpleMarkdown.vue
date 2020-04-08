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
import { bus } from '../../main';

export default {
  props: {
    message: String
  },
  mounted() {
    this.setEmojiSize();
  },
  methods: {
    textClicked(event) {
      if (event.target.classList[0] === "mention") {
        const id = event.target.id.split("-")[1];
        if (event.target.classList.contains("channel")) {
          this.channelClicked(id)
        } else {
          this.$store.dispatch("setUserInformationPopout", id);
        }
      }
    },
    channelClicked(id) {
      const channel = this.$store.getters.channels[id];
      if (!channel) return;
      bus.$emit("openServer", channel.server_id, id);
    },
    setEmojiSize() {
      if (!this.$refs.content) return false;
      const nodes = this.$refs.content.childNodes;
      // make emoji size big if theres nothing else
      let containsOtherType = false;
      let emojiCount = 0;
      for (let index = 0; index < nodes.length; index++) {
        if (emojiCount >= 5) return;
        const element = nodes[index];
        if (!element.classList && element.wholeText.trim() != "") {
          containsOtherType = true;
          break;
        } else if (!element.classList) {
          continue;
        }
        if (element.classList.contains("emoji")) {
          containsOtherType = false;
          emojiCount += 1;
        } else {
          containsOtherType = true;
        }
      }
      if (!containsOtherType) {
        this.$refs.content.classList.add("large-emojis");
      } else {
        this.$refs.content.classList.remove("large-emojis");
      }
    }
  },
  watch: {
    message() {
      this.$nextTick(() => {
        this.setEmojiSize();
      });
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

.large-emojis .emoji {
  height: 5em;
  width: 5em;
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
  padding: 2px;
  cursor: pointer;
  transition: 0.2s;
  display: inline-block;
}
.mention:hover {
  background: rgba(0, 0, 0, 0.5);
}
.mention.channel {
  color: rgba(255, 255, 255, 0.9);
}
</style>

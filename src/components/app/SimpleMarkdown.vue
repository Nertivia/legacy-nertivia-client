<template>
  <div class="formatted-content" ref="content" @click="textClicked" v-html="markdown"></div>
</template>

<script>
import messageFormatter from "@/utils/messageFormatter";
import { bus } from "../../main";

export default {
  props: {
    message: String,
    content: Object,
  },
  mounted() {
    this.setEmojiSize();
  },
  methods: {
    textClicked(event) {
      if (event.target.classList[0] === "mention") {
        const id = event.target.id.split("-")[1];
        if (event.target.classList.contains("channel")) {
          this.channelClicked(id);
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

      const ELEMENT = 1;
      const TEXT = 3;

      let emojiCount = 0;
      let notEmoji = false;
      for (let index = 0; index < nodes.length; index++) {
        const element = nodes[index];

        if (element.nodeType === TEXT) {
          if (emojiCount >= 5) {
            notEmoji = true;
            break;
          }
          // element.data !== "️" contains some weird unicode which some emojis contain for some reason.
          if (element.data !== "️" && element.data.replace(/\s+/g, "").trim().length !== 0) {
            // dont enlargen emoji since it contains text.
            notEmoji = true;
            break;
          }
        }
        if (element.nodeType === ELEMENT) {
          if (!element.classList || !element.classList.contains("emoji")) {
            notEmoji = true;
            break;
          }
          emojiCount++;
        }
      }
      if (notEmoji) {
        this.$refs.content.classList.remove("large-emojis");
      } else {
        this.$refs.content.classList.add("large-emojis");
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
      return messageFormatter(this.message, this.content);
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

img.emoji[alt] {
  text-indent: -9999px;
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
.formatted-content .quote {
  background: rgba(0, 0, 0, 0.3);
  display: block;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
  margin-top: 5px;
}

.formatted-content .quote .quote-profile{ 
  display: flex;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px;
  font-weight: bold;
}
.formatted-content .quote .quote-username {
  font-weight: initial;
  cursor: pointer; 
}

.formatted-content .quote .quote-username:hover {
  text-decoration: underline;
}

.formatted-content .quote .quote-message{
  padding: 5px;
}
</style>

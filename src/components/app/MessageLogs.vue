<template>
  <div
    ref="msg-logs"
    class="message-logs"
    @scroll.passive="scrollEvent"
    @resize="onResize"
  >
    <div
      class="load-more-button"
      v-if="loadMoreTop.show && selectedChannelMessages.length >= 50"
    >
      <spinner :size="30" v-if="loadMoreTop.loading" />
      <div class="text" v-if="!loadMoreTop.loading" @click="loadMoreMessages">
        Load more
      </div>
    </div>
    <message
      v-for="(msg, index) in selectedChannelMessages"
      :class="{
        'show-message-animation': index === selectedChannelMessages.length - 1
      }"
      :key="msg.tempID || msg.messageID"
      :creator="msg.creator"
      :message="msg"
      :isServer="isServer"
      :hideAdditional="groupedMessages.includes(msg.messageID)"
    />
    <!-- {{ groupedMessages }} -->
    <uploadsQueue v-if="uploadQueue !== undefined" :queue="uploadQueue" />
    <div
      class="load-more-button"
      v-if="loadMoreBottom.show && selectedChannelMessages.length >= 50"
    >
      <spinner :size="30" v-if="loadMoreBottom.loading" />
      <div
        class="text"
        v-if="!loadMoreBottom.loading"
        @click="loadBottomMessages"
      >
        Load more
      </div>
    </div>
  </div>
</template>

<script>
import messagesService from "@/services/messagesService";
import { bus } from "../../main";
import Message from "../../components/app/MessageTemplate.vue";
import Spinner from "@/components/Spinner.vue";
import uploadsQueue from "@/components/app/uploadsQueue.vue";
import debounce from "lodash/debounce";

import windowProperties from "@/utils/windowProperties";

export default {
  components: {
    Message,
    Spinner,
    uploadsQueue
  },
  data() {
    return {
      scrolledDown: true,
      scrolledTop: false,

      loadMoreTop: {
        show: true,
        loading: false
      },
      loadMoreBottom: {
        show: false,
        loading: false
      },
      selectedChannelID: null,
      currentScrollTopPos: null,
      backToBottomLoading: false
    };
  },
  methods: {
    scrollEvent: debounce(function(event) {
      const {
        target: { scrollTop, clientHeight, scrollHeight }
      } = event;
      this.scrolledDown =
        Math.abs(scrollHeight - scrollTop - clientHeight) <= 3.0;
      this.scrolledTop = scrollTop === 0;
      this.currentScrollTopPos = scrollTop;
    }, 20),
    scrollDown(data) {
      const element = this.$refs["msg-logs"];
      const force = data && data.force ? data.force : false;
      const pos = data && data.pos ? data.pos : undefined;
      if (!force && !this.scrolledDown) return;
      if (!element) return;
      element.scrollTop = pos || element.scrollHeight;
    },
    unloadTopMessages() {
      if (
        this.selectedChannelMessages &&
        this.selectedChannelMessages.length >= 100
      )
        this.$store.dispatch("unloadTopMessages", {
          channelID: this.selectedChannelID
        });
    },
    unloadBottomMessages() {
      if (
        this.selectedChannelMessages &&
        this.selectedChannelMessages.length >= 100
      ) {
        this.$store.dispatch("setBottomUnloadStatus", {
          channelID: this.selectedChannelID,
          status: true
        });
        this.$store.dispatch("unloadBottomMessages", {
          channelID: this.selectedChannelID
        });
      }
    },
    onResize() {
      this.scrollDown();
    },
    async loadMoreMessages() {
      if (this.loadMoreTop.loading) return;
      const msgLogs = this.$refs["msg-logs"];
      const scrollHeight = msgLogs.scrollHeight;

      const continueMessageID = this.selectedChannelMessages[0].messageID;
      this.$set(this.loadMoreTop, "loading", true);
      const { ok, result } = await messagesService.get(
        this.selectedChannelID,
        continueMessageID
      );
      if (ok) {
        if (!result.data.messages.length) {
          this.$set(this.loadMoreTop, "loading", false);
          this.$set(this.loadMoreTop, "show", false);
          return;
        }
        this.$store.dispatch("addMessages", result.data.messages);
        this.$nextTick(() => {
          this.$set(this.loadMoreTop, "loading", false);
          msgLogs.scrollTop = msgLogs.scrollHeight - scrollHeight;
        });
      }
    },
    async loadBottomMessages() {
      if (this.loadMoreBottom.loading) return;
      const msgLogs = this.$refs["msg-logs"];
      const scrollTop = msgLogs.scrollTop;
      const channelID = this.selectedChannelID;

      const beforeMessageID = this.selectedChannelMessages[
        this.selectedChannelMessages.length - 1
      ].messageID;
      this.$set(this.loadMoreBottom, "loading", true);
      const { ok, result } = await messagesService.get(
        channelID,
        null,
        beforeMessageID
      );
      if (ok) {
        if (!result.data.messages.length) {
          this.$store.dispatch("setBottomUnloadStatus", {
            channelID,
            status: false
          });
          this.$set(this.loadMoreBottom, "loading", false);
          this.$set(this.loadMoreBottom, "show", false);
          return;
        }
        this.$store.dispatch("addMessagesBefore", result.data.messages);

        this.$nextTick(() => {
          this.$set(this.loadMoreBottom, "loading", false);
          this.scrolledDown = false;
          msgLogs.scrollTop = scrollTop;
          this.$set(this.loadMoreBottom, "show", true);
        });
      }
    },
    scrolledUpEvent() {
      this.unloadBottomMessages();
      const msgLogs = this.$refs["msg-logs"];

      this.$set(this.loadMoreBottom, "show", true);

      this.$nextTick(() => {
        msgLogs.scrollTop = 0;
        if (this.loadMoreTop.show) this.loadMoreMessages();
      });
    },
    scrolledDownEvent() {
      this.unloadTopMessages();
      this.$set(this.loadMoreTop, "show", true);
      this.$nextTick(() => {
        if (this.loadMoreBottom.show) this.loadBottomMessages();
      });
    },
    async backToBottomEvent() {
      if (this.backToBottomLoading) return;
      const channelID = this.selectedChannelID;
      const bottomUnloaded = this.bottomUnloaded;
      if (!bottomUnloaded) {
        this.scrollDown({ force: true });
        this.unloadTopMessages();
        return;
      }
      this.backToBottomLoading = true;
      const { ok, result } = await messagesService.get(this.selectedChannelID);
      if (ok) {
        this.$store.dispatch("messages", {
          messages: result.data.messages.reverse(),
          channelID
        });
        this.$set(this.loadMoreBottom, "show", false);
        this.$store.dispatch("setBottomUnloadStatus", {
          channelID,
          status: false
        });
        this.$nextTick(() => {
          this.scrollDown({ force: true });
        });
      }
      this.backToBottomLoading = false;
    }
  },

  mounted() {
    this.selectedChannelID = this.$store.getters.selectedChannelID;
    const pos = this.$store.getters.scrollPosition[this.selectedChannelID];
    bus.$on("backToBottom", this.backToBottomEvent);
    bus.$on("scrollDown", this.scrollDown);
    bus.$emit("scrolledDown", this.scrolledDown);

    if (this.bottomUnloaded) {
      this.$set(this.loadMoreBottom, "show", true);
    }
    this.$nextTick(() => {
      this.scrollDown({ force: pos, pos: pos });
    });
  },

  beforeDestroy() {
    this.$store.dispatch("setEditMessage", null);
    this.$store.dispatch("changeScrollPosition", {
      channelID: this.selectedChannelID,
      pos: !this.scrolledDown ? this.currentScrollTopPos : null
    });
    bus.$off("backToBottom", this.backToBottomEvent);
    bus.$off("scrollDown", this.scrollDown);
  },

  watch: {
    selectedChannelMessages() {
      this.$set(this.loadMoreTop, "show", true);
      this.$nextTick(function() {
        this.scrollDown();
      });
    },
    uploadQueue() {
      this.$nextTick(function() {
        this.scrollDown({ force: true });
      });
    },
    getWindowWidth() {
      this.onResize();
    },
    scrolledTop(scrolledTop) {
      if (scrolledTop) this.scrolledUpEvent();
    },
    scrolledDown(scrolledDown) {
      bus.$emit("scrolledDown", scrolledDown);
      if (scrolledDown) this.scrolledDownEvent();
    }
  },
  computed: {
    isServer() {
      return this.$store.getters.currentTab === 2;
    },
    uploadQueue() {
      const allUploads = this.$store.getters.getAllUploads;
      const selectedChannelID = this.$store.getters.selectedChannelID;

      const filteredArray = [];

      for (let upload in allUploads) {
        if (allUploads[upload].channelID === selectedChannelID) {
          filteredArray.push(allUploads[upload]);
        }
      }
      if (!filteredArray.length) return undefined;
      return filteredArray;
    },
    user() {
      return this.$store.getters.user;
    },
    channel() {
      return this.$store.getters.channels[this.selectedChannelID];
    },
    selectedChannelMessages() {
      const selectedChannel = this.$store.getters.selectedChannelID;
      return this.$store.getters.messages[selectedChannel];
    },
    editMessage() {
      let editMessage = this.$store.getters.popouts.editMessage;
      if (!editMessage) return null;
      return editMessage;
    },
    getWindowWidth() {
      return {
        width: windowProperties.resizeWidth,
        height: windowProperties.resizeHeight
      };
    },
    scrollPosition() {
      return this.$store.getters.scrollPosition;
    },
    bottomUnloaded() {
      return (
        this.$store.getters.bottomUnloaded[this.selectedChannelID] || false
      );
    },
    groupedMessages() {
      const messages = this.selectedChannelMessages;
      const grouped = [];
      let groupLength = 0;
      let prevMessageCreator = null;
      for (let index = 0; index < messages.length; index++) {
        const message = messages[index];
        if (message.type !== 0 && message.type !== undefined) {
          groupLength = 0;
          prevMessageCreator = null;
          continue;
        }
        if (message.creator.uniqueID !== prevMessageCreator) {
          groupLength = 0;
          prevMessageCreator = message.creator.uniqueID;
        } else {
          if (groupLength > 3) {
            groupLength = 0;
            continue;
          }
          grouped.push(message.messageID);
          groupLength += 1;
        }
      }
      return grouped;
    }
  }
};
</script>

<style lang="scss" scoped>
.message-logs {
  overflow: auto;
  flex: 1;
  position: relative;
  padding-bottom: 23px;
}

.load-more-button {
  background: rgba(0, 0, 0, 0.46);
  padding: 5px;
  user-select: none;
  border-radius: 5px;
  margin: 5px;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .text {
    text-align: center;
    color: white;
    cursor: pointer;
    align-self: center;
  }
}

.show-message-animation {
  animation: showMessage 0.3s ease-in-out;
}
@keyframes showMessage {
  from {
    transform: translate(-50px, 0);
    opacity: 0;
  }
}
</style>

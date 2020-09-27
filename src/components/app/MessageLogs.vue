<template>
  <!-- <div
    ref="msg-logs"
    class="message-logs"
    @scroll.passive="scrollEvent"
    @resize="onResize"
  >-->
  <CustomScroller
    ref="customScroller"
    class="message-logs"
    height="100%"
    width="calc(100% - 5px)"
    spacingTop="50px"
    spacingBottom="31px"
    scrollbarTop="50px"
    :scrollbarBottom="
      isTyping && Object.values(isTyping).length ? '36px' : '5px'
    "
  >
    <div
      class="load-more-button"
      v-if="loadMoreTop.show && currentChannelMessages.length >= 50"
    >
      <spinner :size="30" v-if="loadMoreTop.loading" />
      <div class="text" v-if="!loadMoreTop.loading" @click="loadMoreMessages">
        Load more
      </div>
    </div>
    <message
      v-for="(msg, index) in currentChannelMessages"
      :class="{
        'show-message-animation': index === currentChannelMessages.length - 1
      }"
      :ref="`message-${msg.messageID}`"
      :key="msg.tempID || msg.messageID"
      :notificationLastMessageID="notificationLastMessageID"
      :creator="msg.creator"
      :message="msg"
      :isServer="isServer"
      :hideAdditional="groupedMessages.includes(msg.messageID)"
    />
    <!-- {{ groupedMessages }} -->
    <uploadsQueue v-if="uploadQueue !== undefined" :queue="uploadQueue" />
    <div
      class="load-more-button"
      v-if="loadMoreBottom.show && currentChannelMessages.length >= 50"
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
  </CustomScroller>
  <!-- </div> -->
</template>

<script>
import messagesService from "@/services/messagesService";
import CustomScroller from "@/components/global/CustomScroller";
import { bus } from "../../main";
import Message from "../../components/app/MessageTemplate.vue";
import Spinner from "@/components/global/Spinner.vue";
import uploadsQueue from "@/components/app/uploadsQueue.vue";
import debounce from "lodash/debounce";

import windowProperties from "@/utils/windowProperties";

export default {
  props: ["isTyping"],
  components: {
    Message,
    Spinner,
    uploadsQueue,
    CustomScroller
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
      currentChannelID: null,
      currentScrollTopPos: null,
      backToBottomLoading: false,
      scrollEl: null,
      notificationLastMessageID: null
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
      const element = this.scrollEl;
      const force = data && data.force ? data.force : false;
      const pos = data && data.pos ? data.pos : undefined;
      if (!force && !this.scrolledDown) return;
      if (!element) return;
      element.scrollTop = pos || element.scrollHeight;
    },
    unloadTopMessages() {
      if (
        this.currentChannelMessages &&
        this.currentChannelMessages.length >= 100
      )
        this.$store.dispatch("unloadTopMessages", {
          channelID: this.currentChannelID
        });
    },
    unloadBottomMessages() {
      if (
        this.currentChannelMessages &&
        this.currentChannelMessages.length >= 100
      ) {
        this.$store.dispatch("setBottomUnloadStatus", {
          channelID: this.currentChannelID,
          status: true
        });
        this.$store.dispatch("unloadBottomMessages", {
          channelID: this.currentChannelID
        });
      }
    },
    onResize() {
      this.scrollDown();
    },
    async loadMoreMessages() {
      if (this.loadMoreTop.loading) return;
      const msgLogs = this.scrollEl;
      const scrollHeight = msgLogs.scrollHeight;

      const continueMessageID = this.currentChannelMessages[0].messageID;
      this.$set(this.loadMoreTop, "loading", true);
      const { ok, result } = await messagesService.get(
        this.currentChannelID,
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
      const msgLogs = this.scrollEl;
      const scrollTop = msgLogs.scrollTop;
      const channelID = this.currentChannelID;

      const beforeMessageID = this.currentChannelMessages[
        this.currentChannelMessages.length - 1
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
      const msgLogs = this.scrollEl;

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
      const channelID = this.currentChannelID;
      const bottomUnloaded = this.bottomUnloaded;
      if (!bottomUnloaded) {
        this.scrollDown({ force: true });
        this.unloadTopMessages();
        return;
      }
      this.backToBottomLoading = true;
      const { ok, result } = await messagesService.get(this.currentChannelID);
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
    },
    dismissNotification(channelID) {
      if (this.channel.server_id) return this.dismissServerNotification();
      const notifications = this.channelNotifications;
      if (notifications && notifications.count >= 1 && document.hasFocus()) {
        setTimeout(() => {
          this.$socket.client.emit("notification:dismiss", { channelID });
        }, 500);
      }
    },
    dismissServerNotification() {
      if (!this.hasServerNotifications) return;
      if (!document.hasFocus()) return;
      this.$socket.client.emit("notification:dismiss", {
        channelID: this.channel.channelID
      });
    },
    async scrollTo(messageID) {
      if (
        this.$refs[`message-${messageID}`] &&
        this.$refs[`message-${messageID}`][0]
      ) {
        this.$refs[`message-${messageID}`][0].$el.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center"
        });
        this.highlightMessage(messageID);
        return;
      }

      const { result } = await messagesService.get(
        this.currentChannelID,
        null,
        null,
        messageID
      );
      this.$store.dispatch("messages", {
        ...result.data,
        messages: result.data.messages.reverse()
      });

      this.$nextTick(() =>
        this.$nextTick(() =>
          this.$nextTick(() => {
            this.$refs[`message-${messageID}`][0].$el.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "center"
            });
            this.$store.dispatch("setBottomUnloadStatus", {
              channelID: this.currentChannelID,
              status: true
            });
            this.$set(this.loadMoreBottom, "show", true);
            this.highlightMessage(messageID);
          })
        )
      );
    },
    highlightMessage(messageID) {
      const el = this.$refs[`message-${messageID}`][0].$el;
      if (el.classList.contains("active")) return;
      el.classList.add("active");
      setTimeout(() => {
        el.classList.remove("active");
      }, 3000);
    },
    setNotificationLastMessageID() {
      if (this.channelNotifications) {
        this.notificationLastMessageID = this.channelNotifications.lastMessageID;
      }
    }
  },

  mounted() {
    this.setNotificationLastMessageID();
    this.scrollEl = this.$refs.customScroller.$el.children[0];
    this.scrollEl.addEventListener("scroll", this.scrollEvent);
    this.currentChannelID = this.$store.getters.currentChannelID;
    const pos = this.$store.getters.scrollPosition[this.currentChannelID];
    bus.$on("message:scrollTo", this.scrollTo);
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
    this.scrollEl.removeEventListener("scroll", this.scrollEvent);
    this.$store.dispatch("setEditMessage", null);
    this.$store.dispatch("changeScrollPosition", {
      channelID: this.currentChannelID,
      pos: !this.scrolledDown ? this.currentScrollTopPos : null
    });
    bus.$off("message:scrollTo", this.scrollTo);
    bus.$off("backToBottom", this.backToBottomEvent);
    bus.$off("scrollDown", this.scrollDown);
  },

  watch: {
    "channelNotifications.count"() {
      if (!document.hasFocus()) {
        this.setNotificationLastMessageID();
      }
    },
    currentChannelMessages(newVal) {
      this.$set(this.loadMoreTop, "show", true);
      this.$nextTick(function() {
        this.scrollDown();
      });

      const lastMessage = newVal[newVal.length - 1];
      if (!lastMessage) return;
      if (!this.currentChannelID) return;
      if (lastMessage.creator.uniqueID != this.user.uniqueID) {
        this.dismissNotification(this.currentChannelID);
      }
    },
    currentChannelID(channelID) {
      if (!channelID) return;
      this.setNotificationLastMessageID();
      this.dismissNotification(channelID);
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
    hasServerNotifications() {
      if (!this.channel.server_id) return false;
      return this.$store.getters
        .serverNotifications(this.channel.server_id)
        .find(c => c.channelID === this.channel.channelID);
    },
    channelNotifications() {
      return this.$store.getters.notifications.find(e => {
        return e.channelID === this.currentChannelID;
      });
    },
    isServer() {
      return this.$store.getters.currentTab === 2;
    },
    uploadQueue() {
      const allUploads = this.$store.getters.getAllUploads;
      const currentChannelID = this.$store.getters.currentChannelID;

      const filteredArray = [];

      for (let upload in allUploads) {
        if (allUploads[upload].channelID === currentChannelID) {
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
      return this.$store.getters.channels[this.currentChannelID];
    },
    currentChannelMessages() {
      const currentChannel = this.$store.getters.currentChannelID;
      return this.$store.getters.messages[currentChannel];
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
      return this.$store.getters.bottomUnloaded[this.currentChannelID] || false;
    },
    groupedMessages() {
      const messages = this.currentChannelMessages;
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
  flex: 1;
  position: relative;
}

.message-logs:after {
  content: "";
  display: block;
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

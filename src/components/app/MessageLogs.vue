<template>

    <div  ref="msg-logs" class="message-logs" @scroll="scrollEvent" @resize="onResize">
      <div class="load-more-button" v-if="!noMoreLoadMore && selectedChannelMessages.length >= 50">
        <spinner :size="30" v-if="loadingMore" />
        <div class="text" v-if="!loadingMore" @click="loadMoreMessages">Load more</div>
      </div>
      <message
        class="message-container"
        v-for="(msg, index) in selectedChannelMessages"
        :key="index + selectedChannelID"
        :date="msg.created"
        :admin="msg.creator.admin"
        :username="msg.creator.username"
        :uniqueID="msg.creator.uniqueID"
        :avatar="msg.creator.avatar"
        :message="msg.message"
        :embed="msg.embed"
        :files="msg.files"
        :status="msg.status"
        :messageID="msg.messageID"
        :channelID="msg.channelID"
        :type="msg.type"
        :timeEdited="msg.timeEdited"
      />
      <uploadsQueue v-if="uploadQueue !== undefined" :queue="uploadQueue"/>

    </div>

</template>

<script>
import messagesService from "@/services/messagesService";
import { bus } from "../../main";
import Message from "../../components/app/MessageTemplate.vue";
import Spinner from "@/components/Spinner.vue";
import uploadsQueue from "@/components/app/uploadsQueue.vue";
import debounce from "lodash/debounce";

import windowProperties from '@/utils/windowProperties';


export default {
  components: {
    Message,
    Spinner,
    uploadsQueue,
  },
  data() {
    return {
      scrolledDown: true,
      scrolledTop: false,

      //load more messages
      loadingMore: false,
      noMoreLoadMore: false,
      selectedChannelID: null,
      currentScrollTopPos: null
    };
  },
  methods: {
    scrollEvent: debounce(function(event) {
      const { target: { scrollTop, clientHeight, scrollHeight} } = event;
      this.scrolledDown = Math.abs(scrollHeight - scrollTop - clientHeight) <= 3.0;
      this.scrolledTop = scrollTop === 0;
      this.currentScrollTopPos = scrollTop;
    }, 20),
    scrollDown(data) {
      const element = this.$refs['msg-logs']
      const force = data && data.force ? data.force : false;
      const pos = data && data.pos ? data.pos : undefined;
      if (!force && !this.scrolledDown) return;
      if (!element) return;
      element.scrollTop = pos || element.scrollHeight;
    },
    onResize(dimentions) {
      this.scrollDown();
    },
    async loadMoreMessages() {
      const msgLogs = this.$refs['msg-logs'];
      const scrollTop = msgLogs.scrollTop;
      const scrollHeight = msgLogs.scrollHeight;

      const continueMessageID = this.selectedChannelMessages[0].messageID;
      this.loadingMore = true
      const {ok, result, error} = await messagesService.get(this.selectedChannelID, continueMessageID)
      if (ok) {
        if (!result.data.messages.length) {
          this.loadingMore = false;
          this.noMoreLoadMore = true;
          return;
        }
        this.$store.dispatch('addMessages', result.data.messages)
        this.$nextTick(_ => {
          this.loadingMore = false;
          msgLogs.scrollTop = msgLogs.scrollHeight - scrollHeight; 
        })
      }
    },
    scrolledUpEvent() {
      this.loadMoreMessages();
    },
    scrolledDownEvent(){
      this.noMoreLoadMore = false;
      this.unloadTopMessages()
    },
    unloadTopMessages(){
      if (this.selectedChannelMessages && this.selectedChannelMessages.length)
      this.$store.dispatch('unloadTopMessages', {channelID: this.selectedChannelID});
    },
    backToBottomEvent() {
      this.scrollDown({force: true});
      this.unloadTopMessages();
    },
    
  },
  
  mounted() {
    
    this.selectedChannelID = this.$store.getters.selectedChannelID;
    const pos = this.$store.getters.scrollPosition[this.selectedChannelID];
    bus.$on('backToBottom', this.backToBottomEvent)
    bus.$on('scrollDown', this.scrollDown)
    bus.$emit('scrolledDown',this.scrolledDown);
    this.$nextTick( _ => {
      this.scrollDown({force: pos, pos: pos});
    })

  },

  beforeDestroy() {
    this.$store.dispatch("setEditMessage", null);
    this.$store.dispatch('changeScrollPosition',{ channelID: this.selectedChannelID, pos: this.currentScrollTopPos });
    bus.$off('backToBottom', this.backToBottomEvent);
    bus.$off('scrollDown', this.scrollDown)
  },
 
  watch: {
    selectedChannelMessages(newMessages, oldMessages){
      this.noMoreLoadMore = false;
      const msgLogs = this.$refs['msg-logs'];
      this.$nextTick(function () {
        this.scrollDown();
      })
    },
    uploadQueue() {
      this.$nextTick(function () {
        this.scrollDown({force: true});
      })
    },
    getWindowWidth(dimentions) {
      this.onResize();
    },
    scrolledTop(scrolledTop) {
      if (scrolledTop)
        this.scrolledUpEvent();
    },
    scrolledDown(scrolledDown) {
      bus.$emit('scrolledDown',scrolledDown);
      if (scrolledDown)
        this.scrolledDownEvent();
    }
  },
  computed: {
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
      return {width: windowProperties.resizeWidth, height: windowProperties.resizeHeight};
    },
    scrollPosition() {
      return this.$store.getters.scrollPosition;
    }
  }
};
</script>

<style lang="scss" scoped>

.message-logs {
  overflow: auto;
  flex: 1;
  margin-right: 2px;
  position: relative;
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
.back-to-bottom-button {
  &:hover {
    background: rgb(23, 124, 255);  
    box-shadow: 0px 0px 15px 0px #0000008a;
  }
  transition: 0.2s;
  background: rgba(23, 124, 255, 0.818);
  color: white;
  position: absolute;
  bottom: 15px;
  right: 25px;
  border-radius: 10px;
  height: 50px;
  z-index: 2;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0px 0px 7px 0px #0000008a;
  align-content: center;
  align-items: center;
  padding-left: 10px;
  user-select: none;
  cursor: pointer;
  .material-icons {
    align-self: center;
    flex-shrink: 0;
    font-size: 35px;
  }
}
</style>

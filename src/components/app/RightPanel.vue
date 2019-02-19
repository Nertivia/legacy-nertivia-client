<template>
  <div class="right-panel">
    <div class="heading">
      <div class="show-menu-button" cli>
        <i class="material-icons" @click="toggleLeftMenu">
        menu
        </i>
      </div>
      <div class="current-channel"><span v-if="!selectedChannelID">Welcome back!</span><span v-else>{{channelName}}</span></div>
    </div>
    <div class="loading" v-if="selectedChannelID && !messages[selectedChannelID]">
      <spinner />
    </div>
    <div v-else-if="selectedChannelID" class="message-logs" @wheel="invertScroll">
      <div class="scroll">
        <message v-for="(msg, index) in messages[selectedChannelID]" :key="index" :date="msg.created" :username="msg.creator.username" :uniqueID="msg.creator.uniqueID" :avatar="msg.creator.avatar" :message="msg.message" :status="msg.status" />
      </div>
    </div>
    <news v-else />
    <div class="chat-input-area" v-if="selectedChannelID">
      <div class="message-area">
        <textarea class="chat-input" ref="input-box" placeholder="Message" @keydown="chatInput" @keyup="messageKeyUp" v-model="message"></textarea>
        <button :class="{'send-button': true, 'error-send-button': messageLength > 5000}" @click="sendMessage">Send</button>
      </div>
      <div class="info">
        <div class="typing-outer">
          <transition name="typing-animate">
            <typing-status v-if="typing" :username="whosTyping"/>
          </transition>
        </div>
        <div :class="{'message-count': true, 'error-info': messageLength > 5000 }">{{messageLength}}/5000</div>
      </div>
    </div>
  </div>
</template>

<script>
import messagesService from '@/services/messagesService'
import typingService from '@/services/TypingService'
import {bus} from '../../main'
import JQuery from 'jquery'
let $ = JQuery
import News from '../../components/app/News.vue'
import Message from '../../components/app/MessageTemplate.vue'
import Spinner from '@/components/Spinner.vue'
import TypingStatus from '@/components/app/TypingStatus.vue'

export default {
  components: {
    Message,
    Spinner, 
    News,
    TypingStatus
  },
  data() {
    return {
      message: "",
      messageLength: 0,
      postTimerID: null,
      getTimerID: null,
      typing: false,
      whosTyping: "",
    }
  },
  methods:{
    toggleLeftMenu(){
      bus.$emit('toggleLeftMenu')
    },
    generateNum(n) {
      var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   

      if ( n > max ) {
              return this.generateNum(max) + this.generateNum(n - max);
      }

      max        = Math.pow(10, n+add);
      var min    = max/10; // Math.pow(10, n) basically
      var number = Math.floor( Math.random() * (max - min + 1) ) + min;

      return ("" + number).substring(add); 
    },
    async sendMessage(){
      this.$refs["input-box"].focus()
      this.message = this.message.trim();

      if(this.message == "")return;
      if (this.message.length > 5000) return;
      clearInterval(this.postTimerID);
      this.postTimerID = null;

      const msg = this.message;
      const tempID = this.generateNum(25);

      this.$store.dispatch('addMessage', {
        sender: true,
        channelID: this.selectedChannelID,
        message: {
          tempID,
          message: this.message,
          channelID: this.selectedChannelID,
          created: new Date()
        }
      })

      this.message = ""
      this.$store.dispatch('updateChannelLastMessage', this.selectedChannelID);
      const { ok, error, result } = await messagesService.post(this.selectedChannelID, {
        message: msg,
        socketID: this.$socket.id,
        tempID
      })
      if ( ok ) {
        const message = result.data.messageCreated
        message.status = 1;
        this.$store.dispatch('replaceMessage', {
          tempID: result.data.tempID,
          message
        });
      } else {
        // TODO: Error handling
        console.log(error)
      }
    },
    async postTimer() {
      this.postTimerID = setInterval(async () => {
        if (this.$refs['input-box'].value.trim() == "") {
          clearInterval(this.postTimerID);
          return this.postTimerID = null;
        }
        await typingService.post(this.selectedChannelID);
      }, 2000);
    },
    async messageKeyUp(event){
      this.messageLength = this.message.length;
      const value = event.target.value.trim();
      if (value && this.postTimerID == null) {
        // Post typing status
        this.postTimer()
        await typingService.post(this.selectedChannelID);
      }
    },
    chatInput(event) {
      if (event.keyCode == 13) {
        event.preventDefault();
        this.sendMessage();
      }
    },
    invertScroll(event) {
      if(event.deltaY) {
        event.preventDefault();
        event.currentTarget.scrollTop -= parseFloat(getComputedStyle(event.currentTarget).getPropertyValue('font-size')) * (event.deltaY < 0 ? -1 : 1) * 2;
      }
    },
    hideTypingStatus(data) {
      if(this.user.uniqueID === data.message.creator.uniqueID) return;
      this.typing = false;
    }
  },
  mounted() {
    this.$options.sockets.typingStatus = (data) => {
      const {channelID, userID} = data;
      if (channelID !== this.selectedChannelID) return;
      this.typing = true; 
      this.whosTyping = this.channel.recipients.find(function(recipient) {
        return recipient.uniqueID == userID;
      }).username
      clearTimeout(this.getTimerID);
      this.getTimerID = setTimeout(() => {
        this.typing = false; 
      }, 2500);
    }
    bus.$on('newMessage', this.hideTypingStatus)
    //dismiss notification on focus
    window.onfocus = () => {
      bus.$emit('title:change', "Nertivia");
      if (!this.$store.getters.selectedChannelID) return;
      const find = this.$store.getters.notifications.find(notification => {return notification.channelID === this.$store.getters.selectedChannelID});
      if (find && find.count >= 1) {
        this.$socket.emit('notification:dismiss', {channelID: this.$store.getters.selectedChannelID});
      }   
    }
  },
  beforeDestroy() {
    bus.$off('newMessage', this.hideTypingStatus);
    delete this.$options.sockets.typingStatus;
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    channel() {
      return this.$store.getters.channels[this.selectedChannelID];
    },
    messages() {
      return this.$store.getters.messages;
    },
    selectedChannelID() {
      return this.$store.getters.selectedChannelID
    },
    channelName() {
      return this.$store.getters.channelName;
    }
  }
}
</script>



<style scoped>


.typing-animate-enter-active {
  transition: .10s;
}
.typing-animate-enter /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(3px)
}
.typing-animate-leave-to {
  opacity: 0;
  transform: translateY(-3px)
}
.error-info {
  color: red;
}

.heading{
    border-bottom: solid 2px white;
    margin: 5px;
    height: 40px;
    padding-bottom: 2spx;
    display: flex;
    flex-shrink: 0;
}

.show-menu-button{
  display: inline-block;
  margin: auto;
  color: white;
  margin-left: 10px;
  margin-right: 5px;
  margin-top: 8px;
  user-select: none;
  display: none;
}

.heading .current-channel{
  color: white;
  font-size: 20px;
  margin: auto;
  margin-left: 5px;
  flex: 1;
  padding: 5px;
}

.right-panel {
    height: 100%;
    background-color: rgba(0, 0, 0, 0.507);
    flex: 1;
    display: flex;
    flex-direction: column;
}
.message-logs{
    overflow: auto;
    flex: 1;
}
.message-logs, .message-logs .scroll {transform: scale(1,-1);}

.loading{
  overflow: auto;
  flex: 1;
}
.chat-input-area{
    display: flex;
    flex-direction: column;
    padding-top: 10px;
    margin-bottom: 5px;
}
.chat-input-area .info{
  color: white;
  font-size: 12px;
  margin-left: 25px;
  margin-top: 5px;
  display: flex;
}
.typing-outer{
  flex: 1;
  height: 20px;
}
.message-count {
  float: right;
  margin-right: 30px;
  margin-top: 3px;
}
.message-area{
  display: flex;
  width: 100%;
}
.chat-input{
    font-family: 'Roboto', sans-serif;
    background: rgba(0, 0, 0, 0.158);
    color: white;
    flex: 1;
    height: 20px;
    padding: 10px;
    margin: auto;
    margin-left: 20px;
    font-size: 15px;
    resize: none;
    border: none;
    outline: none;
    padding-left: 10px;
    transition: 0.3s;
}

.chat-input:hover{
    background: rgba(0, 0, 0, 0.288);
}

.chat-input:focus{
    background: rgba(0, 0, 0, 0.466);
}

.send-button{
    font-size: 20px;
    color:white;
    background: rgba(0, 0, 0, 0.274);
    border: none;
    outline: none;
    margin: auto;
    margin-left: 2px;
    margin-right: 20px;
    height: 40px;
    transition: 0.3s;

}
.send-button:hover{
  background: rgba(0, 0, 0, 0.514);
}
.error-send-button {
  background-color: rgba(255, 0, 0, 0.294);
}

.error-send-button:hover {
  background-color: rgba(255, 0, 0, 0.294);
}
@media (max-width: 600px) {
  .show-menu-button{
    display: block;
  }
}
</style>


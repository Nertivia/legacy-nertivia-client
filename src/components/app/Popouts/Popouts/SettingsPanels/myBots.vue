<template>
  <div class="panel">
    <manage-bot
      v-if="clickedBotIndex !== undefined"
      @update="updateBot"
      :bot="bots[clickedBotIndex]"
      @back="clickedBotIndex = undefined"
    />
    <div class="content" v-else>
      <error-list v-if="errors" :errors="errors" />
      <div class="title main">
        {{ $t("mybots-notice") }}
      </div>
      <div class="button" @click="createBotButton">Create Bot</div>
      <div class="sub-head">{{ $t("your-bots") }}</div>
      <div class="bots-list">
        <div
          class="bot"
          v-for="(bot, i) in botsReverse"
          :key="bot.uniqueID"
          @click="clickedBotIndex = i"
        >
          <profile-picture
            :uniqueID="bot.uniqueID"
            :avatar="bot.avatar"
            size="30px"
            :hover="true"
            animation-padding="4px"
          />
          <div class="username">
            {{ bot.username }}<span class="tag">:{{ bot.tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfilePicture from "@/components/global/ProfilePictureTemplate.vue";
import ErrorList from "@/components/app/errorsListTemplate";
import manageBot from "./manageBot/Manage";
import botsService from "@/services/botsService";

export default {
  components: { manageBot, ProfilePicture, ErrorList },
  data() {
    return {
      bots: [],
      clickedBotIndex: undefined,
      errors: undefined
    };
  },
  methods: {
    updateBot(data) {
      this.$set(this.bots, this.clickedBotIndex, {
        ...this.bots[this.clickedBotIndex],
        ...data
      });
    },
    async createBotButton() {
      const { result, ok, error } = await botsService.createBot();
      if (ok) {
        this.bots.push(result.data);
      } else {
        if (error.response === undefined) {
          this.errors = [{ msg: "Cannot connect to server. Try again later." }];
        } else {
          this.errors = [{ msg: error.response.data.message }];
        }
      }
    },
    async getBots() {
      const { result } = await botsService.getBots();
      this.bots = result.data;
    }
  },
  mounted() {
    this.getBots();
  },
  computed: {
    botsReverse() {
      const bots = this.bots;
      return bots.reverse();
    }
  }
};
</script>

<style scoped lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.content {
  display: flex;
  overflow: hidden;
  flex-direction: column;
}
.title.main {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 10px;
}
.button {
  background: linear-gradient(
    137deg,
    rgba(45, 136, 255, 1) 0%,
    rgba(87, 160, 255, 1) 100%
  );
  align-self: center;
  padding: 5px;
  border-radius: 4px;
  user-select: none;
  cursor: pointer;
  transition: 0.2s;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
}
.sub-head {
  margin-left: 10px;
  font-size: 15px;
  font-weight: bold;
}
.bots-list {
  overflow: auto;
  margin-top: 10px;
  .bot {
    cursor: pointer;
    user-select: none;
    display: flex;
    align-content: center;
    align-items: center;
    transition: 0.2s;
    padding-left: 5px;
    .username {
      font-size: 14px;
      margin-left: 5px;
    }
    .tag {
      opacity: 0.8;
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>

<template>
  <div class="my-profile-panel">
    <div class="message-example">
      <message-template
        message="Hi"
        :username="user.username"
        :date="Date.now()"
        :unique-i-d="user.uniqueID"
        :admin="user.admin"
        :avatar="user.avatar"
      />
      <message-template
        message="Hello."
        username="Cool Dude"
        :date="Date.now()"
      />
      <message-template
        message="Whaddup"
        :username="user.username"
        :date="Date.now()"
        :unique-i-d="user.uniqueID"
        :admin="user.admin"
        :avatar="user.avatar"
      />
      <message-template
        message="Nothing, bye."
        username="Cool Dude"
        :date="Date.now()"
      />
    </div>
    <div class="options">
      <div class="title">
        Options
      </div>
      <div class="switches">
        <div class="checkbox" @click="toggleAppearance">
          <div
            :class="
              `checkbox-box ${
                apperance &&
                apperance.own_message_right &&
                apperance.own_message_right === true
                  ? 'selected'
                  : ''
              }`
            "
          />
          <div class="checkbox-name">
            Show my messages on the right side.
          </div>
        </div>
        <div class="checkbox" @click="toggleTime">
          <div
            :class="
              `checkbox-box ${
                apperance &&
                apperance['12h_time'] &&
                apperance['12h_time'] === true
                  ? 'selected'
                  : ''
              }`
            "
          />
          <div class="checkbox-name">
            Show time in 12 hour.
          </div>
        </div>
      </div>
    </div>
    <div class="title">
      Message Themes (Soon!)
    </div>
  </div>
</template>

<script>
import MessageTemplate from "@/components/app/MessageTemplate.vue";
import SettingsService from "@/services/settingsService.js";

export default {
  components: {
    MessageTemplate
  },
  data() {
    return {};
  },
  computed: {
    apperance() {
      return this.$store.getters["settingsModule/settings"].apperance;
    },
    user() {
      return this.$store.getters.user;
    }
  },
  methods: {
    toggleTime() {
      if (
        !this.apperance ||
        !this.apperance["12h_time"] ||
        this.apperance["12h_time"] === false
      ) {
        this.$store.dispatch("settingsModule/setApperance", {
          "12h_time": true
        });
        return SettingsService.setApperance("12h_time", true);
      }
      this.$store.dispatch("settingsModule/setApperance", {
        "12h_time": false
      });
      SettingsService.setApperance("12h_time", false);
    },
    toggleAppearance() {
      if (
        !this.apperance ||
        !this.apperance.own_message_right ||
        this.apperance.own_message_right === false
      ) {
        this.$store.dispatch("settingsModule/setApperance", {
          own_message_right: true
        });
        return SettingsService.setApperance("own_message_right", true);
      }
      this.$store.dispatch("settingsModule/setApperance", {
        own_message_right: false
      });
      SettingsService.setApperance("own_message_right", false);
    }
  }
};
</script>
<style scoped>
.switches {
  display: flex;
  margin: 20px;
  user-select: none;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.checkbox {
  display: flex;
  cursor: pointer;
}
.checkbox-box {
  background: rgba(88, 88, 88, 0.74);
  height: 20px;
  width: 20px;
  margin: auto;
  margin-right: 10px;
  transition: 0.3s;
  flex-shrink: 0;
}

.checkbox-box.selected {
  background: rgba(66, 122, 244, 0.74);
}

.checkbox-box.selected:hover {
  background: rgba(66, 122, 244, 0.94);
}

.checkbox-box:hover {
  background: rgba(88, 88, 88, 0.94);
}
.checkbox-name {
  max-width: 200px;
  display: flex;
  align-items: center;
}

.message-example {
  padding: 10px;
  background: linear-gradient(#0b4155, #01677e);
}
.title {
  font-size: 20px;
  text-align: center;
  margin-bottom: 5px;
}

.hidden {
  display: none;
}
.my-profile-panel {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow: auto;
}

.options {
  background-color: #023643;
  padding-top: 5px;
}
</style>

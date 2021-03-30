<template>
  <div class="my-profile-panel message-design">
    <div class="message-example">
      <message-template
        :message="{ message: 'Hi', created: Date.now() }"
        :creator="user"
        :date="Date.now()"
      />
      <message-template
        :message="{ message: 'Hello.', created: Date.now() }"
        :creator="dummyUser"
        :date="Date.now()"
      />
      <message-template
        :message="{ message: 'Whaddup', created: Date.now() }"
        :creator="user"
        :date="Date.now()"
      />
      <message-template
        :message="{ message: 'Nothing, bye.', created: Date.now() }"
        :creator="dummyUser"
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
    return {
      dummyUser: {
        username: "Cool Dude",
        uniqueID: "dummy"
      }
    };
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
  flex-direction: column;
  margin: 20px;
  user-select: none;
  flex-shrink: 0;
  flex-wrap: wrap;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.checkbox {
  display: flex;
  cursor: pointer;
  margin-bottom: 10px;
}
.checkbox-box {
  background: rgba(255, 255, 255, 0.1);
  height: 20px;
  border-radius: 4px;
  width: 20px;
  margin-right: 10px;
  transition: 0.3s;
  flex-shrink: 0;
  align-self: center;
}

.checkbox-box.selected {
  background: rgba(255, 255, 255, 0.74);
}

.checkbox-box.selected:hover {
  background: rgba(255, 255, 255, 0.94);
}

.checkbox-box:hover {
  background: rgba(255, 255, 255, 0.2);
}
.checkbox-name {
  max-width: 200px;
  display: flex;
  align-items: center;
}

.message-example {
  padding: 10px;
  border-bottom: solid 1px rgba(255, 255, 255, 0.6);
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
  padding-top: 5px;
}
</style>

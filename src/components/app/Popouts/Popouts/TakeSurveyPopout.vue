<template>
  <div class="darken-background take-survey-popout">
    <div class="box">
      <div class="survay-icon">
        <i class="material-icons">error</i>
      </div>
      <div class="text">
        There is a survey you can complete about yourself. Would you like to
        take it?
      </div>
      <div class="text">
        You can always take the survey again by going to settings.
      </div>
      <div class="buttons">
        <div class="button warning" @click="laterButtonClickEvent">
          Later
        </div>
        <div class="button valid" @click="TakeThereClickEvent">
          Take Me There
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userService from "@/services/userService.js";

export default {
  methods: {
    close() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "surveyPopout",
        visibility: false
      });
    },
    laterButtonClickEvent() {
      userService.skipSurvey();
      this.$store.dispatch("surveyCompleted");
      this.close();
    },
    TakeThereClickEvent() {
      this.close();
      this.$store.dispatch("surveyCompleted");
      this.$store.dispatch("setPopoutVisibility", {
        name: "settings",
        visibility: true
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/global";
.darken-background {
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999999;
  display: flex;
  color: white;
}
.box {
  height: 330px;
  width: 400px;
  display: flex;
  flex-direction: column;
  margin: auto;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.507);
  padding: 10px;
  overflow: hidden;
  box-shadow: 0px 0px 20px 5px #151515bd;
  background: $other-box-color;
  border-radius: 4px;
  backdrop-filter: blur(5px);
}
.survay-icon .material-icons {
  color: white;
  font-size: 70px;
}
.survay-icon {
  margin: auto;
  margin-top: 5px;
  margin-bottom: 10px;
}

.text {
  margin: auto;
  text-align: center;
  margin-top: 10px;
}
.buttons {
  display: flex;
  margin: auto;
}
.button {
  padding: 10px;
  margin: 3px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  transition: 0.3s;
  user-select: none;
  cursor: pointer;
}
.valid {
  background: $primary-button-color;
  opacity: 0.8;
}
.valid:hover {
  opacity: 1;
}
.warning {
  background: rgba(255, 67, 67, 0.7);
}
.warning:hover {
  background: rgba(255, 67, 67, 0.9);
}

</style>

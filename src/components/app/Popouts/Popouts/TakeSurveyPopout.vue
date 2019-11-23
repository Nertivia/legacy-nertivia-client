<template>
  <div class="darken-background">
    <div class="box">
      <div class="survay-icon">
        <i class="material-icons">error</i>
      </div>
      <div class="text">
        There is a survey you can complete about yourself. Would you like to take it?
      </div>
      <div class="text">
        You can always take the survey again by going to settings.
      </div>
      <div class="buttons">
        <div
          class="button warning"
          @click="laterButtonClickEvent"
        >
          Later
        </div>
        <div
          class="button valid"
          @click="TakeThereClickEvent"
        >
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
    laterButtonClickEvent(){
      userService.skipSurvey()
      this.$store.dispatch('surveyCompleted')
      this.close();
    },
    TakeThereClickEvent(){
      this.close();
      this.$store.dispatch('surveyCompleted')
      this.$store.dispatch('setPopoutVisibility', {name: 'settings', visibility: true})
    }
  }
};
</script>


<style scoped>
.darken-background {
  position: absolute;
  background: rgba(0, 0, 0, 0.541);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
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
  background: linear-gradient(#0B4155, #01677E);
  border-radius: 4px;
}
.survay-icon .material-icons{
  color: white;
  font-size: 120px;
}
.survay-icon {
  margin: auto;
  margin-top: 5px;
}

.text {
  margin: auto;
  text-align: center;
}
.buttons {
  display: flex;
  margin: auto;
}
.button {
  padding: 10px;
  margin: 3px;
  background: #014656;
  transition: 0.3s;
  user-select: none;
  cursor: pointer;
}
.valid {
  background: #014656;
}
.valid:hover{
  background: #02303c;
}
.warning {
  background: rgba(255, 27, 27, 0.589)
}
.warning:hover{
  background: rgb(255, 27, 27)
}
</style>


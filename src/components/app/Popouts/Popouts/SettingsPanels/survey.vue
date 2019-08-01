<template>
  <div class="survey" >
    <div class="title"><i class="material-icons">error</i>Take Survey</div>
    <div class="notice">Note: Everyone will be able to see your survey in your profile.</div>
    <div class="survey-inner">
      <div class="survey-content">
        <div class="left">
          <!-- name -->
          <div class="input">
            <div class="input-title">Name</div>
            <input type="text" placeholder="Name">
          </div>
          <!-- Gender -->
          <drop-down class="dropdown" :items="surveyItems.gender" :noneSelect="true" name="Gender"/>
          <!-- Age -->
          <drop-down class="dropdown" :items="surveyItems.age" :noneSelect="true" name="Age"/>
        </div>
        <div class="right">
          <!-- Continent -->
          <drop-down class="dropdown" :items="surveyItems.continents" :noneSelect="true" name="Continent"/>
          <!-- Countries -->
          <drop-down class="dropdown" :items="surveyItems.countries" :noneSelect="true" name="Country"/>
          <!-- About me --> 
          <div class="input">
            <div class="input-title">About me</div>
            <textarea placeholder="I like cats and dogs." />
          </div>       
        </div>
      </div>


      <div class="survey-warning" v-if="surveyErrorMessage">{{ surveyErrorMessage }}</div>
      <div class="survey-valid" v-if="surveyValidMessage">{{ surveyValidMessage }}</div>
      <div class="button" @click="surveySubmitButton">Save</div>
    </div>
  </div>
</template>

<script>
import DropDown from './../ServerSettingsPanels/DropDownMenu';
import surveyItems from "@/utils/surveyItems.js";
import userService from "@/services/userService.js";
export default {
  components: { DropDown },
  data() {
    return {
      surveyItems: surveyItems,
      surveyErrorMessage: null,
      surveyValidMessage: null,

      // selected: {
      //   name: "",
      //   gender: null,
      //   age: null,
      //   continent: null,
      //   country: null,
      //   about_me: ""
      // }
    };
  },
  computed: {

  },
  async mounted() {
    const { ok, error, result } = await userService.getSurvey();
    if (ok) {

    }
    this.previousLoaded = true;
  },
  methods: {
    async surveySubmitButton() {
      this.surveyValidMessage = null;
      this.surveyErrorMessage = null;
      //checks if all drop boxes are not null.
      for (let item in this.selected) {
        if (this.selected[item] === null && item !== "country") {
          this.surveyErrorMessage =
            "Make sure you select / fill in all fields!";
          return;
        }
      }
      //checks if all values are not null
      if (
        this.selected.name.trim() === "" ||
        this.selected.about_me.trim() === ""
      ) {
        this.surveyErrorMessage = "Make sure you select / fill in all fields!";
        return;
      }
      this.surveyValidMessage = "Saving...";
      //gets the country index after unfiltering.
      let countryIndex = undefined;
      if (this.filterCountry[this.selected.country]) {
        const selectedCountryName = this.filterCountry[this.selected.country]
          .name;
        countryIndex = this.surveyItems.countries.findIndex(
          el => el.name == selectedCountryName
        );
      }
      if (this.selected.name && this.selected.name.length > 100) {
        this.surveyErrorMessage = "Name must be less that 100 characters.";
        this.surveyValidMessage = null;
        return;
      }
      if (this.selected.about_me && this.selected.about_me.length > 500) {
        this.surveyErrorMessage = "About me must be less that 500 characters.";
        this.surveyValidMessage = null;
        return;
      }

      const { ok, error, result } = await userService.setSurvey({
        name: this.selected.name,
        gender: this.selected.gender,
        age: this.selected.age,
        continent: this.selected.continent,
        country: countryIndex,
        about_me: this.selected.about_me
      });
      if (ok) {
        this.surveyValidMessage = "Saved!";
      } else {
        this.surveyValidMessage = null;
        this.surveyErrorMessage = error.response.data.message;
      }
    }
  }
};
</script>

<style scoped>
.notice {
  color: grey;
  font-size: 15px;
  margin-top: 20px;
  margin-left: 30px;
  user-select: none;
}

.survey-title {
  margin-top: 10px;
  user-select: none;
}

.survey {
  height: 100%;
  overflow: auto;
  align-items: center;
  width: 100%;
}
.survey {
  display: flex;
  flex-direction: column;
}
.survey-inner {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

}

.survey-content {
  display: flex;
}

.left{
  display: flex;
  flex-direction: column;
  flex: 1;
}
.right {
  display: flex; 
  flex-direction: column;
  flex: 1;
}

.dropdown {
  margin: 10px;
  margin-left: 30px;
  margin-right: 30px;
}

.survey-warning {
  color: red;
  margin-bottom: 10px;
}
.survey-valid {
  color: green;
  margin-bottom: 10px;
}
.survey .button {
  color: white;
  background: rgb(27, 114, 255);
  border-radius: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: center;
  transition: 0.3s;
  user-select: none;
  cursor: default;
}
.survey .button:hover {
  background: rgb(0, 98, 255);
}


.title {
  margin-top: 30px;
  display: flex;
  align-content: center;
  align-items: center;
  margin-left: 25px;
  font-size: 20px;
  user-select: none;
}
.title .material-icons {
  color: cyan;
  margin-right: 10px;
  font-size: 30px;
}

.input {
  display: flex;
  flex-direction: column;
  background-color: rgb(44, 44, 44);
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  margin-left: 30px;
  margin-right: 30px;
  padding-bottom: 0;
}
.input input {
  width: initial;
  border-radius: 5px;
  margin-top: 2px;
}
textarea {
  padding: 10px;
  resize: none;
  background: rgba(0, 0, 0, 0.301);
  border: none;
  outline: none;
  border-radius: 5px;
  color: white;
  height: 100px;
  margin-bottom: 10px;
  margin-top: 2px;
  transition: 0.3s;
}
textarea:hover {
  background: rgba(0, 0, 0, 0.401);
}
</style>
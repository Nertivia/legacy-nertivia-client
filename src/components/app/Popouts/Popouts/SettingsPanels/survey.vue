<template>
  <div class="survey" v-show="previousLoaded">
    <div class="title">
      <i class="material-icons">error</i>
      Take Survey
    </div>
    <div class="notice">Note: Everyone will be able to see your survey in your profile.</div>
    <div class="survey-inner">
      <!-- name -->
      <div class="survey-box">
        <div class="survey-title">What's your name?</div>
        <input class="survey-input" v-model="selected.name" type="text" placeholder="Name">
      </div>
      <!-- Gender -->
      <div class="survey-box">
        <drop-down
          name="What is your gender?"
          v-model="selected.gender"
          :items="surveyItems.gender"
        />
      </div>
      <!-- Age -->
      <div class="survey-box">
        <drop-down name="What is your age?" v-model="selected.age" :items="surveyItems.age"/>
      </div>
      <!-- Continent -->
      <div class="survey-box">
        <drop-down
          name="Pick a continent"
          v-model="selected.continent"
          :items="surveyItems.continents"
        />
      </div>
      <!-- Countries -->
      <div class="survey-box">
        <drop-down
          name="Pick a country"
          v-if="selected.continent != null"
          v-model="selected.country"
          :items="filterCountry"
        />
      </div>
      <!-- About me -->
      <div class="survey-box">
        <div class="survey-title">About me (Formatting allowed)</div>
        <textarea
          class="survey-input textarea"
          v-model="selected.about_me"
          placeholder="Hobbies, games, animals"
        ></textarea>
      </div>
      <div class="survey-warning" v-if="surveyErrorMessage">{{surveyErrorMessage}}</div>
      <div class="survey-valid" v-if="surveyValidMessage">{{surveyValidMessage}}</div>
      <div class="button" @click="surveySubmitButton">Save</div>
    </div>
  </div>
</template>

<script>
import surveyItems from "@/utils/surveyItems.js";
import DropDown from "./DropDownTemplate.vue";
import userService from "@/services/userService.js";
export default {
  components: { DropDown },
  data() {
    return {
      surveyItems: Object.assign({},surveyItems),
      surveyErrorMessage: null,
      surveyValidMessage: null,
      previousLoaded: false,
      selected: {
        name: "",
        gender: null,
        age: null,
        continent: null,
        country: null,
        about_me: ""
      }
    };
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
      if ( this.selected.name.trim() === "" || this.selected.about_me.trim() === "") {
        this.surveyErrorMessage = "Make sure you select / fill in all fields!";
        return;
      }
      this.surveyValidMessage = "Saving..."
      //gets the country index after unfiltering.
      let countryIndex = undefined;
      if (this.filterCountry[this.selected.country]) {
        const selectedCountryName = this.filterCountry[this.selected.country].name;
        countryIndex = this.surveyItems.countries.findIndex(el => el.name == selectedCountryName);
      }
      if (this.selected.name && this.selected.name.length >100) {
        this.surveyErrorMessage = "Name must be less that 100 characters."
        this.surveyValidMessage = null;
        return;
      }
      if (this.selected.about_me && this.selected.about_me.length >500) {
        this.surveyErrorMessage = "About me must be less that 500 characters."
        this.surveyValidMessage = null
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
        this.surveyValidMessage = "Saved!"
			} else {
        this.surveyValidMessage = null;
				this.surveyErrorMessage = error.response.data.message
			}
    }
  },
  async mounted(){
    const {ok, error, result} = await userService.getSurvey();
    if (ok) {
      this.selected.continent = result.data.result.continent
        this.selected.age = result.data.result.age
        this.selected.name = result.data.result.name
        this.selected.about_me = result.data.result.about_me
        this.selected.gender = result.data.result.gender
        //filter the country
        if(result.data.result.country) {
          setTimeout(() => {
            const continentCode = surveyItems.continents[this.selected.continent].code;
            const filter = surveyItems.countries.filter(e => e.code === continentCode);
            const countryName = surveyItems.countries[result.data.result.country].name;
            this.selected.country = filter.findIndex(e => e.name === countryName);
          }, 500);
        }
    }
    this.previousLoaded = true;
  },
  computed: {
    filterCountry() {
      const selectedContinentIndex = this.selected.continent;
      const selectedContinent = this.surveyItems.continents[
        selectedContinentIndex
      ];
      const code = selectedContinent.code;
      
      return this.surveyItems.countries.filter(element => {
        return element.code == code || !element.code;
      });
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
.survey, .survey-inner {
  display: flex;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 50px;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
}

.survey-warning {
  color: red;
  margin-bottom: 10px;
}
.survey-valid{
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
.survey-input {
  height: 24px;
  padding: 10px;
  background: rgba(61, 61, 61, 0.863);
  margin-top: 5px;
  border-radius: 5px;
	transition: 0.3s;
}
.survey-input:hover {
  background: rgba(73, 73, 73, 0.863);
}
.survey-input.textarea {
  resize: none;
  color: white;
  outline: none;
  border: none;
  width: 200px;
  height: 100px;
	transition: 0.3s;
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
</style>

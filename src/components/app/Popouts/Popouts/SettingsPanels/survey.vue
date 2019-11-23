<template>
  <div class="survey">
    <div class="inner-content">
      <div class="title">
        <i class="material-icons">error</i>Take Survey
      </div>
      <div class="notice">Note: Everyone will be able to see your survey in your profile.</div>
      <spinner v-if="!loaded" />
      <div class="survey-inner" v-if="loaded">
        <div class="survey-content">
          <div class="left">
            <!-- name -->
            <div class="input">
              <div class="input-title">Name</div>
              <input type="text" placeholder="Name" v-model="items.name" />
            </div>
            <!-- Gender -->
            <drop-down
              class="dropdown"
              :items="surveyItems.gender"
              selectBy="name"
              :selectedItem="items.gender"
              :noneSelect="true"
              name="Gender"
              @change="changeEvent('gender', $event)"
            />
            <!-- Age -->
            <drop-down
              class="dropdown"
              :items="surveyItems.age"
              selectBy="name"
              :selectedItem="items.age"
              :noneSelect="true"
              name="Age"
              @change="changeEvent('age', $event)"
            />
          </div>
          <div class="right">
            <!-- Continent -->
            <drop-down
              class="dropdown"
              :items="surveyItems.continents"
              selectBy="name"
              :selectedItem="items.continent"
              :noneSelect="true"
              name="Continent"
              @change="changeEvent('continent', $event)"
            />
            <!-- Countries -->
            <drop-down
              class="dropdown"
              v-if="filterCountries"
              :items="filterCountries"
              selectBy="name"
              :selectedItem="items.country"
              :noneSelect="true"
              name="Country"
              @change="changeEvent('country', $event)"
            />
            <!-- About me -->
            <div class="input">
              <div class="input-title">About me</div>
              <textarea placeholder="I like cats and dogs." v-model="items.about_me" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="survey-warning" v-if="surveyErrorMessage">{{ surveyErrorMessage }}</div>
    <div class="survey-valid" v-if="surveyValidMessage">{{ surveyValidMessage }}</div>
    <div class="button" v-if="loaded" @click="surveySubmitButton">Save</div>
  </div>
</template>

<script>
import DropDown from "./../ServerSettingsPanels/DropDownMenu";
import surveyItems from "@/utils/surveyItems.js";
import userService from "@/services/userService.js";
import Spinner from "@/components/Spinner";
export default {
  components: { DropDown, Spinner },
  data() {
    return {
      surveyItems: surveyItems,
      surveyErrorMessage: null,
      surveyValidMessage: null,
      loaded: false,
      items: {
        about_me: null,
        name: null
      }
    };
  },
  async mounted() {
    const { ok, error, result } = await userService.getSurvey();
    if (!ok) {
      if (error.response === undefined) {
        return;
      }
      this.loaded = true;
      return;
    }
    this.$set(this, "items", Object.assign({}, this.items, result.data.result));
    this.loaded = true;
  },
  methods: {
    changeEvent(name, item) {
      if (name === "continent") {
        this.$set(this.items, "country", null);
      }
      this.$set(this.items, name, item.name);
    },
    async surveySubmitButton() {
      this.surveyValidMessage = null;
      this.surveyErrorMessage = null;

      this.surveyValidMessage = "Saving...";
      //gets the country index after unfiltering.

      if (this.items.name && this.items.name.length > 100) {
        this.surveyErrorMessage = "Name must be less that 100 characters.";
        this.surveyValidMessage = null;
        return;
      }
      if (this.items.about_me && this.items.about_me.length > 500) {
        this.surveyErrorMessage = "About me must be less that 500 characters.";
        this.surveyValidMessage = null;
        return;
      }

      const { ok, error, result } = await userService.setSurvey(this.items);
      if (ok) {
        this.surveyValidMessage = "Saved!";
      } else {
        this.surveyValidMessage = null;
        this.surveyErrorMessage =
          error.response.data.message || error.response.data;
      }
    }
  },
  computed: {
    filterCountries() {
      if (!this.items.continent || this.items.continent === "Rather not say")
        return null;
      const continent = this.surveyItems.continents.find(
        c => c.name === this.items.continent
      );
      if (!continent) return null;
      return [
        ...this.surveyItems.countries.filter(c => c.code === continent.code),
        ...[{ emoji: "😶", name: "Rather not say", code: "no" }]
      ];
    }
  }
};
</script>

<style scoped>
.notice {
  color: rgb(216, 216, 216);
  font-size: 15px;
  margin-top: 10px;
  margin-left: 30px;
  user-select: none;
}

.survey-title {
  margin-top: 10px;
  user-select: none;
}

.survey {
  height: 100%;
  align-items: center;
  width: 100%;
}
.survey {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.survey-inner {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.inner-content {
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 100%;
  height: 100%;
}

.survey-content {
  display: flex;
}

.left {
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-shrink: 0;
}
.right {
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-shrink: 0;
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
  background: #024554;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: center;
  transition: 0.3s;
  user-select: none;
  cursor: pointer;
}
.survey .button:hover {
  background: #02303c;
}

.title {
  margin-top: 20px;
  display: flex;
  align-content: center;
  align-items: center;
  margin-left: 25px;
  font-size: 20px;
  user-select: none;
}
.title .material-icons {
  margin-right: 5px;
  font-size: 30px;
}

.input {
  display: flex;
  flex-direction: column;
  background-color: #044050;
  padding: 10px;
  margin: 10px;
  margin-left: 30px;
  margin-right: 30px;
  padding-bottom: 0;
}
.input input {
  width: initial;
  margin-top: 2px;
  background: #032d38;
}
textarea {
  padding: 10px;
  resize: none;
  background: #032d38;
  border: none;
  outline: none;
  color: white;
  height: 100px;
  margin-bottom: 10px;
  margin-top: 2px;
  transition: 0.3s;
}
textarea:hover {
  background: rgba(0, 0, 0, 0.401);
}

@media (max-width: 764px) {
  .survey-content {
    flex-direction: column;
  }
}
</style>
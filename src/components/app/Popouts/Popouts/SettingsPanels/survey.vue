<template>
  <div class="survey">
    <div class="inner-content">
      <div class="title"><i class="material-icons">error</i>Take Survey</div>
      <div class="notice">
        Note: Everyone will be able to see your survey in your profile.
      </div>
      <spinner v-if="!loaded" />
      <div class="survey-inner" v-if="loaded">
        <div class="survey-content">
          <div class="left">
            <!-- name -->
            <custom-input theme="light" class="input" name="Name" v-model="items.name"/>
            
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
            <custom-input theme="light" class="input" name="About me" type="textarea" v-model="items.about_me"/>
          </div>
        </div>
      </div>
    </div>
    <div class="survey-warning" v-if="surveyErrorMessage">
      {{ surveyErrorMessage }}
    </div>
    <div class="survey-valid" v-if="surveyValidMessage">
      {{ surveyValidMessage }}
    </div>
    <div class="button" v-if="loaded" @click="surveySubmitButton">Save</div>
  </div>
</template>

<script>
import DropDown from "./../ServerSettingsPanels/DropDownMenu";
import surveyItems from "@/utils/surveyItems.js";
import userService from "@/services/userService.js";
import Spinner from "@/components/global/Spinner";
import CustomInput from '@/components/global/CustomInput';
export default {
  components: { DropDown, Spinner, CustomInput },
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

      const { ok, error } = await userService.setSurvey(this.items);
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

<style scoped lang="scss">
@import "@/styles/global.scss";
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
  margin-top: 20px;
}

.left {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: flex-end;
  align-content: flex-end;
  .input {
    align-self: flex-end;
  }
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
  width: 200px;
}

.survey-warning {
  color: red;
  margin-bottom: 10px;
}
.survey-valid {
  color: #54ff54;
  margin-bottom: 10px;
}
.survey .button {
  color: white;
  background: $primary-button-color;
  opacity: 0.8;
  padding-top: 10px;
  padding-bottom: 10px;
  z-index: 99999;
  width: 120px;
  text-align: center;
  transition: 0.3s;
  user-select: none;
  cursor: pointer;
  flex-shrink: 0;
  margin: auto;
  margin-bottom: 10px;
  align-self: flex-end;

  border-radius: 4px;
}
.survey .button:hover {
  opacity: 1;
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
  margin: 10px;
  margin-left: 30px;
  width: 200px;
  margin-right: 30px;
}
textarea {
  padding: 10px;
  resize: none;
  background-color: rgba(0, 0, 0, 0.4);
  border: none;
  outline: none;
  color: white;
  height: 100px;
  margin-bottom: 10px;
  margin-top: 2px;
  transition: 0.3s;
  border-radius: 4px;
}
textarea:hover {
  background: rgba(0, 0, 0, 0.401);
}

@media (max-width: 764px) {
  .survey-content {
    flex-direction: column;
  }
  .left, .right {
    align-items: center;
    align-items: center;
    .input {
      align-self: center;
    }
  }
}
</style>

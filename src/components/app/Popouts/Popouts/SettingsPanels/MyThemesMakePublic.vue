<template>
  <div class="make-public">
    <Spinner v-if="details === null" />
    <div v-else class="main-container" ref="scroll">
      <div class="notice">
        <strong>Note:</strong> Making your theme public requires reviewing. This
        may take some days to review.
      </div>
      <ErrorList v-if="errors" :errors="errors" />
      <div class="container">
        <div class="block">
          Theme Status
          <div v-if="details === false"><strong>Not published</strong></div>
          <div class="warn" v-else-if="details.updatedCss">
            <strong>Update Getting Reviewed.</strong>
          </div>
          <div class="warn" v-else-if="details.approved === false">
            <strong>Getting Reviewed.</strong>
          </div>
          <div class="valid" v-else><strong>Theme is public!</strong></div>
        </div>
        <div class="block">
          Name:
          <div>
            <strong>{{ name }}</strong>
          </div>
        </div>
        <div class="block">
          Theme Preview
          <div
            class="preview"
            :style="{
              backgroundImage: `url(${update.screenshot ||
                (details ? `${screenshotDomain}${details.screenshot}` : '')})`
            }"
          />
          <div class="button" @click="$refs.screenshotBrowser.click()">
            Upload
          </div>
          <input
            ref="screenshotBrowser"
            type="file"
            accept=".jpeg, .jpg, .png, .gif"
            class="hidden"
            @change="screenshotBrowseChange"
          />
        </div>
        <div class="input">
          <div
            class="title"
            v-if="update.description === undefined && !details"
          >
            Description (0/150)
          </div>
          <div class="title" v-if="update.description !== undefined">
            Description (<span
              :class="{ warn: update.description.length > 150 }"
              >{{ update.description.length }}</span
            >/150)
          </div>
          <div class="title" v-if="update.description === undefined && details">
            Description (<span
              :class="{ warn: details.description.length > 150 }"
              >{{ details.description.length }}</span
            >/150)
          </div>
          <textarea
            placeholder="Description"
            :default-value.prop="details.description || ''"
            @input="descriptionInput"
          ></textarea>
        </div>
        <div class="buttons">
          <div class="button" @click="backButton">Back</div>
          <div class="button" v-if="details" @click="updateButton">
            {{ submitClicked ? "Updating..." : "Update" }}
          </div>
          <div class="button" @click="sendForReviewButton" v-else>
            {{ submitClicked ? "Sending..." : "Send For Review" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "@/components/global/Spinner";
import ErrorList from "@/components/app/errorsListTemplate";
import path from "path";
import config from "@/config.js";
import exploreService from "@/services/exploreService";
export default {
  components: { Spinner, ErrorList },
  props: ["themeID", "name"],
  data() {
    return {
      update: {},
      errors: null,
      success: null,
      details: null,
      screenshotDomain: config.domain + "/media/",
      submitClicked: false
    };
  },
  methods: {
    async updateButton() {
      this.errors = null;
      if (this.submitClicked === true) return;
      this.submitClicked = true;

      const { result, ok, error } = await exploreService.updateTheme(
        this.themeID,
        this.update
      );
      if (!ok) {
        if (error.response.data.message) {
          this.errors = [{ msg: error.response.data.message }];
        } else {
          this.errors = error.response.data.errors;
        }
      } else {
        this.details = result.data;
      }
      this.submitClicked = false;
      this.$refs.scroll.scrollTo({ top: 0, behavior: "smooth" });
    },
    async sendForReviewButton() {
      this.errors = null;
      if (this.submitClicked === true) return;
      this.submitClicked = true;

      const { result, ok, error } = await exploreService.addTheme(
        this.themeID,
        this.update
      );
      if (!ok) {
        if (error.response.data.message) {
          this.errors = [{ msg: error.response.data.message }];
        } else {
          this.errors = error.response.data.errors;
        }
      } else {
        this.details = result.data;
      }
      this.submitClicked = false;
      this.$refs.scroll.scrollTo({ top: 0, behavior: "smooth" });
    },
    screenshotBrowseChange(event) {
      if (!this.googleDriveLinked) {
        event.target.value = "";
        return this.$store.dispatch("setPopoutVisibility", {
          name: "GDLinkMenu",
          visibility: true
        });
      }
      const file = event.target.files[0];

      const _this = this;
      const maxSize = 2092000;
      if (file.size > maxSize) {
        return this.$store.dispatch(
          "setGenericMessage",
          "Image is larger than 2MB"
        );
      }
      event.target.value = "";
      const allowedFormats = [".png", ".jpeg", ".gif", ".jpg"];
      if (!allowedFormats.includes(path.extname(file.name).toLowerCase())) {
        return this.$store.dispatch(
          "setGenericMessage",
          "That file format is not allowed!"
        );
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function() {
        _this.$set(_this.update, "screenshot", reader.result);
      };
      reader.onerror = function(error) {
        console.log("Error: ", error);
        return this.$store.dispatch(
          "setGenericMessage",
          "Something went wrong. Try again later."
        );
      };
    },
    backButton() {
      this.$emit("back");
    },
    async fetchDetails() {
      const { ok, error, result } = await exploreService.getTheme(this.themeID);
      if (!ok && !error.response) {
        return;
      }
      if (error) {
        this.details = false;
        return;
      }
      this.details = result.data;
    },
    descriptionInput(event) {
      this.$set(this.update, "description", event.target.value);
    }
  },
  async mounted() {
    this.fetchDetails();
  },
  computed: {
    googleDriveLinked() {
      return this.$store.getters["settingsModule/settings"].GDriveLinked;
    }
  }
};
</script>

<style lang="scss" scoped>
.make-public {
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
}
.main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  overflow: auto;
}
.notice {
  background: rgba(0, 0, 0, 0.3);
  padding: 5px;
  flex-shrink: 0;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 5px;
}

.input {
  background-color: #044050;
  padding: 10px;
  margin: 5px;
  align-self: flex-start;
  height: 155px;
  width: 300px;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  .title {
    margin-bottom: 5px;
  }
  textarea {
    background: #032d38;
    resize: none;
    outline: none;
    margin-top: 2px;
    margin-bottom: 0;
    padding: 10px;
    border: none;
    color: white;
    flex: 1;
  }
  .warn {
    color: rgb(255, 67, 67);
  }
}
.block {
  display: flex;
  flex-direction: column;
  background-color: #044050;
  max-width: 300px;
  margin: 5px;
  padding: 10px;
  flex-shrink: 0;
}
.buttons {
  display: flex;
  flex-shrink: 0;
  margin-bottom: 10px;
  align-self: center;
}
.button {
  user-select: none;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  align-self: center;
  margin-left: 10px;
  margin-right: 10px;
  transition: 0.2s;
  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }
}
.preview {
  height: 150px;
  width: 300px;
  background: rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  margin-top: 5px;
  margin-bottom: 5px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
.hidden {
  display: none;
}
.valid {
  color: green;
}
.warn {
  color: orange;
}
</style>

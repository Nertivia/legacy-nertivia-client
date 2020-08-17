<template>
  <div class="content">
    <div class="description">
      Add bot commands to easily let users know which commands exist for your
      bot
    </div>
    <errors-list-template :errors="errors" v-if="errors" />
    <custom-input
      theme="light"
      class="input prefix"
      type="text"
      name="Prefix"
      v-model="prefix"
      @input="prefixInput"
      placeholder="!"
    />
    <div class="inner-content">
      <div class="button add-command" @click="addCommand">Add Command</div>
      <div class="commands-list">
        <div class="titles">
          <div class="title">Command</div>
          <div class="title">Arguments</div>
        </div>

        <command-template
          v-for="(command, i) in commands"
          :key="i"
          :initialCMD="command.c"
          :initialArgs="command.a"
          @cmd-input="cmdInput(i, $event)"
          @args-input="argsInput(i, $event)"
          @delete="deleteClicked(i)"
        />
      </div>
    </div>
    <div
      class="button"
      v-if="showSave"
      :class="{ disabled: saving }"
      @click="saveButton"
    >
      Save Changes
    </div>
  </div>
</template>

<script>
import CustomInput from "@/components/global/CustomInput";
import CommandTemplate from "./CommandTemplate";
import ErrorsListTemplate from "@/components/app/errorsListTemplate";
import botsService from "@/services/botsService";
export default {
  props: ["bot"],
  components: { CommandTemplate, CustomInput, ErrorsListTemplate},
  data() {
    return {
      commands: [],
      prefix: "",
      saving: false,
      showSave: false,
      errors: null,
    };
  },
  async mounted() {
    const { result, ok } = await botsService.getBot(this.bot.uniqueID, true);
    if (ok) {
      if (result.data.botPrefix) {
        this.prefix = result.data.botPrefix;
      }
      if (result.data.botCommands) {
        this.commands = result.data.botCommands;
      }
    }
  },
  methods: {
    cmdInput(index, input) {
      this.showSave = true;
      this.$set(this.commands[index], "c", input);
    },
    argsInput(index, input) {
      this.showSave = true;
      this.$set(this.commands[index], "a", input);
    },
    prefixInput() {
      this.showSave = true;
    },
    addCommand() {
      this.commands = [{ c: "", a: "" }, ...this.commands];
    },
    deleteClicked(index) {
      this.showSave = true;
      this.commands = this.commands.filter((c, i) => i !== index);
    },
    async saveButton() {
      this.errors = null;
      if (this.saving) return;
      else this.saving = true;
      this.commands = this.commands.filter(c => c.c.trim());
      const { ok, error } = await botsService.updateBot(
        { botCommands: this.commands, botPrefix: this.prefix },
        this.bot.uniqueID
      );
      this.saving = false;
      if (ok) {
        this.showSave = false;
      } else {
        this.errors = error.response.data.errors;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";
.content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.input.prefix {
  align-self: center;
  margin-top: 10px;
  width: 60px;
}
.description {
  margin-top: 10px;
  opacity: 0.7;
  text-align: center;
}
.inner-content {
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 100%;
  height: 100%;
}
.commands-list {
  display: flex;
  margin-top: 10px;
  border-radius: 4px;
  align-self: center;
  flex-direction: column;
}
.titles {
  display: flex;
  background: rgba(255, 255, 255, 0.3);
  align-self: center;
  .title {
    padding: 10px;
    padding-left: 15px;
    padding-right: 56px;
    &:nth-child(2) {
      padding-right: 99px;
    }
  }
}
.button {
  align-self: center;
  padding: 5px;
  background: $primary-button-color;
  margin: 5px;
  border-radius: 5px;
  user-select: none;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    opacity: 0.7;
  }
  &.disabled {
    background: gray;
  }
}
.add-command {
  margin-top: 20px;
}
</style>

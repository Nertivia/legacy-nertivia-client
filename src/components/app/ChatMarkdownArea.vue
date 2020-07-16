<template>
  <div class="markdown-buttons">
    <div
      class="material-icons markdown-icon"
      @click="addFormat('**')"
      title="Bold"
    >
      format_bold
    </div>
    <div
      class="material-icons markdown-icon"
      @click="addFormat('_')"
      title="Italic"
    >
      format_italic
    </div>
    <div
      class="material-icons markdown-icon"
      @click="addFormat('__')"
      title="Underline"
    >
      format_underlined
    </div>
    <div
      class="material-icons markdown-icon"
      @click="addFormat('```\n', '\n```', 4)"
      title="Code block"
    >
      code
    </div>
    <div class="color-picker" title="Message color">
      <input
        type="color"
        ref="colorPic"
        style="display: none"
        @change="messageColorChange"
        value="#e7e7e7"
      />
      <div
        class="color"
        :style="{ background: customColor }"
        @click="$refs.colorPic.click()"
      ></div>
      <div
        class="reset-button"
        @click="$emit('changeColor', null)"
        v-if="customColor"
      >
        Reset
      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: "customColor",
    event: "changeColor",
  },
  props: ["customColor"],
  methods: {
    messageColorChange(e) {
      const hexColor = e.target.value;
      e.target.value = "";
      this.$emit("changeColor", hexColor);
    },
    addFormat(type, customEnding, customPos) {
      const msgBox = this.$parent.$refs["input-box"];
      msgBox.focus();
      const startPos = msgBox.selectionStart;
      const endPos = msgBox.selectionEnd;

      const selection = window.getSelection();
      const selected = selection.toString();

      if (selected === "") {
        this.message = [
          this.message.slice(0, endPos),
          type + (customEnding || type),
          this.message.slice(endPos),
        ].join("");
        this.$nextTick(() => {
          const offsetCursorPos = customPos || type.length;
          msgBox.focus();
          msgBox.setSelectionRange(
            endPos + offsetCursorPos,
            endPos + offsetCursorPos
          );
        });
        return;
      }
      this.message = [
        this.message.slice(0, startPos),
        type + selected + (customEnding || type),
        this.message.slice(endPos),
      ].join("");
      this.$nextTick(() => {
        msgBox.focus();
        msgBox.setSelectionRange(startPos + type.length, endPos + type.length);
      });
    },
  },
  computed: {
    message: {
      get: function() {
        return this.$store.getters.message;
      },
      set: function(value) {
        this.$store.dispatch("setMessage", value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.markdown-buttons {
  display: flex;
  height: 35px;
  align-items: center;
  align-content: center;
  margin-left: 2px;
  flex-shrink: 0;
  color: white;
  .markdown-icon {
    font-size: 21px;
    flex-shrink: 0;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: pointer;
    height: 100%;
    width: 30px;
    margin-left: 0px;
    transition: 0.2s;
    color: rgba(255, 255, 255, 0.5);
    &:hover {
      color: white;
    }
  }
}

.color-picker {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
  flex-shrink: 0;
  min-width: 35px;
  .color {
    width: 15px;
    height: 15px;
    background: rgb(231, 231, 231);
    flex-shrink: 0;
    cursor: pointer;
    border-radius: 3px;
  }
  .reset-button {
    color: #a5bec4;
    user-select: none;
    cursor: pointer;
    margin-left: 5px;
    transition: 0.2s;
    flex-shrink: 0;
    &:hover {
      color: white;
    }
  }
}
</style>

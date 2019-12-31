<template>
  <div class="theme">
    <div
      class="name"
      :class="{ selected: selectedThemeID === theme.id }"
      @click="themeClick()"
    >
      {{ theme.name }}
    </div>
    <div class="context" v-if="theme.id == selectedThemeID">
      <div class="button" @click="applyButton">
        <div class="material-icons">check</div>
        <div class="btn-name">Apply</div>
      </div>
      <div class="button" @click="editButton">
        <div class="material-icons">edit</div>
        <div class="btn-name">Edit</div>
      </div>
      <div class="button" @click="makePublicButton">
        <div class="material-icons">public</div>
        <div class="btn-name">Manage Public</div>
      </div>
      <div class="button delete-button" @click="deleteButton">
        <div class="material-icons">delete</div>
        <div class="btn-name">Delete</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["theme", "selectedThemeID"],
  methods: {
    themeClick() {
      this.$emit("clicked");
    },
    applyButton() {
      this.$emit("apply");
    },
    editButton() {
      this.$emit("edit");
    },
    deleteButton() {
      this.$emit("delete");
    },
    makePublicButton() {
      this.$emit("makePublic");
    }
  }
};
</script>

<style lang="scss" scoped>
.theme {
  display: flex;
  flex-direction: column;
  widows: 100%;
  min-height: 30px;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
  color: rgb(230, 230, 230);
  transition: 0.2s;
  .name {
    flex-shrink: 0;
    display: flex;
    height: 100%;
    min-height: 30px;
    padding-left: 5px;
    flex: 1;
    align-items: center;
    transition: 0.2s;
    &:hover {
      color: white;
      background: rgba(0, 0, 0, 0.3);
    }
    &.selected {
      background: rgba(0, 0, 0, 0.5);
      color: white;
    }
  }
}
.context {
  display: flex;
  background: rgba(0, 0, 0, 0.6);
  .button {
    display: flex;
    margin: 5px;
    align-content: center;
    align-items: center;
    opacity: 0.8;
    transition: 0.2s;
    &:hover {
      opacity: 1;
    }
  }
  .material-icons {
    margin-right: 5px;
  }
  .delete-button {
    margin: auto;
    margin-right: 10px;
  }
}
</style>

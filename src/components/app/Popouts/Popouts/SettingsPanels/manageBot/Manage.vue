<template>
  <div class="manage-bot">
    <div class="tabs">
      <div class="tab" :class="{ selected: tab === 0 }" @click="tab = 0">
        Edit Bot
      </div>
      <div class="tab" :class="{ selected: tab === 1 }" @click="tab = 1">
        Edit Commands
      </div>
    </div>
    <edit-bot
      :bot="bot"
      v-if="tab === 0"
      @delete="$emit('delete')"
      @back="$emit('back')"
    />
    <edit-commands :bot="bot" v-if="tab === 1" />
  </div>
</template>

<script>
import EditBot from "./EditBot";
import EditCommands from "./EditCommands";
export default {
  components: { EditBot, EditCommands },
  props: ["bot"],
  data() {
    return {
      tab: 0
    };
  }
};
</script>

<style lang="scss" scoped>
.manage-bot {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.tabs {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  user-select: none;
  .tab {
    cursor: pointer;
    text-align: center;
    margin: 10px;
    margin-bottom: 0;
    padding-bottom: 10px;
    transition: 0.2s;
    border-bottom: solid 2px rgba(87, 73, 73, 0);
    &:hover {
      border-bottom: solid 2px rgba(255, 255, 255, 0.3);
    }
    &.selected {
      border-bottom: solid 2px white;
    }
  }
}
</style>

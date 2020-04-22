<template>
  <div class="panel">
    <div
      class="information"
    >Share what programs or games you are running by adding apps below. This will replace your custom status when a program is opened and revert back when the program is closed.</div>
    <drop-down-template
      class="activity dropdown"
      :items="items"
      selectBy="name"
      :selectedItem="0"
      :noneSelect="true"
      name="Add A Program"
      @change="changeEvent"
    />
    <div class="programs-list">
      <div class="item" v-for="program in storedPrograms" :key="program.filename">
        <div class="details">
          <div class="input-box">
            <div class="text">Action:</div>
            <input
              type="text"
              @blur="updateStatus(program, $event)"
              class="input status"
              :value="program.status"
            />
          </div>
          <div class="input-box">
            <div class="text">Name:</div>
            <input
              type="text"
              @blur="updateName(program, $event)"
              class="input name"
              :value="program.name"
            />
          </div>
          <div class="input-box">
            <div class="text">Filename:</div>
            <div class="name">{{program.filename}}</div>
          </div>
        </div>
        <div class="delete-button material-icons" @click="deleteButton(program)">close</div>
      </div>
    </div>
  </div>
</template>



<script>
const activeWindowListener = window.require("active-window-listener");
const { ipcRenderer } = window.require("electron");

import DropDownTemplate from "@/components/app/Popouts/Popouts/ServerSettingsPanels/DropDownMenu";
import activityProgramNames from "@/utils/activityProgramNames";
export default {
  components: { DropDownTemplate },
  data() {
    return {
      items: [],
      storedPrograms: JSON.parse(localStorage.getItem("activity_status")) || []
    };
  },
  watch: {
    storedPrograms(){
      if (!this.storedPrograms.length) {
        this.$socket.client.emit('programActivity:set', null)
      }
    }
  },
  methods: {
    deleteButton(program) {
      this.storedPrograms = this.storedPrograms.filter(
        sp => sp.filename !== program.filename
      );
      localStorage.setItem(
        "activity_status",
        JSON.stringify(this.storedPrograms)
      );
      this.getItems();
      this.updateDetector();
    },
    updateStatus(program, event) {
      if (event.target.value.trim() === "") return this.deleteButton(program);
      const newObj = { ...program, status: event.target.value };
      const index = this.storedPrograms.findIndex(
        sp => sp.filename === program.filename
      );
      this.$set(this.storedPrograms, index, newObj);
      localStorage.setItem(
        "activity_status",
        JSON.stringify(this.storedPrograms)
      );
      this.updateDetector();
    },
    updateName(program, event) {
      if (event.target.value.trim() === "") return this.deleteButton(program);
      const newObj = { ...program, name: event.target.value };
      const index = this.storedPrograms.findIndex(
        sp => sp.filename === program.filename
      );
      this.$set(this.storedPrograms, index, newObj);
      localStorage.setItem(
        "activity_status",
        JSON.stringify(this.storedPrograms)
      );
      this.updateDetector();
    },
    changeEvent(selected) {
      this.storedPrograms.push({
        ...selected,
        status: this.randomStatusChooser()
      });
      localStorage.setItem(
        "activity_status",
        JSON.stringify(this.storedPrograms)
      );
      this.updateDetector();
      this.getItems();
    },
    getItems() {
      this.items = activeWindowListener
        .getWindows()
        .map(window => {
          const filename = window.path.split("\\")[
            window.path.split("\\").length - 1
          ];
          let title = window.getTitle();
          if (activityProgramNames.blacklist.includes(filename)) {
            return undefined;
          }
          if (this.storedPrograms.find(sp => sp.filename === filename))
            return undefined;
          if (activityProgramNames.preferedNames[filename]) {
            title = activityProgramNames.preferedNames[filename];
          } else {
            const split = title.split(" - ");
            if (split.length > 1) {
              title = split[split.length - 1].trim();
            }
          }
          // console.log({
          //   filename,
          //   path: window.path,
          //   title: window.getTitle()
          // })
          return {
            name: title,
            filename
          };
        })
        .filter(w => w !== undefined);
    },
    randomStatusChooser() {
      const statusArr = ["Playing", "Exploring", "Enjoying"];
      return statusArr[Math.floor(Math.random() * statusArr.length)];
    },
    updateDetector() {
      const programNameArr = this.storedPrograms.map(sp => sp.filename);
      ipcRenderer.send("activity_status:update", programNameArr);
    }
  },

  mounted() {
    this.getItems();
  },
  computed: {}
};
</script>

<style scoped lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.information {
  margin: 10px;
  opacity: 0.8;
}
.programs-list {
  height: 100%;
  width: 100%;
  overflow: auto;
  background: rgba(0, 0, 0, 0.1);
  .input-box {
    display: flex;
    align-content: center;
    align-items: center;
  }
  .item {
    display: flex;
    padding: 10px;
    transition: 0.2s;
    align-self: center;
    align-content: center;
    .details {
      align-self: flex-start;
    }
    .filename {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
    }
    .delete-button {
      margin: auto;
      margin-right: 10px;
      margin-top: 5px;
      align-self: center;
      cursor: pointer;
      transition: 0.2s;
      color: rgba(255, 255, 255, 0.8);
      user-select: none;
      &:hover {
        color: white;
      }
    }
  }
  .input {
    background: transparent;
    padding: 2px;
    font-size: 16px;
    margin-bottom: 5px;
    margin-left: 5px;
    color: rgba(255, 255, 255, 0.7);
    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
    &:focus {
      background: rgba(0, 0, 0, 0.2);
    }
  }
  .input-box {
    .name {
      color: rgba(255, 255, 255, 0.7);
      margin-left: 5px;
    }
  }
  .status {
    width: 85px;
  }
}
</style>




<style>
.activity.dropdown {
  border-radius: 0;
  background: rgba(0, 0, 0, 0.3);
}
.activity.dropdown .drop-container {
  max-height: 200px;
}
</style>

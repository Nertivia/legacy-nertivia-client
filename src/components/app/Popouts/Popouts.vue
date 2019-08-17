<template>
  <div class="popouts">
    <transition-group name="show" mode="out-in">
      <settings key="settings" v-if="popouts.settings"/>
      <upload-dialog key="upload-dialog" v-if="popouts.uploadDialog"/>
      <GDriveLinkMenu key="GDriveLinkMenu" v-if="popouts.GDLinkMenu"/>
      <image-large-preview key="ilp" v-if="popouts.ImagePreviewURL"/>
      <drag-drop-file-upload-dialog key="ddfud" v-if="showUploadDrapDrop"/>
      <user-information-popout key="uip" v-if="popouts.userInformationPopoutID"/>
      <take-survey-popout key="tsp" v-if="popouts.surveyPopout"/>
      <add-server key="as" v-if="popouts.addServer"/>
      <server-invite key="sip" v-if="popouts.showServerInviteMenu" />
      <server-settings key="ss" v-if="popouts.serverSettings.serverID"/>
      <GenericPopout  key="gp" v-if="popouts.genericMessage"/>
      <message-context-menu  key="mcm" v-if="popouts.messageContextMenu.messageID"/>
    </transition-group>
  </div>
</template>

<script>

//popouts
  const userInformationPopout = () => import('./Popouts/userInformationPopout.vue');
  const messageContextMenu = () => import('./Popouts/messageContextMenu');
  const AddServer = () => import('./Popouts/AddServer.vue');
  const Settings = () => import('./Popouts/Settings.vue');
  const TakeSurveyPopout = () => import('./Popouts/TakeSurveyPopout.vue');
  const uploadDialog = () => import('./Popouts/uploadDialog.vue');
  const GDriveLinkMenu = () => import('./Popouts/GDriveLinkMenu.vue');
  const imageLargePreview = () => import('./Popouts/imageLargePreview.vue');
  const DragDropFileUploadDialog = () => import('./Popouts/DragDropFileUploadDialog.vue');
  const ServerInvitePopout = () => import('./Popouts/ServerInvitePopout.vue');
  const ServerSettings = () => import('./Popouts/ServerSettingsPanels/ServerSettings.vue');
  const GenericPopout = () => import('./Popouts/GenericPopout');



export default {
  components: {
    Settings,
    uploadDialog,
    GDriveLinkMenu,
    userInformationPopout,
    DragDropFileUploadDialog,
    imageLargePreview,
    TakeSurveyPopout,
    AddServer,
    ServerInvite: ServerInvitePopout,
    ServerSettings,
    GenericPopout,
    messageContextMenu
  },
  data() {
    return {
      showUploadDrapDrop: false,
      uploadDialogLastTarget: null
    };
  },
  methods: {
    isFile(evt) {
      var dt = evt.dataTransfer;
      for (var i = 0; i < dt.types.length; i++) {
        if (dt.types[i] === "Files") {
          return true;
        }
      }
      return false;
    },
    dragenter(event) {
      if (!this.isFile(event) || !this.selectedChannelID) return;

      this.lastTarget = event.target; // cache the last target here
      this.showUploadDrapDrop = true;
      event.preventDefault();
    },
    dragleave(event) {
      if (event.target === this.lastTarget || event.target === document) {
        this.showUploadDrapDrop = false;
      }
    },
    dragover(event) {
      event.preventDefault();
    },
    drop(event) {
      this.showUploadDrapDrop = false;
      event.preventDefault();
      if (!event.dataTransfer.files.length || !this.selectedChannelID) return;
      this.$store.dispatch("setFile", event.dataTransfer.files[0]);
      this.$store.dispatch("setPopoutVisibility", {
        name: "uploadDialog",
        visibility: true
      });
    },
    uploadDrapDropEvent() {
      window.addEventListener("dragenter", this.dragenter);
      window.addEventListener("dragleave", this.dragleave);
      window.addEventListener("dragover", this.dragover);
      window.addEventListener("drop", this.drop);
    }
  },
  mounted() {
    this.uploadDrapDropEvent();
  },
  destroyed() {
    window.removeEventListener("dragenter", this.dragenter);
    window.removeEventListener("dragleave", this.dragleave);
    window.removeEventListener("dragover", this.dragover);
    window.removeEventListener("drop", this.drop);
  },
  computed: {
    popouts() {
      return this.$store.getters.popouts;
    },
    selectedChannelID() {
      return this.$store.getters.selectedChannelID;
    }
  }
};
</script>

<style scoped>
.show-enter-active,
.show-leave-active {
  transition: opacity 0.1s;
}
.show-enter, .show-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;

}
</style>

<template>
  <div class="popouts">
    <transition-group name="show" mode="out-in">
      <settings key="settings" v-if="popouts.settings" />
      <upload-dialog key="upload-dialog" v-if="popouts.uploadDialog" />
      <GDriveLinkMenu key="GDriveLinkMenu" v-if="popouts.GDLinkMenu" />
      <image-large-preview key="ilp" v-if="popouts.ImagePreviewURL" />
      <drag-drop-file-upload-dialog key="ddfud" v-if="showUploadDrapDrop" />
      <user-information-popout
        :key="`uip-${popouts.userInformationPopoutID}`"
        v-if="popouts.userInformationPopoutID"
      />
      <take-survey-popout key="tsp" v-if="popouts.surveyPopout" />
      <add-server key="as" v-if="popouts.addServer" />
      <server-invite key="sip" v-if="popouts.showServerInviteMenu" />
      <server-settings key="ss" v-if="popouts.serverSettings.serverID" />
      <GenericPopout key="gp" v-if="popouts.genericMessage" />
      <message-context-menu
        key="mcm"
        v-if="
          popouts.allPopout.type === 'MESSAGE_CONTEXT' && popouts.allPopout.show
        "
      />
      <server-member-context
        key="smc"
        v-if="popouts.serverMemberContext.uniqueID"
      />
      <server-context
        key="sc"
        v-if="popouts.allPopout.type === 'SERVER' && popouts.allPopout.show"
      />
      <add-friend
        key="af"
        v-if="popouts.allPopout.type === 'ADD_FRIEND' && popouts.allPopout.show"
      />
      <admin-css-editor
        key="ace"
        v-if="popouts.allPopout.type === 'ADMIN_CSS_EDITOR'"
      />
      <admin-manage-user
        key="amu"
        v-if="popouts.allPopout.type === 'ADMIN_MANAGE_USER'"
      />
      <DeleteConfirm
        key="delete-confirm"
        v-if="popouts.allPopout.type === 'DELETE_CONFIRM'"
      />
      <ChannelContextMenu
        key="ccm"
        v-if="popouts.allPopout.type === 'CHANNEL_CONTEXT'"
      />
      <ImageContextMenu
        key="icm"
        v-if="popouts.allPopout.type === 'IMAGE_CONTEXT'"
      />
      <TextAreaContext
        key="tac"
        v-if="popouts.allPopout.type === 'TEXT_AREA_CONTEXT'"
      />

      <DrawPopout
        key="dp"
        v-if="popouts.allPopout.unclosableType === 'DRAW_POPOUT'"
      />
    </transition-group>
  </div>
</template>

<script>
//popouts
const userInformationPopout = () =>
  import("./Popouts/userInformationPopout.vue");

// context menus
const messageContextMenu = () => import("./Popouts/messageContextMenu");
const ServerMemberContext = () => import("./Popouts/ServerMemberContext");
const ServerContext = () => import("./Popouts/ServerContextMenu.vue");
const ChannelContextMenu = () => import("./Popouts/ChannelContextMenu.vue");
const ImageContextMenu = () => import("./Popouts/ImageContextMenu.vue");
const TextAreaContext = () => import("./Popouts/TextAreaContext.vue");

const AddServer = () => import("./Popouts/AddServer.vue");
const AddFriend = () => import("./Popouts/AddFriend");
const Settings = () => import("./Popouts/Settings.vue");
const TakeSurveyPopout = () => import("./Popouts/TakeSurveyPopout.vue");
const uploadDialog = () => import("./Popouts/uploadDialog.vue");
const GDriveLinkMenu = () => import("./Popouts/GDriveLinkMenu.vue");
const imageLargePreview = () => import("./Popouts/imageLargePreview.vue");
const DragDropFileUploadDialog = () =>
  import("./Popouts/DragDropFileUploadDialog.vue");
const ServerInvitePopout = () => import("./Popouts/ServerInvitePopout.vue");
const ServerSettings = () =>
  import("./Popouts/ServerSettingsPanels/ServerSettings.vue");
const AdminCssEditor = () => import("./Popouts/AdminEditorPopout");
const AdminManageUser = () => import("./Popouts/adminManageUserPopout");
const GenericPopout = () => import("./Popouts/GenericPopout");
const DeleteConfirm = () => import("./Popouts/DeleteConfirm");

const DrawPopout = () => import("./Popouts/DrawPopout");

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
    messageContextMenu,
    ServerMemberContext,
    ServerContext,
    AddFriend,
    AdminCssEditor,
    AdminManageUser,
    DeleteConfirm,
    ChannelContextMenu,
    ImageContextMenu,
    DrawPopout,
    TextAreaContext
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
      if (!this.isFile(event) || !this.currentChannelID) return;

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
      if (!event.dataTransfer.files.length || !this.currentChannelID) return;
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
    currentChannelID() {
      return this.$store.getters.currentChannelID;
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

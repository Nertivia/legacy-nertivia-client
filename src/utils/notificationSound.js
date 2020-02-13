import messageSound from "@/assets/sounds/Message.mp3";
import mentionSound from "@/assets/sounds/Mention.mp3";
import newFriendSound from "@/assets/sounds/FriendRequest.mp3";

import { store } from "@/store/index";

export default {
  notification: mentioned => {
    if (isBusy() || isNotificationDisabled()) return;
    const audio = new Audio(mentioned ? mentionSound : messageSound);
    audio.play();
  },
  newFriend: () => {
    if (isBusy() || isNotificationDisabled()) return;
    const audio = new Audio(newFriendSound);
    audio.play();
  }
};

function isBusy() {
  return store.getters.user.status == 3;
}
function isNotificationDisabled() {
  return !!store.getters["settingsModule/settings"].notification
    .disableNotificationSound;
}

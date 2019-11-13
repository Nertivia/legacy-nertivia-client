import notificationSound from '@/assets/sounds/Notification.mp3';
import newFriendSound from '@/assets/sounds/FriendRequest.mp3';
import {
	store
} from '@/store/index';

//init audio
const notificationAudio = new Audio(notificationSound);

const newFriendAudio = new Audio(newFriendSound);


export default  {
    notification: () => {
        if (isBusy() || isNotificationDisabled()) return;
        const audio = new Audio(notificationSound);
        audio.play();
    },
    newFriend: () => {
        if (isBusy() || isNotificationDisabled()) return;
        const audio = new Audio(newFriendSound);
        audio.play();
    }
}

function isBusy(){
 return store.getters.user.status == 3
}
function isNotificationDisabled(){
 return !!store.getters['settingsModule/settings'].notification.disableNotificationSound;
}
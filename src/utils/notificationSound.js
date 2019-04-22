import notificationSound from '@/assets/sounds/Notification.mp3';
import newFriendSound from '@/assets/sounds/FriendRequest.mp3';
import {
	store
} from '@/store/index';

export default  {
    notification: () => {
        if (isBusy()) return;
        const audio = new Audio(notificationSound);
        audio.play();
    },
    newFriend: () => {
        if (isBusy()) return;
        const audio = new Audio(newFriendSound);
        audio.play();
    }
}

function isBusy(){
 return store.getters.user.status == 3
}
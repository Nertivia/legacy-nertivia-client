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
        if (isBusy()) return;
        notificationAudio.play();
    },
    newFriend: () => {
        if (isBusy()) return;
        newFriendAudio.play();
    }
}

function isBusy(){
 return store.getters.user.status == 3
}
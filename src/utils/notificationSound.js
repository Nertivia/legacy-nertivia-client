import notificationSound from '@/assets/sounds/Notification.mp3';
import newFriendSound from '@/assets/sounds/FriendRequest.mp3';

export default  {
    notification: () => {
        const audio = new Audio(notificationSound);
        audio.play();
    },
    newFriend: () => {
        const audio = new Audio(newFriendSound);
        audio.play();
    }
}
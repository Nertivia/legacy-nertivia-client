import {instance, wrapper} from './Api';

export default {
  post (channelID) {
    return wrapper(instance().post(`messages/${channelID}/typing`))
  } 
}
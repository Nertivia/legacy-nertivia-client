import {instance, wrapper} from './Api';

export default {
  // TODO: add ?continue=id
  get ( channelID )  {
    return wrapper(instance().get(`messages/${channelID}`));
  },

  post (channelID, data) {
    return wrapper(instance().post(`messages/${channelID}`, data))
  } 
}
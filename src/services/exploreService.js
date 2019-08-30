import {instance, wrapper} from './Api';

export default {
  getServersList () {
    return wrapper(instance().get(`explore/servers`))
  },

}
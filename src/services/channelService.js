import {instance, wrapper} from './Api';

export default {
  post ( uniqueID )  {
    return wrapper(instance().post(`channels/${ uniqueID }`));
  }
}
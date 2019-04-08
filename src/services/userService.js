import {instance, wrapper} from './Api';

export default {
  get (uniqueID) {
    return wrapper(instance().get(`user/${uniqueID}`))
  } 
}
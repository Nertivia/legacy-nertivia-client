import {instance, wrapper} from './Api';

export default {
  get (uniqueID) {
    return wrapper(instance().get(`user/${uniqueID}`))
  },
  setSurvey(data) {
    return wrapper(instance().put('/user/survey', data));
  }
}
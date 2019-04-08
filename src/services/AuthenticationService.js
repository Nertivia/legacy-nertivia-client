import {instance, wrapper} from './Api';

export default {
  register ( credentials )  {
    return wrapper(instance().post('user/register', credentials));
  },
  login( credentials ) {
    return wrapper(instance().post('user/login', credentials));
  },
  user () {
    return wrapper(instance().get('user'))
  }
}
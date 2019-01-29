import {instance, wrapper} from './Api';

export default {
  setStatus ( status )  {
    return wrapper(instance().post('/settings/status', { status }));
  },
}
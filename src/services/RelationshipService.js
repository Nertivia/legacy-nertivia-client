import {instance, wrapper} from './Api';

export default {
  post ( friend )  {
    return wrapper(instance().post('/user/relationship', friend));
  },
  put( uniqueID ) {
    return wrapper(instance().put('/user/relationship', {uniqueID}));
  },
  delete( uniqueID ) {
    return wrapper(instance().delete(
      '/user/relationship', 
      {
        data: {uniqueID}
      }
    ));
  }
}
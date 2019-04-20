import {instance, wrapper} from './Api';

export default {
  setStatus ( status )  {
    return wrapper(instance().post('/settings/status', { status }));
  },
  GDriveURL ()  {
    return wrapper(instance().get('/settings/drive/url'));
  },
  GDriveAuth (code) {
    return wrapper(instance().post('/settings/drive/auth', {code}));
  },
  setApperance (apperance, boolean) {
    return wrapper(instance().put('/settings/apperance', {
      [apperance]: boolean
    }));
  }
}
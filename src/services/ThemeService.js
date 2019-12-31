import { instance, wrapper } from "./Api";

export default {
  getTheme(id) {
    return wrapper(instance().get(`themes/${id}`));
  },
  getThemes() {
    return wrapper(instance().get("themes/"));
  },
  save(data) {
    return wrapper(instance().post(`themes/`, data));
  },
  update(data, id) {
    return wrapper(instance().patch(`themes/${id}`, data));
  },
  delete(id) {
    return wrapper(instance().delete(`themes/${id}`));
  }
};

export const permissions = {
  ADMIN: {
    name: "Admin",
    value: 1
  },
  SEND_MESSAGE: {
    name: "Send Message",
    value: 2
  }
};

export function removePerm(perms, flag) {
  return (perms &= ~flag);
}
export function addPerm(perms, flag) {
  return perms | flag;
}
export function containsPerm(perms, flag) {
  return perms & flag;
}

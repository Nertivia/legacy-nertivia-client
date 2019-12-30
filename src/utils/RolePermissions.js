export const permissions = {
  ADMIN: {
    name: "Admin",
    value: 1,
    info: "Enables ALL permissions"
  },
  SEND_MESSAGES: {
    name: "Send Messages",
    value: 2,
    info: "Send messages to server channels"
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

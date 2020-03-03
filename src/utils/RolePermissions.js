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
  },
  MANAGE_ROLES: {
    name: "Manage Roles",
    value: 4,
    info: "Update or delete roles"
  },
  MANAGE_CHANNELS: {
    name: "Manage Channels",
    value: 8,
    info: "Update or delete channels"
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

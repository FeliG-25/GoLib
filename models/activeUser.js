let activeUser = null;

function setActiveUser(userId) {
  activeUser = userId;
}

function getActiveUser() {
  return activeUser;
}

module.exports = { setActiveUser, getActiveUser };
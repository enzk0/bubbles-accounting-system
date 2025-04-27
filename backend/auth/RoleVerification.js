const { getUserById } = require('./UserService');

const verifyUserRole = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user.role; // Assume user object has a `role` property ('admin' or 'employee')
};

module.exports = { verifyUserRole };
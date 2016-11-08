//re. "...roles":  'spread-operator' which pushes all args passed into an array
module.exports = function getEnsureRole(...roles) {
  
  const lookup = roles.reduce((lkup, role) => {
    lkup[role] = true;
    return lkup;
  }, Object.create(null));

  return function ensureRole(req, res, next) {
    const userRoles = req.user.roles;

    if(userRoles && userRoles.some(role => lookup[role])) {
      next();
    } else {
      next({
        code: 400,
        error: 'not authorized'
      });
    }
  };
};
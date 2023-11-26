import Authentication from "../../../shared/middleware/authentication.mjs";

class AuthenticationCheck {
  constructor() {
    this.authentication = new Authentication();
  }
  isAuthenticated = (req, res, next) => this.authentication.isLoggedIn(req, res, next);
  isNotAuthenticated = (req, res, next) => {
    console.log(req);
    return this.authentication.isNotLoggedIn(req, res, next)
  };
}

export default AuthenticationCheck;
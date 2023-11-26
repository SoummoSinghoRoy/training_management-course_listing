import { jwtDecode } from "jwt-decode";

class Authentication {
  isLoggedIn = (req, res, next) => {
    const token = req.cookies['auth_token'];
    if (token) {
      const decoded = jwtDecode(token)
      req.user = decoded;
      next()
    } else {
      return res.status(401).json({
        message: 'Unauthorized user',
        authorized: false
      })
    }
  };
  isNotLoggedIn = (req, res, next) => {
    const token = req.cookies['auth_token'];
    if (!token) {
      next()
    } else {
      return res.status(403).json({
        message: `Already loggedin`,
        authorized: true
      })
    }
  }
}

export default Authentication;
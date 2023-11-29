import authRoute from './authRoute.mjs';
import studentRoute from './studentRoute.mjs';

const routes = [
  {
    path: '/api/student',
    handler: studentRoute
  },
  {
    path: '/api/auth',
    handler: authRoute
  },
  {
    path: '/',
    handler: (req, res) => {
      res.send('Server is running....')
    }
  },
]

const executedRoute = (app) => {
  routes.forEach((route) => {
    if(route.path === '/') {
      app.get(route.path, route.handler)
    } else {
      app.use(route.path, route.handler)
    }
  })
}

export default executedRoute;

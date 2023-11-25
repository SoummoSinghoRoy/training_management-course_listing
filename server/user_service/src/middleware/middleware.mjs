import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const middlewares = [
  morgan('dev'),
  cors(),
  express.json(),
  express.urlencoded({extended: true}),
  cookieParser()
]

const executedMiddleware = (app) => {
  middlewares.forEach((middleware) => {
    app.use(middleware)
  })
}

export default executedMiddleware;
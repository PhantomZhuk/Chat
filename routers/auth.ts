import controller from '../controllers/auth'
import express from 'express'

const router = express
    .Router()
    .post(`/sendConfirmationEmail`, controller.sendConfirmationEmail)
    .post(`/register`, controller.createUser)
    .post(`/login`, controller.login)
    .get(`protected`, controller.protected)
    .get(`/refresh`, controller.refresh)
    .get(`/allUsers`, controller.allUsers)

export default router
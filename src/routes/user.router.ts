import express from 'express';

import * as userController from "../controllers/user.controller"
import { checkUserAuth } from '../middlewares/auth-middlewares';

const router = express.Router();

//public routes
router.post('/register',userController.registerUser)
router.post('/login',userController.loginUser);
router.post('/reset-email',userController.sendPasswordResetEmail);
router.post('/reset-password/:id/:token',userController.userPasswordReset)

//protected routes
router.post('/changepassword',checkUserAuth,userController.changePassword)


export default router
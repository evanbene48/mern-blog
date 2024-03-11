import express from 'express'
import { test,updateUserById } from '../controllers/user.controller.js';

import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUserById);

export default router;
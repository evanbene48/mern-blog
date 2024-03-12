import express from 'express'
import { deleteUserById, test,updateUserById } from '../controllers/user.controller.js';

import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUserById);
router.delete('/delete/:userId', verifyToken, deleteUserById);

export default router;
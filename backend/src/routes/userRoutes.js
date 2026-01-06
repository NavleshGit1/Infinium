import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// User profile routes
router.post('/profile', userController.createUpdateUser);
router.get('/:userId/profile', userController.getProfile);

// Family member routes
router.post('/:userId/family', userController.addFamilyMember);
router.get('/:userId/family', userController.getFamilyMembers);

export default router;

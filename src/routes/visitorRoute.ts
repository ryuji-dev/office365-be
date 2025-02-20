import express from 'express';
import passport from 'passport';
import { selectDepartment } from '../controllers/visitorController';

const router = express.Router();

router.post(
  '/select-department',
  passport.authenticate('jwt', { session: false }),
  selectDepartment
);

export default router;

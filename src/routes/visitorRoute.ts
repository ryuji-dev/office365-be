import express from 'express';
import passport from 'passport';
import { selectDepartment } from '../controllers/visitorController';

const router = express.Router();

router.post(
  '/select-department',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    selectDepartment(req, res);
  }
);

export default router;

import express from 'express';
import passport from 'passport';
import {
  selectDepartment,
  registration,
  getVisitor,
} from '../controllers/visitorController';

const router = express.Router();

router.post(
  '/select-department',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    selectDepartment(req, res);
  }
);

router.post(
  '/registration',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    registration(req, res);
  }
);

router.get(
  '/visitors',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    getVisitor(req, res);
  }
);

export default router;

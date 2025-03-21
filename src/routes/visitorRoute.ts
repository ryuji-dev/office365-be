import express from 'express';
import passport from 'passport';
import {
  registration,
  getVisitors,
  getVisitorById,
  updateVisitor,
} from '../controllers/visitorController';

const router = express.Router();

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
    getVisitors(req, res);
  }
);

router.get(
  '/visitors/:visitorId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    getVisitorById(req, res);
  }
);

router.put(
  '/visitors/:visitorId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    updateVisitor(req, res);
  }
);

export default router;

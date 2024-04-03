// followRoutes.js
import express from "express";
import { getRequests, sendRequest, acceptRequest, rejectRequest, getFollowers, getFollowing, removeFollower, unFollow } from "../controllers/followController.js";

const router = express.Router();

router.get('/getRequests', getRequests);
router.get('/sendRequest/:followingId', sendRequest); //passing th id of the person to be followed

router.get('/acceptRequest/:followerId', acceptRequest);
router.get('/rejectRequest/:followerId', rejectRequest);

router.get('/removeFollower/:followerId', removeFollower);
router.get('/unFollower/:followerId', unFollow);

router.get('/getFollowers', getFollowers);
router.get('/getFollowing', getFollowing);

export default router;
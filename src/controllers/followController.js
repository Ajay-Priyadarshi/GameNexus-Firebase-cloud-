import moment from 'moment-timezone';
import { UserModel as User } from '../models/User.js';
import { FollowRequestModel as Follow } from '../models/Follow.js';

export const sendRequest = async (req, res) => {
    try {
        const followingId = req.params.followingId; //jisko follow karna hai
        const followerId = req.session.userId;      //jo follow kar raha hai

        const existingFollow = await Follow.findOne({ User_ID: followingId, Follower_ID: followerId });
        if (existingFollow && existingFollow.Request_Status === 'Accepted') {
            return res.status(200).send(`
                <script>
                    alert('Already following.');
                    window.location.href = '/profile/${followingId}';
                </script>
            `);
        }

        const followRequest = new Follow({
            User_ID: followingId,
            Request_Status: 'Pending',
            Follower_ID: followerId,
            Follow_Timestamp: moment.tz('Asia/Kolkata').format(),
        });

        await followRequest.save();
        await User.findByIdAndUpdate(followingId, { $inc: { followRequestCount: 1 } });

        return res.status(200).send(`
            <script>
                alert('Request Sent.');
                window.location.href = '/profile/${followingId}';
            </script>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export const getRequests = async (req, res) => {
    try {
        const userId = req.session.userId;
        const requests = await Follow.find({ User_ID: userId, Request_Status: 'Pending' })
            .populate('Follower_ID', 'username userPhoto _id')
            .exec();

        res.render('requests', { requests });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export const acceptRequest = async (req, res) => {
    try {
        const followerId = req.params.followerId;
        const userId = req.session.userId;

        await Follow.findOneAndUpdate({ User_ID: userId, Follower_ID: followerId }, { Request_Status: 'Accepted' }); //status upadte request ka
        await User.findByIdAndUpdate(userId, { $inc: { followersCount: 1, followRequestCount: -1 } }); //user ke followers count update
        await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } }); //follower ke following count update

        return res.status(200).send(`
        <script>
          alert('Request Accepted.');
          window.location.href = '/profile';
        </script>
      `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

export const rejectRequest = async (req, res) => {
    try {
        const followerId = req.params.followerId;
        const userId = req.session.userId;

        await Follow.findOneAndUpdate({ User_ID: userId, Follower_ID: followerId }, { Request_Status: 'Rejected' });; //status upadte request ka
        await User.findByIdAndUpdate(userId, { $inc: { followRequestCount: -1 } }); //decrement follow request count

        return res.status(200).send(`
        <script>
          alert('Request Rejected.');
          window.location.href = '/profile';
        </script>
      `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

export const getFollowers = async (req, res) => {
    try {
        const userId = req.session.userId;
        const followers = await Follow.find({ User_ID: userId, Request_Status: 'Accepted' })
            .populate('Follower_ID', 'username userPhoto _id')
            .exec();

        res.render('followers', { followers });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

export const getFollowing = async (req, res) => {
    try {
        const userId = req.session.userId;
        const following = await Follow.find({ Follower_ID: userId, Request_Status: 'Accepted' })
            .populate('User_ID', 'username userPhoto _id')
            .exec();
        res.render('following', { following });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

export const removeFollower = async (req, res) => {
    try {
        const followerId = req.params.followerId;
        const userId = req.session.userId;

        await Follow.findOneAndDelete({ User_ID: userId, Follower_ID: followerId }); //deleting the follow requestrecord 
        await User.findByIdAndUpdate(userId, { $inc: { followersCount: -1 } });
        await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });

        return res.status(200).send(`
        <script>
          alert('Follower Removed.');
          window.location.href = '/profile';
        </script>
      `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

export const unFollow = async (req, res) => {
    try {
        const followingId = req.params.followingId;
        const userId = req.session.userId;

        await Follow.findOneAndDelete({ User_ID: followingId, Follower_ID: userId }); //deleting the follow requestrecord 
        await User.findByIdAndUpdate(userId, { $inc: { followingCount: -1 } });
        await User.findByIdAndUpdate(followingId, { $inc: { followersCount: -1 } });

        return res.status(200).send(`
        <script>
          alert('Unfollowed.');
          window.location.href = '/profile';
        </script>
      `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
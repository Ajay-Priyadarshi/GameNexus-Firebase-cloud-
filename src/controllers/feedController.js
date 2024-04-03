import { ContentModel as Content } from '../models/Contents.js';
import { UserModel as User } from '../models/User.js';

export const showFeed = async (req, res) => {
    try {
        const userId = req.session.userId;

        const user = await User.findById(userId);
        const userPosts = await Content.find({})
            .populate('User_ID', 'username userPhoto _id')
            .exec();

        res.render('feed', { user, userPosts });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal Server Error');
    }
}
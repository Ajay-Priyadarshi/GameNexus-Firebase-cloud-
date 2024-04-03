import moment from 'moment-timezone';
import { ContentModel as Content } from '../models/Contents.js';
import { UserModel as User } from '../models/User.js';

export const newPost = async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    res.render('newPost', { user });
};

export const createPost = async (req, res, next, {User_ID, Content_Description, Content_URL, Content_Type}) => {
    try {

        const newPost = new Content({
            User_ID,
            Content_Type,
            Content_URL,
            Content_Description,
            Content_Timestamp: moment.tz('Asia/Kolkata').format(),
        });

        await newPost.save();

        await User.findByIdAndUpdate(User_ID, { $inc: { postCount: 1 } });

        return res.status(200).send(`
        <script>
          alert('Post created.');
          window.location.href = '/profile';
        </script>
      `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.session.userId;
        
        await Content.findByIdAndDelete(postId);

        await User.findByIdAndUpdate(userId, { $inc: { postCount: -1 } });

        return res.status(200).send(`
        <script>
          alert('Post deleted.');
          window.location.href = '/profile';
        </script>
        `);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

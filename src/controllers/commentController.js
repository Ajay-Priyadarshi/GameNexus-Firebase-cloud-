import moment from 'moment-timezone';
import { ContentModel as Content } from '../models/Contents.js';
import { CommentModel as Comment } from '../models/Comment.js';
import { UserModel as User } from '../models/User.js';

export const getPost = async (req, res) => {
    const userId = req.session.userId;
    const postId = req.params.postId;

    try {
        const user = await User.findById(userId);
        const post = await Content.findById(postId)
            .populate('User_ID')
            .exec();
        res.render('postSection', { user, post });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

export const getComments = async(req, res) => {
    const userId = req.session.userId;
    const postId = req.params.postId;

    try {
        const user = await User.findById(userId);
        const post = await Content.findById(postId);

        const comments = await Comment.find({ Content_ID: postId })
            .populate('User_ID', 'username _id')
            .exec();

        res.render('commentSection', { user, post, comments });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

export const createComment = async (req, res) => {
    const userId = req.session.userId;
    const { Content_ID, Comment_Description } = req.body;

    try {
        const newComment = new Comment({
            Content_ID: Content_ID,
            User_ID: userId,
            Comment_Description: Comment_Description,
            Comment_Timestamp: moment.tz('Asia/Kolkata').format(),
        });

        await Content.findByIdAndUpdate(Content_ID, { $inc: { Comment_Count: 1 } });
        await newComment.save();
        
        return res.status(200).send(`
        <script>
          window.location.href = '/comment/commentSection/${Content_ID}';
        </script>
      `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
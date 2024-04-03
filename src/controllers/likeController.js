import moment from 'moment-timezone';
import { ContentModel as Content } from '../models/Contents.js';
import { LikeModel as Like } from '../models/Like.js';

export const likeContent = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.session.userId;
    const guestId = req.params.userId;
    const referer = req.get('Referer');

    const alreadyLiked = await Like.findOne({ User_ID: userId, Content_ID: postId });

    if (alreadyLiked) {
      await Like.findOneAndDelete({ User_ID: userId, Content_ID: postId });
      await Content.findByIdAndUpdate(postId, { $inc: { Like_Count: -1 } });
    }
    else {
      const like = new Like({
        User_ID: userId,
        Content_ID: postId,
        Like_Timestamp: moment.tz('Asia/Kolkata').format(),
      });
      await like.save();
      await Content.findByIdAndUpdate(postId, { $inc: { Like_Count: 1 } });
    }

    let redirectUrl = '/feed';

    if (referer.includes('/profile')) {
      if (guestId) {
        redirectUrl = `/profile/${guestId}`;
      } else {
        redirectUrl = '/profile';
      }
    } else if (referer.includes('/comment/postSection/')) {
      redirectUrl = `/comment/postSection/${postId}`;
    } else if (referer.includes('/search')) {
      redirectUrl = '/search';
    }

    return res.status(200).send(`
      <script>
        window.location.href = '${redirectUrl}';
      </script>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

import { UserModel as User } from '../models/User.js';
import { ContentModel as Content } from '../models/Contents.js';

export const showAnalytics = async (req, res) => {
    try {
        const postAnalyticsData = await User.aggregate([
            {
                $lookup: {
                    from: 'Content_tbl',
                    localField: '_id',
                    foreignField: 'User_ID',
                    as: 'posts'
                }
            },
            {
                $addFields: {
                    postCount: { $size: '$posts' } 
                }
            },
            {
                $match: {
                    accountType: { $ne: 'admin' } 
                }
            },
            {
                $group: {
                    _id: '$_id',
                    username: { $first: '$username' },
                    postCount: { $sum: '$postCount' }
                }
            }
        ]);

        const analyticsData = {};
        postAnalyticsData.forEach(item => {
            analyticsData[item.username] = item.postCount;
        });
        res.render('postAnalytics', { analyticsData });
    } catch (error) {
        console.error('Error fetching user analytics data:', error);
        res.status(500).send('Internal Server Error');
    }
};


export const user = async (req, res) => {
    try {
        const uname = req.params.username;
        const user = await User.findOne({ username: uname });

        const userPosts = await Content.find({ User_ID: user._id });
        const analyticsData = [];

        for (const post of userPosts) {
            const { _id, Content_Type, Content_URL, Content_Description, Like_Count, Comment_Count, Content_TimeStamp } = post;

            analyticsData.push({
                postId: _id,
                content_type: Content_Type,
                content_url: Content_URL,
                content_description: Content_Description,
                like_count: Like_Count,
                comment_count: Comment_Count,
                timestamp: Content_TimeStamp,
            });
        }

        res.render('postAnalytics(User)', { analyticsData, user } );

    } catch (error) {
        console.error('Error fetching user analytics data:', error);
        res.status(500).send('Internal Server Error');
    }
}


export const post = async (req, res) => {}
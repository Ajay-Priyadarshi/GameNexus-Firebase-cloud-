import { UserModel as User } from '../models/User.js';

export const showAnalytics = async (req, res) => {
    try {
        const userAnalyticsData = await User.aggregate([
            {
                $group: {
                    _id: '$accountType',
                    count: { $sum: 1 }
                }
            }
        ]);

        const analyticsData = {};
        userAnalyticsData.forEach(item => {
            analyticsData[item._id] = item.count;
        });

        res.render('userAnalytics', { analyticsData });
    } catch (error) {
        console.error('Error fetching user analytics data:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const userList = async (req, res) => {
    try {
        const activeUsers = await User.find({ accountStatus: 'Active' });
        const inactiveUsers = await User.find({ accountStatus: 'Deactivated' });
        res.render('userList', { activeUsers, inactiveUsers });
    } catch (error) {
        console.error('Error fetching user list:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);

        if (user.accountType === 'admin') {
            res.status(403).send(`
                <script>
                    alert('Cannot delete admin!');
                    window.location.href = '/userAnalytics/userList';
                </script>
            `);
        } else {
            await User.findByIdAndUpdate(userId, { $set: { accountStatus: 'Deactivated' } });
            res.send(`
                <script>
                    alert('User deactivated successfully!');
                    window.location.href = '/userAnalytics/userList';
                </script>
            `);
        }
    } catch (error) {
        console.error('Error deactivating user account:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const activateUser = async (req, res) => {
    const { userId } = req.params;
    try {
        await User.findByIdAndUpdate(userId, { $set: { accountStatus: 'Active' } });
        res.send(`
            <script>
                alert('User activated successfully!');
                window.location.href = '/userAnalytics/userList';
            </script>
        `);
    }
    catch (error) {
        console.error('Error activating user account:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const genderRatio = async (req, res) => {
    try {
        const genderAnalyticsData = await User.aggregate([
            {
                $match: {
                    accountType: { $ne: 'admin' } 
                }
            },
            {
                $group: {
                    _id: '$gender',
                    count: { $sum: 1 }
                }
            }
        ]);

        const analyticsData = {};
        genderAnalyticsData.forEach(item => {
            analyticsData[item._id] = item.count;
        });
        res.render('genderAnalytics', { analyticsData });
    } catch (error) {
        console.error('Error fetching user analytics data:', error);
        res.status(500).send('Internal Server Error');
    }  
}


export const ageRatio = async (req, res) => {
    try {
        const ageAnalyticsData = await User.aggregate([
            {
                $match: {
                    accountType: { $ne: 'admin' }
                }
            },
            {
                $bucket: {
                    groupBy: '$age',
                    boundaries: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                    default: 'Other',
                    output: {
                        count: { $sum: 1 }
                    }
                }
            }
        ]);

        const analyticsData = {};
        ageAnalyticsData.forEach(item => {
            const range = item._id === 'Other' ? item._id : `${item._id}-${item._id + 9}`;
            analyticsData[range] = item.count;
        });

        res.render('ageAnalytics', { analyticsData });
    } catch (error) {
        console.error('Error fetching user analytics data:', error);
        res.status(500).send('Internal Server Error');
    }
}

import { UserModel as User } from '../models/User.js';
import { ContentModel as Content } from '../models/Contents.js';

export const showProfile = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).send('Unauthorized');
    }

    const user = await User.findById(userId);
    const userPosts = await Content.find({ User_ID: userId });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('profile', { user, userPosts });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).send('Unauthorized');
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('editProfile', { user });
  } catch (error) {
    console.error('Error fetching user profile for editing:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const updateProfile = async (req, res, next, {bio, requirements, userPhoto}) => {
  try {
    const userId = req.session.userId;

    const updatedData = {
      bio: bio,
      requirements: requirements,
      userPhoto: userPhoto
    };

    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

    if (!user) {
      return res.status(404).send('User not found');
    }

    await user.save();
    res.redirect('/profile');

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const del = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).send('Unauthorized');
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('deleteProfile', { user });
  } catch (error) {
    console.error('Error fetching user profile for editing:', error);
    res.status(500).send('Internal Server Error');
  }
}

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const { securityAnswer } = req.body;

    if (securityAnswer.toLowerCase() === user.answer.toLowerCase()) {
      // Delete the user's account
      await User.findByIdAndUpdate(userId, { $set: { accountStatus: 'Deactivated' } });
      req.session.destroy();

      const script = '<script>window.top.location.href =  "/";</script>';
      res.send(script);
    } else {
      return res.status(401).send(`
        <script>
      alert('Incorrect answer to security question');
      window.location.href = '/profile/del'; 
    </script>
      `);
    }
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).send('Internal Server Error');
  }
}

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const userPosts = await Content.find({ User_ID: userId });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('searchProfile', { user, userPosts });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Internal Server Error');
  }
};


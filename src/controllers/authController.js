import { UserModel as User } from '../models/User.js';
import { PlanModel as Plan } from '../models/Plan.js';
import { PaymentModel as Payment } from '../models/Payment.js';

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.status(404).send(`
        <script>
          alert('Invalid User name try again.');
          window.location.href = '/login.html'; // Redirect to the login page if needed
        </script>
      `);
    }

    if (existingUser.accountStatus !== 'Active') {
      return res.status(401).send(`
        <script>
          alert('Account is not active. Please contact support.');
          window.location.href = '/login.html';
        </script>
      `);
    }

    if (password !== existingUser.password) {
      return res.status(401).send(`
        <script>
          alert('Incorrect password try again or forget password.');
          window.location.href = '/login.html'; // Redirect to the login page if needed
        </script>
      `);
    }
    req.session.userId = existingUser._id;
    if (existingUser.accountType === 'admin') {
      // Redirect to the admin dashboard
      return res.redirect('/admin/dashboard');
    } else if (existingUser.accountType === 'EVENT ORGANIZER') {
      // Redirect to the organiser's or home page
      return res.redirect('/HomePageEventOrganiser.html');
    }
    else {
      // Redirect to the user's profile or home page
      return res.redirect('/Homepage.html');
    }
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to handle user registration
export const register = async (req, res, next, { username, email, password, accountType, bio, securityQuestion, answer, age, gender, userPhoto }) => {
  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).send(`
      <script>
        alert('Username already exists. Please choose a different username.');
         window.location.href = '/auth/reg';
      </script>
    `);
    }

    // Use a default filename if not provided
    const photoFileName = userPhoto ? userPhoto : 'demo.jpg';

    const newUser = new User({
      username,
      email,
      password,
      accountType,
      bio,
      securityQuestion,
      answer,
      age,
      gender,
      userPhoto: photoFileName, // Use the provided filename or default filename
    });

    const userPlans = await Plan.find({ accountType: accountType });

    res.render('selectPlan', { newUser, userPlans });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};


export const selectPlan = async (req, res) => {
  const { planId, newUser } = req.body;

  try {
    const parsedNewUser = JSON.parse(newUser);
    const plan = await Plan.findById(planId);

    const user = new User(parsedNewUser); 
    user.Plan_ID = planId;

    await user.save(); 

    const newPayment = new Payment({
      User_ID: user._id,
      Amount: plan.Price,
      Plan_ID: planId,
    });

    await newPayment.save();

    return res.status(200).send(`
    <script>
      alert('Registration successful. Please login to continue.');
      window.location.href = '/login.html'; 
    </script>
    `);

  } catch (error) {
    console.error('Error selecting plan:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Function to handle forgot password step 1
export const forgotPasswordStep1 = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({ question: null });
    }

    req.session.forgotPasswordUser = username;

    res.json({ question: user.securityQuestion });
  } catch (error) {
    console.error('Error during forgot password (step 1):', error);
    res.status(500).send('Internal Server Error');
  }
};

// Function to handle forgot password step 2
export const forgotPasswordStep2 = async (req, res) => {
  const { securityAnswer, newPassword, confirmPassword } = req.body;

  try {
    const username = req.session.forgotPasswordUser;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the entered security answer with the stored answer directly
    if (securityAnswer.toLowerCase() === user.answer.toLowerCase()) {
      if (newPassword === confirmPassword) {
        // Update the password without hashing
        user.password = newPassword;
        await user.save();

        return res.json({ success: true, message: 'Password reset successful' });
      } else {
        return res.status(400).json({ error: 'New password and confirm password do not match' });
      }
    } else {
      return res.status(401).json({ error: 'Incorrect security answer' });
    }
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

import { PlanModel as Plan } from '../models/Plan.js';
import { UserModel as User } from '../models/User.js';

export const showPlans = async (req, res) => {
    try {
        const plans = await Plan.find();
        res.render('managePlans', { plans });
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const showUserPlans = async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await User.findOne({ _id: userId });
        const plans = await Plan.find({accountType: user.accountType});
        res.render('showUserPlans', { plans });
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const showAddPlanForm = (req, res) => {
    res.render('addPlan');
};

export const addPlan = async (req, res) => {
    const { Plan_Name, accountType, Plan_Description, Price } = req.body;

    try {
        const newPlan = new Plan({
            Plan_Name,
            accountType,
            Plan_Description,
            Price,
        });

        await newPlan.save();
        res.send(`
            <script>
                alert('Plan added successfully!');
                window.location.href = '/managePlans';
            </script>
        `);
    } catch (error) {
        console.error('Error adding plan:', error);
        res.status(500).send('Internal Server Error');
    }
};


export const showEditPlanForm = async (req, res) => {
    const planId = req.params.planId;

    try {
        const plan = await Plan.findById(planId);
        res.render('editPlan', { plan });
    } catch (error) {
        console.error('Error fetching plan for edit:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const editPlan = async (req, res) => {
    const planId = req.params.planId;
    const { Plan_Name, Plan_Description, Price} = req.body;

    try {
        await Plan.findByIdAndUpdate(planId, {
            Plan_Name,
            Plan_Description,
            Price,
        });
        return res.send(`
        <script>
            alert('Plan edited successfully!');
            window.location.href = '/managePlans';
        </script>
    `);
    } catch (error) {
        console.error('Error editing plan:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const deletePlan = async (req, res) => {
    const planId = req.params.planId;

    try {
        await Plan.findByIdAndDelete(planId);
        res.redirect('/managePlans');
    } catch (error) {
        console.error('Error deleting plan:', error);
        res.status(500).send('Internal Server Error');
    }
};

import { UserModel as User } from '../models/User.js';
import { PaymentModel as Payment } from '../models/Payment.js';
import { PlanModel as Plan } from '../models/Plan.js';

export const showAnalytics = async (req, res) => {
    try {
        const payments = await Payment.find().populate('User_ID Plan_ID');
        const planAnalytics = {};

        for (const payment of payments) {
            const { User_ID, Plan_ID, Amount } = payment;

            const plan = await Plan.findById(Plan_ID);

            // Calculate quantity sold (number of occurrences of the plan ID in payments)
            const quantitySold = planAnalytics[Plan_ID] ? planAnalytics[Plan_ID].quantitySold + 1 : 1;

            // Update or set plan-wise analytics
            planAnalytics[Plan_ID] = {
                planName: plan.Plan_Name,
                quantitySold,
                price: plan.Price,
                totalRevenue: quantitySold * plan.Price,
            };
        }

        // Convert the plan-wise analytics object to an array
        const analyticsData = Object.values(planAnalytics);

        res.render('salesAnalytics', { analyticsData });
    } catch (error) {
        console.error('Error fetching sales analytics data:', error);
        res.status(500).send('Internal Server Error');
    }
};

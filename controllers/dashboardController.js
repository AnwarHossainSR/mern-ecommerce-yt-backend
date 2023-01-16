const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');

// get Dashboard STate And Graph Data

exports.getDashboardStateAndGraphData = async (req, res) => {
  const today = new Date();
  const lastMonth = new Date(today.setMonth(today.getMonth() - 1));

  const orders = await Order.find({
    createdAt : {$gte : lastMonth},
  });

  const totalOrders = orders.length;

  const totalAmount = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  const totalProducts = await Product.countDocuments();

  const totalUsers = await User.countDocuments();

  // get last 12 months revenue with graph data
  const months = [];
  const revenue = [];

  for (let i = 0; i < 12; i++) {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    const total = await Order.aggregate([
      {
        $match : {
          createdAt : {
            $gte : new Date(month.setMonth(month.getMonth() - 1)),
            $lte : new Date(month.setMonth(month.getMonth() + 1)),
          },
        },
      },
      {
        $project : {
          month : {$month : '$createdAt'},
          totalPrice : '$totalPrice',
        },
      },
      {
        $group : {
          _id : '$month',
          total : {$sum : '$totalPrice'},
        },
      },
    ]);

    months.push(month.toLocaleString('default', {month : 'short'}));
    revenue.push(total.length > 0 ? total[0].total : 0);
  }

  months.reverse();
  revenue.reverse();

  // return latest 5 orders with usr name, order date and total price
  const latestOrders = await Order.find()
                           .sort({createdAt : -1})
                           .limit(5)
                           .populate('user', 'name')
                           .select('user createdAt totalPrice');

  res.status(200).json({
    totalOrders,
    totalAmount,
    totalProducts,
    totalUsers,
    latestOrders,
    revenue,
    months,
  });
};

import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

export const getAnalyticsData = async() => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments(); //countDocuments is used to count the number of documents in a collection


  
  const salesData = await Order.aggregate([  //aggregate is used to process data records and return computed results
    {
      $group: {  //$group is used to group the documents by a specified expression
        _id: null,
        totalSales: {$sum:1},  
        totalRevenue:{$sum:"$totalAmount"}
      }
    }
  ])
  const {totalSales, totalRevenue} = salesData[0] || {totalSales: 0, totalRevenue: 0};  //if salesData[0] is undefined, then set totalSales and totalRevenue to 0

  return {
    users:totalUsers,
    products:totalProducts,
    totalSales,
    totalRevenue
  };
};

export const getDailySalesData = async(startDate, endDate) => {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {  //$match is used to filter the documents
          createdAt:{
            $gte: startDate, //$gte is used to select the documents where the value is greater than or equal to a specified value
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {$dateToString: {format: "%Y-%m-%d", date: "$createdAt"}},
          sales: {$sum: 1},
          revenue: {$sum: "$totalAmount"},
        }
      },
      {
        $sort: { _id: 1 },  //sort the documents in ascending order
      }
    ]);

    //example of dailySalesData
    // [
    //   { _id: '2021-09-01',
            //  sales: 2, 
            //  revenue: 100.75
            //  },]


    const dateArrray = getDatesInRange(startDate, endDate);   
    //example of dateArray
    // [ '2021-09-01', '2021-09-02', '2021-09-03', '2021-09-04', '2021-09-05', '2021-09-06', '2021-09-07' ]
    
    return dateArrray.map((date) => {
      const foundData = dailySalesData.find((item) => item._id === date); 

      return {
        date,
        sales: foundData ? foundData.sales : 0,
        revenue: foundData ? foundData.revenue : 0,
      };
    });
  } catch (error) {
      throw error;
  }
};

function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while(currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};
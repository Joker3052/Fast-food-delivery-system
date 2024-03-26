import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GetALLOrder } from '../../../../Services/OrderServices';

function Dashboard() {
  const [listorder, setlistorder] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      let res = await GetALLOrder();
      if (res && res.data) {
        setlistorder(res.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Tạo một object để đếm quantity đơn hàng cho mỗi trạng thái
  const statusCounts = listorder.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  // Chuyển đổi object thành mảng dữ liệu cho biểu đồ
  const chartData = Object.keys(statusCounts).map(status => ({
    name: status,
    quantity: statusCounts[status]
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="quantity" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default Dashboard;

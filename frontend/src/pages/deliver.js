import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function DeliverItems() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [otpInputs, setOtpInputs] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders/pending'); // Fetch orders for the seller
        setPendingOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const handleOtpChange = (orderId, value) => {
    setOtpInputs((prev) => ({
      ...prev,
      [orderId]: value,
    }));
  };

  const completeTransaction = async (orderId) => {
    try {
      const enteredOtp = otpInputs[orderId];

      if (!enteredOtp) {
        setErrors((prev) => ({
          ...prev,
          [orderId]: 'Please enter OTP before proceeding.',
        }));
        return;
      }

      const response = await axios.post(`/api/orders/${orderId}/complete`, { otp: enteredOtp });

      if (response.data.success) {
     
        setPendingOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        setErrors((prev) => ({
          ...prev,
          [orderId]: '',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [orderId]: 'Invalid OTP. Please try again.',
        }));
      }
    } catch (error) {
      console.error('Error completing transaction:', error);
      setErrors((prev) => ({
        ...prev,
        [orderId]: 'Something went wrong. Try again later.',
      }));
    }
  };

  const renderOrders = (orders) => {
    if (orders.length === 0)
      return <p className="text-gray-400">No orders to deliver.</p>;

    return (
      <div className='w-4/6'>
        <ul>
          {orders.map((order) => (
            <li key={order._id} className="bg-gray-700 rounded-lg p-4 mb-4 shadow-md w-full">
   
              <div className="flex flex-col space-y-3">

                <div className="flex">
                  <span className="text-sm text-gray-400">Buyer:</span>&nbsp;
                  <span className="text-sm font-semibold text-gray-200">
                    {order.buyer.lname
                      ? `${order.buyer.fname} ${order.buyer.lname}`
                      : order.buyer.fname}
                  </span>
                </div>

                <div className="flex space-x-4 overflow-x-auto py-2 pl-2">
                  {order.items.map((item) => (
                    <Link key={item._id} href={`/item/${item._id}`}>
                      <div className="bg-gray-800 rounded-lg p-4 shadow-sm w-48 hover:shadow-lg transition-all transform hover:scale-105">
                        <span className="block text-lg font-medium text-blue-400">{item.name}</span>
                        <span className="block text-sm text-gray-400">₹{item.price.toFixed(2)}</span>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="flex justify-between">
                  <div>
                    <div className="flex">
                      <span className="text-sm text-gray-400">Total Amount:</span>&nbsp;
                      <span className="text-sm font-bold text-blue-400">₹{order.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-400">Placed On:</span>&nbsp;
                      <span className="text-sm font-semibold text-gray-200">
                        {new Date(order.PlacedAt).toLocaleString('en-UK')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otpInputs[order._id] || ''}
                      onChange={(e) => handleOtpChange(order._id, e.target.value)}
                      className="p-2 text-black rounded-md w-32 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => completeTransaction(order._id)}
                      className="p-2 bg-green-600 text-white rounded-md hover:bg-green-500"
                    >
                      Complete Transaction
                    </button>
                  </div>
                </div>

                {errors[order._id] && <p className="text-red-500 text-sm mt-2">{errors[order._id]}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 min-h-screen text-gray-200">
      <Navbar />
      <div className="flex flex-col items-center p-6 w-full">
        <h2 className="text-2xl font-bold mb-6">Deliver Items</h2>
        {renderOrders(pendingOrders)}
      </div>
    </div>
  );
}

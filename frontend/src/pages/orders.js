import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function OrdersHistory() {
  const [selectedTab, setSelectedTab] = useState('pending');
  const [pendingOrders, setPendingOrders] = useState([]);
  const [boughtOrders, setBoughtOrders] = useState([]);
  const [soldOrders, setSoldOrders] = useState([]);
  const [otp, setOtp] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders/all');
        const { pending, bought, sold } = response.data;

        setPendingOrders(pending);
        setBoughtOrders(bought);
        setSoldOrders(sold);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const regenerateOtp = async (orderId) => {
    try {
      const response = await axios.get(`/api/orders/${orderId}/regenerate`);
      setOtp((prevOtp) => ({
        ...prevOtp,
        [orderId]: response.data.otp,
      }));
    } catch (error) {
      console.error('Error regenerating OTP:', error);
    }
  };

  const renderOrders = (orders, isBuyer, isPending) => {

    if (orders.length === 0) return <p className="text-gray-400 mt-6">No orders to show.</p>

    return (
      <div>
        <ul>
          {orders.map((order) => (
            <li key={order._id} className="bg-gray-700 rounded-lg p-4 mb-4 shadow-md">
              
              <div className="flex flex-col space-y-3">
                
                <div className="flex">

                    {isBuyer ? (

                        <>
                        <span className="text-sm text-gray-400">Seller:</span>&nbsp;
                        <span className="text-sm font-semibold text-gray-200">
                            {order.seller.lname
                            ? `${order.seller.fname} ${order.seller.lname}`
                            : order.seller.fname}
                        </span>
                        </>

                    ) : (

                        <>
                        <span className="text-sm text-gray-400">Buyer:</span>&nbsp;
                        <span className="text-sm font-semibold text-gray-200">
                            {order.buyer.lname
                            ? `${order.buyer.fname} ${order.buyer.lname}`
                            : order.buyer.fname}
                        </span>
                        </>

                    )}
                </div>
  
                <div className="flex space-x-4 overflow-x-auto py-2 pl-2">
                  {order.items.map((item, index) => (
                    <Link key={item._id} href={`/item/${item._id}`}>
                        <div
                        key={index}
                        className="bg-gray-800 rounded-lg p-4 shadow-sm w-48 hover:shadow-lg transition-all transform hover:scale-105"
                        >
                        
                        <span className="block text-lg font-medium text-blue-400">{item.name}</span>
                        <span className="block text-sm text-gray-400">₹{item.price.toFixed(2)}</span>
                        </div>
                    </Link>
                  ))}
                </div>

                <div className="flex justify-between">
  
                  <div>
   
                    <div className="flex">
                    <span className="text-sm text-gray-400">Status:</span>&nbsp;
                    <span className="text-sm font-semibold text-gray-200">{order.status}</span>
                    </div>
    
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

                    {isPending && (
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => regenerateOtp(order._id)}
                                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                            >
                                Regenerate OTP
                            </button>
                            {otp[order._id] && (
                                <p className="mt-2 text-sm text-gray-300 ml-4">OTP: {otp[order._id]}</p>
                            )}
                        </div>
                    )}

                </div>

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
      <div className="flex p-4">
        
        <div className="w-1/6 bg-gray-900 p-4 space-y-2 rounded-lg">
          <button
            onClick={() => setSelectedTab('pending')}
            className={`w-full p-2 text-left rounded-lg ${selectedTab === 'pending' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            Pending Orders
          </button>
          <button
            onClick={() => setSelectedTab('bought')}
            className={`w-full p-2 text-left rounded-lg ${selectedTab === 'bought' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            Bought Items
          </button>
          <button
            onClick={() => setSelectedTab('sold')}
            className={`w-full p-2 text-left rounded-lg ${selectedTab === 'sold' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          >
            Sold Items
          </button>
        </div>

        <div className="w-4/6 pl-6">
          {selectedTab === 'pending' && (
            <div>
              <h2 className="text-xl font-semibold mb-5">Pending Orders</h2>
              {renderOrders(pendingOrders, true, true)}
            </div>
          )}
          {selectedTab === 'bought' && (
            <div>
              <h2 className="text-xl font-semibold mb-5">Bought Items</h2>
              {renderOrders(boughtOrders, true, false)}
            </div>
          )}
          {selectedTab === 'sold' && (
            <div>
              <h2 className="text-xl font-semibold mb-5">Sold Items</h2>
              {renderOrders(soldOrders, false, false)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

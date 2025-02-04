import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import LoadingMessage from "../components/LoadingMessage";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get("/api/users/cart/all");
      setCartItems(response.data);
      calculateTotal(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    setTotalPrice(total);
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`/api/users/cart/delete/${itemId}`);
      const updatedCart = cartItems.filter((item) => item._id !== itemId);
      setCartItems(updatedCart);
      calculateTotal(updatedCart);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) return;

    // Group items by seller
    const orders = cartItems.reduce((acc, item) => {
      if (!acc[item.seller]) {
        acc[item.seller] = { seller: item.seller, items: [], amount: 0 };
      }
      acc[item.seller].items.push(item._id);
      acc[item.seller].amount += item.price;
      return acc;
    }, {});

    const orderList = Object.values(orders);

    try {
      await axios.post("/api/orders/add", { orders: orderList });
      setCartItems([]); // Clear cart on success
      setTotalPrice(0);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-800 text-white">

        <Navbar />

        <main className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">My Cart</h1>

            { loading ? (

                <LoadingMessage />

            ) : (

                <>
                {cartItems.length === 0 ? (
                    <p className="text-gray-400">Your cart is empty.</p>
                ) : (
                    <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div key={item._id} className="bg-gray-900 p-4 rounded-lg shadow flex justify-between items-center">
                        <div>
                            <h2 className="text-lg text-blue-400 font-bold">{item.name}</h2>
                            <p className="text-gray-400">₹{item.price.toFixed(2)}</p>
                            <span className="text-sm text-gray-400">Seller:</span>&nbsp;
                            <span className="text-sm font-semibold text-gray-200">
                                {item.seller.lname
                                ? `${item.seller.fname} ${item.seller.lname}`
                                : item.seller.fname}
                            </span>
                        </div>
                        <button
                            onClick={() => removeFromCart(item._id)}
                            className="p-2 bg-red-600 text-white rounded-md hover:bg-red-500"
                        >
                            Remove
                        </button>
                        </div>
                    ))}
                    </div>
                )}

                {/* Total price and Final Order button fixed at bottom */}
                {cartItems.length > 0 && (
                    <div className="fixed bottom-0 right-0 left-0 bg-gray-800 px-4 shadow-lg flex items-center space-y-4">
                        <div className="p-6 max-w-4xl mx-auto flex justify-end items-center">
                            <div className="bg-gray-900 p-4 rounded-lg shadow flex justify-between items-center">
                                <span className="text-lg font-bold text-blue-400 pr-5">Total: ₹{totalPrice.toFixed(2)}</span>
                                <button
                                    onClick={placeOrder}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                                >
                                    Place Order
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                </>
            )}
        </main>
    </div>
  );
}

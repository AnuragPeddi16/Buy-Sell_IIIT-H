import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Navbar from "../../components/Navbar";
import LoadingMessage from "../../components/LoadingMessage";

export default function ItemDetailsPage() {
    const router = useRouter();
    const { itemId } = router.query;

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartMessage, setCartMessage] = useState("");
    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {

        if (!itemId) return;
        const fetchItemDetails = async () => {
            try {
                const { data } = await axios.get(`/api/items/${itemId}`);
                setItem(data);
            } catch (err) {
                setError("Failed to load item details.");
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetails();

    }, [itemId]);

    const checkIfItemInCart = async () => {
        try {
            const response = await axios.get("/api/users/details");
            const cartItems = response.data.cart_items;
            setIsInCart(cartItems.some((cartItem) => cartItem === itemId)); // Check if itemId is in the cart
        } catch (err) {
            console.log(err);
            setError("Failed to fetch cart items.");
        }
    };

    useEffect(() => {
        if (itemId) {
            checkIfItemInCart();
        }
    }, [itemId]);

    const handleAddToCart = async () => {
        try {
            await axios.post(`/api/users/cart/add`, { itemId: itemId });
            setIsInCart(true);
            setCartMessage("✅ Item added to cart!");
        } catch {
            setCartMessage("❌ Failed to add item to cart.");
        }
    };

    const handleRemoveFromCart = async () => {
        try {
            await axios.delete(`/api/users/cart/delete/${itemId}`);
            setIsInCart(false);
            setCartMessage("✅ Item removed from cart!");
        } catch {
            setCartMessage("❌ Failed to remove item from cart.");
        }
    };

    if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-800 text-gray-200 flex flex-col">
            <Navbar />

            {loading ? (

                <LoadingMessage />

            ) : (

                <div className="flex-1 h-full bg-gray-800 text-gray-200 flex justify-center items-center p-6 pb-20">
                    <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold text-blue-400">{item.name}</h1>
                        <p className="text-xl font-semibold text-gray-300 mt-2">
                            ₹{item.price}
                        </p>
                        <p className="text-gray-400 mt-4">{item.description}</p>

                        <div className="mt-4">
                            <p className="text-gray-300">
                                <strong>Seller:</strong>{" "}
                                {item.seller.lname
                                    ? `${item.seller.fname} ${item.seller.lname}`
                                    : item.seller.fname}
                            </p>
                            <p className="text-gray-300">
                                <strong>Categories:</strong> {item.categories.join(", ")}
                            </p>
                        </div>

                        <button
                            onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
                            className={`mt-6 w-full text-white font-bold py-2 px-4 rounded transition duration-200 ${
                                isInCart
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-blue-500 hover:bg-blue-600"
                            }`}
                        >
                            {isInCart ? "🛒 Remove from Cart" : "🛒 Add to Cart"}
                        </button>

                        {cartMessage && (
                            <p
                            className={`mt-4 text-center text-sm font-semibold ${
                                cartMessage.includes("✅") ? "text-green-400" : "text-red-400"
                            }`}
                            >
                                {cartMessage}
                            </p>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}

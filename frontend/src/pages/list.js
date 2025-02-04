import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Router, useRouter } from "next/router";

export default function ListItemPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleAddCategory = () => {
    setCategories([...categories, ""]);
  };

  const handleRemoveCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (index, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = value;
    setCategories(updatedCategories);
  };

  const handleSubmit = async () => {
    if (!name || !price) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/items/add", {
        name,
        price: parseFloat(price),
        description,
        categories,
      });
      
      // Reset form
      setName("");
      setPrice("");
      setDescription("");
      setCategories([""]);

      router.back();
      
    } catch (err) {
      setError("Failed to list item. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-gray-200">
      <Navbar />
      <main className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">List an Item</h2>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Price (₹)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-500"
            rows="4"
          ></textarea>
          <div>
            <h3 className="text-lg font-semibold mb-2">Categories</h3>
            {categories.map((category, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                  className="flex-1 p-2 rounded bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleRemoveCategory(index)}
                  className="p-2 bg-red-600 text-white rounded hover:bg-red-500"
                >
                  -
                </button>
              </div>
            ))}
            <button
              onClick={handleAddCategory}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              + Add Category
            </button>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

        </div>

        <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 mt-12 rounded hover:bg-blue-600 disabled:bg-gray-600"
          >
            {loading ? "Listing..." : "List Item"}
          </button>

      </main>
    </div>
  );
}
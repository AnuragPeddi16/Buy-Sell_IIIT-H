import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Fuse from "fuse.js";

const items = [
  { id: 1, name: "Laptop", price: 50000, vendor: "John", category: ["Electronics"] },
  { id: 2, name: "Chair", price: 2000, vendor: "Doe", category: ["Furniture"] },
  { id: 3, name: "Notebook", price: 50, vendor: "Smith", category: ["Stationery"] },
  { id: 4, name: "Headphones", price: 1500, vendor: "Alice", category: ["Electronics", "Accessories"] },
  { id: 5, name: "Table", price: 3000, vendor: "Eve", category: ["Furniture"] },
  { id: 6, name: "Shoes", price: 2500, vendor: "Liam", category: ["Clothing"] },
  { id: 7, name: "Watch", price: 8000, vendor: "Emma", category: ["Accessories"] },
];

const items_clone = structuredClone(items);

const categories = ["Electronics", "Furniture", "Stationery", "Clothing", "Accessories", "Books", "Appliances"];

const fuse = new Fuse(items, {
  keys: ["name", "category"],
  threshold: 0.3, // Allows for near matches
});

export default function SearchItemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // For the dropdown

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleRemoveCategory = (category) => {
    setSelectedCategories((prev) => prev.filter((cat) => cat !== category));
  };

  const handleCategorySelect = (e) => {
    const category = e.target.value;
    if (category && !selectedCategories.includes(category)) {
      setSelectedCategories((prev) => [...prev, category]);
      setSelectedCategory(""); // Clear the dropdown selection after adding
    }
  };

  let filteredItems = structuredClone(items_clone);

  if (searchTerm !== "") {
    filteredItems = fuse
      .search(searchTerm)
      .map((result) => result.item)
      .filter(
        (item) =>
          selectedCategories.length === 0 ||
          selectedCategories.some((category) => item.category.includes(category))
      );
  } else {
    filteredItems = filteredItems.filter(
      (item) =>
        selectedCategories.length === 0 ||
        selectedCategories.some((category) => item.category.includes(category))
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-gray-200">
      <Navbar />

      <main className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Store</h2>

        {/* Search and Category Dropdown Inputs in a flex row */}
        <div className="flex gap-4 mb-6">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={handleCategorySelect}
              className="p-3 mr-3 rounded bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-72" // Adjusted width
            >
              <option value="">Select a Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Display selected categories with remove option */}
        {selectedCategories.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Selected Categories:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <span
                  key={category}
                  className="bg-blue-500 text-white py-1 px-3 rounded flex items-center gap-1"
                >
                  {category}
                  <button
                    onClick={() => handleRemoveCategory(category)}
                    className="text-sm text-white font-bold"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                <Link key={item.id} href={`/items/${item.id}`}>
                    <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
                    <div className="flex items-baseline justify-between mb-2">
                        <h4
                        className="text-blue-400 text-xl font-semibold hover:text-blue-500 truncate max-w-full"
                        title={item.name}  // This will show the full name on hover
                        >
                        {item.name}
                        </h4>
                        <span className="text-gray-300 text-lg">₹{item.price}</span>
                    </div>
                    
                    <p className="text-gray-400 mb-2">Listed by: <span className="text-gray-300">{item.vendor}</span></p>
                    
                    <div className="text-gray-500 text-xs mt-2">
                        {item.category.join(", ")}
                    </div>
                    </div>
                </Link>
                ))
            ) : (
                <p className="text-gray-400 mt-6">No items match your search or filters.</p>
            )}
        </div>
      </main>
    </div>
  );
}

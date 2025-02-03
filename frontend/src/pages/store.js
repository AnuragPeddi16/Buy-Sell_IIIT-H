import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Fuse from "fuse.js";
import withAuth from "../utils/withAuth";
import axios from "../utils/axiosConfig";
import LoadingMessage from "../components/LoadingMessage";

function SearchItemsPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // For the dropdown
  const [fuse, setFuse] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await axios.get("/api/items/all");
        setItems(response.data);

        let cats_temp = {};
        for (const item of response.data) {

          item.categories.forEach(category => {
            cats_temp[category] = (cats_temp[category] || 0) + 1;
          });

        }

        setFuse(new Fuse(response.data, {
          keys: ["name"],
          threshold: 0.3, // Allows for near matches
        }));

        setCategories(cats_temp);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, []);



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

  let filteredItems = [];

  if (!loading) {

    filteredItems = structuredClone(items);

    if (searchTerm !== "") {
      filteredItems = fuse
        .search(searchTerm)
        .map((result) => result.item)
        .filter(
          (item) =>
            selectedCategories.length === 0 ||
            selectedCategories.some((category) => item.categories.includes(category))
        );
    } else {
      filteredItems = filteredItems.filter(
        (item) =>
          selectedCategories.length === 0 ||
          selectedCategories.some((category) => item.categories.includes(category))
      );
    }

  }

  return (
    <div className="min-h-screen bg-gray-800 text-gray-200">
      <Navbar />

      <main className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Store</h2>

        {loading ? (

          <LoadingMessage />
        
        ) : (

          <>

          <div className="flex gap-4 mb-6">
            
            <input
              type="text"
              placeholder="Search for items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={handleCategorySelect}
                className="p-3 mr-3 rounded bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-72" // Adjusted width
              >
                <option value="">Select a Category</option>
                {Object.keys(categories).map((category) => (
                  <option key={category} value={category}>
                    {category} ({categories[category]})
                  </option>
                ))}
              </select>
            </div>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                  <Link key={item._id} href={`/item/${item._id}`}>
                    <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
                      <div className="flex items-baseline justify-between mb-2">
                          <h4
                            className="text-blue-400 text-xl font-semibold hover:text-blue-500 truncate max-w-full"
                            title={item.name}
                          >
                            {item.name}
                          </h4>
                          <span className="text-gray-300 text-lg">₹{item.price}</span>
                      </div>
                      
                      <p className="text-gray-400 mb-2">Listed by:
                        <span className="text-gray-300">
                          {item.seller.lname
                            ? ` ${item.seller.fname} ${item.seller.lname}`
                            : item.seller.fname}
                        </span>
                      </p>
                      
                      <div className="text-gray-500 text-xs mt-2">
                          {item.categories.join(", ")}
                      </div>
                    </div>
                  </Link>
                  ))
              ) : (
                  <p className="text-gray-400 mt-6">No items match your search or filters.</p>
              )}
          </div>

          </>

        )}
      </main>
    </div>
  );
}


export default withAuth(SearchItemsPage);
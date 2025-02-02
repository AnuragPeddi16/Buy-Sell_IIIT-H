// TEST PAGE




import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";

export default function About() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = "rerere";

    useEffect(() => {
        // This function runs only after the page is loaded (component has been mounted)
        const fetchData = async () => {
            try {
                const response = await axios.get(process.env.BACKEND_URL + '/api/items/all', {
                    headers: {
                      Authorization: 'Bearer ' + token //the token is a variable which holds the token
                    }
                   });  // Replace with your API endpoint
                setData(response.data);
            } catch (err) {
                setError(err.response ? err.response.data : err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();  // Fetch data only after component is mounted

    }, []);  // The empty dependency array ensures that it runs only once after the first render

    // Handle loading, error, and display data
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
    
        <>

            <Navbar />
            <p>This is About</p>
            <p>Requested data - </p>
            {JSON.stringify(data)}

        </>

    );

}
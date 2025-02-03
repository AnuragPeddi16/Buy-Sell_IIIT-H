import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../utils/AuthContext";

const InputField = ({ label, type, name, value, onChange, placeholder, required = false }) => {
    return (
      <div>
        <label htmlFor={name} className="text-gray-400">{label}</label>
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-3 mt-1 text-gray-800 bg-gray-200 rounded-md focus:outline-none"
          placeholder={placeholder}
          required={required}
        />
      </div>
    );
}
  
const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
        <div className="bg-red-800 text-white p-2 rounded-md mb-4 text-center">
        {message}
        </div>
    );
} 
  
function SignUpPage() {
    const [user, setUser] = useState({
        fname: "",
        lname: "",
        email: "",
        age: "",
        contact: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    const { signup } = useAuth();
    const router = useRouter();
  
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validation checks for email and contact number
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(iiit\.ac\.in|[a-zA-Z0-9.-]+\.iiit\.ac\.in)$/;
        if (!emailRegex.test(user.email)) {
            setErrorMessage("Email should be a valid IIIT-H email");
            return;
        }
    
        if (!/^[0-9]+$/.test(user.contact)) {
            setErrorMessage("Phone number should contain numeric digits only");
            return;
        }
    
        if (user.contact.length !== 10) {
            setErrorMessage("Phone Number should be 10 digits long");
            return;
        }
    
        const success = await signup(user);

        if (success) router.push("/");
        else setErrorMessage("User already exists");
    };
  
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl text-gray-100 font-semibold mb-6 text-center">Sign Up</h2>
        
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        label="First Name"
                        type="text"
                        name="fname"
                        value={user.fname}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                        required
                    />
        
                    <InputField
                        label="Last Name (Optional)"
                        type="text"
                        name="lname"
                        value={user.lname}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                    />
        
                    <InputField
                        label="Email"
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
        
                    <InputField
                        label="Password"
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                    />
        
                    <InputField
                        label="Age (Optional)"
                        type="number"
                        name="age"
                        value={user.age}
                        onChange={handleChange}
                        placeholder="Enter your age"
                    />
        
                    <InputField
                        label="Contact Number"
                        type="text"
                        name="contact"
                        value={user.contact}
                        onChange={handleChange}
                        placeholder="Enter your contact number"
                        required
                    />
        
                    <ErrorMessage message={errorMessage} />
        
                    <button
                        type="submit"
                        className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition"
                    >
                        Sign Up
                    </button>
                </form>
        
                <div className="mt-4 text-center text-gray-400">
                    <span>Already have an account? </span>
                    <a href="/login" className="text-blue-400 hover:text-blue-300">Login</a>
                </div>
            </div>
        </div>
    );
}



export default SignUpPage;
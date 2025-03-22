import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import axios from "axios";

const SignIn = () => {
  const [role, setRole] = useState("Attendee");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        role,
        username,
        password,
      });

      if (response.data.success) {
        sessionStorage.setItem("role", role); // Store role in sessionStorage
        alert("Login successful!");

        // Redirect based on role
        if (role === "Attendee") navigate("/");
        if (role === "Event Organizer") navigate("/");
        if (role === "Admin") navigate("/");
      }
    } catch (error) {
      alert("Invalid credentials");
    }
};


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-32 pb-20 flex flex-col items-center">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-border shadow-md p-8 animate-scale-in">
            <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full h-10 px-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                  >
                    <option>Attendee</option>
                    <option>Event Organizer</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mt-3 mb-1">Username</label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-10 px-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                    placeholder="Enter your username"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 px-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                    placeholder="Enter your password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors button-animation bg-primary text-primary-foreground shadow h-10 px-4"
                >
                  Sign In
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-primary hover:text-primary/80">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
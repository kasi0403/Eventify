import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Attendee");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    organization: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        role,
        ...formData,
      });

      alert(response.data.message);
      navigate("/signin");
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
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
            <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-10 px-3 border border-input rounded-md"
                >
                  <option value="Attendee">Attendee</option>
                  <option value="Event Organizer">Event Organizer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {/* Common Fields */}
              {(role === "Attendee" || role === "Event Organizer") && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border border-input rounded-md"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              )}

              {role === "Attendee" && (
                <>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-10 px-3 border border-input rounded-md"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full h-10 px-3 border border-input rounded-md"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </>
              )}

              {role === "Event Organizer" && (
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium mb-1">Organization</label>
                  <input
                    name="organization"
                    type="text"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border border-input rounded-md"
                    placeholder="Enter your organization"
                    required
                  />
                </div>
              )}
              <button type="submit" className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/80">
                Sign Up
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/signin" className="font-medium text-primary hover:text-primary/80">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isSignupForm, setIsSignupForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [gender, setGender] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isSignupForm && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      let res;

      if (isSignupForm) {
        res = await axios.post(BASE_URL + "/signup", {
          firstName,
          lastName,
          age,
          gender,
          photoUrl,
          emailId,
          password,
        });

        setSuccess("Signup successful! Please login.");
        setIsSignupForm(false);
        setPassword("");
        setConfirmPassword("");
      } else {
        res = await axios.post(
          BASE_URL + "/login",
          { emailId, password },
          { withCredentials: true }
        );

        dispatch(addUser(res.data));
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data || "An error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-2xl rounded-3xl">
        <div className="card-body">
          <h2 className="text-center text-2xl font-semibold mb-6">
            {isSignupForm ? "Sign Up" : "Login"}
          </h2>

          {error && (
            <div className="text-red-500 mb-4">
              <strong>Error: </strong>{error}
            </div>
          )}

          {success && (
            <div className="text-green-500 mb-4">
              <strong>Success: </strong>{success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignupForm && (
              <>
                <input
                  type="text"
                  value={firstName}
                  placeholder="First Name"
                  className="input input-bordered w-full rounded-lg"
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  value={lastName}
                  placeholder="Last Name"
                  className="input input-bordered w-full rounded-lg"
                  onChange={(e) => setLastName(e.target.value)}
                />
                <input
                  type="text"
                  value={age}
                  placeholder="Age"
                  className="input input-bordered w-full rounded-lg"
                  onChange={(e) => setAge(e.target.value)}
                />

                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="input input-bordered w-full rounded-lg"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  type="text"
                  value={photoUrl}
                  placeholder="Photo URL"
                  className="input input-bordered w-full rounded-lg"
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </>
            )}

            <input
              type="email"
              value={emailId}
              placeholder="Email"
              className="input input-bordered w-full rounded-lg"
              onChange={(e) => setEmailId(e.target.value)}
              required
            />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Password"
              className="input input-bordered w-full rounded-lg"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {isSignupForm && (
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder="Confirm Password"
                className="input input-bordered w-full rounded-lg"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}

            <div
              className="text-sm text-right text-blue-500 cursor-pointer hover:underline"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </div>

            <button type="submit" className="btn btn-primary w-full rounded-lg">
              {isSignupForm ? "Sign Up" : "Login"}
            </button>

            <p
              className="text-center text-sm text-gray-500 cursor-pointer hover:underline mt-2"
              onClick={() => {
                setIsSignupForm(!isSignupForm);
                setError("");
                setSuccess("");
              }}
            >
              {isSignupForm
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

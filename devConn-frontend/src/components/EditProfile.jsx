import { useState } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
    const dispatch = useDispatch();

    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
    const [gender, setGender] = useState(user.gender);
    const [age, setAge] = useState(user.age);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const saveProfile = async () => {
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const res = await axios.patch(
                BASE_URL + "/profile/edit",
                {
                    firstName,
                    lastName,
                    photoUrl,
                    age: Number(age),
                    gender,
                },
                { withCredentials: true }
            );
            dispatch(addUser(res?.data?.data));
            setSuccess("Profile updated successfully! 🎉");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-base-200">
            <div className="card w-96 bg-base-100 shadow-2xl rounded-3xl">
                <div className="card-body">
                    <h2 className="text-center text-2xl font-semibold mb-6">Edit Profile</h2>

                    {error && (
                        <div className="text-red-600 font-semibold mb-4">
                            <strong>Error: </strong> {error}
                        </div>
                    )}

                    {success && (
                        <div className="text-green-600 font-semibold mb-4">
                            {success}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveProfile(); }}>
                        <div className="flex justify-center">
                            <label className="cursor-pointer">
                                <img
                                    src={photoUrl}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                                />
                            </label>
                        </div>

                        <input
                            type="text"
                            value={photoUrl}
                            placeholder="Profile Photo URL"
                            className="input input-bordered w-full rounded-lg mt-2"
                            onChange={(e) => setPhotoUrl(e.target.value)}
                        />

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
                            type="number"
                            value={age}
                            placeholder="Age"
                            className="input input-bordered w-full rounded-lg"
                            onChange={(e) => setAge(e.target.value)}
                        />
                        <input
                            type="text"
                            value={gender}
                            placeholder="Gender"
                            className="input input-bordered w-full rounded-lg"
                            onChange={(e) => setGender(e.target.value)}
                        />

                        <button
                            type="submit"
                            className={`btn btn-primary w-full rounded-lg ${loading ? "loading" : ""}`}
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;

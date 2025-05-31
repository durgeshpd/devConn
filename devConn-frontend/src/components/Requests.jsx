import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Requests = () => {
    const requests = useSelector((store) => store.requests);
    const dispatch = useDispatch();

    const reviewRequest = async (status, _id) => {
        try {
            await axios.post(
                `${BASE_URL}/request/review/${status}/${_id}`,
                {},
                { withCredentials: true }
            );
            dispatch(removeRequest(_id));
        } catch (err) {
            console.error("Error reviewing request:", err);
        }
    };

    const fetchRequests = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/requests/received", {
                withCredentials: true,
            });
            dispatch(addRequests(res.data.data));
        } catch (err) {
            console.error("Error fetching requests:", err);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    if (!requests) return null;

    if (requests.length === 0)
        return (
            <div className="text-center mt-10 text-xl text-gray-600 dark:text-gray-300">
                No connection requests found
            </div>
        );

    return (
        <div className="max-w-2xl mx-auto mt-10 px-4">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
                Incoming Requests
            </h2>
            <div className="space-y-4">
                {requests.map((request) => {
                    const {
                        _id,
                        firstName,
                        lastName,
                        photoUrl,
                        age,
                        gender,
                    } = request.fromUserId;

                    return (
                        <div
                            key={_id}
                            className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-4 hover:shadow-lg transition duration-300"
                        >
                            <img
                                src={photoUrl || "https://via.placeholder.com/64x64.png?text=User"}
                                alt={firstName + " " + lastName}
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                            />
                            <div className="ml-4 flex-1">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                    {firstName} {lastName}
                                </h3>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    <p>Age: {age || "N/A"}</p>
                                    <p>Gender: {gender || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => reviewRequest("accepted", request._id)}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => reviewRequest("rejected", request._id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Requests;

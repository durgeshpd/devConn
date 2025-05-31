import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
    const connections = useSelector((store) => store.connections);
    const dispatch = useDispatch();

    const fetchConnections = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/connections", {
                withCredentials: true,
            });
            dispatch(addConnections(res.data.data));
        } catch (err) {
            console.error("Error fetching connections:", err);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    if (!connections) return null;

    if (connections.length === 0)
        return (
            <div className="text-center mt-10 text-xl text-gray-600 dark:text-gray-300">
                No connections found
            </div>
        );

    return (
        <div className="max-w-2xl mx-auto mt-10 px-4">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
                Connections
            </h2>
            <div className="space-y-4">
                {connections.map((connection) => {
                    if (!connection) return null;

                    const { _id, firstName, lastName, photoUrl, age, gender } = connection;

                    return (
                        <div
                            key={_id}
                            className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-4 hover:shadow-lg transition duration-300"
                        >
                            <div className="flex items-center">
                                <img
                                    src={photoUrl || "https://via.placeholder.com/64x64.png?text=User"}
                                    alt={firstName + " " + lastName}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                                />
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                        {firstName + " " + lastName}
                                    </h3>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        <p>Age: {age || "N/A"}</p>
                                        <p>Gender: {gender || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            <Link to={`/chat/${_id}`}>
                                <button className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                                    💬 Chat
                                </button>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Connections;

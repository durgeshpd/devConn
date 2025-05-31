import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
    const { _id, firstName, lastName, age, photoUrl, gender, emailId } = user;
    const dispatch = useDispatch();

    const handleSendRequest = async (status, userId) => {
        try {

            const res = await axios.post(BASE_URL + "/request/send/" + status + "/" + userId, {}, {withCredentials: true})

            dispatch(removeUserFeed(userId))

        } catch (err) {}
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="card w-full max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
                <figure className="relative w-full h-64">
                    <img
                        src={photoUrl}
                        alt={`${firstName} ${lastName}`}
                        className="object-cover w-full h-full rounded-t-lg"
                        style={{ objectPosition: 'top' }}
                    />
                </figure>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {firstName} {lastName}
                    </h2>
                    <p className="text-gray-600 mb-1"><strong>Age:</strong> {age || "N/A"}</p>
                    <p className="text-gray-600 mb-1"><strong>Gender:</strong> {gender || "N/A"}</p>
                    <p className="text-gray-600 mb-4"><strong>Email:</strong> {emailId}</p>

                    <div className="flex justify-between space-x-4">
                        <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300" onClick={() => handleSendRequest("interested", _id)}>
                            Interested
                        </button>
                        <button className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300" onClick={() => handleSendRequest("ignored", _id)}>
                            Ignore
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCard;

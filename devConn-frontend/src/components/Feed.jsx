import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
    const feed = useSelector((store) => store.feed);
    const dispatch = useDispatch();

    const getFeed = async () => {
        if (feed) return;
        try {
            const res = await axios.get(BASE_URL + "/users/feed", { withCredentials: true });
            dispatch(addFeed(res.data));
        }
        catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getFeed();
    }, []);

    if (!feed) return null;

    if (feed.length <= 0) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-semibold text-gray-700">NO NEW USER FOUND</h1>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            {feed && feed.length > 0 ? (
                <UserCard user={feed[0]} />
            ) : (
                <p className="text-gray-600 text-lg">Loading feed...</p>
            )}
        </div>
    );
};

export default Feed;

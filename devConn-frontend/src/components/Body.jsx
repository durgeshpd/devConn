import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import Navbar from "./Navbar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice"
import { useEffect } from "react";


const Body = () => {

    const dispatch = useDispatch();
    const navigate  = useNavigate();
    const userData = useSelector((store) => store.user);

    const fetchUser = async () => {
        try {
            const res = await axios.get(BASE_URL + "/profile/view", {
                withCredentials: true,
            });
            dispatch(addUser(res.data))
        }
        catch (err) {
            if (err.status === 401) {
            navigate("/login");
            }
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );
};

export default Body;

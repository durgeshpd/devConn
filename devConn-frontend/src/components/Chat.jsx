import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { BASE_URL } from "../utils/constants";
import axios from "axios";

dayjs.extend(relativeTime);

const Chat = () => {
    const { targetUserId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const user = useSelector((store) => store.user);
    const userId = user?._id;

    const bottomRef = useRef(null);

    const fetchChatMessages = async () => {
        try {
            const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
                withCredentials: true,
            });

            const chatMessages = chat?.data?.messages.map((msg) => ({
                firstName: msg?.senderId?.firstName,
                lastName: msg?.senderId?.lastName,
                text: msg?.text,
                avatar: msg?.senderId?.photoUrl,
                timestamp: msg?.createdAt,
            }));

            setMessages(chatMessages);
        } catch (err) {
            console.error("Error fetching chat messages:", err);
        }
    };

    useEffect(() => {
        fetchChatMessages();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const socket = createSocketConnection();

        socket.emit("joinChat", {
            firstName: user.firstName,
            lastName: user.lastName,
            userId,
            targetUserId,
            avatar: user.photoUrl,
        });

        socket.on("messageReceived", ({ firstName, lastName, text, avatar, timestamp }) => {
            setMessages((prev) => [
                ...prev,
                {
                    firstName,
                    lastName,
                    text,
                    avatar,
                    timestamp: timestamp || new Date().toISOString(),
                },
            ]);
        });

        return () => {
            socket.disconnect();
        };
    }, [userId, targetUserId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const socket = createSocketConnection();

        socket.emit("sendMessage", {
            firstName: user.firstName,
            lastName: user.lastName,
            userId,
            targetUserId,
            text: newMessage,
            avatar: user.photoUrl,
        });

        setNewMessage("");
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-4">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
                DevConn Chat
            </h2>

            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 h-96 overflow-y-auto space-y-4 border border-gray-200 dark:border-gray-700">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat ${
                            msg.firstName === user.firstName ? "chat-end" : "chat-start"
                        }`}
                    >
                        <div className="chat-image avatar">
                            <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img
                                    alt="user avatar"
                                    src={msg.avatar || "https://via.placeholder.com/40"}
                                />
                            </div>
                        </div>
                        <div className="chat-header text-sm text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-2">
                            {msg.firstName} {msg.lastName}
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                • {dayjs(msg.timestamp).fromNow()}
                            </span>
                        </div>
                        <div
                            className={`chat-bubble ${
                                msg.firstName === user.firstName
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                            } transition duration-300 ease-in-out`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={bottomRef}></div>
            </div>

            <div className="mt-4 flex items-center gap-2">
                <input
                    type="text"
                    className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    className="btn btn-primary px-6 transition transform hover:scale-105"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;

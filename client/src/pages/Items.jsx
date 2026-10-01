import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

function Items() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const getImageUrl = (image) => {
        if (!image) return null;

        if (image.startsWith("http://") || image.startsWith("https://")) {
            return image;
        }

        return `http://localhost:5000${image}`;
    };

    const fetchItems = async () => {
        try {
            setLoading(true);
            setMessage("");

            const response = await API.get("/items");

            if (response.data.success) {
                setItems(response.data.items || []);
            } else {
                setMessage("Unable to load items.");
            }
        } catch (error) {
            console.error("Fetch items error:", error);

            setMessage(
                error.response?.data?.message ||
                "Unable to load items. Please make sure the backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div className="items-page">
            <div className="items-container">

                <div className="items-header">
                    <div>
                        <p className="items-label">CAMPUS PORTAL</p>

                        <h1>Lost & Found Items</h1>

                        <p>
                            Browse lost and found items reported by students
                            around campus.
                        </p>
                    </div>

                    <Link
                        to="/report-item"
                        className="report-item-button"
                    >
                        + Report Item
                    </Link>
                </div>

                <div className="items-back">
                    <Link to="/dashboard">
                        ? Back to Dashboard
                    </Link>
                </div>

                {loading && (
                    <div className="items-message">
                        Loading items...
                    </div>
                )}

                {message && (
                    <div className="items-error">
                        {message}
                    </div>
                )}

                {!loading && !message && items.length === 0 && (
                    <div className="empty-items">
                        <h2>No Items Found</h2>

                        <p>
                            There are currently no lost or found items reported.
                        </p>

                        <Link to="/report-item">
                            Report an Item
                        </Link>
                    </div>
                )}

                {!loading && items.length > 0 && (
                    <div className="items-grid">

                        {items.map((item) => (
                            <div
                                className="item-card"
                                key={item.id}
                            >

                                {item.image ? (
                                    <img
                                        src={getImageUrl(item.image)}
                                        alt={item.title}
                                        className="item-image"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="no-image">
                                        No Image
                                    </div>
                                )}

                                <div className="item-card-content">

                                    <span
                                        className={
                                            item.status === "lost"
                                                ? "status-badge lost"
                                                : item.status === "found"
                                                    ? "status-badge found"
                                                    : "status-badge recovered"
                                        }
                                    >
                                        {item.status || "Unknown"}
                                    </span>

                                    <h2>{item.title}</h2>

                                    <p className="item-description">
                                        {item.description || "No description provided."}
                                    </p>

                                    <div className="item-details">

                                        <p>
                                            <strong>Location:</strong>{" "}
                                            {item.location}
                                        </p>

                                        <p>
                                            <strong>Category:</strong>{" "}
                                            {item.category}
                                        </p>

                                        <p>
                                            <strong>Date:</strong>{" "}
                                            {item.date}
                                        </p>

                                        {item.reporter_name && (
                                            <p>
                                                <strong>Reported by:</strong>{" "}
                                                {item.reporter_name}
                                            </p>
                                        )}

                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}

export default Items;

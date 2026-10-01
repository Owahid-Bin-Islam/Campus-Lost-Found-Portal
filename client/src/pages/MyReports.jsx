import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [editData, setEditData] = useState({
        title: "",
        category: "",
        description: "",
        status: "lost",
        location: "",
        date: "",
        contact: "",
        image: null
    });

    const [saving, setSaving] = useState(false);

    const getImageUrl = (image) => {
        if (!image) return null;

        if (image.startsWith("http://") || image.startsWith("https://")) {
            return image;
        }

        return `http://localhost:5000${image}`;
    };

    const fetchReports = async () => {
        try {
            setLoading(true);
            setMessage("");

            const token = localStorage.getItem("token");

            if (!token) {
                setMessage("Please login first.");
                return;
            }

            const response = await fetch(
                "http://localhost:5000/api/items/my-reports",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to load reports"
                );
            }

            setReports(result.items || []);

        } catch (error) {
            console.error("My reports error:", error);
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const startEdit = (report) => {
        setEditingId(report.id);

        setEditData({
            title: report.title || "",
            category: report.category || "",
            description: report.description || "",
            status: report.status || "lost",
            location: report.location || "",
            date: report.date
                ? String(report.date).substring(0, 10)
                : "",
            contact: report.contact || "",
            image: null
        });

        setMessage("");
    };

    const cancelEdit = () => {
        setEditingId(null);

        setEditData({
            title: "",
            category: "",
            description: "",
            status: "lost",
            location: "",
            date: "",
            contact: "",
            image: null
        });
    };

    const handleEditChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image") {
            setEditData((previous) => ({
                ...previous,
                image: files[0] || null
            }));

            return;
        }

        setEditData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const saveEdit = async (id) => {
        try {
            setSaving(true);
            setMessage("");

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Please login first.");
            }

            const formData = new FormData();

            formData.append("title", editData.title);
            formData.append("category", editData.category);
            formData.append("description", editData.description);
            formData.append("status", editData.status);
            formData.append("location", editData.location);
            formData.append("date", editData.date);
            formData.append("contact", editData.contact);

            if (editData.image) {
                formData.append("image", editData.image);
            }

            const response = await fetch(
                `http://localhost:5000/api/items/${id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to update report"
                );
            }

            setMessage("Report updated successfully.");

            cancelEdit();

            await fetchReports();

        } catch (error) {
            console.error("Update report error:", error);
            setMessage(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this report?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/items/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to delete report"
                );
            }

            setReports((previous) =>
                previous.filter((report) => report.id !== id)
            );

            setMessage("Report deleted successfully.");

        } catch (error) {
            console.error("Delete report error:", error);
            setMessage(error.message);
        }
    };

    return (
        <div className="my-reports-page">
            <div className="my-reports-container">

                <div className="my-reports-header">
                    <div>
                        <p className="items-label">
                            STUDENT PORTAL
                        </p>

                        <h1>My Reports</h1>

                        <p>
                            View and manage the lost and found
                            items you have reported.
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

                {message && (
                    <div className="items-message">
                        {message}
                    </div>
                )}

                {loading && (
                    <div className="items-message">
                        Loading your reports...
                    </div>
                )}

                {!loading && reports.length === 0 && (
                    <div className="empty-items">
                        <h2>No Reports Yet</h2>

                        <p>
                            You have not reported any lost or
                            found items yet.
                        </p>

                        <Link to="/report-item">
                            Report an Item
                        </Link>
                    </div>
                )}

                {!loading && reports.length > 0 && (
                    <div className="items-grid">

                        {reports.map((report) => (

                            <div
                                className="item-card"
                                key={report.id}
                            >

                                {report.image ? (
                                    <img
                                        src={getImageUrl(report.image)}
                                        alt={report.title}
                                        className="item-image"
                                    />
                                ) : (
                                    <div className="no-image">
                                        No Image
                                    </div>
                                )}

                                <div className="item-card-content">

                                    <span
                                        className={
                                            report.status === "lost"
                                                ? "status-badge lost"
                                                : report.status === "found"
                                                    ? "status-badge found"
                                                    : "status-badge recovered"
                                        }
                                    >
                                        {report.status}
                                    </span>

                                    <h2>{report.title}</h2>

                                    <p className="item-description">
                                        {report.description || "No description provided."}
                                    </p>

                                    <div className="item-details">

                                        <p>
                                            <strong>Location:</strong>{" "}
                                            {report.location}
                                        </p>

                                        <p>
                                            <strong>Category:</strong>{" "}
                                            {report.category}
                                        </p>

                                        <p>
                                            <strong>Date:</strong>{" "}
                                            {report.date}
                                        </p>

                                        <p>
                                            <strong>Contact:</strong>{" "}
                                            {report.contact}
                                        </p>

                                    </div>

                                    {editingId === report.id ? (

                                        <div className="edit-report-form">

                                            <h3>Edit Report</h3>

                                            <input
                                                type="text"
                                                name="title"
                                                value={editData.title}
                                                onChange={handleEditChange}
                                                placeholder="Item name"
                                            />

                                            <select
                                                name="category"
                                                value={editData.category}
                                                onChange={handleEditChange}
                                            >
                                                <option value="">
                                                    Select category
                                                </option>

                                                <option value="Electronics">
                                                    Electronics
                                                </option>

                                                <option value="Documents">
                                                    Documents
                                                </option>

                                                <option value="Clothing">
                                                    Clothing
                                                </option>

                                                <option value="Accessories">
                                                    Accessories
                                                </option>

                                                <option value="Books">
                                                    Books
                                                </option>

                                                <option value="Keys">
                                                    Keys
                                                </option>

                                                <option value="Wallet">
                                                    Wallet
                                                </option>

                                                <option value="Other">
                                                    Other
                                                </option>
                                            </select>

                                            <select
                                                name="status"
                                                value={editData.status}
                                                onChange={handleEditChange}
                                            >
                                                <option value="lost">
                                                    Lost
                                                </option>

                                                <option value="found">
                                                    Found
                                                </option>

                                                <option value="recovered">
                                                    Recovered
                                                </option>
                                            </select>

                                            <textarea
                                                name="description"
                                                value={editData.description}
                                                onChange={handleEditChange}
                                                placeholder="Description"
                                                rows="3"
                                            />

                                            <input
                                                type="text"
                                                name="location"
                                                value={editData.location}
                                                onChange={handleEditChange}
                                                placeholder="Location"
                                            />

                                            <input
                                                type="date"
                                                name="date"
                                                value={editData.date}
                                                onChange={handleEditChange}
                                            />

                                            <input
                                                type="text"
                                                name="contact"
                                                value={editData.contact}
                                                onChange={handleEditChange}
                                                placeholder="Contact"
                                            />

                                            <input
                                                type="file"
                                                name="image"
                                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                                onChange={handleEditChange}
                                            />

                                            <div className="edit-buttons">

                                                <button
                                                    type="button"
                                                    onClick={() => saveEdit(report.id)}
                                                    disabled={saving}
                                                >
                                                    {saving
                                                        ? "Saving..."
                                                        : "Save Changes"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={cancelEdit}
                                                    disabled={saving}
                                                >
                                                    Cancel
                                                </button>

                                            </div>

                                        </div>

                                    ) : (

                                        <div className="report-actions">

                                            <button
                                                type="button"
                                                onClick={() => startEdit(report)}
                                                className="edit-report-button"
                                            >
                                                Edit Report
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(report.id)}
                                                className="delete-report-button"
                                            >
                                                Delete Report
                                            </button>

                                        </div>

                                    )}

                                </div>
                            </div>

                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}

export default MyReports;

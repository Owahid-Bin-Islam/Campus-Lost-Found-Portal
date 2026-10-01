import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ReportItem() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        status: "lost",
        location: "",
        date: "",
        contact: "",
        image: null
    });

    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image") {
            const file = files[0];

            setFormData((previous) => ({
                ...previous,
                image: file || null
            }));

            if (file) {
                setPreview(URL.createObjectURL(file));
            } else {
                setPreview(null);
            }

            return;
        }

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Please login before submitting a report.");
            }

            const data = new FormData();

            data.append("title", formData.title);
            data.append("category", formData.category);
            data.append("description", formData.description);
            data.append("status", formData.status);
            data.append("location", formData.location);
            data.append("date", formData.date);
            data.append("contact", formData.contact);

            if (formData.image) {
                data.append("image", formData.image);
            }

            const response = await fetch(
                "http://localhost:5000/api/items",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: data
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to submit report"
                );
            }

            setMessage("Report submitted successfully!");

            setFormData({
                title: "",
                category: "",
                description: "",
                status: "lost",
                location: "",
                date: "",
                contact: "",
                image: null
            });

            setPreview(null);

        } catch (error) {
            console.error("Submit report error:", error);
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="report-page">

            <div className="report-container">

                <div className="report-header">

                    <h1>Report an Item</h1>

                    <p>
                        Help your campus community by reporting a
                        lost, found, or recovered item.
                    </p>

                </div>

                <div className="items-back">
                    <Link to="/dashboard">
                        ? Back to Dashboard
                    </Link>
                </div>

                {message && (
                    <div className="report-message">
                        {message}
                    </div>
                )}

                <form
                    className="report-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>
                            Item Name *
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Black Wallet"
                            required
                        />

                    </div>


                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Category *
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
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

                        </div>


                        <div className="form-group">

                            <label>
                                Report Type *
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >

                                <option value="lost">
                                    Lost Item
                                </option>

                                <option value="found">
                                    Found Item
                                </option>

                                <option value="recovered">
                                    Recovered Item
                                </option>

                            </select>

                        </div>

                    </div>


                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the item, color, brand, identifying marks, etc."
                            rows="5"
                        />

                    </div>


                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Location *
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. DIU Library"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Date *
                            </label>

                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    <div className="form-group">

                        <label>
                            Contact Information *
                        </label>

                        <input
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            placeholder="Phone number or email"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Item Picture
                        </label>

                        <input
                            type="file"
                            name="image"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={handleChange}
                        />

                    </div>


                    {preview && (
                        <div className="image-preview">

                            <p>
                                Image Preview
                            </p>

                            <img
                                src={preview}
                                alt="Item preview"
                            />

                        </div>
                    )}


                    <button
                        type="submit"
                        className="submit-report"
                        disabled={loading}
                    >
                        {loading
                            ? "Submitting..."
                            : "Submit Report"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default ReportItem;

import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="dashboard-page">

            <nav className="navbar">
                <div className="brand">
                    Campus Lost & Found
                </div>

                <div className="nav-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/report-item">Report Item</Link>
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            <main className="dashboard-container">

                <section className="welcome-section">
                    <p className="small-title">STUDENT PORTAL</p>

                    <h1>
                        Welcome, {user?.name || "Student"}!
                    </h1>

                    <p>
                        Find lost belongings, report found items,
                        and help reconnect your campus community.
                    </p>
                </section>

                <section className="dashboard-cards">

                    <div className="dashboard-card">
                        <div className="card-icon">??</div>

                        <h2>Find an Item</h2>

                        <p>
                            Browse lost and found reports from
                            students around campus.
                        </p>

                        <Link to="/items" className="card-button">
                            Browse Items
                        </Link>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-icon">??</div>

                        <h2>Report an Item</h2>

                        <p>
                            Lost something or found something?
                            Create a report here.
                        </p>

                        <Link to="/report-item" className="card-button">
                            Create Report
                        </Link>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-icon">??</div>

                        <h2>My Reports</h2>

                        <p>
                            View and manage the items you have
                            reported.
                        </p>

                        <Link to="/my-reports" className="card-button">
                            My Reports
                        </Link>
                    </div>

                </section>

                <section className="dashboard-info">
                    <h2>How Campus Lost & Found Works</h2>

                    <div className="steps">

                        <div>
                            <strong>01</strong>
                            <h3>Report</h3>
                            <p>
                                Submit details about a lost or found item.
                            </p>
                        </div>

                        <div>
                            <strong>02</strong>
                            <h3>Verify</h3>
                            <p>
                                Reports can be reviewed by the campus admin.
                            </p>
                        </div>

                        <div>
                            <strong>03</strong>
                            <h3>Reconnect</h3>
                            <p>
                                Help return belongings to their rightful owners.
                            </p>
                        </div>

                    </div>
                </section>

            </main>

        </div>
    );
}

export default Dashboard;

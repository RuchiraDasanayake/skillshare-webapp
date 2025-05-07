import RightPart from "./RightPart/RightPart";
import Profile from "./Profile/Profile";
const ProfileHome = () => {
    return (
        <div style={{ width: "100%", padding: "1rem", backgroundColor: "#f3e8ff", minHeight: "100vh" }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "1.5rem",
                }}
            >
                {/* Main Content */}
                <div
                    style={{
                        flex: "1 1 60%",
                        minWidth: "300px",
                        maxWidth: "800px",
                        margin: "0 auto",
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        padding: "1rem",
                        boxShadow: "0 4px 12px rgba(128, 90, 213, 0.2)", // Purple shadow
                    }}
                >
                    <Profile />
                </div>

                {/* Right Sidebar */}
                <div
                    style={{
                        flex: "1 1 25%",
                        minWidth: "250px",
                        maxWidth: "300px",
                        position: "sticky",
                        top: "1rem",
                        alignSelf: "flex-start",
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        padding: "1rem",
                        boxShadow: "0 4px 12px rgba(128, 90, 213, 0.2)", // Purple shadow
                    }}
                >
                    <RightPart />
                </div>
            </div>
        </div>
    );
};
export default ProfileHome;
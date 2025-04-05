import { Route, Routes } from "react-router-dom";
import Homesection from "./HomeSection/Homesection";
import RightPart from "./RightPart/RightPart";
import Profile from "./Profile/Profile";

const ProfileHome = () => {
    return (
        <div style={{ width: "100%", padding: "0 16px" }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    width: "100%",
                    flexWrap: "nowrap",
                    gap: "16px",
                }}
            >
                {/* Middle Content */}
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        maxWidth: "67%",
                    }}
                >
                    <div style={{ width: "100%" }}>
                        <Routes>
                            <Route path="/" element={<Homesection />} />
                            <Route path="/profile/5" element={<Profile />} />
                        </Routes>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div
                    style={{
                        width: "100%",
                        maxWidth: "20%",
                        position: "sticky",
                        top: "0",
                        paddingTop: "16px",
                    }}
                >
                    <RightPart />
                </div>
            </div>
        </div>
    );
};

export default ProfileHome;

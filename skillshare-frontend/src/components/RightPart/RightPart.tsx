import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import Brightness6Icon from "@mui/icons-material/Brightness6";
import { Button } from "@mui/material";
import SubscriptionModal from "../SubscriptionModal/SubscriptionModal";

const RightPart = () => {
  const [openSubscriptionModal, setOpenSubscriptionModal] = React.useState(false);

  const handleOpenSubscriptionModal = () => setOpenSubscriptionModal(true);
  const handleCloseSubscriptionModal = () => setOpenSubscriptionModal(false);

  const handleChangeTheme = () => {
    console.log("handle change theme");
  };

  return (
    <div className="py-5 sticky top-0">
      {/* Search Input */}
      <div className="relative flex items-center">
        <input
          type="text"
          className="py-3 rounded-full text-gray-500 w-full pl-12 border border-gray-300"
          placeholder="Search..."
        />
        <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
          <SearchIcon className="text-gray-500" />
        </div>
        <Brightness6Icon className="ml-3 cursor-pointer" onClick={handleChangeTheme} />
      </div>

      {/* Subscription Section */}
      <section className="my-5">
        <h1 className="text-xl font-bold">Get Verified</h1>
        <h1 className="font-bold my-2">Subscribe to unlock new features</h1>
        <Button
          variant="contained"
          sx={{ padding: "10px", px: "20px", borderRadius: "25px" }}
          onClick={handleOpenSubscriptionModal}
        >
          Get Verified
        </Button>
      </section>

      {/* What's Happening Section */}
      <section className="mt-7 space-y-5">
        <h1 className="font-bold text-xl py-1">What's Happening?</h1>
        <div>
          <p className="text-sm">No recent updates.</p>
        </div>
      </section>

      {/* Subscription Modal */}
      <SubscriptionModal open={openSubscriptionModal} handleClose={handleCloseSubscriptionModal} />
    </div>
  );
};

export default RightPart;

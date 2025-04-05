import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "none",
  outline: "none",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

interface SubscriptionModalProps {
  handleClose: () => void;
  open: boolean;
}

export default function SubscriptionModal({ handleClose, open }: SubscriptionModalProps) {
  const [plan, setPlan] = React.useState<any>("Annually");

  const features = [
    "Prioritized rankings in conversations and search",
    "Longer tweets and video uploads",
    "Exclusive subscriber-only features",
    "Edit tweets within a limited time after posting",
    "Customizable app icons and themes",
    "Access to experimental new features before public release",
  ];

  return (
    <div>
      <Modal
        open={open} // Now properly using `open` prop
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Choose Your Plan</h2>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>

          <div className="flex justify-center py-10 border-gray-500">
            <div className="w-[80%] space-y-10">
              <div className="p-3 rounded-md flex items-center justify-between shadow-lg bg-gray-400">
                <h1 className="text-lg pr-6">
                  Blue subscribers with a verified phone number will get a blue
                  checkmark once approved.
                </h1>
                <img
                  className="w-24 h-24 object-contain"
                  src="https://cdn-icons-png.flaticon.com/512/4823/4823340.png"
                  alt="Blue Checkmark"
                />
              </div>

              {/* Plan Selection */}
              <div className="flex justify-between border rounded-full px-5 py-3 bg-gray-100">
                <div className="flex space-x-8">
                  <div
                    onClick={() => setPlan("Annually")}
                    className={`cursor-pointer font-medium ${
                      plan === "Annually" ? "text-black" : "text-gray-400"
                    }`}
                  >
                    Annually
                    <span className="ml-2 text-green-600 font-semibold text-sm">
                      SAVE 12%
                    </span>
                  </div>

                  <div
                    onClick={() => setPlan("Monthly")}
                    className={`cursor-pointer font-medium ${
                      plan === "Monthly" ? "text-black" : "text-gray-400"
                    }`}
                  >
                    Monthly
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                {features.map((item, index) => (
                  <div key={index} className="flex items-center space-x-5">
                    <FiberManualRecordIcon sx={{ width: "7px", height: "7px" }} />
                    <p className="text-xs">{item}</p>
                  </div>
                ))}
              </div>

              {/* Pricing Section */}
              <div className="cursor-pointer flex justify-center bg-gray-900 text-white rounded-full px-5 py-3">
                <span className="line-through italic">Rs.12,800</span>
                <span className="px-5">Rs. 10,500/year</span>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useFormik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import { Avatar, IconButton, TextField, CircularProgress } from "@mui/material";
import "./ProfileModal.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outline: "none",
  borderRadius: 4,
  maxHeight: "90vh", // Prevents modal overflow
  overflowY: "auto",
};

interface ProfileModalProps {
  open: boolean;
  handleClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, handleClose }) => {
  const [uploading, setUploading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      fullname: "",
      website: "",
      location: "",
      bio: "",
      backgroundImage: "",
      image: "",
    },
    onSubmit: (values) => {
      console.log("Form Submitted", values);
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    const { name } = event.target;
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        formik.setFieldValue(name, reader.result); // Store image as Base64 for preview
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } else {
      setUploading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <form onSubmit={formik.handleSubmit} className="w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
              <p className="text-lg font-semibold">Edit Profile</p>
            </div>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto">
            {/* Background Image Upload */}
            <div className="relative">
              <img
                className="w-full h-[12rem] object-cover rounded-md"
                src={formik.values.backgroundImage || "https://cdn.pixabay.com/photo/2025/03/20/18/28/sunset-9483600_1280.jpg"}
                alt="Background"
              />
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageChange}
                name="backgroundImage"
                accept="image/*"
              />
            </div>

            {/* Profile Image Upload */}
            <div className="relative transform -translate-y-16 ml-4">
              <Avatar
                sx={{ width: "10rem", height: "10rem", border: "4px solid white" }}
                src={formik.values.image || "https://secure.gravatar.com/avatar/3fbe84b93407a82e024390352db2544b"}
              />
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageChange}
                name="image"
                accept="image/*"
              />
              {uploading && <CircularProgress size={24} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <TextField fullWidth label="Full Name" {...formik.getFieldProps("fullname")} />
              <TextField fullWidth multiline rows={4} label="Bio" {...formik.getFieldProps("bio")} />
              <TextField fullWidth label="Website" {...formik.getFieldProps("website")} />
              <TextField fullWidth label="Location" {...formik.getFieldProps("location")} />
            </div>

            {/* Birthdate & Professional Section */}
            <div className="mt-4">
              <p className="text-lg font-semibold">Birth date <span className="text-sm text-blue-500 cursor-pointer">Edit</span></p>
              <p className="text-2xl">October 26, 1996</p>
            </div>

            <p className="py-3 text-lg font-semibold text-blue-500 cursor-pointer">Edit Professional Profile</p>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ProfileModal;

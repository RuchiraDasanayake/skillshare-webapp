import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { Avatar } from "@mui/material";
import Verified from "@mui/icons-material/Verified";
import { useNavigate } from "react-router";
import ImageIcon from "@mui/icons-material/Image";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import { useFormik } from "formik";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  outline: "none",
  borderRadius: 4,
};

interface ReplyModalProps {
  handleClose: () => void;
  open: boolean;
}

const ReplyModal: React.FC<ReplyModalProps> = ({ handleClose, open }) => {
  const navigate = useNavigate();
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState("");

  const handleSubmit = (values: { content: string; image: File | string; twitId: number }) => {
    console.log("Form Submitted", values);
  };

  const formik = useFormik({
    initialValues: {
      content: "",
      image: "",
      twitId: 4,
    },
    onSubmit: handleSubmit,
  });

  const handleSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadingImage(true);
    const imgUrl = event.target.files ? event.target.files[0] : null;
    if (imgUrl) {
      formik.setFieldValue("image", imgUrl);
      setSelectedImage(URL.createObjectURL(imgUrl)); // Display image preview
    }
    setUploadingImage(false);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex space-x-5">
            <Avatar
              onClick={() => navigate(`/profile/${6}`)}
              className="cursor-pointer"
              alt="username"
              src="https://secure.gravatar.com/avatar/3fbe84b93407a82e024390352db2544b?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FMP-5.png"
            />
            <div className="w-full">
              <div className="flex justify-between items-center">
                <div className="flex cursor-pointer items-center space-x-2">
                  <span className="font-semibold">Minsandha Pathirana</span>
                  <span className="text-gray-600">@Mina 2m</span>
                  <Verified className="ml-2 w-5 h-5 text-[#1d9bf0]" />
                </div>
              </div>
              <div className="mt-5">
                <p className="mb-7 mt-5">Welcome Here Man</p>
              </div>
            </div>
          </div>

          <section className={`py-10`}>
            <div className="flex space-x-5">
              <Avatar
                alt="username"
                src="https://secure.gravatar.com/avatar/3fbe84b93407a82e024390352db2544b?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FMP-5.png"
              />
              <div className="w-full">
                <form onSubmit={formik.handleSubmit}>
                  <div>
                    <input
                      type="text"
                      placeholder="What is happening"
                      className={`border-none outline-none text-xl bg-transparent w-full`}
                      {...formik.getFieldProps("content")}
                    />
                    {formik.errors.content && formik.touched.content && (
                      <span className="text-red-500">{formik.errors.content}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-5">
                    <div className="flex space-x-5 items-center">
                      <label className="flex items-center space-x-2 rounded-md cursor-pointer">
                        <ImageIcon className="text-[#1d9bf0]" />
                        <input
                          type="file"
                          name="imageFile"
                          className="hidden"
                          onChange={handleSelectImage}
                        />
                      </label>
                      <FmdGoodIcon className="text-[#1d9bf0]" />
                      <TagFacesIcon className="text-[#1d9bf0]" />
                    </div>

                    <Button
                      sx={{
                        width: "100%",
                        borderRadius: "20px",
                        paddingY: "8px",
                        paddingX: "20px",
                        bgcolor: "#1e88e5",
                      }}
                      variant="contained"
                      type="submit"
                    >
                      Tweet
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </Box>
      </Modal>
    </div>
  );
};

export default ReplyModal;

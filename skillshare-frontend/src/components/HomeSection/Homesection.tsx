import { Avatar, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup'
import ImageIcon from '@mui/icons-material/Image';
import { useState } from "react";
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import TweetCard from "./TweetCard";

    const validationSchema = Yup.object().shape({
        content:Yup.string().required("Tweet text is required!")
    })

    const Homesection = () => {

        const [uploadingImage, setuploadingImage] = useState(false);
        const [selectedImage, setselectedImage] = useState("")

        const handleSubmit = (values: any) => {
            console.log("values", values)
        }

        const formik = useFormik({
            initialValues:{
                content:"",
                image:""
            },
            onSubmit:handleSubmit,
            validationSchema,
    })

    const handleSelectImage = (event : any) =>{
        setuploadingImage(true);
        const imgUrl = event.target.files[0]
        formik.setFieldValue("image", imgUrl);
        setselectedImage(imgUrl)
        setuploadingImage(false);
    }

  return (
        <div className="space-y-5 text-center">
                {/* <section>
                    <h1 className="py-5 text-x1 font-bold opacity-">Home</h1>
                </section> */}
                 <section className={`pb-10`}>
                    <div className="flex space-x-5">
                        <Avatar alt="username" src="C:\\Users\\minsanda\\Pictures\\Slideshow\\view-old-tree-lake-with-snow-covered-mountains-cloudy-day.jpg"/>
                        <div className="w-full">
                            <form onSubmit ={formik.handleSubmit}>
                                <div>
                                    <input type="text"  placeholder='What is happening' className={`border-none outline-none text-xl bg-transparent`}{...formik.getFieldProps("content")}/>
                                    {formik.errors.content && formik.touched.content &&(
                                        <span className="text-red-500">{formik.errors.content}</span>
                                    )}
                                </div>
                            
                                <div className="flex justify-between items-center mt-5">
                                    <div className="flex space-x-5 items-center">
                                        <label className="flex items-center space-x-2 rounded-md cursor-pointer">
                                        <ImageIcon className="text-[#1d9bf0]"/>
                                        <input type="file" name="imageFile" className="hidden" onChange={handleSelectImage}/>
                                        </label>
                                        <FmdGoodIcon className="text-[#1d9bf0]"/>
                                        <TagFacesIcon className="text-[#1d9bf0]"/>
                                    </div>
                                    <div>
                                        <Button sx={{width:"100%",borderRadius:"20px", paddingY:"8px", paddingX:"20px", bgcolor:"#1e88e5"}} variant="contained" type="submit">
                                            Tweet
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </section> 
                <section >
                  { [1,1,1,1,1].map((item) => <TweetCard/>)}
                </section>
        </div>
  )
}

export default Homesection;
 
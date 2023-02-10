import React, { useState } from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import Header from "./Header";
import "./Home.css"
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import DataTable from "./Table";
// import "./Home.scss"


const Home = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [isBrandFileSelected, setIsBrandFileSelected] = useState(false);
    const [brandFile, setBrandFile] = useState();
    const [domainFile, setDomainFile] = useState();
    const [isDomainFileSelected, setIsDomainFileSelected] = useState(false);
    const [brandsData, setBrandsData] = useState([]);
    const [domainsData, setdomainsData] = useState([]);
    const [loading, setLoading] = useState(false);




    /*  
    Function to capture file upload action and set the "brandsFile" and "domainFile" state 
    based on the type of file selected 
     
      @param {Object} event : onChange event of file upload
      @param {String} type : Type of file uploaded ("domain"  or "brand")

      @return {void}

      */
    const handleFileChange = (event, type) => {
        const file = event.target.files[0]
        if (file.name) {
            if (type === "brand") {
                setBrandFile(file)
                setIsBrandFileSelected(true);
            }
            else {
                setDomainFile(file)
                setIsDomainFileSelected(true);
            }

        }
    }




    /* Function to upload file to the backend , get the response data from the backend and set the brandsData
        or domainsData state based on the received response

        @param {String} url : backend endpoint url to post file
        @param {String} type : Type of file uploaded ("domain"  or "brand")
        @param {Object} file : File to be uploaded

        @return {void}
    
    */
    const uploadTestFile = async (url, file, type) => {
        try {
            setLoading(true)
            const formdata = new FormData();
            formdata.append("file", file)
            const res = await axios.post(url, formdata)
            if (res.data) {
                if (type === "brand") {
                    setBrandsData(res.data.data)
                    enqueueSnackbar("Brands File uploaded successfully", { variant: "success" })
                }
                else {
                    setdomainsData(res.data.data)
                    enqueueSnackbar("Domains File uploaded successfully", { variant: "success" })
                }
                setLoading(false)
            }
            else if (res.status === 500) {
                enqueueSnackbar("Oops! File can't be uploaded, please check your server or reload the page", { variant: "success" })
            }
        }
        catch (err) {
            setLoading(false)
            enqueueSnackbar("Something went wrong! Please restart the application or check the console for error", { variant: "error" })
            console.log(err)

        }

    }





    return (
        <Box>
            <Header />
            <Stack marginTop={6} spacing={3}  >
                {!domainsData?.length ? <Typography className="uploadtext" variant="h5" fontWeight={600} color="tertiary" textAlign="center">Upload your files here</Typography> : null}
                {loading ?
                    <Box className="uploadtextbox">
                        <Typography variant="h6">Uploading ...</Typography> <CircularProgress sx={{ marginTop: "2rem" }} size="7rem" thickness={1} />
                    </Box> :
                    !brandsData?.length ?
                        (<Box className="home-box">
                            <form action="#" encType="multipart/form-data">
                                <div >
                                    <input type="file" id="file" name="file" onChange={(e) => handleFileChange(e, "brand")} accept=".xlsx" />
                                </div>
                            </form>
                            <Button variant="contained" className="uploadbutton" onClick={(e) => uploadTestFile("http://localhost:8082/upload/brands/brand", brandFile, "brand")} disabled={!isBrandFileSelected}>upload brands file</Button>
                        </Box>) :
                        !domainsData?.length ?
                            (<Box className="home-box">
                                <form action="#">
                                    <div >
                                        <input type="file" id="file" name="file" onChange={(e) => handleFileChange(e, "domain")} accept=".xlsx" />
                                    </div>
                                </form>
                                <Button variant="contained" className="uploadbutton" onClick={(e) => uploadTestFile("http://localhost:8082/upload/domains/domain", domainFile, "domain")} disabled={!isDomainFileSelected}>upload domains file</Button>
                            </Box>) :
                            <DataTable brandsData={brandsData} domainsData={domainsData} />
                }

            </Stack>
        </Box>
    )
}

export default Home;
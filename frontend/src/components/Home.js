import React, { useState } from "react";
import { Box, Typography, Stack, Button} from "@mui/material";
import Header from "./Header";
import * as XLSX from "xlsx"
import { compress} from 'compress-json';
import "./Home.css"
import axios from "axios";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";


const Home = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [isBrandFileSelected, setIsBrandFileSelected] = useState(false);
    const [brandFile, setBrandFile] = useState();
    const [domainFile, setDomainFile] = useState();
    const [isDomainFileUploaded, setIsDomainFileUploaded] = useState(false);
    const [isDomainFileSelected, setIsDomainFileSelected] = useState(false);
    const [brandsData, setBrandsData] = useState([]);
    const [domainData, setDomainData] = useState([]);
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

  


 /*
     Function to post the file to the backend . This function will be called in "postFileToBackend()"
     function.

            @param  {String} url : backend URL to post the data
            @param  {Array} data : Array of objects of domains or brands 

            @return {Object} : response object of axios post request
 */
    const uploadFile = async (url, data) => {
        try {
            const response = await axios.post(url, data);
            return response;
        }
        catch (err) {
            console.log(err)
            return null;
        }
    }



    /* 
     Function to read the excel file and convert the same to json . Set the "brandsData" or
      "domainsData" state based on the file selected for upload

        @param {String} url : url to post the json converted to backend
        @param {Object} e : File Upload event 



    */
    const postFileToBackend = async (url, e, file, type) => {
        setLoading(true)
        e.preventDefault();
        try {
            var reader = new FileReader();
            reader.readAsBinaryString(file)
            reader.onload = async (e) => {
                var dataToRead = e.target.result;
                let readedData = XLSX.read(dataToRead, { type: 'binary' });
                const wsname = readedData.SheetNames[0];
                const ws = readedData.Sheets[wsname];
                /* Convert array to json*/
                const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
                const compressedData = compress(dataParse);
                const response = await uploadFile(url, compressedData)
                console.log(response)

                if (response.data) {
                    setLoading(false);
                    if (type === "domain") {
                        setIsDomainFileUploaded(true);
                        setDomainData(dataParse)          
                    }
                    else {
                        setBrandsData(dataParse)
                    }
                    enqueueSnackbar("File uploaded successfully !!", { variant: "success" })
                }
                else {
                    setLoading(false);
                    enqueueSnackbar("Something went wrong, please try again!!", { variant: "error" })
                }

            }

        }
        catch (err) {
            console.log(err)
            setLoading(false)
        }
    }


    return (
        <Box>
            <Header />
            <Stack marginTop={6} spacing={3} height="100vh" alignItems="center">
                {!isDomainFileUploaded ? <Typography variant="h6" fontWeight={600} color="tertiary" textAlign="center">Upload Your Files Here</Typography> : null}
                {loading ? <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100vh", alignItems: "center" }}><Typography variant="h6">Uploading ...</Typography> <CircularProgress sx={{ marginTop: "1rem" }} /> </Box> : brandsData.length === 0 ?
                    <Box className="home-box">
                        <form action="#">
                            <div >
                                <input type="file" id="file" onChange={(e) => handleFileChange(e, "brand")} accept=".xlsx" />
                            </div>
                        </form>
                        <Button variant="contained" onClick={(e) => postFileToBackend("http://localhost:8082/upload/brands", e, brandFile, "brand")} disabled={!isBrandFileSelected}>upload brands file</Button>
                    </Box> : !isDomainFileUploaded && !domainData.length ?
                        <Box className="home-box">
                            <form action="#">
                                <div >
                                    <input type="file" id="file" onChange={(e) => handleFileChange(e, "domain")} accept=".xlsx" />
                                </div>
                            </form>
                            <Button variant="contained" onClick={(e) => postFileToBackend("http://localhost:8082/upload/domains", e, domainFile, "domain")} disabled={!isDomainFileSelected}>upload domains file</Button>
                        </Box> :
                       <Box marginTop={10}> <Link to="/table" style={{textDecoration: 'none'}}><Button  variant="contained">View Table</Button></Link> </Box>}
               
            </Stack>
        </Box>
    )
}

export default Home;
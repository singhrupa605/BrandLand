import React, { useState, useEffect, useCallback } from "react";
import { Box, Stack, Typography, Button, CircularProgress } from "@mui/material";
import "./Table.css"
import axios from "axios"
import DataGridDemo from "./Demo";
import { useSnackbar } from "notistack";
import "./Table.scss"

const DataTable = ({ domainsData, brandsData }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [domainRows, setDomainRows] = useState([])
    const [unSuspiciousDomain, setUnSuspiciousDomain] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [loading, setLoading] = useState(false)
    const [loadbuttonclassname, setClassName] = useState("loadbutton")

    // const isDomainReachable = async (data) => {
    //     try {
    //         const response = await axios.post("http://localhost:8082/upload/domains/reachable",
    //             { domains: data })
    //         if (response.status === 200 && response.data.length > 0) {
    //             return response.data
    //         }
    //     }
    //     catch (err) {
    //         console.log(err)
    //         return []
    //     }
    // }

    const createRowData = useCallback(
        async (domainDataParam) => {
            try {
                let rows = domainDataParam.slice(1, domainDataParam.length).map((x, i) => (
                    {
                        "id": i + 1,
                        "domain": x[0],
                        "new or existing": "",
                        "brand name": "",
                        "brand Id": "",
                        "industry": "",
                        "sensitive": "",
                        "suspicious domain": "",
                        "comments": "",
                        "process": "",
                    })
                )
                let unSuspiciousDomainData = []
                // if (rows.length) {
                //     unSuspiciousDomainData = await isDomainReachable(rows)

                // }
                setDomainRows(rows)
                // setUnSuspiciousDomain(unSuspiciousDomainData)
            }

            catch (err) {
                console.log(err)
            }
        }, [])


       
  
    const displayData = () => {
        setClassName('loadbutton animate');
        setTimeout(function(){
            setClassName('loadbutton');
        },800);
        setLoading(true)
        
         createRowData(domainsData).then(x => {
           
            setLoading(false)
            setTimeout( ()=>
            {
                setDataLoaded(true)
            },1000)
        })
       
        
    }



    return (
        <Box>
            <Stack  className="table-box">
                <Typography className="datatable" variant="h5" fontWeight={600} textAlign="center" >Data Table</Typography>
                {(!dataLoaded && !loading) && <button className={loadbuttonclassname} onClick={displayData} >
                    LOAD TABLE</button>}
                {loading ? <CircularProgress /> :
                    dataLoaded && <DataGridDemo domainRows={domainRows} setDomainRows={setDomainRows} brandsData={brandsData} />}
            </Stack>
        </Box>

    )
}

export default DataTable
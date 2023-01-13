import React, { useState, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { downloadExcel } from "react-export-table-to-excel";
import "./Table.css"
import { useSnackbar } from "notistack";
import axios from "axios"
import DataGridDemo from "./Demo";
import Header from "./Header";

const DataTable = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [brandsData, setBrandsData] = useState([]);
    const [domainsData, setDomainsData] = useState([]);
    const [domainRows, setDomainRows] = useState([])
    const [unSuspiciousDomain, setUnSuspiciousDomain] = useState([]);

   
    const getBrandsData = async () => {
        try {
            const response = await axios.get(`http://localhost:8082/upload/brands/latest`);
            if (response.status === 200 && response.data.length > 0) {
                setBrandsData(response.data);
            }
            else {
                enqueueSnackbar("Oops! somethig went wrong, please check the server", { variant: "error" })
            }
        }

        catch (err) {
            console.log(err)
        }

    }



    const isDomainReachable = async (data) => {
        try {
            const response = await axios.post("http://localhost:8082/upload/domains/reachable",
                { domains: data })
            if (response.data.length) {
                setUnSuspiciousDomain(response.data)
            }
        }
        catch (err) {
            console.log(err)
            return []
        }
    }




    const createRowData = async (domainData) => {
        let rows = []
        try {
            for (let i = 1; i < domainData.length; i++) {
                let domainObj = {
                    "id": i, "domain": domainData[i][0], "new or existing": "", "brand name": "",
                    "brand Id": "", "industry": "", "sensitive": "", "suspicious domain": "", "comments": "", "process": "",
                }
                rows.push(domainObj);
            }
            if (rows.length) {
                await isDomainReachable(rows)
            }
            setDomainRows(rows)
        }

        catch (err) {
            console.log(err)
        }
    }






    const getDomainsData = async () => {
        const response = await axios.get(`http://localhost:8082/upload/domains/latest`);
        if (response.status === 200 && response.data.length > 0) {
            setDomainsData(response.data);
            createRowData(response.data)
        }
        else {
            enqueueSnackbar("Oops! somethig went wrong, please check the server", { variant: "error" })
        }

    }

    useEffect(() => {
        (async () => {
            await getBrandsData()
            await getDomainsData()
        })()
            ;
    }, [])




    return (
        <Box>
            <Header />
            <Stack spacing={3} className="table-box">
                <Typography variant="h5" fontWeight={600} textAlign="center" >Data Table</Typography>
                {domainsData ? <DataGridDemo  domainData={domainRows} brandsData={brandsData} unSuspiciousDomain={unSuspiciousDomain} /> : null}
            </Stack>
        </Box>

    )
}

export default DataTable
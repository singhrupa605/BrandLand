import React, { useEffect, useState } from 'react';
import { Table } from "react-bootstrap";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import BootstrapTable from './BootstrapTable';


export default function DataGridDemo({ domainData, brandsData, unSuspiciousDomain }) {
    const [rows, setRows] = useState([])
    const [brandObjects, setBrandObjects] = useState([]);
    const [topLevelDomains, setTopLevelDomains] = useState([]);
    const [loading, setLoading] = useState(false)
    const [unSuspicious, setUnSuspicious] = useState([])
    const { enqueueSnackbar } = useSnackbar();
    const sensitiveIndustries = ["Cannabis And Cannabis Products", "Dating", "Firearms & Weapons", "Weight Loss Products", "Weight Loss Programs", "Gambling (Online)", "Politics", "Alternative & Natural Medicine", "Sexual Health", "Affiliate Marketing", "Money Making Offers", "Online Advertising Companies", "Intimate Apparel", "Specialized Merchants", "Tobacco & Smoking Products"]


    /* Creates an array of all the top level domains from brands file and sets the "topLevelDomains" state
 
     @param    {Array} brandsArray  : array of brands details
     @return   {void}   
 
   */
    const filterTopLevelDomain = (brandsArray) => {
        let filteredTopLevelDomains = [];
        for (let i = 1; i < brandsArray.length; i++) {
            for (let j = 0; j < brandsArray[i].length; j++) {
                if (brandsArray[0][j] === "Top Level Domain" && brandsArray[i][j] !== null) {
                    let domain = brandsArray[i][j]
                    if (domain.includes("|")) {
                        let splittedArray = domain.split("|");
                        filteredTopLevelDomains = [...filteredTopLevelDomains.concat(splittedArray)]
                    }
                    else {
                        filteredTopLevelDomains.push(domain)
                    }
                }
            }

        }
        setTopLevelDomains(filteredTopLevelDomains)

    }


    /* Creates an array of objects from brands file consisting Brand ID, Name, Bundles, Industry , and Top Level Domains
    and set the "brandObjects" state
    
        @param {Array} brandsArray : array of brands details
        
        @return {void}

    */
    const createBrandObjects = (brandsArray) => {
        let dataToSet = [];
        for (let i = 1; i < brandsArray.length; i++) {
            let brandObj = {}
            for (let j = 0; j < brandsArray[i].length; j++) {
                brandObj[brandsArray[0][j]] = brandsArray[i][j]
            }
            dataToSet.push(brandObj)
        }
        setBrandObjects([...dataToSet])
    }



    /* Function used to set the cell value of any row and column , which is used by handleProcess() 
     function to process individual row value 
       
          @param {Object} row : row selected to process
          @param {String} value : value to be set for a cell
          @param {String} column : Name of column whose field value to be set 
          @param {Array} rows : current rows of the table     
  
          @return  {Array} : An updated array with newly set values of the selected row
    */

    const setCellValue = (row, value, column, rows) => {
        const newArray = [...rows].map(obj => {
            if (row.id === obj.id) {
                return { ...obj, [column]: value }
            }
            return obj;
        })
        return newArray
    }


    /* Function used to display the "Suspicious Domain? column of the table based on
       whether a particular domain is reachable or not
       
         @param {String} type : "process" or "process all"
         @param {Object} row  : row selected to process if type is "process"
         @param {Array} rows : current table rows
         
         @return {Array} : Updated array with "Suspicious Domain?" column populated
      */
    const fillSuspiciousDomain = (type, row, rows) => {
        let newArray = [];
        if (type === "process all") {
            newArray = [...rows].map(obj => {
                if (unSuspicious.includes(obj.domain)) {
                    return { ...obj, "suspicious domain": "No" }
                }
                else {
                    return { ...obj, "suspicious domain": "NA" }
                }
            })
        }
        else if (type === "process") {
            if (unSuspicious.includes(row.domain)) {
                newArray = setCellValue(row, "No", "suspicious domain", rows)
            }
            else {
                newArray = setCellValue(row, "NA", "suspicious domain", rows)
            }
        }
        return newArray

    }



    /* Function to populate the "New or Existing" column of the table depending 
    on whether a particular domain is present in the "Top Level Domain" column 
    of the brands file and is there in unsuspicious domains list 
      
        @param {String} type : "process" or "process all"
        @param {Object} row  : row selected to process if type is "process"
        @param {Array} rows : current table rows 

        @return {Array} : Updated array with "New or Existing" column populated
  */
    const fillNewOrExisting = (type, row, rows) => {
        let newArray = []
        if (type === "process all") {
            newArray = [...rows].map(obj => {
                if (topLevelDomains.includes(obj.domain) && unSuspicious.includes(obj.domain)) {
                    return { ...obj, "new or existing": "Existing" }
                }
                else if (!topLevelDomains.includes(obj.domain) && unSuspicious.includes(obj.domain)) {
                    return { ...obj, "new or existing": "New" }
                }
                else {
                    return { ...obj, "new or existing": "NA" }
                }
            })
        }
        else if (type === "process") {
            if (topLevelDomains.includes(row.domain) && unSuspicious.includes(row.domain)) {
                newArray = setCellValue(row, "Existing", "new or existing", rows)
            }
            else if (!topLevelDomains.includes(row.domain) && unSuspicious.includes(row.domain)) {
                newArray = setCellValue(row, "New", "new or existing", rows)
            }
            else {
                newArray = setCellValue(row, "NA", "new or existing", rows)
            }
        }
        return newArray
    }





    /* Function to populate the "Brand Name", "Brand ID" and "Industry" columns of the table depending 
    on whether a particular domain is "Existing", "New" or "NA"
   
        @param {String} type : "process" or "process all"
        @param {Object} row  : row selected to process if type is "process"
        @param {Array} rows : current table rows 

        @return {Array} : Updated array with "Brand Name", "Brand ID" and "Industry" columns populated
  */
    const fillExistingBrandDetails = (type, row, rows) => {
        let newArray = [];
        if (type === "process all") {
            newArray = [...rows].map((row) => {
                if (row["new or existing"] === "Existing") {
                    const obj = brandObjects.find(brand => brand["Top Level Domain"] === row.domain)
                    return { ...row, "brand Id": obj["Brand ID"], "brand name": obj["Name"], "industry": obj["Industry"] }
                }
                else if (row["new or existing"] === "NA") {
                    return { ...row, "brand Id": "NA", "brand name": "NA", "industry": "NA" }
                }
                else {
                    return row;
                }
            })
        }
        else if (type === "process") {
            const currRow = rows.find(o => o.id === row.id)
            if (currRow["new or existing"] === "Existing") {
                const obj = brandObjects.find(brand => brand["Top Level Domain"] === row.domain)
                newArray = setCellValue(currRow, obj["Brand ID"], "brand Id", rows)
                newArray = setCellValue(currRow, obj["Name"], "brand name", [...newArray])
                newArray = setCellValue(currRow, obj["Industry"], "industry", [...newArray])
            }
            else if (currRow["new or existing"] === "NA") {
                newArray = setCellValue(currRow, "NA", "brand Id", rows)
                newArray = setCellValue(currRow, "NA", "brand name", [...newArray])
                newArray = setCellValue(currRow, "NA", "industry", [...newArray])
            }
            else {
                newArray = setCellValue(row, "", "brand Id", rows)
            }
        }
        return newArray
    }




 /* Function to populate the "Sensitive Category?" column of the table depending 
    on whether the industry of a domain exists in the list of sensitive industries or not
   
        @param {String} type : "process" or "process all"
        @param {Object} row  : row selected to process if type is "process"
        @param {Array} rows : current table rows 

        @return {Array} : Updated array with "Sensitive Category?" column populated
  */

    const fillSensitiveCategory = (type, row, rows) => {
        let newArray = []
        if (type === "process all") {
            newArray = [...rows].map((obj) => {
                let splitted = [];
                if ((obj.industry.includes("|"))) {
                    splitted = [...obj.industry.split("|")]
                }
                else {
                    splitted.push(obj.industry)
                }
                const sensitiveCategoryIndustries = splitted.filter((ind) => sensitiveIndustries.includes(ind))
                if (sensitiveCategoryIndustries.length > 0 && obj["new or existing"] !== "NA") {
                    return { ...obj, "sensitive": "Yes" }
                }
                else if (sensitiveCategoryIndustries.length === 0 && obj["new or existing"] !== "NA") {
                    return { ...obj, "sensitive": "No" }
                }
                else {
                    return { ...obj, "sensitive": "NA" }
                }
            })
        }
        else {
            let splitted = [];
            const obj = rows.find(o => o.domain === row.domain)
            if (obj.industry !== "NA") {
                if ((obj.industry.includes("|"))) {
                    splitted = [...obj.industry.split("|")]
                }
                else {
                    splitted.push(obj.industry)
                }
                const sensitiveCategoryIndustries = splitted.filter((ind) => sensitiveIndustries.includes(ind))

                if (sensitiveCategoryIndustries.length > 0 && obj["new or existing"] !== "NA") {
                    newArray = setCellValue(obj, "Yes", "sensitive", rows)
                }
                else if (sensitiveCategoryIndustries.length === 0 && obj["new or existing"] !== "NA") {
                    newArray = setCellValue(obj, "No", "sensitive", rows)
                }
            }
            else {
                newArray = setCellValue(obj, "NA", "sensitive", rows)
            }
        }
        return newArray
    }



    /* Function to process individual row
    
        @param  {Object} row : row selected to be processed
        @return {void} 
    */
    const handleProcess = (row ) => {
        const data = fillSuspiciousDomain("process", row, rows)
        const arr = fillNewOrExisting("process", row, data)
        const rowIds = fillExistingBrandDetails("process", row, arr)
        const array = fillSensitiveCategory("process", row, rowIds)
        setRows(array)
    }


    /* Function to process all rows at once on a single click */

    const handleProcessAll = () => {
        setLoading(true)
        setTimeout(() => {
            if (unSuspicious.length > 0) {
                setLoading(false)
                const data = fillSuspiciousDomain("process all", "", rows)
                const arr = fillNewOrExisting("process all", "", data)
                const rowIds = fillExistingBrandDetails("process all", "", arr)
                const array = fillSensitiveCategory("process all", "", rowIds)
                setRows(array)
            }
            else {
                setLoading(false)
                enqueueSnackbar("Cannot process the data , please retry or restart the appplication", { variant: "error" })
            }
        }, 5000)

    }


 

    useEffect(() => {
        setRows(domainData)
    }, [domainData])
 


    useEffect(() => {
        createBrandObjects(brandsData)
        filterTopLevelDomain(brandsData)
        setUnSuspicious(unSuspiciousDomain)
    }, [brandsData, unSuspiciousDomain])


 

    return (
        <Box sx={{ height: "100vh", width: '100%' }}>
            {loading ? <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem" }}> <CircularProgress />  </Box> : null}
            {rows.length && !loading ? <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem" }}> <Button onClick={handleProcessAll} variant='contained'>Process All</Button></Box> : null}
            {rows.length ?
            <BootstrapTable rows={rows} handleProcess={handleProcess} setRows={setRows}/>
                : null}
        </Box>
    );
}
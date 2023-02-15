import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import BootstrapTable from './BootstrapTable';
import axios from 'axios';
import "./Progress.css"
import Progress from './Progress';
import { downloadExcel } from 'react-export-table-to-excel';


export default function DataGridDemo({ domainRows, setDomainRows, brandsData }) {
    const [brandObjects, setBrandObjects] = useState([]);
    const [topLevelDomains, setTopLevelDomains] = useState([]);
    const [loading, setLoading] = useState(false)
    const [buttonLoader, setButtonLoader] = useState(false)
    const { enqueueSnackbar } = useSnackbar();
    const [current, setCurrent] = useState(null)
    const [dataProcessing, setDataProcessing] = useState(false)

    const sensitiveIndustries = ["Cannabis And Cannabis Products", "Dating", "Firearms & Weapons", "Weight Loss Products", "Weight Loss Programs", "Gambling (Online)", "Politics", "Alternative & Natural Medicine", "Sexual Health", "Affiliate Marketing", "Money Making Offers", "Online Advertising Companies", "Intimate Apparel", "Specialized Merchants", "Tobacco & Smoking Products"]
    const header = ["S No.", "Domain", "New or Existing", "Brand Name", "Brand ID", "Industry", "Sensitive Category?",
        "Suspicious Domain?", "Comments"]





    const isDomainReachable = async (data) => {
        try {
            const response = await axios.post("http://localhost:8082/upload/domains/reachable",
                { domains: data })
            if (response.status === 200 && response.data.length > 0) {
                return response.data
            }
            else {
                console.log(response)
                return [];
            }
        }
        catch (err) {
            console.log(err)
            return []
        }
    }





    const isSingleDomainReachable = async (data) => {
        try {
            const response = await axios.post("http://localhost:8082/upload/domains/singlereachable",
                { domain: data })
            if (response.status === 200 && response.data) {
                return response.data
            }
            else {
                console.log(response)
                return null;
            }
        }
        catch (err) {
            console.log(err)
            return null
        }
    }
    /* Creates an array of all the top level domains from brands file and sets the "topLevelDomains" state
 
     @param    {Array} brandsArray  : array of brands details
     @return   {void}   
 
   */
    const filterTopLevelDomain = (brandsArray) => {
        let filteredTopLevelDomains = [];
        const headersList = brandsArray.length ? brandsArray[0] : []
        const indexForTopLevelDomain = headersList.indexOf("Top Level Domain")

        filteredTopLevelDomains = brandsArray.flatMap((x, i) => {
            if (i !== 0) {
                if (x[indexForTopLevelDomain] !== null) {
                    let domain = x[indexForTopLevelDomain]
                    if (domain?.includes("|")) {
                        let splittedArray = domain.split("|");
                        return [...filteredTopLevelDomains.concat(splittedArray)]
                    }
                    else {
                        return domain
                    }
                }
            }
            return null
        }).filter(y => !!y)
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
    const fillSuspiciousDomain = async (type, row, rows, unSuspiciousDomain) => {
        let newArray = [];
        if (type === "process all") {
            newArray = [...rows].map(obj => {
                if (unSuspiciousDomain.includes(obj.domain)) {
                    return { ...obj, "suspicious domain": "No" }
                }
                else {
                    return { ...obj, "suspicious domain": "NA" }
                }
            })
        }
        else if (type === "process") {
            const isReachable = await isSingleDomainReachable(row.domain)
            console.log(isReachable)
            if (isReachable) {
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
    const fillNewOrExisting = async (type, row, rows, unSuspiciousDomain) => {
        let newArray = []
        if (type === "process all") {
            newArray = [...rows].map(obj => {
                if (topLevelDomains.includes(obj.domain) && unSuspiciousDomain.includes(obj.domain)) {
                    return { ...obj, "new or existing": "Existing" }
                }
                else if (!topLevelDomains.includes(obj.domain) && unSuspiciousDomain.includes(obj.domain)) {
                    return { ...obj, "new or existing": "New" }
                }
                else {
                    return { ...obj, "new or existing": "NA" }
                }
            })
        }
        else if (type === "process") {
            const isReachable = await isSingleDomainReachable(row.domain)
            if (topLevelDomains.includes(row.domain) && isReachable) {
                newArray = setCellValue(row, "Existing", "new or existing", rows)
            }
            else if (!topLevelDomains.includes(row.domain) && isReachable) {
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
    const handleProcess = async (row) => {
        try {
            setCurrent(row)
            setButtonLoader(true)
            if (topLevelDomains.length) {
                const data = await fillSuspiciousDomain("process", row, domainRows)
                const arr = await fillNewOrExisting("process", row, data)
                const rowIds = fillExistingBrandDetails("process", row, arr)
                const array = fillSensitiveCategory("process", row, rowIds)
                setDomainRows(array)
                setButtonLoader(false)
            }
            else {
                setButtonLoader(false)
                enqueueSnackbar("Cannot process the data , please retry or restart the appplication", { variant: "error" })
            }
        }
        catch (err) {
            console.log(err)
        }


    }



    /* Function to process all rows at once on a single click */

    const handleProcessAll = async () => {
        setLoading(true)
        setDataProcessing(true)
        new Promise(async (resolve, reject) => {
            resolve(await isDomainReachable(domainRows))

        }).then(async (unSuspiciousDomain) => {
            console.log(unSuspiciousDomain)
            if (unSuspiciousDomain.length > 0 && topLevelDomains.length) {
                setLoading(false)
                setDataProcessing(false)
                const data = await fillSuspiciousDomain("process all", "", domainRows, unSuspiciousDomain)
                const arr = await fillNewOrExisting("process all", "", data, unSuspiciousDomain)
                const rowIds = fillExistingBrandDetails("process all", "", arr)
                const array = fillSensitiveCategory("process all", "", rowIds)
                setDomainRows(array)
            }
            else {
                setLoading(false)
                setDataProcessing(false)
                enqueueSnackbar("Cannot process the data , please retry or restart the appplication", { variant: "error" })
            }


        }).catch(err => {
            setLoading(false)
            setDataProcessing(false)
            console.log(err)
            enqueueSnackbar(err, { variant: "error" })
        })


    }



    function handleDownloadExcel() {
        downloadExcel({
            fileName: "demo",
            sheet: "demo.xlsx",
            tablePayload: {
                header,
                // accept two different data structures
                body: domainRows.map((obj) => ({
                    "id": obj["id"], "domain": obj["domain"], "new or existing": obj["new or existing"], "brand name": obj["brand name"],
                    "brand Id": obj["brand Id"], "industry": obj["industry"], "sensitive": obj["sensitive"],
                    "suspicious domain": obj["suspicious domain"], "comments": obj["comments"]
                }))
            },
        });
    }



    useEffect(() => {
        createBrandObjects(brandsData)
        filterTopLevelDomain(brandsData)
    }, [])



    return (
        <Box sx={{ width: '100%' }}>
            {!domainRows?.length ? <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem" }}>  <CircularProgress />  </Box> :
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Stack direction="row" spacing={6} paddingBottom={3}
                    > <Button disabled={loading} onClick={handleProcessAll} variant='contained' >Process All</Button>
                        <Button variant="contained" onClick={handleDownloadExcel} disabled={loading}>download excel <DownloadIcon /></Button></Stack>
                    {loading ? <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem" }}><CircularProgress sx={{ marginTop: "2rem" }} thickness={1} size="7rem" />  {dataProcessing && <Progress />
                    } </Box> : <BootstrapTable rows={domainRows} handleProcess={handleProcess} setRows={setDomainRows} buttonLoader={buttonLoader} current={current} />}
                </Box>}

        </Box>
    );
}


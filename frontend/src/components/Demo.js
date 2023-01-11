import React, { useEffect, useState } from 'react';
import { Table } from "react-bootstrap";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import BootstrapTable from './BootstrapTable';

// Styling of the data-grid using Mui Styles
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 0,
    color:
        theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.85)',
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(','),
    WebkitFontSmoothing: 'auto',
    letterSpacing: 'normal',
    '& .MuiDataGrid-columnsContainer': {
        backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : 'blue',
    },
    '& .MuiDataGrid-iconSeparator': {
        display: 'none',
    },
    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
        borderRight: `1px solid ${theme.palette.mode === 'light' ? 'rgb(182, 184, 188)' : 'black'
            }`,
        borderTop: `1px solid ${theme.palette.mode === 'light' ? 'rgb(182, 184, 188)' : 'black'
            }`,
    },
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
        borderBottom: `1px solid ${theme.palette.mode === 'light' ? 'rgb(182, 184, 188)' : 'pink'
            }`,
        borderRight: `1px solid ${theme.palette.mode === 'light' ? 'rgb(182, 184, 188)' : 'pink'
            }`,
    },
    '& .MuiDataGrid-cell': {
        color:
            theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.65)',
    },
    '& .MuiPaginationItem-root': {
        borderRadius: 0,
    },
}));




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
            console.log(obj)
            if (obj.industry !== "NA") {
                if ((obj.industry.includes("|"))) {
                    splitted = [...obj.industry.split("|")]
                }
                else {
                    splitted.push(obj.industry)
                }
                console.log(splitted)
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
    const handleProcess = (row) => {
        const data = fillSuspiciousDomain("process", row, rows)
        const arr = fillNewOrExisting("process", row, data)
        const rowIds = fillExistingBrandDetails("process", row, arr)
        const array = fillSensitiveCategory("process", row, rowIds)
        setRows(array)
        //setRows(rowIds)
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


    const renderDetailsButton = (params) => {
        return <Box><Button variant='contained' onClick={() => handleProcess(params.row)} sx={{ textDecoration: "none" }}>process</Button><AutorenewIcon /></Box>
    }

    const columns = [
        { field: 'id', headerName: 'S No.', minWidth: 50 },

        {
            field: 'domain',
            headerName: 'Domain',
            editable: true,
            minWidth: 200,
        },
        {
            field: 'new or existing',
            headerName: 'New or Existing?',
            editable: true,
            minWidth: 130,
        },
        {
            field: 'brand name',
            headerName: 'Brand Name',
            editable: true,
            minWidth: 200,
        },
        {
            field: 'brand Id',
            headerName: 'Brand ID',
            editable: true,
            minWidth: 200
        }
        ,
        {
            field: 'industry',
            headerName: 'Industry',
            editable: true,
            minWidth: 250
        },
        {
            field: 'sensitive',
            headerName: 'Sensitive Catergory?',
            editable: true,
            minWidth: 200,
        },
        {
            field: 'suspicious domain',
            headerName: 'Suspicious Domain?',
            editable: true,
            minWidth: 200,
        },
        {
            field: 'comments',
            headerName: 'Comments',
            editable: true,
            minWidth: 300
        },
        {
            field: 'process',
            headerName: 'Start Processing',
            width: 150,
            renderCell: renderDetailsButton,
            disableClickEventBubbling: true,
            disableExport: true
        }
    ];



    useEffect(() => {
        setRows(domainData)
    }, [])


    useEffect(() => {
        createBrandObjects(brandsData)
        filterTopLevelDomain(brandsData)
        setUnSuspicious(unSuspiciousDomain)
    }, [brandsData, unSuspiciousDomain])


    //Custom Toolbar component to display "Export" option in the data grid

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer sx={{ justifyContent: "flex-end" }}>
                <Button></Button>  <GridToolbarExport sx={{ color: "black", fontWeight: "400", marginBottom: "2rem", marginRight: "4rem" }} />
            </GridToolbarContainer>
        );
    }
 

    return (
        <Box sx={{ height: "100vh", width: '100%' }}>
            {loading ? <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem" }}> <CircularProgress />  </Box> : null}
            {rows.length && !loading ? <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem" }}> <Button onClick={handleProcessAll} variant='contained'>Process All</Button></Box> : null}
            {rows.length ?
            <BootstrapTable currentPageRows={rows} handleProcess={handleProcess}/>
                // <StyledDataGrid
                //     pageSize={100}
                //     rowsPerPageOptions={[100]}
                //     rows={rows}
                //     components={{ Toolbar: CustomToolbar }}
                //     experimentalFeatures={{ newEditingApi: true }}
                //     columns={columns}
                // /> 
                : null}


        </Box>
    );
}
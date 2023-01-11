import { Table, } from "react-bootstrap";
import { Button , Stack, Box} from "@mui/material";
import "./Table.css"
import DownloadIcon from '@mui/icons-material/Download';
import React, { useRef } from 'react';
import { downloadExcel } from 'react-export-table-to-excel';

const BootstrapTable = ({
    currentPageRows,
    handleProcess,
}) => {


    const header = ["S No.", "Domain", "New or Existing", "Brand Name", "Brand ID", "Industry", "Sensitive Category?",
        "Suspicious Domain?", "Comments"]


    function handleDownloadExcel() {
        downloadExcel({
            fileName: "demo",
            sheet: "demo.xlsx",
            tablePayload: {
                header,
                // accept two different data structures
                body: currentPageRows.map((obj) => ({
                    "id": obj["id"], "domain": obj["domain"], "new or existing": obj["new or existing"], "brand name": obj["brand name"],
                    "brand Id": obj["brand Id"], "industry": obj["industry"], "sensitive": obj["sensitive"],
                    "suspicious domain": obj["suspicious domain"], "comments": obj["comments"]
                }))
            },
        });
    }
    return (
        <Stack spacing={3} alignItems="center">
           <Box justifyContent="flex-end"><Button  variant="contained" onClick={handleDownloadExcel}>download excel <DownloadIcon /></Button></Box> 
            <Table
                striped
                bordered
                hover
                responsive
                contentEditable
                className="table"
                bsPrefix="table"
            >
                <thead className="thead">
                    <tr key={0} id={0}>
                        <th>S No.</th>
                        <th>Domain</th>
                        <th>New or Existing</th>
                        <th>Brand Name</th>
                        <th>Brand ID</th>
                        <th>Industry</th>
                        <th>Sensitive Category?</th>
                        <th>Suspicious Domain?</th>
                        <th>Comments</th>
                        <th>Process</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPageRows.map((row) => {
                        return (
                            <tr key={row["id"]}>
                                <td>{row["id"]}</td>
                                <td>{row["domain"]}</td>
                                <td>{row["new or existing"]}</td>
                                <td>{row["brand name"]}</td>
                                <td>{row["brand Id"]}</td>
                                <td>{row["industry"]}</td>
                                <td>{row["sensitive"]}</td>
                                <td>{row["suspicious domain"]}</td>
                                <td>{row["comments"]}</td>
                                <td>
                                    <Stack direction="horizontal" className="actions" >
                                        <Button
                                            variant="contained"
                                            onClick={() => handleProcess(row)} >
                                            Process
                                        </Button>
                                    </Stack>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </Stack>

    );
}
export default BootstrapTable

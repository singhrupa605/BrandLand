import { Table, } from "react-bootstrap";
import { Button, Stack, Box } from "@mui/material";
import "./Table.css"
import DownloadIcon from '@mui/icons-material/Download';
import React, { useEffect, useState } from 'react';
import { downloadExcel } from 'react-export-table-to-excel';
import "./BootstrapTable.css"
import { style } from "@mui/system";


const BootstrapTable = ({
    rows,
    handleProcess,
    setRows
}) => {

    const [focused, setFocused] = useState(null)
    const header = ["S No.", "Domain", "New or Existing", "Brand Name", "Brand ID", "Industry", "Sensitive Category?",
        "Suspicious Domain?", "Comments"]


    function handleDownloadExcel() {
        downloadExcel({
            fileName: "demo",
            sheet: "demo.xlsx",
            tablePayload: {
                header,
                // accept two different data structures
                body: rows.map((obj) => ({
                    "id": obj["id"], "domain": obj["domain"], "new or existing": obj["new or existing"], "brand name": obj["brand name"],
                    "brand Id": obj["brand Id"], "industry": obj["industry"], "sensitive": obj["sensitive"],
                    "suspicious domain": obj["suspicious domain"], "comments": obj["comments"]
                }))
            },
        });
    }

    const handleEdit = (e, row) => {
        setFocused(e.target.textContent)
    }
    const handleSave = (e, row) => {
        const fieldEdited = e.target.id
        if (focused !== e.target.textContent) {
            let updatedRows = [...rows].map((obj) => {
                if (row.id === obj.id) {
                    return { ...obj, [fieldEdited]: e.target.textContent }
                }
                else {
                    return obj
                }
            })
            setRows(updatedRows)

        }
    }


   
    return (
        <Stack spacing={3} alignItems="center">
            <Box justifyContent="flex-end"><Button variant="contained" onClick={handleDownloadExcel}>download excel <DownloadIcon /></Button></Box>
            <Table
                striped
                bordered
                hover
                responsive
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
                <tbody className="tbody">
                    {rows.map((row) => {

                        return (
                            <tr key={row["id"]} id={row["id"]}  >
                                <td>{row["id"]}</td>
                                <td>{row["domain"]}</td>
                                <td contentEditable suppressContentEditableWarning className="cell" id="new or existing" onClick={(e) => handleEdit(e, row)} onBlur={(e) => handleSave(e, row)}>{row["new or existing"]}</td>
                                <td contentEditable suppressContentEditableWarning className="cell" id="brand name" onClick={(e) => handleEdit(e, row)} onBlur={(e) => handleSave(e, row)}>{row["brand name"]}</td>
                                <td contentEditable suppressContentEditableWarning className="cell" id="brand Id" onClick={(e) => handleEdit(e, row)} onBlur={(e) => handleSave(e, row)}>{row["brand Id"]}</td>
                                <td contentEditable suppressContentEditableWarning className="cell" id="industry" onClick={(e) => handleEdit(e, row)} onBlur={(e) => handleSave(e, row)}>{row["industry"]}</td>
                                <td contentEditable suppressContentEditableWarning className="cell" id="sensitive" onClick={(e) => handleEdit(e, row)} onBlur={(e) => handleSave(e, row)}>{row["sensitive"]}</td>
                                <td contentEditable suppressContentEditableWarning className="cell" id="suspicious domain" onClick={(e) => handleEdit(e, row)} onBlur={(e) => handleSave(e, row)}>{row["suspicious domain"]}</td>
                                <td contentEditable suppressContentEditableWarning className="cell" id="comments" onClick={(e) => handleEdit(e, row)} onBlur={(e) => handleSave(e, row)}>{row["comments"]}</td>
                                <td>
                                    <Stack className="actions" >
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

import { Table, } from "react-bootstrap";
import { Button, Stack, CircularProgress } from "@mui/material";
import "./Table.css"
import React, { useEffect, useState } from 'react';
import "./BootstrapTable.css"
// import CustomPagination from "./CustomPagination";



const BootstrapTable = ({
    rows,
    handleProcess,
    setRows,
    buttonLoader,
    current
}) => {

    // const [rowsPerPage] = useState(10)
    const [focused, setFocused] = useState(null)
    // const [page, setPage] = useState(0)
    // const [currentPageRows , setCurrentPageRows] = useState([]);


    const handleEdit = (e) => {
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

    // useEffect(() => {
    //     const lastIndex = (page + 1) * rowsPerPage;
    //     const beginIndex = lastIndex - rowsPerPage;
    //     const currentRows = rows.slice(beginIndex, lastIndex);
    //     setCurrentPageRows(currentRows)
    // }, [page])


    return (
        <Stack spacing={3} alignItems="center">
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
                                        <Button variant="contained" onClick={async (e) => {
                                            e.preventDefault()
                                            handleProcess(row)
                                        }}>Process {(buttonLoader && current.id === row.id) && <CircularProgress sx={{ marginLeft: "0.5rem" }} color="tertiary" size="20px" />}</Button>
                                    </Stack>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            {/* <CustomPagination page={page} rowsPerPage={10} setPage={setPage} totalRows={rows?.length ? rows.length : 0} /> */}

        </Stack>

    );
}
export default BootstrapTable

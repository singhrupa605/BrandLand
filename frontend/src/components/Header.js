import React from "react";
import { Box, Typography, AppBar, Toolbar, Menu, MenuItem } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';

const Header = () => {
    return (
        <Box >
            <AppBar position="static">
                <Toolbar  >
                 <FileUploadIcon/>   <Typography marginLeft={1} variant="h6">Brand Land</Typography>
                </Toolbar>
            </AppBar>
        
        </Box>
    )
}

export default Header;
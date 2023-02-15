import React from "react";
import { Box, Typography, AppBar, Toolbar } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';

import "./Header.css"


const Header = () => {
    
    const style={
    
    textShadow: `0 2px 1px #79a06d, 
-1px 3px 1px #5d7d72;, 
-2px 5px 1px #8ebf80`,
     fontWeight: "600",
    }

    
    return (
        <Box >
            <AppBar position="static" className="appbar">
                <Toolbar  >
                 <FileUploadIcon/>   <Typography sx={style} marginLeft={1} variant="h5">Brand Land</Typography>
                </Toolbar>
            </AppBar>
        
        </Box>
    )
}

export default Header;
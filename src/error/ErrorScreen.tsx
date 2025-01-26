import React from "react";
import {Icon} from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";
type ErrorScreenProps =  {
    icon: SvgIconComponent;
    message: string
}

const ErrorScreen :React.FC<ErrorScreenProps> = ({icon, message}) => {
    return (
        <>
            <Icon />
            {icon}
            <p>{message}</p></>
    );
}
export default ErrorScreen;

import React from 'react';
import ErrorScreen from './ErrorScreen';
import ReportIcon from '@mui/icons-material/Report';

const InternalServerError: React.FC = () => {
    return (
        <>
            <ReportIcon />
                <p> message="500 Internal Server Error. Something went wrong on our end."
            </p>
        </>
    );
};

export default InternalServerError;

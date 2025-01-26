import React from 'react';
import LockIcon from '@mui/icons-material/Lock';

const UnauthorizedError: React.FC = () => {
    return (
        <>
            <LockIcon/>
            <p>message="401 Unauthorized. You need to log in to access this page."</p>
        </>
)};

export default UnauthorizedError;

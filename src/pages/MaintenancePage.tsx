import React, {PropsWithChildren} from 'react';

const MaintenancePage: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="flex justify-center mb-6">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
export default MaintenancePage;

import React from 'react';

interface LoadingStateProps {
    message?: string;
    fullScreen?: boolean;
}

export const LoadingState = ({ message = 'Loading...', fullScreen = false }: LoadingStateProps) => {
    const content = (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            {message && (
                <p className="text-gray-600 text-sm font-medium">{message}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            {content}
        </div>
    );
};

export default LoadingState; 
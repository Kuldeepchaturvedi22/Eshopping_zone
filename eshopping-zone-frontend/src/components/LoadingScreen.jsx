import React from 'react';

export default function LoadingScreen({ message = "Loading...", show = false }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{message}</h3>
                    <p className="text-gray-600 text-sm">Please wait...</p>
                </div>
            </div>
        </div>
    );
}
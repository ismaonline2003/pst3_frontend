import * as React from 'react';

export default function SimpleNotification({message, type}) {
    let containerColor = "";
    let messageColor = "";
    if(type == 'error') {
        containerColor = "bg-red-200";
        messageColor = 'text-red-800'
    }
    if(type == 'success') {
        containerColor = "bg-green-200";
        messageColor = 'text-green-800';
    }
    return (
        <div className={containerColor+" p-4 rounded m-4"} style={{zIndex: '999 !important'}}>
            <p className={messageColor+" font-medium"}>{message}</p>
        </div>
    )
}
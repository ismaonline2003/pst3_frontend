import { React, useState, useContext, useEffect, Fragment } from 'react'

const FormContainer = ({children}) => {
    return (
        <div className='rounded border border-slate-500 p-10 border-opacity-20'>
            {children}
        </div>
    );
};

export default FormContainer;

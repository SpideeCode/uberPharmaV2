import React from 'react';

const InputError = ({ message, className = '', ...props }) => {
    return message ? (
        <p 
            className={`text-sm text-red-600 dark:text-red-400 ${className}`}
            {...props}
        >
            {message}
        </p>
    ) : null;
};

export default InputError;

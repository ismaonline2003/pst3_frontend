import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import AppContext from '../../context/App';
import { Link } from 'react-router-dom';

const recordsLimit = [
    { value: '10', label: '10'},
    { value: '25', label: '25'},
    { value: '50', label: '50'},
    { value: '100', label: '100'},
    { value: '250', label: '250'},
    { value: '500', label: '500'},
    { value: '700', label: '700'},
    { value: '1000', label: '1000'}
]

export default function SearchBarReadOnly({selectOptions, externalHandleSearchBtn, crearRoute, searchSelectValues}) {
    const [ selectedOptionType, setSelectedOptionType ] = useState("search");
    const [ selectedOption, setSelectedOption ] = useState("");
    const [ searchValue, setSearchValue ] = useState("");
    const [ searchLimit, setSearchLimit ] = useState(25);
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);

    const _onSearchBarParameters = (e) => {
        let filterOption = selectOptions.filter((item) => item.value == e.target.value);
        if(filterOption.length > 0) {
            setSelectedOption(filterOption[0].value);
            setSelectedOptionType(filterOption[0].type);
            console.log(Object.keys(searchSelectValues));
        }
    };

    const handleSearchBtn = () => {
        const searchVals = {
            parameter: selectedOption,
            value: searchValue,
            limit: searchLimit,
        }
        if(!selectedOption) {
            setNotificationMsg("Debe seleccionar un parametro a buscar");
            setNotificationType("warning");
            setShowNotification(true);
            return;
        }
        if(!searchValue) {
            setNotificationMsg("Debe especificar un valor a buscar");
            setNotificationType("warning");
            setShowNotification(true);
            return;
        }
        if(!searchLimit) {
            setNotificationMsg("Debe especificar un limite de registros");
            setNotificationType("warning");
            setShowNotification(true);
            return;
        }
        if(selectedOptionType == 'number' && isNaN(searchValue)) {
            setNotificationMsg("Debe colocar valores numéricos");
            setNotificationType("warning");
            setShowNotification(true);
            return;
        }
        if(selectedOptionType == 'search' && searchValue.replace(/\s+/g, '') == "") {
            setNotificationMsg("Debe especificar un valor a buscar");
            setNotificationType("warning");
            setShowNotification(true);
            return;
        }
        externalHandleSearchBtn(searchVals);
    }

    return (
        <div>
            <div className='d-flex flex-row flex-wrap items-center'>
                {
                    selectedOptionType != 'selection' && 
                    <TextField id="search-bar" label="Buscar" type={selectedOptionType} style={{width: '400px', margin: "10px" }}
                    onChange={(e) => setSearchValue(e.target.value.trim())}
                />
                }
                {
                    selectedOptionType == 'selection' && Object.keys(searchSelectValues).includes(selectedOption) &&
                    <TextField
                        id="search-bar"
                        select
                        label="Buscar"
                        style={{width: '400px', margin:"10px" }}
                        onChange={(e) => setSearchValue(e.target.value)}
                    >
                        {searchSelectValues[selectedOption].map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                }
                <TextField
                    id="searchbar-parameters"
                    select
                    label="Parametros"
                    style={{width: '200px', margin:"10px" }}
                    onChange={(e) => _onSearchBarParameters(e)}
                >
                    {selectOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id="records-limit"
                    select
                    label="Limite de Registros"
                    defaultValue="25"
                    style={{width: '200px', margin:"10px" }}
                    onChange={(e) => setSearchLimit(e.target.value)}
                >
                    {recordsLimit.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
            <div>
                <Button variant="contained" onClick={(e) => handleSearchBtn()} style={{marginLeft: '10px'}}>Buscar</Button>
            </div>
        </div>
    );
}


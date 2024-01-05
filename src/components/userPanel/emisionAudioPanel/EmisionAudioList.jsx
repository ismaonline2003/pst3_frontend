import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';

//material UI
import { TextField } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import DeleteIcon from '@mui/icons-material/Delete';
//own
import SearchBarReadOnly from '../SearchBarReadOnly';
import ListBtns from '../ListBtns';
import styledComponents from '../../styled';
import AppContext from '../../../context/App';
import consts from '../../../settings/consts';
import getFormattedDate from '../../../helpers/getFormattedDate';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const searchBarParameters = [
    { value: 'ref', label: 'Referencia', type: "number"},
    { value: 'audio', label: 'Audio', type: "search"},
    { value: 'fecha', label: 'Fecha Programada', type: "date"}
];
const searchSelectValues = [];

export default function EmisionAudioList({}) {
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const StyledH2 = styledComponents.dahsboardPanelh2;
    const [ records, setRecords ] = useState([]);
    const [ status, setStatus ] = useState("readonly");
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    //
    const [ audiosFound, setAudiosFound ] = useState([]);
    const [ selectedAudio, setSelectedAudio ] = useState(false);
    const [ newRecordDate, setNewRecordDate ] = useState(new Date());
    const [ newRecords, setNewRecords ] = useState([]);



    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const searchRecords = (searchVals) => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const config = {headers:{ authorization: token}};
        let url = `${consts.backend_base_url}/api/emision_audio?limit=${searchVals.limit}`;
        if(searchVals.parameter != "" && searchVals.value != "") {
            url += `&parameter=${searchVals.parameter}&value=${searchVals.value}`;
        }
        axios.get(url, config).then((response) => {
            setRecords(response.data);
            setBlockUI(false);
        }).catch((err) => {
          setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
          setNotificationType('error');
          setShowNotification(true);
          setBlockUI(false);
        });
    }

    useEffect(() => {
        searchRecords({
            parameter: "",
            value: "",
            limit: 25,
        });
    }, []);

    const handleSearchBtn = (searchVals) => {
        searchRecords(searchVals);
    };

    const audiosSearch = async (value) => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const config = {headers:{ authorization: token}};
        let url = `${consts.backend_base_url}/api/radio_audio?limit=25&parameter=title&value=${value}`;
        try {
            const response = await axios.get(url, config);
            setAudiosFound(response.data);
            setBlockUI(false);
        } catch(err) {
            setNotificationMsg(err.response.data.message);
            setNotificationType('error');
            setShowNotification(true);
            setBlockUI(false);
        }
    }

    const _addNewRecordToList = () => {
        const newRecordData = {id: newRecords.length, radio_audio: selectedAudio, fecha_emision_programada: newRecordDate};
        if(!selectedAudio) {
            setNotificationMsg("Debe seleccionar un audio");
            setNotificationType('error');
            setShowNotification(true);
            return;
        }
        if(!newRecordDate) {
            setNotificationMsg("Debe seleccionar una fecha de emisión valida");
            setNotificationType('error');
            setShowNotification(true);
            return;
        }
        setNewRecords(recordsLocalAdd(newRecords, newRecordData));
        setAudiosFound([]);
        setSelectedAudio(false);
        setNewRecordDate(new Date());
    }

    const _deleteNewRecordFromList = (id) => {
        setNewRecords(recordsLocalRemove(id, newRecords));
    }

    const recordsLocalAdd = (recordList=[], newRecord={}) => {
        let newList = [...recordList];
        newList.push(newRecord);
        return newList;
    }

    
    const recordsLocalRemove = (id=0, recordList=[]) => {
        let newRecordList = [];
        for(let i = 0; i < recordList.length; i++) {
            if(recordList[i].id != id) {
                recordList[i].id = i;
                newRecordList.push(recordList[i]);
            }
        }
        return newRecordList;
    }

    const recordsLocalUpdate = (id=0, recordList=[], updateVals={}) => {
        for(let i = 0; i < recordList.length; i++) {
            if(recordList[i].id == id) {
                recordList[i] = {...recordList[i], ...updateVals};
            }
        }
        return recordList;
    }

    const setRecordDate = (id=0, val=new Date(), is_new=false) => {
        if(is_new) {
            setNewRecords(recordsLocalUpdate(id, newRecords, {fecha_emision_programada: val}));
        }
        if(!is_new) {
            setRecords(recordsLocalUpdate(id, records, {fecha_emision_programada: val}));
        }
    }


    const handleConfirmarBtn = () => {

    }

    const handleCancelarBtn = () => {
        setStatus('readonly');
    }
 
    return (
        <React.Fragment>
            <br /> 
            <StyledH1>Programación de Emisión de Audios</StyledH1>
            <br />
            <ListBtns status={status} setStatus={setStatus} handleConfirmarBtn={handleConfirmarBtn} handleCancelarBtn={handleCancelarBtn} ReadyOnly={false} />
            <br />
            <SearchBarReadOnly selectOptions={searchBarParameters} externalHandleSearchBtn={handleSearchBtn} crearRoute={"/dashboard/emisionesAudio/0"} searchSelectValues={searchSelectValues}/>
            <br />
            <div style={{ height: 400, width: '100%' }}>
            {
                status &&
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="Autores">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">
                                        </TableCell>
                                        <TableCell align="left">Ref</TableCell>
                                        <TableCell align="left">Audio</TableCell>
                                        <TableCell align="left">Fecha</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {
                                    ( status == 'readonly' ||  status == 'create') &&
                                    records.filter((item, index) => index < (page+1)*rowsPerPage && index >= (page)*rowsPerPage).map((row, index) => {
                                    return (
                                        <TableRow
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                </TableCell>
                                                <TableCell component="th" scope="row">{row.id}</TableCell>
                                                <TableCell align="left">{row.radio_audio.author.name} - {row.radio_audio.title}</TableCell>
                                                <TableCell component="th" scope="row">{getFormattedDate(new Date(row.fecha_emision_programada), true)}</TableCell>
                                        </TableRow>
                                    )
                                    })
                                }
                                {
                                    status == 'edit' &&
                                    records.filter((item, index) => index < (page+1)*rowsPerPage && index >= (page)*rowsPerPage).map((row, index) => {
                                    return (
                                        <TableRow
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    <Checkbox onClick={(e) => console.log(e)}/>
                                                </TableCell>
                                                <TableCell component="th" scope="row">{row.id}</TableCell>
                                                <TableCell align="left">{row.radio_audio.author.name} - {row.radio_audio.title}</TableCell>
                                                <TableCell component="th" scope="row">
                                                    <TextField id="date" label="Fecha" variant="outlined" defaultValue={getFormattedDate(new Date(row.fecha_emision_programada))} onChange={(e) => setRecordDate(row.id, e.target.value)}/>
                                                    {getFormattedDate(new Date(row.fecha_emision_programada), true)}
                                                </TableCell>
                                        </TableRow>
                                    )
                                    })
                                }
                                {
                                    status == 'delete' &&
                                    records.filter((item, index) => index < (page+1)*rowsPerPage && index >= (page)*rowsPerPage).map((row, index) => {
                                    return (
                                        <TableRow
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    <Checkbox onClick={(e) => console.log(e)}/>
                                                </TableCell>
                                                <TableCell component="th" scope="row">{row.id}</TableCell>
                                                <TableCell align="left">{row.radio_audio.author.name} - {row.radio_audio.title}</TableCell>
                                                <TableCell component="th" scope="row">{getFormattedDate(new Date(row.fecha_emision_programada), true)}</TableCell>
                                        </TableRow>
                                    )
                                    })
                                }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={records.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                }
                 {
                    status === 'create' &&
                    <React.Fragment>
                        <br />
                        <br />
                        <StyledH2>Registrar nuevas emisiones</StyledH2>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} aria-label="Autores">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" width={'25%'}>Busqueda</TableCell>
                                            <TableCell align="left" width={'25%'}>Audio</TableCell>
                                            <TableCell align="left" width={'25%'}>Fecha</TableCell>
                                            <TableCell align="left" width={'25%'}>Acción</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            newRecords.map((row, index) => {
                                            return (
                                                <TableRow
                                                    key={row.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                        </TableCell>
                                                        <TableCell align="left">{row.radio_audio.author.name} - {row.radio_audio.title}</TableCell>
                                                        <TableCell component="th" scope="row">{getFormattedDate(new Date(row.fecha_emision_programada), true)}</TableCell>
                                                        <TableCell>
                                                            <DeleteIcon sx={{fontSize: '2.2rem', ':hover': {cursor: 'pointer', fontSize: '2.5rem', transition: '.3s ease all'}}} color="error"
                                                                onClick={(e) => _deleteNewRecordFromList(row.id)}
                                                            />
                                                        </TableCell>
                                                </TableRow>
                                            )})
                                        }
                                    </TableBody>
                                    <TableRow
                                        key={'create-new-row'}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <TextField id="search_audio" label="Buscar Audio" variant="outlined" onMouseOut={(e) => audiosSearch(e.target.value)}/>
                                        </TableCell>
                                        <TableCell align="left">
                                            <TextField sx={{width: '100%'}} id="audios_found" select label="Fuente" onChange={(e) => setSelectedAudio(audiosFound.filter(a => a.id == parseInt(e.target.value))[0])}>
                                                {audiosFound.map((option) => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                        {option.author.name} - {option.title}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['DateTimePicker']}>
                                                <DateTimePicker label="Fecha y Hora" onChange={(e) => setNewRecordDate(e['$d'])} />
                                            </DemoContainer>
                                            </LocalizationProvider>
                                        </TableCell>
                                        <TableCell>
                                            <LibraryAddIcon sx={{fontSize: '2.2rem', ':hover': {cursor: 'pointer', fontSize: '2.5rem', transition: '.3s ease all'}}} color="success"
                                                onClick={(e) => _addNewRecordToList()}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </React.Fragment>
                }
            </div>
        </React.Fragment>
    );
}
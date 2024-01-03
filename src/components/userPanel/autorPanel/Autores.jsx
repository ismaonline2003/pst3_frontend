import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';

//material UI
import VisibilityIcon from '@mui/icons-material/Visibility';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

//own
import SearchBar from '../SearchBar';
import styledComponents from '../../styled';
import AppContext from '../../../context/App';
import consts from '../../../settings/consts';

const searchBarParameters = [
    { value: 'ref', label: 'Referencia', type: "number"},
    { value: 'nombre', label: 'Nombre', type: "search"}
];
const searchSelectValues = [];

export default function Autores({}) {
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const [ records, setRecords ] = useState([]);
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);


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
        let url = `${consts.backend_base_url}/api/autor?limit=${searchVals.limit}`;
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

    return (
        <React.Fragment>
            <br /> 
            <StyledH1>Autores</StyledH1>
            <br />
            <SearchBar selectOptions={searchBarParameters} externalHandleSearchBtn={handleSearchBtn} crearRoute={"/dashboard/autores/0"} searchSelectValues={searchSelectValues}/>
            <br />
            <div style={{ height: 400, width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="Autores">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Ref</TableCell>
                                <TableCell align="left">Nombre</TableCell>
                                <TableCell align="left">Ver</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {records.filter((item, index) => index < (page+1)*rowsPerPage && index >= (page)*rowsPerPage).map((row, index) => {
                            return (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.id}
                                        </TableCell>
                                        <TableCell align="left">{row.name}</TableCell>
                                        <TableCell align="left">
                                            <Link to={`/dashboard/autores/${row.id}`}>
                                                <VisibilityIcon color="secondary"/>
                                            </Link>
                                        </TableCell>
                                </TableRow>
                            )
                        })}
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
            </div>
        </React.Fragment>
    );
}
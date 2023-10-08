import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from "axios";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchBar from '../SearchBar';
import styledComponents from '../../styled';
import AppContext from '../../../context/App';
import consts from '../../../settings/consts';
//simple table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
//link
import { Link } from 'react-router-dom';



const searchBarParameters = [
    { value: 'ref', label: 'Referencia', type: "number"},
    { value: 'nombre', label: 'Nombre y Apellido', type: "search"},
    { value: 'ci', label: 'Cédula', type: "search"},
    { value: 'nro_telefono', label: 'Nro Teléfono', type: "number"},
    { value: 'nro_movil', label: 'Nro Móvil', type: "number"},
    { value: 'nro_expediente', label: 'Nro Expediente', type: "search"}
]

export default function Estudiantes({}) {
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const [ estudiantes, setEstudiantes ] = useState([]);
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const searchEstudiantes = (searchVals) => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const config = {headers:{ authorization: token}};
        let url = `${consts.backend_base_url}/api/estudiante?limit=${searchVals.limit}`;
        if(searchVals.parameter != "" && searchVals.value != "") {
            url += `&parameter=${searchVals.parameter}&value=${searchVals.value}`;
        }
        axios.get(url, config).then((response) => {
            let estudiantes = [];
            response.data.map(item => {
                estudiantes.push({
                    id: item.id, 
                    name: `${item.person.name} ${item.person.lastname}`, 
                    ci: item.person.ci,
                    nro_expediente: item.nro_expediente,
                    phone: item.person.phone,
                    mobile: item.person.mobile
                })
            }) 
            setEstudiantes(estudiantes)
            setBlockUI(false);
        }).catch((err) => {
          console.log(err);
          setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
          setNotificationType('error');
          setShowNotification(true);
          setBlockUI(false);
        });
    }

    useEffect(() => {
        searchEstudiantes({
            parameter: "",
            value: "",
            limit: 25,
        });
    }, []);

    const handleSearchBtn = (searchVals) => {
        searchEstudiantes(searchVals);
    };

    return (
        <React.Fragment>
            <br /> 
            <StyledH1>Estudiantes</StyledH1>
            <br />
            <SearchBar selectOptions={searchBarParameters} externalHandleSearchBtn={handleSearchBtn} crearRoute={"/dashboard/estudiantes/0"}/>
            <br />
            <div style={{ height: 400, width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="Estudiantes">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Ref</TableCell>
                                <TableCell align="left">Nombre y Apellido</TableCell>
                                <TableCell align="left">Cédula</TableCell>
                                <TableCell align="left">Nro Expediente</TableCell>
                                <TableCell align="left">Teléfono</TableCell>
                                <TableCell align="left">Móvil</TableCell>
                                <TableCell align="left">Ver</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {estudiantes.filter((item, index) => index < (page+1)*rowsPerPage && index >= (page)*rowsPerPage).map((row, index) => {
                                return (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.id}
                                            </TableCell>
                                            <TableCell align="left">{row.name}</TableCell>
                                            <TableCell align="left">{row.ci}</TableCell>
                                            <TableCell align="left">{row.nro_expediente}</TableCell>
                                            <TableCell align="left">{row.phone}</TableCell>
                                            <TableCell align="left">{row.mobile}</TableCell>
                                            <TableCell align="left">
                                                <Link to={`/dashboard/estudiantes/${row.id}`}>
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
                    count={estudiantes.length}
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


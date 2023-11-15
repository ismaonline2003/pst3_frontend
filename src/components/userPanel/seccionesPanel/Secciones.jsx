import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from "axios";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchBar from '../SearchBar';
import styledComponents from '../../styled';
import AppContext from '../../../context/App';
import consts from '../../../settings/consts';
import getTurnoName from '../../../helpers/getTurnoName';
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


/*
    number: solo valores numericos
    search: valores de texto
*/
const searchBarParameters = [
    { value: 'ref', label: 'Referencia', type: "number"},
    { value: 'nombre', label: 'Nombre', type: "search"},
    { value: 'trayecto', label: 'Trayecto', type: "selection"},
    { value: 'year', label: 'Año', type: "number"},
    { value: 'turno', label: 'Turno', type: "selection"},
    { value: 'pnf', label: 'Carrera', type: "search"}
];

const searchSelectValues= {
    'trayecto': [
        {
          value: '0',
          label: 'Inicial',
        },
        {
          value: '1',
          label: '1',
        },
        {
          value: '2',
          label: '2',
        },
        {
            value: '3',
            label: '3',
        },
        {
            value: '4',
            label: '4',
        },
        {
            value: '5',
            label: '5',
        }
    ],
    'turno': [
        {
          value: '1',
          label: 'Mañana',
        },
        {
          value: '2',
          label: 'Tarde',
        },
        {
          value: '3',
          label: 'Noche',
        }
    ]
}

export default function Secciones({}) {
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const [ secciones, setSecciones ] = useState([]);
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


    const searchSecciones = (searchVals) => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const config = {headers:{ authorization: token}};
        let url = `${consts.backend_base_url}/api/seccion?limit=${searchVals.limit}`;
        if(searchVals.parameter != "" && searchVals.value != "") {
            url += `&parameter=${searchVals.parameter}&value=${searchVals.value}`;
        }
        axios.get(url, config).then((response) => {
            let secciones = [];
            response.data.map(item => {
                console.log(item);
                secciones.push({
                    id: item.id, 
                    nombre: item.nombre, 
                    year: item.year,
                    trayecto: item.trayecto,
                    turno: item.turno,
                    turno_name: getTurnoName(item.turno),
                    pnf: item.carrera_universitarium.nombre_pnf
                })
            }) 
            setSecciones(secciones);
            setBlockUI(false);
        }).catch((err) => {
          setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
          setNotificationType('error');
          setShowNotification(true);
          setBlockUI(false);
        });
    }

    useEffect(() => {
        searchSecciones({
            parameter: "",
            value: "",
            limit: 25,
        });
    }, []);

    const handleSearchBtn = (searchVals) => {
        searchSecciones(searchVals);
    };

    return (
        <React.Fragment>
            <br /> 
            <StyledH1>Secciones</StyledH1>
            <br />
            <SearchBar selectOptions={searchBarParameters} externalHandleSearchBtn={handleSearchBtn} crearRoute={"/dashboard/secciones/0"} searchSelectValues={searchSelectValues} />
            <br />
            <div style={{ height: 400, width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="Secciones">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Ref</TableCell>
                                <TableCell align="left">Carrera</TableCell>
                                <TableCell align="left">Nombre</TableCell>
                                <TableCell align="left">Año</TableCell>
                                <TableCell align="left">Trayecto</TableCell>
                                <TableCell align="left">Turno</TableCell>
                                <TableCell align="left">Ver</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {secciones.filter((item, index) => index < (page+1)*rowsPerPage && index >= (page)*rowsPerPage).map((row, index) => {
                                return (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.id}
                                            </TableCell>
                                            <TableCell align="left">{row.pnf}</TableCell>
                                            <TableCell align="left">{row.nombre}</TableCell>
                                            <TableCell align="left">{row.year}</TableCell>
                                            <TableCell align="left">{row.trayecto}</TableCell>
                                            <TableCell align="left">{row.turno_name}</TableCell>
                                            <TableCell align="left">
                                                <Link to={`/dashboard/secciones/${row.id}`}>
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
                    count={secciones.length}
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

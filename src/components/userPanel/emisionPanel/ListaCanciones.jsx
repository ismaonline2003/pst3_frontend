import * as React from 'react';
import { Container, Box} from '@mui/material';
import axios from "axios";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styledComponents from '../../styled';
import consts from '../../../settings/consts';
import AppContext from '../../../context/App';
import ModalAddCanciones from './ModalAddCanciones';


const columns = [
    { field: 'nro', headerName: 'Nro', type: 'number', width: '10px' },
    { field: 'duracion', headerName: 'Duracion', type: 'number', width: '50px' },
    { field: 'titulo', headerName: 'Título', width: '100px' },
    { field: 'editar', headerName: 'Editar', width: '10px' }
];



export default function ListaCanciones({cancionesList, setCancionesList}) {
    const [ listaBorrador, setListaBorrador ] = React.useState([]);
    const [ rows, setRows ] = React.useState([]);
    const [ addRows, setAddRows] = React.useState(false);
    const [ showBtnAddSongs, setShowBtnAddSongs] = React.useState(false);
    const {blockUI, setBlockUI} = React.useContext(AppContext);

    React.useEffect(() => {
        //setRows([{ id: `song_1`, nro: 1, duracion: '', titulo: 'Canción 1', editar: false }]);
    }, []);

    const StyledH2 = styledComponents.dahsboardPanelh2;

    const onBtnAllowAddRows = () => {
        setAddRows(true);
    };

    return (
        <div>
            <StyledH2>Lista de Canciones</StyledH2>
            <br />
            {
                rows.length > 0 && 
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Nro</TableCell>
                            <TableCell align="left">Titulo</TableCell>
                            <TableCell align="left">Duración</TableCell>
                            <TableCell align="left">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                        rows.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left">{row.nro}</TableCell>
                                <TableCell align="left">{row.titulo}</TableCell>
                                <TableCell align="left">{row.duracion}</TableCell>
                                <TableCell align="left"><button></button></TableCell>
                            </TableRow>
                        ))
                    }
                    </TableBody>
                </Table>
                </TableContainer>
            }
            {
                rows.length == 0 && !addRows &&
                (
                    <div className="text-center mt-10 rounded shadow	p-10">
                        <span onClick={(e) => onBtnAllowAddRows()} className="font-bold text-2xl text-gray-500 cursor-pointer">Click Aquí para Agregar una nueva canción a la lista</span>
                    </div>
                )
            }
            {
                addRows && 
                (<Button variant="contained" id="btn-show-modal-add-canciones" color="success" onClick={(e) => setShowBtnAddSongs(true)}>Cargar Nuevas Canciones</Button>)
            }
            {
                showBtnAddSongs && (
                    <ModalAddCanciones showModal={showBtnAddSongs} setShowModal={setShowBtnAddSongs}/>
                )
            }
        </div>
    );
}
import * as React from 'react';
import { Container, Box} from '@mui/material';
import axios from "axios";
import Typography from '@mui/material/Typography';
//dialog title
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
//other
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
//propios
import AppContext from '../../../context/App';
import consts from '../../../settings/consts';
//generales
import BootstrapDialog from '../../generales/BootstrapDialog';
import BootstrapDialogTitle from '../../generales/BootstrapDialogTitle';
import BoostrapModal from '../../generales/BoostrapModal';


import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
const filter = createFilterOptions();
const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '60%',
    bgcolor: 'background.paper',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
  };

//

export default function ModalAddCanciones({ showModal, setShowModal }) {
    const [ newSongs, setNewSongs ] = React.useState([]);
    const [ fileInput, setFileInput ] = React.useState(false);
    const [ nameInput, setNameInput ] = React.useState("");
    const [ autorSelect, setAutorSelect ] = React.useState("");
    const [ autorOptions, setAutorOptions ] = React.useState([{name: 'Ninguno', code: ""}]);
    const [ releaseDateInput, setReleaseDateInput ] = React.useState("");
    const { blockUI, setBlockUI } = React.useContext(AppContext);
    const [ Autores, setAutores ] = React.useState([]);

    //validations
    const fileInputValidations = (files) => {
        let objReturn = {success:true, error:""};
        if(files.length > 0) {
            console.log(files[0]);
            let filename = files[0].name
            let extension = files[0].type
            let size = files[0].size
            if(extension != 'audio/mpeg' || !(filename.includes('.mp3'))) {
                objReturn = { success: false, error: "El formato del archivo debe ser .mp3" };
                return objReturn;
            }
            if(size > 10485760) {
                objReturn = { success: false, error: "El tamaño del archivo no puede sobrepasar los 10 MB .mp3" };
                return objReturn;
            }
        }
        return objReturn;
    }

    const nameInputValidations = (val) => {
        let objReturn = {success:true, error:""};
        if(val.trim() == "") {
            objReturn.success = false;
            objReturn.error = "Debe colocar un nombre válido";
        }
        return objReturn;
    }

    const autorSelectValidations = (val) => {
        let objReturn = {success: true, error: "", option:{}};
        let authorOption = autorOptions.filter((option) => option.value == val);
        if(val.trim() == "") {
            objReturn.success = false;
            objReturn.error = "El autor no es válido";
            return objReturn;
        }
        if(authorOption.length == 0) {
            objReturn.success = false;
            objReturn.error = "No se encontro al autor seleccionado";
            return objReturn;
        }
        objReturn.option = authorOption[0];
        return objReturn;
    }

    //event listeners
    const _onFileInput = (e) => {
        let validations = fileInputValidations(e.target.files);
        if(!validations.success) {
            console.log(validations);
            return;
        }
        setFileInput(e.target.files[0]);
    }

    const _onNameInput = (e) => {
        let validations = nameInputValidations(e.target.value);
        if(!validations.success) {
            console.log(validations);
            return;
        }
        setNameInput(e.target.value);
    }

    const _onAutorInput = (e) => {
        const token = localStorage.getItem('token');
        const config = {headers:{ authorization: token}};
        axios.get(`${consts.backend_base_url}/api/author/name/${e.target.value}`, config).then((response) => {
            console.log('response _onAutorInput', response.data);
            if(response.data.length > 0) {
                setAutorOptions(response.data);
                setAutorSelect(response.data[0].id);
                console.log('setAutorSelect', autorSelect);
            } else {
                setAutorOptions([{name: 'Ninguno', id: ""}]);
                setAutorSelect("");
            }
          }).catch((err) => {
            console.log(err);
            setBlockUI(false);
          });
    }

    //filter
    const filterAutorSelectOptions = (options, params) => {
        console.log(options, params)
        const filtered = filter(options, params);
        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.title);
        if (inputValue !== '' && !isExisting) {
            filtered.push({
                inputValue,
                title: `No se encontro ningún resultado`,
            });
        }

        return filtered;
    }

    const getAutorSelectLabel = (option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
            return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
            return option.inputValue;
        }
        // Regular option
        return option.title;
    }

    //
    const newRecordValidations = () => {
        let objReturn = {success: true, error: ""};
        return objReturn;
    };

    //handleBtn
    const handleBtnAdd = () => {
        let validations = newRecordValidations();
        let oldLista = [...newSongs];
        if(!validations.success) {
            console.log(validations.error);
            return;
        }
        let filterAutor = autorOptions.filter((val) => val.id == autorSelect);
        oldLista.push({file: fileInput, name: nameInput, autor: filterAutor[0], releaseDate: releaseDateInput});
        setNewSongs(oldLista);
    }

    const handleSaveBtn = () => {
        setBlockUI(true);
        setTimeout(() => {
            console.log('saved changes');
            setBlockUI(false);
            setShowModal(false);
        }, 10000)
    }

    return(
        <BoostrapModal 
            props={
                [
                    "xl",
                    showModal,
                    setShowModal,
                    (() => {console.log('save')}),
                    (<h5>Agregar Nuevas Canciones</h5>),
                    (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Nro</TableCell>
                                        <TableCell align="left">Archivo</TableCell>
                                        <TableCell align="left">Nombre</TableCell>
                                        <TableCell align="left">Autor</TableCell>
                                        <TableCell align="left">Fecha de Lanzamiento</TableCell>
                                        <TableCell align="left">Acción</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {
                                    newSongs.map((row, index) => {

                                        return(
                                            <TableRow
                                                key={`draft-song-${index}`}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="left">{index+1}</TableCell>
                                                <TableCell align="left">{row.name}</TableCell>
                                                <TableCell align="left">{row.name}</TableCell>
                                                <TableCell align="left">{row.autor.name}</TableCell>
                                                <TableCell align="left">{row.releaseDate}</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                                    <TableRow
                                            key={'draft-row-add-line'}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left"></TableCell>
                                            <TableCell align="left">
                                                <input type="file" className="block w-full text-sm text-slate-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-violet-50 file:text-green-700
                                                    hover:file:bg-green-100
                                                    "
                                                    onChange={(e) => _onFileInput(e)}
                                                />
                                            </TableCell>
                                            <TableCell align="left">
                                                <TextField id="new-audio-name" size="small" label="Nombre" variant="outlined" onChange={(e) => _onNameInput(e)}/>
                                            </TableCell>
                                            <TableCell align="left">
                                                <TextField 
                                                    id="new-audio-name" 
                                                    size="small" 
                                                    label="Autor" 
                                                    variant="outlined" 
                                                    onChange={(e) => _onAutorInput(e)}
                                                />
                                                <br />
                                                <Select
                                                    labelId="new-audio-autor-select"
                                                    id="new-audio-autor-select"
                                                    value={autorSelect}
                                                    label={"Seleccione al Autor"}
                                                    size="small"
                                                >
                                                    {   
                                                        autorOptions.length > 0 && 
                                                        autorOptions.map((option) => {
                                                            return (<MenuItem value={option.id}>{option.name}</MenuItem>)
                                                        })
                                                    }
                                                    {   
                                                        autorOptions.length == 0 && 
                                                        (<MenuItem value="">Ninguno</MenuItem>)
                                                    }
                                                </Select>
                                            </TableCell>
                                            <TableCell align="left">
                                                <input type="date" onChange={(e) => setReleaseDateInput(e.target.value)}/>
                                            </TableCell>
                                            <TableCell align="left">
                                                <Fab size="small" color="success" aria-label="add">
                                                    <AddIcon onClick={(e) => handleBtnAdd()}/>
                                                </Fab>
                                            </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ),
                    (
                        <React.Fragment>
                            {   
                                newSongs.length > 0 && (
                                    <Button variant="contained" autoFocus onClick={(e) => handleSaveBtn()} color="success">
                                        Guardar
                                    </Button>
                                )
                            }
                            <Button variant="outlined" autoFocus onClick={(e) => setShowModal(false)}>
                                Cancelar
                            </Button>
                        </React.Fragment>
                    ),
                ]
            }
        />
    )
}
import { useState, useEffect, useContext, Fragment, useRef } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import parse from 'html-react-parser'
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

//text editor
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  MenuSelectTextAlign,
  RichTextEditorProvider,
  RichTextField
} from "mui-tiptap";

//icons
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

//simple table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

//own
import AppContext from '../../../context/App';
import consts from '../../../settings/consts';
import FormBtns from '../FormBtns';
import getFormattedDate from '../../../helpers/getFormattedDate';
import styledComponents from '../../styled'
import FormContainer from '../FormContainer'
import noEncontrado from '../../../icons/no-encontrado.jpg'
import getTurnoName from '../../../helpers/getTurnoName';
import DeleteDialog from '../../generales/DeleteDialog';
import imgValidations from '../../../helpers/imgValidations';
import docValidations from '../../../helpers/docValidations';

const trayectoVals = [
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
];

const ProyectoForm = ({}) => {
    const [reLoad, setReload] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [showFormBtns, setShowFormBtns] = useState(true);
    const navigate = useNavigate();

    
    //db fields
    const [seccionID, setSeccionID] = useState(false);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [miniatura, setMiniatura] = useState(false);
    const [imgs, setImgs] = useState([]);
    const [docs, setDocs] = useState([]);
    const [integrantes, setIntegrantes] = useState([]);

    //ui fields
    const [pnfs, setPnfs] = useState([]);
    const [selectedPNF, setSelectedPNF] = useState(false);
    const [selectedTrayecto, setSelectedTrayecto] = useState("0");
    const [secciones, setSecciones] = useState([]);
    const [seccionSelected, setSeccionSelected] = useState(false);
    const [selectedYear, setSelectedYear] = useState((new Date()).getFullYear());
    const [imgsDeleted, setImgsDeleted] = useState([]);
    const [imgs2Add, setImgs2Add] = useState([]);
    const [docsDeleted, setDocsDeleted] = useState([]);
    const [docsUpdated, setDocsUpdated] = useState([]);
    const editor = useEditor({
        extensions: [StarterKit],
        content: "<p>Descripción</p>",
    });
    const [estudiantesSearch, setEstudiantesSearch] = useState([]);
    const [currentSelectedStudentID, setCurrentSelectedStudentID] = useState(false);
    const newImage = useRef(null);
    const newDoc = useRef(null);
    const [ newImageName, setNewImageName ] = useState('');
    const [ newDocName, setNewDocName ] = useState('');
    const [ newImageDescription, setNewImageDescription] = useState('');
    const [ docs2Add, setDocs2Add ] = useState([]);


    //form common fields
    const [showDeleteDialog, setShowDeleteDialog ] = useState(false);
    const [recordFound, setRecordFound] = useState(false);
    const [recordData, setRecordData ] = useState(undefined);
    const [newId, setNewId] = useState(0);
    const { id } = useParams();
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const [unlockFields, setUnlockFields] = useState(false);
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const StyledH2 = styledComponents.dahsboardPanelh2;

    const getImgsList = (data) => {
        let imgsList = [];
        data.proyecto_archivos.filter(e => e.tipo == 'IMG').map((item) => {
            imgsList.push({
                id: item.id,
                position: item.posicion,
                url: item.url.replace(consts.back_public_file_route, ''),
                nombre: item.nombre,
                descripcion: item.descripcion
            })
        })
        return imgsList
    }

    const getDocsList = (data) => {
        let docsList = [];
        data.proyecto_archivos.filter(e => e.tipo == 'DOC').map((item) => {
            docsList.push({
                id: item.id,
                position: item.posicion,
                url: item.url.replace(consts.back_public_file_route, ''),
                nombre: item.nombre
            })
        })
        return docsList
    }

    const getIntegrantesList = (data) => {
        let integrantesList = [];
        data.inscripcions.map((item) => {
            let estudiante = data.seccion.estudiantes.filter(e => e.id == item.estudiante_id);
            if(estudiante.length > 0) {
                estudiante = estudiante[0];
                integrantesList.push({
                    id: estudiante.id,
                    ci_type: estudiante.person.ci_type,
                    ci: estudiante.person.ci,
                    nombre: estudiante.person.name,
                    apellido: estudiante.person.lastname
                })
            }
        })
        return integrantesList
    }

    const setProyectoInfo = (data) => {
        setRecordData(data);
        setNombre(data.nombre);
        setDescripcion(data.descripcion);
        setSeccionID(data.id_seccion);
        setImgs(getImgsList(data));
        setDocs(getDocsList(data));
        setIntegrantes(getIntegrantesList(data));
        //
        setPnfs([]);
        setSelectedPNF(false);
        setSelectedTrayecto(data.seccion.trayecto);
        setSecciones([]);
        setSeccionSelected(false);
        setSelectedYear(data.seccion.year);
        setImgsDeleted([]);
        setImgs2Add([]);
        setDocsDeleted([]);
        setDocsUpdated([]);
        setEstudiantesSearch([]);
        setCurrentSelectedStudentID(false);
        setNewImageName('');
        setNewDocName('');
        setNewImageDescription('');
        setDocs2Add([]);
    }

    if(newImage && newImage.current) {
        newImage.current.onchange = (e) => {
            const validations = imgValidations(e.target.files[0]);
            if(validations.status != 'success') {
                setNotificationMsg(validations.msg);
                setNotificationType('error');
                setShowNotification(true);
                e.target.value = "";
            }
        } 
    }

    if(newDoc && newDoc.current) {
        newDoc.current.onchange = (e) => {
            const validations = docValidations(e.target.files[0]);
            if(validations.status != 'success') {
                setNotificationMsg(validations.msg);
                setNotificationType('error');
                setShowNotification(true);
                e.target.value = "";
            }
        } 
    }

    const recordValidations = () =>  {
        let objReturn = {'status': 'success', 'data': {}, 'msg': ''};
        return objReturn;
    }

    const searchPNFS = () => {
        const token = localStorage.getItem('token');
        const config = {headers:{ authorization: token}};
        let url = `${consts.backend_base_url}/api/carrera_universitaria`;
        axios.get(url, config).then((response) => {
            setPnfs(response.data);
        }).catch((err) => {
            setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
            setNotificationType('error');
            setShowNotification(true);
        });
    }

    const searchSecciones = () => {
        const token = localStorage.getItem('token');
        const config = {headers:{ authorization: token}};
        let urlQuery = `?parameter=pnf_id&value=${selectedPNF}&parameter_2=year&value_2=${selectedYear}&parameter_3=trayecto&value_3=${selectedTrayecto}`;
        let url = `${consts.backend_base_url}/api/seccion${urlQuery}`;
        axios.get(url, config).then((response) => {
            setSecciones(response.data);
            if(response.data.length > 0) {
                setSeccionSelected(response.data[0].id);
            }
        }).catch((err) => {
            console.log(err);
            setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
            setNotificationType('error');
            setShowNotification(true);
        });
    }

    const searchStudent = (value) => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const config = {headers:{ authorization: token}};
        let seccion_id = false;
        if(seccionSelected) {
            seccion_id = seccionSelected
        } else if(seccionID) {
            seccion_id = seccionID
        }
        if(seccion_id) {
            let urlQuery = `?value=${value}&seccion_id=${seccion_id}`;
            let url = `${consts.backend_base_url}/api/estudiante/searchBarBySeccion${urlQuery}`;
            axios.get(url, config).then((response) => {
                console.log(response.data);
                if(response.data.data.length > 0) {
                    if(response.data.data[0].length > 0) {
                        setEstudiantesSearch(response.data.data[0]);
                    }
                } else {
                    setEstudiantesSearch([]);
                }
                setBlockUI(false);
            }).catch((err) => {
                setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
                setNotificationType('error');
                setShowNotification(true);
                setBlockUI(false);
            });
        } else {
            setBlockUI(false);
        }
    }

    const searchRecord = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const config = {headers:{ authorization: token}};
        let url = `${consts.backend_base_url}/api/proyecto/${id}`;
        axios.get(url, config).then((response) => {
            //setear campos de la base de datos
            setRecordData(response.data);
            setBlockUI(false);
        }).catch((err) => {
          setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
          setNotificationType('error');
          setShowNotification(true);
          setBlockUI(false);
        });
    }

    const getIntegrantesDeleted = () => {
        let arrReturn = [];
        recordData.integrante_proyecto.map((item) => {
            let filter = integrantes.filter(integranteRecord => integranteRecord.id == item.estudiante_id);
            if(filter.length == 0) {
                arrReturn.push(filter[0].id);
            }
        });
        return arrReturn;
    }

    const getAddedIntegrantes = () => {
        let arrReturn = [];
        integrantes.map((item) => {
            let filter = recordData.integrante_proyecto.filter(integranteRecord => integranteRecord.estudiante_id == item.id);
            if(filter.length == 0) {
                arrReturn.push(filter[0].estudiante_id);
            }
        });
        return arrReturn;
    }

    const updateRecord = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const formData = new FormData();
        const integrantesDeleted = getIntegrantesDeleted();
        const AddedIntegrantes = getAddedIntegrantes();
        let body = {
            id_seccion: seccionSelected,
            nombre: nombre,
            descripcion: editor.getHTML(),
            addedIntegrantes: AddedIntegrantes,
            deletedIntegrantes: integrantesDeleted,
            deletedImgs: imgsDeleted, //solo van a ir los ids de la tabla (proyecto - archivo)
            deletedDocs: docsDeleted //solo van a ir los ids de la tabla (proyecto - archivo)
        };
        formData.append('data', JSON.stringify(body));
        if(miniatura != false) {
            formData.append('miniatura', miniatura);
        }
        imgs2Add.map((item) => {
            formData.append('img', item);
        });
        docsUpdated.map((item) => {
            formData.append('docs', item);
        });
        const config = {headers:{'authorization': token, 'Content-Type': 'multipart/form-data'}};
        let url = `${consts.backend_base_url}/api/proyecto`;
        axios.put(url, formData, config).then((response) => {
            //update db fields
            setBlockUI(false);
            setNotificationMsg(response.data.message);
            setNotificationType('success');
            setShowNotification(true);
        }).catch((err) => {
            setNotificationMsg(err.response.data.message);
            setNotificationType('error');
            setShowNotification(true);
            setBlockUI(false);
        });
    }

    const createRecord = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const formData = new FormData();
        let a = 0;
        let body = {
            id_seccion: seccionSelected,
            nombre: nombre,
            descripcion: editor.getHTML(),
            integrantes: integrantes,
            miniaturaAdded: false,
            imgs: [],
            docs: []
        };

        if(miniatura != false) {
            formData.append('files', miniatura);
            body.miniaturaAdded = true;
            a += 1;
        } 

        for(let i = 0; i < imgs2Add.length; i++) {
            let item = imgs2Add[i];
            formData.append(`files`, item.img);
            body.imgs.push({nombre: item.nombre, descripcion: item.descripcion, position: item.position, type: "img", index: a});
            a += 1;
        }

        for(let i = 0; i < docs2Add.length; i++) {
            let item = docs2Add[i];
            formData.append(`files`, item.doc);
            body.docs.push({nombre: item.nombre, position: item.position, type: "doc", index: a});
            a += 1;
        }

        formData.append('data', JSON.stringify(body));
        const config = {headers:{'authorization': token, 'Content-Type': 'multipart/form-data'}};
        let url = `${consts.backend_base_url}/api/proyecto`;
        axios.post(url, formData, config).then((response) => {
            setProyectoInfo(response.data);
            setNotificationMsg("El proyecto fue creado exitosamente!!");
            setNotificationType('success');
            setShowNotification(true);
            setReload(true);
            setBlockUI(false);
            setRecordFound(true);
            setUnlockFields(false);
            setNewId(response.data.id);
            setTimeout(() => {
                setReload(true);
            }, 3000);
        }).catch((err) => {
            setNotificationMsg(err);
            setNotificationType('error');
            setShowNotification(true);
            setBlockUI(false);
        });
    }

    const handleConfirmarBtn = (e) => {
        let confirmarBtnReturn = {'status': 'success', 'message': '', 'data': {}};
        confirmarBtnReturn = recordValidations();
        if(confirmarBtnReturn.status == 'success') {
            if(recordData != undefined) {
                updateRecord();
            } else {
                createRecord();
            }
        }
        return confirmarBtnReturn;
    }

    const _resetRecordData = () => {
       //resetear los campos de la base de datos
    }

    const handleCancelarBtn = (e) => {
        if(id != '0') {
            _resetRecordData();
        } else {
            setRedirect(true);
        }
    }

    const handleDeleteBtn = () => {
        setShowDeleteDialog(true);
    }

    const handleDeleteConfirm = (e) => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const config = {headers:{'authorization': token}};
        let url = `${consts.backend_base_url}/api/proyecto/${id}`;
        axios.delete(url, config).then((response) => {
            setBlockUI(false);
            setNotificationMsg(response.data.message);
            setNotificationType('success');
            setShowNotification(true);
            setShowFormBtns(false);
            setTimeout(() => {
                setRedirect(true);
            }, 5000);
        }).catch((err) => {
            setNotificationMsg(err.response.data.message);
            setNotificationType('error');
            setShowNotification(true);
            setBlockUI(false);
        });
    }

    useEffect(() => {
        if(id != 0) {
            searchRecord();
        }
        searchPNFS();
    }, []);

    useEffect(() => {
        if(selectedPNF && selectedYear && selectedTrayecto) {
            searchSecciones();
        } else {
            setSecciones([]);
            setSeccionSelected(false);
        }
        if(recordData) {
            setIntegrantes(getIntegrantesList(recordData));
        } else {
            setIntegrantes([]);
        }
    }, [selectedPNF, selectedYear, selectedTrayecto]);

    const addIntegrante = (estudianteID) => {
        let newIntegrantesArr = [];
        let newIntegrante = estudiantesSearch.filter(estudianteRecord => estudianteRecord.id == estudianteID);
        integrantes.map((item) => {
            if(item.id != estudianteID) {
                newIntegrantesArr.push(item);
            }
        })
        if(newIntegrante.length > 0) {
            newIntegrante.rel_id = false;
            newIntegrantesArr.push(newIntegrante[0]);
        }
        setIntegrantes(newIntegrantesArr);
    }

    const removeIntegrante = (estudianteID) => {
        let newIntegrantesArr = [];
        integrantes.map((item) => {
            if(item.id != estudianteID) {
                newIntegrantesArr.push(item);
            }
        })
        setIntegrantes(newIntegrantesArr);
    }

    const getNewImagePos = () => {
        let newImgPos = 0;
        let lastImageNumber = 0;
        let sortedArr = imgs2Add.sort((a) => a.position);
        if(sortedArr.length > 0) {
            lastImageNumber = sortedArr[sortedArr.length-1].position;
        }
        newImgPos = lastImageNumber+1;
        return newImgPos;
    }

    const getNewDocPos = () => {
        let newDocPos = 0;
        let lastDocNumber = 0;
        let sortedArr = docs2Add.sort((a) => a.position);
        if(sortedArr.length > 0) {
            lastDocNumber = sortedArr[sortedArr.length-1].position;
        }
        newDocPos = lastDocNumber+1;
        return newDocPos;
    }

    const addNewImage = () => {
        if(newImage.current.files.length > 0) {
            let newImgs2Add = [...imgs2Add];
            const validations = imgValidations(newImage.current.files[0]);
            if(validations.status != 'success') {
                setNotificationMsg(validations.msg);
                setNotificationType('error');
                setShowNotification(true);
                newImage.current.value = "";
                return;
            }
            let Imgurl = window.URL.createObjectURL(newImage.current.files[0]);
            let imageObj = {
                position: getNewImagePos(),
                img:  newImage.current.files[0],
                url: Imgurl,
                nombre: newImageName,
                descripcion: newImageDescription
            };
            console.log(imageObj);
            newImgs2Add.push(imageObj);
            setImgs2Add(newImgs2Add);
        } else {
            setNotificationMsg("Debe subir una imagen primero.");
            setNotificationType('error');
            setShowNotification(true); 
        }
        
    }

    const changeImgVal = (key="", val="", id=0, is_new=false) => {
        let imgsArr = [];
        if(is_new) {
            imgsArr = [...imgs2Add];
            imgsArr.map((item, index) => {
                if(item.position == id) {
                    imgsArr[index][key] = val;
                }
            });
            setImgs2Add(imgsArr);
        }
        if(!is_new) {
            imgsArr = [...imgs];
            imgsArr.map((item, index) => {
                if(item.id == id) {
                    imgsArr[index][key] = val;
                }
            });
            setImgs(imgsArr);
        }
    }

    const deleteImg = (id=0, is_new=false) => {
        let imgsArr = [];
        if(is_new) {
            imgs2Add.map((item, index) => {
                if(item.position != id) {
                    imgsArr.push(item);
                }
            });
            setImgs2Add(imgsArr);
        }
        if(!is_new) {
            imgs.map((item, index) => {
                if(item.id != id) {
                    imgsArr.push(item);
                }
            });
            setImgs(imgsArr);
        }
    }

    const addNewDoc = () => {
        if(newDoc.current.files.length > 0) {
            let newDocs2Add = [...docs2Add];
            const validations = docValidations(newDoc.current.files[0]);
            if(validations.status != 'success') {
                setNotificationMsg(validations.msg);
                setNotificationType('error');
                setShowNotification(true);
                newImage.current.value = "";
                return;
            }
            let docObj = {
                position: getNewDocPos(),
                doc:  newDoc.current.files[0],
                file_name: newDoc.current.files[0].name,
                nombre: newDocName
            };
            console.log(docObj);
            newDocs2Add.push(docObj);
            setDocs2Add(newDocs2Add);
        } else {
            setNotificationMsg("Debe subir un documento primero.");
            setNotificationType('error');
            setShowNotification(true); 
        }
    }

    const changeDocName = (val="", id=0, is_new=false) => {
        let docArr = [];
        if(is_new) {
            docArr = [...docs2Add];
            docArr.map((item, index) => {
                if(item.position == id) {
                    docArr[index]['nombre'] = val;
                }
            });
            setDocs2Add(docArr);
        }
        if(!is_new) {
            docArr = [...docs];
            docArr.map((item, index) => {
                if(item.id == id) {
                    docArr[index]['nombre'] = val;
                }
            });
            setDocs(docArr);
        }
    }
    
    const deleteDoc = (id=0, is_new=false) => {
        let docArr = [];
        if(is_new) {
            docs2Add.map((item, index) => {
                if(item.position != id) {
                    docArr.push(item);
                }
            });
            setDocs2Add(docArr);
        }
        if(!is_new) {
            docs.map((item, index) => {
                if(item.id != id) {
                    docArr.push(item);
                }
            });
            setDocs(docArr);
        }
    }

    return (
        <div className='m-4'>
            {
                id == '0' && recordFound && 
                <div className='text-center mb-10'>
                    <StyledH1>Crear un nuevo Proyecto</StyledH1>
                </div>
            }
            {
                id != '0' && recordFound &&
                <div className='text-center mb-10'>
                    <StyledH1>Actualizar Proyecto</StyledH1>
                </div>
            }
            {
                showFormBtns && 
                <FormBtns 
                    setUnlockFields={setUnlockFields} 
                    handleConfirmarBtn={handleConfirmarBtn} 
                    handleCancelarBtn={handleCancelarBtn} 
                    showEditBtn={true ? id == '0' : false}
                    deleteApplies={true}
                    handleDeleteBtn={handleDeleteBtn}
                />
                /*<Button variant="contained" color="primary" style={{marginLeft: '10px'}} onClick={(e) => createRecord()}>Crear</Button>*/

            }
            {
                reLoad && <Navigate to={`/dashboard/proyectos/${newId}`} />
            }
            {
                redirect && <Navigate to="/dashboard/proyectos" />
            }
                <Fragment>
                    <FormContainer>
                        <div className="w-100 text-center">
                            <StyledH2>Datos Generales del Proyecto</StyledH2>
                        </div>
                        <br />
                        <div className='d-flex flex-row flex-wrap'>
                            {
                                (recordFound && !unlockFields) && 
                                <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                    <TextField id="nombre" label="Nombre" disabled variant="outlined" value={nombre}/>
                                </FormControl>
                            }
                            {
                                (!recordFound || unlockFields) && 
                                <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                    <TextField id="nombre" label="Nombre" variant="outlined" defaultValue={nombre} onChange={(e) => setNombre(e.target.value)}/>
                                </FormControl>
                            }
                        </div>
                        <div className='d-flex flex-row flex-wrap'>
                            {
                                (recordFound && !unlockFields) && 
                                <Fragment>
                                    <FormControl sx={{ m: 1, width: '22%' }} variant="outlined">
                                        <TextField id="carrera_universitaria" label="Carrera Universitaria" disabled variant="outlined" value={recordData.seccion.carrera_universitarium.nombre}/>
                                    </FormControl>
                                    <FormControl sx={{ m: 1, width: '22%' }} variant="outlined">
                                        <TextField id="year" label="Año" disabled variant="outlined" value={recordData.seccion.year}/>
                                    </FormControl>
                                    <FormControl sx={{ m: 1, width: '22%' }} variant="outlined">
                                        <TextField id="trayecto" label="Trayecto" disabled variant="outlined" value={recordData.seccion.trayecto}/>
                                    </FormControl>
                                    <FormControl sx={{ m: 1, width: '22%' }} variant="outlined">
                                        <TextField id="seccion" label="Sección" disabled variant="outlined" value={recordData.seccion.nombre}/>
                                    </FormControl>
                                </Fragment>
                            }
                            {
                                (!recordFound || unlockFields) && 
                                <Fragment>
                                    <FormControl sx={{ m: 1, width: '22%' }} variant="outlined">
                                        <TextField id="carrera_universitaria" select label="Carrera" defaultValue={""}  onChange={(e) => setSelectedPNF(parseInt(e.target.value))}>
                                            {pnfs.map((option) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.nombre}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </FormControl>
                                    <FormControl sx={{ m: 1, width: '22%' }} variant="outlined">
                                        <TextField id="year" label="Año" variant="outlined" type="number" defaultValue={(new Date).getFullYear()} onChange={(e) => parseInt(setSelectedYear(e.target.value))}/>
                                    </FormControl>
                                    <FormControl sx={{ m: 1, width: '22%' }} variant="outlined">
                                        <TextField id="trayecto" select label="Trayecto" defaultValue={"0"} onChange={(e) => setSelectedTrayecto(e.target.value)}>
                                            {trayectoVals.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </FormControl>
                                    <FormControl sx={{ m: 1, width: '22%' }} variant="outlined">
                                        <TextField id="seccion" select label="Sección" defaultValue={seccionSelected ? (seccionSelected != false) : ''}  
                                            onChange={(e) => setSeccionSelected(parseInt(e.target.value))}>
                                            {secciones.map((option) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.nombre}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </FormControl>  
                                </Fragment>
                            }
                        </div>
                        <div className='d-flex flex-row flex-wrap'>
                            {
                                (recordFound && !unlockFields) && 
                                <Fragment>
                                    <span style={{color: 'rgba(0, 0, 0, 0.38)', margin: '10px'}}>Descripción</span>
                                    <FormControl sx={{ m: 1, width: '95%' }} variant="outlined" style={{border: '1px solid rgba(0, 0, 0, 0.38)', padding: '10px', borderRadius: '10px', color: 'rgba(0, 0, 0, 0.38)'}}>
                                        {parse(descripcion)}
                                    </FormControl>
                                </Fragment>
                            }
                            {
                                (!recordFound || unlockFields) && 
                                <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                    <RichTextEditorProvider editor={editor}>
                                        <RichTextField
                                            controls={
                                            <MenuControlsContainer>
                                                <MenuSelectHeading />
                                                <MenuDivider />
                                                <MenuButtonBold />
                                                <MenuButtonItalic />
                                                <MenuSelectTextAlign/>
                                                {/* Add more controls of your choosing here */}
                                            </MenuControlsContainer>
                                            }
                                        />
                                    </RichTextEditorProvider>
                                </FormControl>
                            }
                        </div>
                    </FormContainer>
                    <br />
                    <FormContainer>
                        <div className="w-100 text-center">
                            <StyledH2>Integrantes del Proyecto</StyledH2>
                            <br />
                            <Paper sx={{ width: '100%', mb: 2 }}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: '100%' }} aria-label="Proyectos" >
                                        <TableHead className="bg-neutral-800 ">
                                            <TableRow>
                                                <TableCell align="left" width="30%">
                                                    <span className='text-cyan-50'>CI</span>
                                                </TableCell>
                                                <TableCell align="left" width="50%">
                                                    <span className='text-cyan-50'>Nombre y Apellido</span>
                                                </TableCell>
                                                <TableCell align="left" width="20%">
                                                    <span className='text-cyan-50'>Acción</span>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {
                                            (recordFound && !unlockFields) && 
                                            integrantes.map((row, index) => {
                                                    return (
                                                        <TableRow 
                                                            className="text-center"
                                                            key={row.id}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell align="left" className="text-center">{row.ci_type}-{row.ci}</TableCell>
                                                                <TableCell align="left" className="text-center">{row.nombre} {row.apellido}</TableCell>
                                                                <TableCell align="left" className="text-center">
                                                                </TableCell>
                                                        </TableRow>
                                                    )
                                            })
                                        }
                                        {
                                            (!recordFound || unlockFields) && 
                                            integrantes.map((row, index) => {
                                                    return (
                                                        <TableRow 
                                                            className="text-center"
                                                            key={row.id}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell align="left" className="text-center">{row.ci_type}-{row.ci}</TableCell>
                                                                <TableCell align="left" className="text-center">{row.nombre} {row.apellido}</TableCell>
                                                                <TableCell align="left" className="text-center">
                                                                    <div className="text-center">
                                                                        <DeleteIcon style={{fontSize:'30px', cursor: 'pointer'}} 
                                                                        onClick={(e) => removeIntegrante(row.id)}/>
                                                                    </div>
                                                                </TableCell>
                                                        </TableRow>
                                                    )
                                            })
                                        }
                                        {
                                            ((!recordFound || unlockFields) && (seccionSelected || seccionID)) && 
                                            <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell align="left" width="30%">
                                                    <TextField id="student_searchbar" label="Buscar Estudiante" variant="outlined" 
                                                        type="search" onChange={(e) => searchStudent(e.target.value)}/>
                                                </TableCell>
                                                <TableCell align="left" width="50%">
                                                    <TextField fullWidth={true} id="students_selection" select label="Estudiante"
                                                        defaultValue={currentSelectedStudentID ? currentSelectedStudentID : ''} 
                                                        onChange={(e) => setCurrentSelectedStudentID(e.target.value)}
                                                    >
                                                        {estudiantesSearch.map((option) => (
                                                            <MenuItem key={option.id} value={option.id}>
                                                                {option.ci_nombre}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </TableCell>
                                                <TableCell align="left" width="20%">
                                                    <Button variant="contained" color="primary" style={{marginLeft: '10px'}} 
                                                        onClick={(e) => addIntegrante(currentSelectedStudentID)}
                                                    >
                                                        Agregar
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </div>
                        <br />
                    </FormContainer>
                    <br />
                    <FormContainer>
                        <div className="w-100 text-center">
                            <StyledH2>Imagenes del Proyecto</StyledH2>
                        </div>
                        <br />
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: '100%' }} aria-label="Proyectos" >
                                    <TableHead className="bg-neutral-800 ">
                                        <TableRow>
                                            <TableCell align="left" width="10%">
                                                <span className='text-cyan-50'>Imagen</span>
                                            </TableCell>
                                            <TableCell align="left" width="30%">
                                                <span className='text-cyan-50'>Nombre</span>
                                            </TableCell>
                                            <TableCell align="left" width="40%">
                                                <span className='text-cyan-50'>Descripción</span>
                                            </TableCell>
                                            <TableCell align="left" width="10%">
                                                <span className='text-cyan-50'>Acción</span>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {
                                        (recordFound && !unlockFields) && 
                                        imgs.map((row) => {
                                            const imgUrl = `${consts.backend_base_url}/api/files/getFile/${row.url}`;
                                            return (
                                            <TableRow 
                                                    className="text-center"
                                                    key={row.position}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="left" width="20%">
                                                        <img src={imgUrl} alt={`img-${row.position}`} style={{width:'60%'}}  />
                                                    </TableCell>
                                                    <TableCell align="left" width="30%">
                                                        <TextField label="Nombre" variant="outlined" disabled value={row.nombre} sx={{ m: 1, width: '100%' }}/>
                                                    </TableCell>
                                                    <TableCell align="left" width="40%">
                                                        <TextField label="Descripción" variant="outlined" disabled value={row.descripcion}  sx={{ m: 1, width: '100%' }}/>
                                                    </TableCell>
                                                    <TableCell align="left" width="10%">
                                                        <a href={imgUrl} target="_blank">Ver</a>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                    {
                                        (!recordFound || unlockFields) && 
                                        imgs2Add.map((row, index) => {
                                            return (
                                                <TableRow 
                                                    className="text-center"
                                                    key={row.position}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="left" width="20%">
                                                        <img src={row.url} alt={`img-${row.position}`} style={{width:'60%'}}  />
                                                    </TableCell>
                                                    <TableCell align="left" width="30%">
                                                        <TextField label="Nombre" variant="outlined" defaultValue={row.nombre} 
                                                             sx={{ m: 1, width: '100%' }}
                                                            onChange={(e) => changeImgVal("nombre", e.target.value, row.position, true)}/>
                                                    </TableCell>
                                                    <TableCell align="left" width="40%">
                                                        <TextField label="Descripción" variant="outlined" defaultValue={row.descripcion} 
                                                             sx={{ m: 1, width: '100%' }}
                                                            onChange={(e) => changeImgVal("descripcion", e.target.value, row.position, true)}/>
                                                    </TableCell>
                                                    <TableCell align="left" width="10%">
                                                        <div className='text-center'>
                                                            <DeleteIcon style={{fontSize:'30px', cursor: 'pointer', margin: '0 auto'}} 
                                                                onClick={(e) => deleteImg(row.position, true)}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    {
                                        (!recordFound || unlockFields) && 
                                        <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell align="left" width="20%">
                                                <Button component="label" color="secondary" variant="contained" startIcon={<CloudUploadIcon />}>
                                                    Cargar
                                                    <input type="file" id="img_to_upload" ref={newImage} hidden/>
                                                </Button>
                                            </TableCell>
                                            <TableCell align="left" width="30%">
                                                <TextField id="newImageName" sx={{ m: 1, width: '100%' }} label="Nombre" variant="outlined" defaultValue={""} onChange={(e) => setNewImageName(e.target.value)}/>
                                            </TableCell>
                                            <TableCell align="left" width="40%">
                                                <TextField id="newImageDescription" sx={{ m: 1, width: '100%' }} label="Descripción" variant="outlined" defaultValue={""} onChange={(e) => setNewImageDescription(e.target.value)}/>
                                            </TableCell>
                                            <TableCell align="left" width="10%">
                                                <Button variant="contained" color="primary" style={{marginLeft: '10px'}} 
                                                    onClick={(e) => addNewImage()}
                                                >
                                                    Agregar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </FormContainer>
                    <br />
                    <FormContainer>
                        <div className="w-100 text-center">
                            <StyledH2>Documentos del Proyecto</StyledH2>
                        </div>
                        <br />
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: '100%' }} aria-label="Proyectos" >
                                    <TableHead className="bg-neutral-800 ">
                                        <TableRow>
                                            <TableCell align="left" width="20%">
                                                <span className='text-cyan-50'>Documento</span>
                                            </TableCell>
                                            <TableCell align="left" width="60%">
                                                <span className='text-cyan-50'>Nombre</span>
                                            </TableCell>
                                            <TableCell align="left" width="20%">
                                                <span className='text-cyan-50'>Acción</span>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {
                                        (recordFound && !unlockFields) && 
                                        docs.map((row) => {
                                            const docUrl = `${consts.backend_base_url}/api/files/getFile/${row.url}`;
                                            return (
                                            <TableRow 
                                                    className="text-center"
                                                    key={row.position}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="left" width="20%">
                                                        <div className='text-center'>
                                                            <InsertDriveFileIcon style={{fontSize:'30px', cursor: 'pointer', margin: '0 auto'}}/>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="left" width="60%">
                                                        <TextField label="Nombre" variant="outlined" disabled value={row.nombre} sx={{ m: 1, width: '100%' }}/>
                                                    </TableCell>
                                                    <TableCell align="left" width="20%">
                                                        <a href={docUrl} target="_blank">Ver</a>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                    {
                                        (!recordFound || unlockFields) && 
                                        docs2Add.map((row, index) => {
                                                return (
                                                    <TableRow 
                                                        className="text-center"
                                                        key={row.position}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" width="20%">
                                                            <div className='text-center'>
                                                                <InsertDriveFileIcon style={{fontSize:'30px', cursor: 'pointer', margin: '0 auto'}}/>
                                                                <br></br>
                                                                <span style={{fontSize:'10px'}}>{row.file_name}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell align="left" width="60%">
                                                            <TextField label="Nombre" variant="outlined" defaultValue={row.nombre} 
                                                                sx={{ m: 1, width: '100%' }}
                                                                onChange={(e) => changeDocName(e.target.value, row.position, true)}/>
                                                        </TableCell>
                                                        <TableCell align="left" width="20%">
                                                            <div className='text-center'>
                                                                <DeleteIcon style={{fontSize:'30px', cursor: 'pointer', margin: '0 auto'}} 
                                                                    onClick={(e) => deleteDoc(row.position, true)}
                                                                />
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                        })}
                                    {
                                        (!recordFound || unlockFields) && 
                                        <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell align="left" width="20%">
                                                <Button component="label" color="secondary" variant="contained" startIcon={<CloudUploadIcon />}>
                                                    Cargar
                                                    <input type="file" id="doc_to_upload" ref={newDoc} hidden/>
                                                </Button>
                                            </TableCell>
                                            <TableCell align="left" width="30%">
                                                <TextField id="newImageName" sx={{ m: 1, width: '100%' }} label="Nombre" variant="outlined" defaultValue={""} onChange={(e) => setNewDocName(e.target.value)}/>
                                            </TableCell>
                                            <TableCell align="left" width="10%">
                                                <Button variant="contained" color="primary" style={{marginLeft: '10px'}} 
                                                    onClick={(e) => addNewDoc()}
                                                >
                                                    Agregar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </FormContainer>
                </Fragment>
            {
                showDeleteDialog &&
                <DeleteDialog showDeleteDialog={showDeleteDialog} setShowDeleteDialog={setShowDeleteDialog} handleDeleteConfirm={handleDeleteConfirm}></DeleteDialog>
            }

        </div>
    )
}

export default ProyectoForm;

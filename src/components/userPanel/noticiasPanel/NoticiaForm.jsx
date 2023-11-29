import { useState, useEffect, useContext, Fragment, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import axios from "axios";

import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';

//text editor
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditorProvider,
  RichTextField,
  MenuButtonAddImage,
  RichTextReadOnly
} from "mui-tiptap";

//icons
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import SubjectIcon from '@mui/icons-material/Subject';

//
import SinFotoPerfil from '../../../icons/sin-foto-perfil.png';
import AppContext from '../../../context/App';
import consts from '../../../settings/consts';
import FormBtns from '../FormBtns';
import sequelizeImg2Base64 from '../../../helpers/sequelizeImg2Base64';
import getFormattedDate from '../../../helpers/getFormattedDate';
import styledComponents from '../../styled'
import FormContainer from '../FormContainer'
import noEncontrado from '../../../icons/no-encontrado.jpg'
import Button from '@mui/material/Button';
import getTurnoName from '../../../helpers/getTurnoName';
import DeleteDialog from '../../generales/DeleteDialog';
import imgValidations from '../../../helpers/imgValidations';

// define your extension array
Image.configure({
    inline: true,
})  
TextAlign.configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right', 'justify'],
});
const extensions = [StarterKit, Document, Heading, Paragraph, Image, TextAlign]
const defaultContent = `<p>Hola</p>`;

const postBooleanLabel = { inputProps: { 'aria-label': 'Publicado' } };


const NoticiaForm = ({}) => {
    //logic
    const [reLoad, setReload] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [showFormBtns, setShowFormBtns] = useState(true);
    const [recordData, setRecordData] = useState(false);

    //bd values
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [contenido, setContenido] = useState( `<p>Contenido</p>`);
    const [miniatura, setMiniaturaUrl] = useState("");
    const [userId, setUserId] = useState(false);
    const [categId, setCategId] = useState(false);
    const [postDate, setPostDate] = useState(new Date());
    const [imgs, setImgs] = useState([]);

    //Ui fields
    const [categorias, setCategorias] = useState([]);
    const [newImgsList, setNewImgsList] = useState([]);
    const [newMiniaturaObj, setNewMiniaturaObj] = useState(false);
    const [showEditMiniatura, setShowEditMiniatura] = useState(false);
    const [booleanPostChecked, setBooleanPostChecked] = useState(false);
    const ImgsInput = useRef(null);
    const miniaturaInput = useRef(null);
    const StyledH1 = styledComponents.dahsboardPanelh1;
    const StyledH2 = styledComponents.dahsboardPanelh2;
    const StyledH3 = styledComponents.dahsboardPanelh3;
    const StyledH4 = styledComponents.dahsboardPanelh4;
    const MiniaturaImg = styledComponents.miniaturaImg;
    const MiniaturaImgEdit = styledComponents.miniaturaImgEdit;
    const MiniaturaImgEditLayer = styledComponents.miniaturaImgEditLayer;
    const MiniaturaSmall = styledComponents.miniaturaSmall;
    const editor = useEditor({extensions,defaultContent});

    //logic
    const [showDeleteDialog, setShowDeleteDialog ] = useState(false);
    const [recordFound, setRecordFound] = useState(false);
    const [newId, setNewId] = useState(0);
    const { id } = useParams();
    const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
    const [unlockFields, setUnlockFields] = useState(false);


    if(editor) {
        editor.setEditable(contenido);
    }

    if(ImgsInput && ImgsInput.current) {
        ImgsInput.current.onchange = (e) => {
            const validations = imgValidations(e.target.files[0]);
            if(validations.status != 'success') {
                setNotificationMsg(validations.msg);
                setNotificationType('error');
                setShowNotification(true);
                e.target.value = "";
            } else {
                addnewImg(e.target.files[0]);
            }
        } 
    }

    if(miniaturaInput && miniaturaInput.current) {
        miniaturaInput.current.onchange = (e) => {
            const validations = imgValidations(e.target.files[0]);
            if(validations.status != 'success') {
                setNotificationMsg(validations.msg);
                setNotificationType('error');
                setShowNotification(true);
                e.target.value = "";
            } else {
                const url = window.URL.createObjectURL(e.target.files[0]);
                setNewMiniaturaObj({
                    url: url,
                    file: e.target.files[0]
                });
                setMiniaturaUrl(url);
            }
        } 
    }

    const setEditorContent = () => {
        if (!editor || editor.isDestroyed) {
            return;
        }
        if (!editor.isFocused || !editor.isEditable) {
            if(contenido != "") {
                queueMicrotask(() => {
                    const currentSelection = editor.state.selection;
                    editor
                    .chain()
                    .setContent(contenido)
                    .setTextSelection(currentSelection)
                    .run();
                });
            }
        }
    }

    useEffect(() => {
        setEditorContent();
    }, [recordData, contenido]);

    const setNoticiaInfo = (data) => {
        setRecordData(data);
        setNombre(data.nombre);
        setDescripcion(data.descripcion);
        setContenido(data.contenido);
        setMiniaturaUrl(`${consts.backend_base_url}/${data.miniatura}`);
        setUserId(data.user.id);
        setCategId(data.categoria_noticium.id);
        setPostDate(data.fecha_publicacion);
        let imgsList = []
        data.noticia_imagens.map((item) => {
            imgsList.push({url: item.file, id: item.id})
        });
        setImgs(imgsList);
        setNewImgsList([]);
        setNewMiniaturaObj(false);
        setShowEditMiniatura(false);
    }

    const searchCategoriasNoticias = () => {
        const token = localStorage.getItem('token');
        const config = {headers:{ authorization: token}};
        let url = `${consts.backend_base_url}/api/categoria_noticia`;
        axios.get(url, config).then((response) => {
            //set record data
            console.log(response);
            setCategorias(response.data);
            setBlockUI(false);
        }).catch((err) => {
            if(err.response.status == 404) {
                setRecordFound(false);
            } else {
                setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
                setNotificationType('error');
                setShowNotification(true);
            }
            setBlockUI(false);
        });
    }

    const recordValidations = () =>  {
        let objReturn = {'status': 'success', 'data': {}, 'msg': ''};
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const addedImgs = getNewImgs();
        if(nombre.trim() == "") {
            objReturn = {'status': 'failed', 'data': {}, 'msg': 'Se debe definir un nombre para la noticia.'};
            return objReturn;
        }
        if(!newMiniaturaObj && id == 0) {
            objReturn = {'status': 'failed', 'data': {}, 'msg': 'Debe cargar una miniatura para la noticia'};
            return objReturn;
        }
        if(addedImgs.length > 70) {
            objReturn = {'status': 'failed', 'data': {}, 'msg': 'La cantidad máxima de imagenes que se pueden cargar es de 70.'};
            return objReturn;
        }
        if(!categId) {
            objReturn = {'status': 'failed', 'data': {}, 'msg': 'Debe seleccionar una categoria para la noticia'};
            return objReturn;
        }
        return objReturn;
    }

    const searchRecord = () => {
        setBlockUI(true);
        if(id != "0") {
            const token = localStorage.getItem('token');
            const config = {headers:{ authorization: token}};
            let url = `${consts.backend_base_url}/api/noticia/${id}`;
            axios.get(url, config).then((response) => {
                setNoticiaInfo(response.data);
                setRecordFound(true);
                setBlockUI(false);
            }).catch((err) => {
                if(err.response.status == 404) {
                    setRecordFound(false);
                } else {
                    setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
                    setNotificationType('error');
                    setShowNotification(true);
                }
                setBlockUI(false);
            });
        } else {
            setRecordFound(true);
            setUnlockFields(true);
            setBlockUI(false);
        }
    }

    const updateRecordData = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('userData'));
        const formData = new FormData();
        const new_imgs = getNewImgs();
        const deleted_imgs = getDeletedImgs();
        let body = {
            id: id,
            nombre: nombre.trim(),
            descripcion: descripcion,
            contenido: editor.getHTML(),
            addedImgs: new_imgs.url,
            deletedImgs: deleted_imgs,
            miniaturaUpdated: false,
            miniaturaFileIndex: 0,
            categId: false,
            userId: userData.id,
            post: booleanPostChecked
        };
        if(categId) {
            body.categId = parseInt(categId);
        }

        let a = 0;
        for(let i = 0; i < new_imgs.file.length; i++) {
            formData.append('files', new_imgs.file[i]);
            a += 1;
        }
        if(miniatura != recordData.miniatura && newMiniaturaObj) {
            body.miniaturaUpdated = true;
            body.miniaturaFileIndex = a;
            formData.append('files', newMiniaturaObj.file);
        }
        formData.append('data', JSON.stringify(body));
        const config = {headers:{'authorization': token, 'Content-Type': 'multipart/form-data'}};
        let url = `${consts.backend_base_url}/api/noticia/${id}`;
        axios.put(url, formData, config).then((response) => {
            setNoticiaInfo(response.data.data);
            setBlockUI(false);
            setNotificationMsg(response.data.message);
            setNotificationType('success');
            setShowNotification(true);
        }).catch((err) => {
            console.log(err);
            setNotificationMsg("Ocurrió un error inesperado. Intentelo mas tarde...");
            setNotificationType('error');
            setShowNotification(true);
            setBlockUI(false);
        });
    }

    const createRecord = () => {
        setBlockUI(true);
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('userData'));
        const formData = new FormData();
        const new_imgs = getNewImgs();
        const deleted_imgs = getDeletedImgs();
        let body = {
            nombre: nombre.trim(),
            descripcion: descripcion,
            contenido: editor.getHTML(),
            addedImgs: new_imgs.url,
            deletedImgs: deleted_imgs,
            miniaturaFileIndex: 0,
            categId: false,
            userId: userData.id
        };
        if(categId) {
            body.categId = parseInt(categId);
        }

        let a = 0;
        for(let i = 0; i < new_imgs.file.length; i++) {
            formData.append('files', new_imgs.file[i]);
            a += 1;
        }
        
        formData.append('files', newMiniaturaObj.file);
        body.miniaturaFileIndex = a;
        formData.append('data', JSON.stringify(body));
        const config = {headers:{'authorization': token, 'Content-Type': 'multipart/form-data'}};
        let url = `${consts.backend_base_url}/api/noticia`;

        axios.post(url, formData, config).then((response) => {
            //set record data
            setNoticiaInfo(response.data);
            setNotificationMsg("El registro fue creado exitosamente!!");
            setNotificationType('success');
            setShowNotification(true);
            setReload(true);
            setBlockUI(false);
        }).catch((err) => {
            console.log(err);
            setNotificationMsg(err.response.data.message);
            setNotificationType('error');
            setShowNotification(true);
            setBlockUI(false);
        });
    }

    const handleConfirmarBtn = (e) => {
        let confirmarBtnReturn = {'status': 'success', 'message': '', 'data': {}};
        confirmarBtnReturn = recordValidations();
        if(confirmarBtnReturn.status == 'success') {
            if(recordData != false) {
                updateRecordData();
            } else {
                createRecord();
            }
        }
        return confirmarBtnReturn;
    }

    const handleCancelarBtn = (e) => {
        if(id != '0') {
            setNoticiaInfo(recordData);
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
        let url = `${consts.backend_base_url}/api/noticia/${id}`;
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

    //fields
    const getNewImgs = () => {
        let imgsList = {url: [], file: []};
        let a = 0;
        newImgsList.map((item, index) => {
            if(editor.getHTML().includes(item.url)) {
                imgsList.url.push({url: item.url, index: a});
                imgsList.file.push(item.file);
                a += 1;
            }
        });
        return imgsList;
    }

    const getDeletedImgs = () => {
        let imgsList = [];
        imgs.map((item) => {
            if(!editor.getHTML().includes(item.url)) {
                imgsList.push(item.id);
            }
        });
        return imgsList;
    }

    const _handleEliminarMiniaturaBtn = () => {
        setMiniaturaUrl('');
        setNewMiniaturaObj(false);
    }
    const addnewImg = (file) => {
        let imgsList = [...newImgsList];
        const newImgObj = {
            url: window.URL.createObjectURL(file),
            file: file
        }
        imgsList.push(newImgObj);
        setNewImgsList(imgsList);
        if(editor) {
            editor?.chain().focus().setImage({ src: newImgObj.url }).run();
        }
    }

    useEffect(() => {
        searchRecord();
        searchCategoriasNoticias();
    }, []);

    return (
        <div className='m-4'>
            {
                id == '0' && recordFound && 
                <div className='text-center mb-10'>
                    <StyledH1>Crear una Nueva Noticia</StyledH1>
                </div>
            }
            {
                id != '0' && recordFound &&
                <div className='text-center mb-10'>
                    <StyledH1>Actualizar Noticia</StyledH1>
                </div>
            }
            {
                recordFound && showFormBtns && 
                <FormBtns 
                    setUnlockFields={setUnlockFields} 
                    handleConfirmarBtn={handleConfirmarBtn} 
                    handleCancelarBtn={handleCancelarBtn} 
                    showEditBtn={true ? id == '0' : false}
                    deleteApplies={true}
                    handleDeleteBtn={handleDeleteBtn}
                />
            }
            {
                reLoad && <Navigate to={`/dashboard/noticias/${newId}`} />
            }
            {
                redirect && <Navigate to="/dashboard/noticias" />
            }
            {
                recordFound &&
                <FormContainer>
                    <div className='d-flex flex-row flex-wrap text-center mb-4'>
                        {
                            !unlockFields &&
                            <MiniaturaImg src={miniatura ? miniatura : SinFotoPerfil} alt="miniatura-noticia"/>  
                        } 
                        {
                            unlockFields &&
                            <Fragment>
                                <MiniaturaImgEdit 
                                    style={{backgroundImage: `url('${miniatura ? miniatura : SinFotoPerfil}')`}}   
                                    onMouseEnter={() => setShowEditMiniatura(true)} 
                                    onMouseLeave={() => setShowEditMiniatura(false)}
                                >
                                    {
                                        showEditMiniatura &&
                                        <MiniaturaImgEditLayer
                                            onClick={(e) => miniaturaInput.current.click()}
                                        >
                                            <p>Click Aqui para cambiar la foto</p>
                                            <input type="file" id="miniaturaInput" ref={miniaturaInput} hidden/>
                                        </MiniaturaImgEditLayer>
                                    }
                                </MiniaturaImgEdit>
                                {
                                    miniatura &&
                                    <Button variant="outlined" color="error" style={{margin: '10px'}} onClick={(e) => _handleEliminarMiniaturaBtn(e)}>Eliminar Miniatura</Button>
                                }
                            </Fragment>
                        }
                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        {
                            !unlockFields && 
                            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                <TextField id="nombre" label="Nombre" disabled variant="outlined" value={nombre}/>
                            </FormControl>
                        }
                        {
                            unlockFields && 
                            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                <TextField id="nombre" label="Nombre" variant="outlined" defaultValue={nombre} onChange={(e) => setNombre(e.target.value)}/>
                            </FormControl>
                        }

                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        {
                            !unlockFields && 
                            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                <TextField id="descripcion" label="Descripción" disabled variant="outlined" value={nombre}/>
                            </FormControl>
                        }
                        {
                            unlockFields && 
                            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                <TextField id="descripcion" label="Descripción" variant="outlined" defaultValue={descripcion} onChange={(e) => setDescripcion(e.target.value)}/>
                            </FormControl>
                        }

                    </div>
                    <div className='d-flex flex-row flex-wrap'>
                        {
                            !unlockFields && 
                            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                <TextField id="categ_id" label="Categoría" disabled variant="outlined" value={recordData.categoria_noticium.nombre}/>
                            </FormControl>
                        }
                        {
                            unlockFields && 
                            <FormControl sx={{ m: 1, width: '30%' }} variant="outlined">
                                <TextField id="categ_id" select label="Categoría" defaultValue={categId ? categId : ""} onChange={(e) => setCategId(e.target.value)}>
                                    {categorias.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.nombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
                        }
                    </div>
                    <div className='d-flex flex-row flex-wrap mb-4 items-center justify-center text-center'>
                        {
                            !unlockFields && 
                            <Fragment className="text-left">
                                <span style={{color: 'rgba(0, 0, 0, 0.38)', margin: '10px'}}>Contenido</span>
                                <FormControl sx={{ m: 1, width: '95%' }} variant="outlined" style={{border: '1px solid rgba(0, 0, 0, 0.38)', padding: '10px', borderRadius: '10px', color: 'rgba(0, 0, 0, 0.38)'}}>
                                    <RichTextReadOnly content={contenido} extensions={[StarterKit, Image]} />
                                </FormControl>
                            </Fragment>
                        }
                        {
                            unlockFields && 
                            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                            {/*<RichTextReadOnly content={contenido} extensions={extensions} />*/}
                            <input type="file" id="imgsInput" ref={ImgsInput} hidden/>
                            <RichTextEditorProvider editor={editor}>
                                <RichTextField
                                    controls={
                                    <MenuControlsContainer>
                                        <MenuSelectHeading />
                                        <MenuDivider />
                                        <MenuButtonBold />
                                        <MenuButtonItalic />
                                        <MenuDivider />
                                        {
                                            <Fragment>
                                                <button onClick={() => editor.chain().focus().setTextAlign('left').run()}>
                                                    <FormatAlignLeftIcon  style={{color: 'rgba(0, 0, 0, 0.54)'}} />
                                                </button>
                                                <button onClick={() => editor.chain().focus().setTextAlign('center').run()}>
                                                    <FormatAlignCenterIcon style={{color: 'rgba(0, 0, 0, 0.54)'}}  />
                                                </button>
                                                <button onClick={() => editor.chain().focus().setTextAlign('right').run()}>
                                                    <FormatAlignLeftIcon style={{color: 'rgba(0, 0, 0, 0.54)'}}  />
                                                </button>
                                                <button onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
                                                    <FormatAlignJustifyIcon  style={{color: 'rgba(0, 0, 0, 0.54)'}} />
                                                </button>
                                                <button onClick={() => editor.chain().focus().setTextAlign().run()}>
                                                    <SubjectIcon style={{color: 'rgba(0, 0, 0, 0.54)'}}  />
                                                </button>
                                            </Fragment>
                                        }
                                        <MenuDivider />
                                        <MenuButtonAddImage
                                            onClick={() => {
                                                ImgsInput.current.click()
                                            }}
                                        />
                                        {/* Add more controls of your choosing here */}
                                    </MenuControlsContainer>
                                    }
                                />
                            </RichTextEditorProvider>
                        </FormControl>
                        }
                    </div>
                    <div className='d-flex flex-row flex-wrap m-4'>
                        <div style={{width:'100px !important'}}>
                            {
                                !postDate &&
                                <StyledH4>Publicar</StyledH4>
                            }
                                                        {
                                postDate &&
                                <StyledH4>Ocultar</StyledH4>
                            }
                        </div>
                        <div style={{width:'100px !important'}}><Switch {...postBooleanLabel} onClick={(e) => setBooleanPostChecked(e.target.checked)}/></div>
                    </div>
                    
                </FormContainer>

            }
            {
                showDeleteDialog &&
                <DeleteDialog showDeleteDialog={showDeleteDialog} setShowDeleteDialog={setShowDeleteDialog} handleDeleteConfirm={handleDeleteConfirm}></DeleteDialog>
            }

            {
                (!recordFound && id != 0) && 
                <FormContainer>
                    <div className='text-center'>
                        <img src={noEncontrado} alt="no-encontrado" style={{width: '300px', margin: '0 auto', marginTop:'10px'}}/>
                        <StyledH2 className='mt-5'>La noticia no fue encontrada</StyledH2>
                        <div className='text-center d-flex flex-row flex-wrap w-100 mt-5'>
                            <Link to={"/dashboard/noticias"}>
                                <Button variant="contained" color="primary" style={{marginLeft: '10px'}}>Volver</Button>
                            </Link>
                        </div>
                    </div>
                </FormContainer>
            }

        </div>
    )
}

export default NoticiaForm;

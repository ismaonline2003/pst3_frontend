import { React, useState, useContext, useEffect, useMemo, Fragment } from 'react'
import { Link, useParams } from 'react-router-dom';
import parser from 'html-react-parser';
import axios from "axios";

//material ui
import Grid from '@mui/material/Grid';
import { Container, FormGroup, FormControl, InputLabel, Input, Button } from '@mui/material';
import { styled } from '@mui/system';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';


//own
import styledComponents from '../styled';
import consts from '../../settings/consts';
import AppContext from '../../context/App';
import IconButton from '../../icons/radio-online-icon.svg'
import OnlineRadioNavbar from './OnlineRadioNavbar';
import getFormattedDate from '../../helpers/getFormattedDate';


const ContainerComponent = styled('div')({
  padding: '20px'
});


const RadionOnlineEmision = ({}) => {
  const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
  const { id } = useParams();
  const [ audioName, setAudioName ] = useState("");
  const [ userID, setUserID] = useState(false);
  const [ recordData, setRecordData ] = useState({});
  const [ titulo, setTitulo ] = useState("");
  const [ descripcion, setDescripcion ] = useState("");
  const [ fechaInicio, setFechaInicio ] = useState(false);
  const [ chatMessages, setChatMessages ] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  //const playElement = useRef();
  const H1 = styledComponents.radioOnlineh1;
  const ImgIcon = styledComponents.radioOnlineIcon;

    const handleChangePage = (event, newPage) => {
        const messagesNumber = newPage*10;
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


  const setEmisionValues = (data) => {
    setRecordData(data);
    setTitulo(data.titulo);
    setDescripcion(data.descripcion);
    const fechaString = getFormattedDate(new Date(data.fecha_inicio), true);
    setFechaInicio(fechaString);
    setAudioName(data.file);
    setChatMessages(data.messages);
  }

  const searchMessages = () => {
    setBlockUI(true);
    const url = `${consts.backend_base_url}/api/emision/${id}`;
    axios.get(url).then((response) => {
        console.log(response);
        if(response.data) {
            setEmisionValues(response.data);
        }
        setBlockUI(false);
    }).catch((err) => {
        setNotificationMsg(err.response.data.message);
        setNotificationType('error');
        setShowNotification(true);
        setBlockUI(false);
    });
  }

  const searchEmision = () => {
    setBlockUI(true);
    const url = `${consts.backend_base_url}/api/emision/${id}`;
    axios.get(url).then((response) => {
        console.log(response);
        if(response.data) {
            setEmisionValues(response.data);
        }
        setBlockUI(false);
    }).catch((err) => {
        setNotificationMsg(err.response.data.message);
        setNotificationType('error');
        setShowNotification(true);
        setBlockUI(false);
    });
  }

  const setUsersVals = () => {
    let userData = localStorage.getItem('userData');
    if(userData != '{}') {
      userData = JSON.parse(userData);
      if(userData) {
        setUserID(userData.id);
      }
    }
  }

  useEffect(() => {
    searchEmision();
    setUsersVals();
  }, []);


  return (
    <Fragment>
      <OnlineRadioNavbar userID={userID}/>
      <ContainerComponent>
        <Container maxWidth="md">
              <br />
              <h1 style={{'color': '#00b0ff', 'fontSize': '40px', 'fontWeight': '700'}}>Emisión de Radio</h1>
              <br />
              <Container maxWidth="xl" className="bg-teal-300  p-6 rounded-md">
                  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={2} className="text-left">
                      <ImgIcon src={IconButton} alt="React Logo" className="radio-online-icon"/>
                    </Grid>
                    <Grid item xs={10} className="text-left p-0 m-0">
                        <h2 style={{'fontSize': '1.6rem', 'fontWeight': '700', 'color': 'white', marginBottom: '10px'}}>{titulo}</h2>
                        {
                            audioName &&
                            <audio controls style={{width: '100%'}}>
                                <source src={`${consts.backend_base_url}/api/files/getEmisionAudio/${audioName}`} type="audio/mp3"/>
                            </audio>
                        }
                    </Grid>
                  </Grid>
              </Container>
                <br />
                <strong><span style={{color: "#868686", fontSize: '1.3rem'}}>Fecha de Emisión: {fechaInicio}</span></strong>
                <br />
                <div className='text-justify'>
                    <br />
                    {parser(descripcion)}
                </div>
                <br />
                <h2 style={{'color': '#00b0ff', 'fontSize': '1.6rem', 'fontWeight': '700'}}>Mensajes del Chat</h2>
                <br />
              <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: '100%' }} aria-label="Mensajes">
                        <TableBody>
                        {chatMessages.filter((item, index) => index < (page+1)*rowsPerPage && index >= (page)*rowsPerPage).map((row, index) => {
                            const fechaMsg = new Date(row.fecha_envio);
                            const fechaMsgString = getFormattedDate(fechaMsg, true);
                                return (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">
                                                <strong>{row.username}  <span style={{color: "#868686"}}>{fechaMsgString}</span></strong>
                                                <br />
                                                {row.content}
                                            </TableCell>
                                    </TableRow>
                                )
                        })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10]}
                    component="div"
                    count={chatMessages.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                 />
            </Paper>
        </Container>
      </ContainerComponent>
    </Fragment>
  )
};

export default RadionOnlineEmision;

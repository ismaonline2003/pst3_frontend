import { React, useState, useContext, useEffect, useMemo, Fragment } from 'react'
import { Link } from 'react-router-dom';
import parser from 'html-react-parser';
import axios from "axios";

//material ui
import TextField from '@mui/material/TextField';
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


const ContainerComponent = styled('div')({
  padding: '20px'
});


const EmisionesRadio = ({}) => {
  const { blockUI, setBlockUI, setNotificationMsg, setNotificationType, setShowNotification} = useContext(AppContext);
  const [ userID, setUserID] = useState(false);
  const [ searchValue, setSearchValue] = useState("");
  const [ records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //const playElement = useRef();
  const H1 = styledComponents.radioOnlineh1;

  const handleChangePage = (event, newPage) => {
      setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
  };


  const searchRecords = () => {
    setBlockUI(true);
    const url = `${consts.backend_base_url}/api/emision?value=${searchValue}`;
    axios.get(url).then((response) => {
      console.log(response);
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
    searchRecords();
    let userData = localStorage.getItem('userData');
    if(userData != '{}') {
      userData = JSON.parse(userData);
      if(userData) {
        setUserID(userData.id);
      }
    }
  }, [])

  return (
    <Fragment>
      <OnlineRadioNavbar userID={userID}/>
      <ContainerComponent>
        <Container maxWidth="md">
            <br />
              <h1 style={{'color': '#00b0ff', 'fontSize': '40px', 'fontWeight': '700'}}>Emisiones de Radio</h1>
            <br />
            <div className='d-flex flex-row flex-wrap items-center content-center text-left'>
              <TextField id="search-bar" label="Buscar" 
                  type="search" style={{width: '80%'}}
                  onChange={(e) => setSearchValue(e.target.value)}
              />
              <Button variant="contained" color="success" onClick={(e) => searchRecords()} style={{marginLeft: '20px', marginTop: '10px'}}>Buscar</Button>
            </div>
            <br />
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: '100%' }} aria-label="Proyectos">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left"><strong>Emisión</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {records.filter((item, index) => index < (page+1)*rowsPerPage && index >= (page)*rowsPerPage).map((row, index) => {
                                return (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">
                                              <Link to={`/radionOnlineEmision/${row.id}`} style={{width: '100%'}}>
                                                {row.titulo}
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
        </Container>
      </ContainerComponent>
    </Fragment>
  )
};

export default EmisionesRadio;

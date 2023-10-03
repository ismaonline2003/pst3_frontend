import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import SearchBar from '../SearchBar';
import styledComponents from '../../styled';
import AppContext from '../../../context/App';
import consts from '../../../settings/consts';

const columns = [
    { field: 'id', headerName: 'Ref', width: 70 },
    { field: 'name', headerName: 'Nombre y Apellido', width: 250 },
    { field: 'ci', headerName: 'Cédula', width: 120 },
    { field: 'nro_expediente', headerName: 'Nro Expediente', width: 120 },
    { field: 'phone', headerName: 'Teléfono', width: 150 },
    { field: 'mobile', headerName: 'Teléfono Móvil', width: 150 },
    { field: 'actions', headerName: 'Acciones', width: 150 }
];
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
    const { blockUI, setBlockUI, setShowNotification, setNotificationMsg, setNotificationType } = useContext(AppContext);

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
            setNotificationMsg("Ocurrió un error inesperado... Intentelo mas tarde.");
            setNotificationType('error');
            setShowNotification(true);
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
            {
            }
            <StyledH1>Estudiantes</StyledH1>
            <br />
            <SearchBar selectOptions={searchBarParameters} externalHandleSearchBtn={handleSearchBtn}/>
            <br />
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={estudiantes}
                    columns={columns}
                    initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                />
            </div>
        </React.Fragment>
    );
}


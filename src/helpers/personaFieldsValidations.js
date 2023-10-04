export default function personaFieldsValidations(data) {
    let objReturn = {status: 'success', 'message': ''}
    if(data.name.trim() == "") {
        objReturn = {status: 'error', 'message': 'El nombre no puede estar vacío'}
        return objReturn;
    }
    if(data.lastname.trim() == "") {
        objReturn = {status: 'error', 'message': 'El apellido no puede estar vacío'}
        return objReturn;
    }
    return objReturn;
}
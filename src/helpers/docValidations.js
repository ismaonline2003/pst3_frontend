export default function docValidations(file) {
    let objReturn = {status: 'success', msg: ''}
    console.log(file.name);
    if(!["application/pdf"].includes(file.type)) {
        objReturn = {status: 'error', msg: 'El documento debe estar en formato .pdf .'}
        return objReturn;
    }
    if(file.size > 524300000) {
        objReturn = {status: 'error', msg: 'El documento debe tener un peso máximo de 50 mb (megabytes).'}
        return objReturn;
    }
    return objReturn;
}
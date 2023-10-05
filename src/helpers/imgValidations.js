export default function imgValidations(file) {
    let objReturn = {status: 'success', msg: ''}
    if(!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        objReturn = {status: 'error', msg: 'La imagen debe estar en formato jpg, jpeg o png.'}
        return objReturn;
    }
    if(file.size > 52430000) {
        objReturn = {status: 'error', msg: 'La imagen debe tener un peso máximo de 5 mb (megabytes).'}
        return objReturn;
    }
    return objReturn;
}
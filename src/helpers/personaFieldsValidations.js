export default function personaFieldsValidations(data) {
    let objReturn = {status: 'success', msg: ''}
    const whiteSpacesRegEx = /\s/g;
    const numbersRegEx = /\d/g;
    const onlyLettersRegEx =  /^[A-Za-z]+$/g;
    const lettersRegEx =  /[A-Za-z]/g;
    const ciTypes = ["V", "J", "E", "P"];
    const sexoOptions = ["M", "F"];

    //ci type validations    
    if(!ciTypes.includes(data.ci_type)) {
        objReturn = {status: 'error', msg: 'El tipo de número de cédula debe ser uno de los siguientes: V, J, E, P.'}
        return objReturn;
    }

    //sexo validations
    if(!sexoOptions.includes(data.sexo)) {
        objReturn = {status: 'error', msg: 'Debe elegir entre los sexo Masculino y Femenino.'}
        return objReturn;
    }

    //ci validations
    if(whiteSpacesRegEx.test(data.ci)) {
        objReturn = {status: 'error', msg: 'El número de cédula no puede contener espacios en blanco.'}
        return objReturn;
    }
    if(isNaN(parseInt(data.ci))) {
        objReturn = {status: 'error', msg: 'El número de cédula solo puede contener números.'}
        return objReturn;
    }
    if(data.ci == "0") {
        objReturn = {status: 'error', msg: 'El número de cédula no puede ser 0.'}
        return objReturn;
    }
    if(data.ci.length > 9) {
        objReturn = {status: 'error', msg: 'El número de cédula no puede superar los 9 caracteres.'}
        return objReturn;
    }
    if(data.ci == "") {
        objReturn = {status: 'error', msg: 'El  número de cédula no puede estar vacío.'}
        return objReturn;
    }

    //name validations
    if(whiteSpacesRegEx.test(data.name)) {
        objReturn = {status: 'error', msg: 'El nombre no puede contener espacios en blanco.'}
        return objReturn;
    }
    if(numbersRegEx.test(data.name)) {
        objReturn = {status: 'error', msg: 'El nombre no puede contener números.'}
        return objReturn;
    }
    if(!data.name.match(onlyLettersRegEx)) {
        objReturn = {status: 'error', msg: 'El nombre solo puede contener letras.'}
        return objReturn;
    }
    if(data.name.length > 20) {
        objReturn = {status: 'error', msg: 'El nombre no puede superar los 20 caracteres.'}
        return objReturn;
    }
    if(data.name == "") {
        objReturn = {status: 'error', msg: 'El nombre no puede estar vacío.'}
        return objReturn;
    }

    //lastname validations
    if(whiteSpacesRegEx.test(data.lastname)) {
        objReturn = {status: 'error', msg: 'El apellido no puede contener espacios en blanco.'}
        return objReturn;
    }
    if(numbersRegEx.test(data.lastname)) {
        objReturn = {status: 'error', msg: 'El apellido no puede contener números.'}
        return objReturn;
    }
    if(!data.lastname.match(onlyLettersRegEx)) {
        objReturn = {status: 'error', msg: 'El apellido solo puede contener letras.'}
        return objReturn;
    }
    if(data.lastname.length > 20) {
        objReturn = {status: 'error', msg: 'El apellido no puede superar los 20 caracteres.'}
        return objReturn;
    }
    if(data.lastname == "") {
        objReturn = {status: 'error', msg: 'El apellido no puede estar vacío.'}
        return objReturn;
    }

    //phone validations
    if(whiteSpacesRegEx.test(data.phone)) {
        objReturn = {status: 'error', msg: 'El número de telefono no puede contener espacios en blanco.'}
        return objReturn;
    }
    if(data.phone.match(lettersRegEx)) {
        objReturn = {status: 'error', msg: 'El número de telefono no puede contener letras.'}
        return objReturn;
    }
    if(data.phone.length > 15) {
        objReturn = {status: 'error', msg: 'El número de telefono no puede superar los 15 digitos.'}
        return objReturn;
    }
    if(data.phone == "") {
        objReturn = {status: 'error', msg: 'El número de teléfono no puede estar vacío.'}
        return objReturn;
    }

    //mobile validations
    if(whiteSpacesRegEx.test(data.mobile)) {
        objReturn = {status: 'error', msg: 'El número de telefono móvil no puede contener espacios en blanco.'}
        return objReturn;
    }
    if(data.mobile.match(lettersRegEx)) {
        objReturn = {status: 'error', msg: 'El número de telefono móvil no puede contener letras.'}
        return objReturn;
    }
    if(data.mobile.length > 15) {
        objReturn = {status: 'error', msg: 'El número de telefono móvil no puede superar los 15 digitos.'}
        return objReturn;
    }

    let birthDate = new Date(data.birthdate);
    let currentDate = new Date();
    if(isNaN(birthDate)) {
        objReturn = {status: 'error', msg: 'Debe establecer una fecha de nacimiento.'}
        return objReturn;
    }
    if(birthDate instanceof Date) {
        if(birthDate > currentDate) {
            objReturn = {status: 'error', msg: 'La fecha de nacimiento no puede ser mayor a la fecha actual.'}
            return objReturn;
        }
    }
    
    return objReturn;
}
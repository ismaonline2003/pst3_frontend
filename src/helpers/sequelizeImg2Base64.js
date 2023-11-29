export default function sequelizeImg2Base64(image_data) {
    let dataReturn = {b64str: "", blob: ""};
    const intArray = new Uint8Array(image_data.data);
    const reducedArray = intArray.reduce((data, byte) => data + String.fromCharCode(byte), '');
    const base64String = `data:image/jpg;base64, ${btoa(reducedArray)}`;
    dataReturn = {b64str: base64String};
    return dataReturn;
}
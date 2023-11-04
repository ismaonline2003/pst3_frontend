export default function getTurnoName(value) {
    let name = "";
    if(value == "1") {
        name = "Mañana";
    }
    if(value == "2") {
        name = "Tarde";
    }
    if(value == "3") {
        name = "Noche";
    }
    return name;
}
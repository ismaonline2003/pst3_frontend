import consts from '../settings/consts'
export default function WSconnectToServer() {
    const ws = new WebSocket(`${consts.ws_server_url}`);
    return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
            if(ws.readyState === 1) {
                clearInterval(timer)
                resolve(ws);
            }
        }, 10);
    });
}
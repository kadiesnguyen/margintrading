import config from '@/config.json';
class DepositSocket {
    socket;
    
    connect(){
        this.socket = new WebSocket(config.BASE_URL_SOCKET_NAP + `?token=${localStorage.getItem('userToken')}`);
        this.socket.onmessage = (e) => {
            this.onmessage(e)
        }
    }

    close(){
        if(this.socket){
            this.socket.close();
            this.socket = null;
        } 
    }

    send(type, data){
        this.socket.send(JSON.stringify({type, data}))
    }

    onmessage(e){
       
    }
}

export default new DepositSocket()
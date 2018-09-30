// var PKUser = (require('./PKUser'));
// var PKRoom = (require('./PKRoom'));
var PKHall = (require('./PKHall'));
module.exports = class PKServer{
    private static _instance: PKServer;

    public static getInstance(): PKServer {
        if (!this._instance)
            this._instance = new PKServer();
        return this._instance;
    }

    public onDataReceive(data,conn) {
         var head = data.head;
         var gameid = data.gameid;
         var msg = data.msg;
         if(gameid && !conn.gameid)
             conn.gameid = gameid;
         switch(head)
         {
             case 'pair':
                 PKHall.getInstance().addUser(msg);
                 break;
             case 'pk_info':
             case 'face':
                 PKHall.getInstance().onRoomMsg(data);
                 break;
             case 'pk_result':
                 PKHall.getInstance().onRoomMsg(data);
                 PKHall.getInstance().removeUser(gameid);
                 break;
         }
    }



}
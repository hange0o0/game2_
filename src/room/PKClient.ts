module.exports = class PKClient{
    private static list = []
    private static userObject = {};

    public static addClient(conn){
        if(this.list.indexOf(conn) == -1)
            this.list.push(conn);
    }

    public static removeClient(conn){
          var index = this.list.indexOf(conn)
        if(index != -1)
        {
            this.list.splice(index,1);
            delete this.userObject[conn.gameid];
        }
    }

    public static getConnByGameid(gameid){
        if(!this.userObject[gameid])
        {
            for(var s in this.list)
            {
                if(this.list[s].gameid == gameid)
                {
                    this.userObject[gameid] = this.list[s];
                    break;
                }
            }
        }
        return this.userObject[gameid];
    }

    public static deleteConnByGameid(gameid){
        var conn = this.getConnByGameid(gameid);
        if(conn)
        {
            this.removeClient(conn);
        }
    }

    public static sendToUser(gameid,head,msg,index=0){
        var conn = this.getConnByGameid(gameid);
        console.log('callSend:'+gameid)
        if(conn)
        {
            var str = JSON.stringify({
                head:head,
                msg:msg,
                callbackid:index
            });
            conn.sendText(str)
            console.log('send:'+gameid + ':',str)
        }
    }

}
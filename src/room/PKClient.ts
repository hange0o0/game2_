export default class PKClient{
    private static list = []
    private static userObject = {};

    public static addClient(conn){
        if(this.list.indexOf(conn) == -1)
        {
            this.list.push(conn);
            conn.connecttime = Date.now();
        }
    }

    //如果有多个相同gameid的连接，只保留最新一个
    public static disconnectOld(gameid){

        if(!gameid)
            return;
        var arr = [];
        for(var s in this.list)
        {
            if(this.list[s].gameid == gameid)
            {
                arr.push(this.list[s])
            }
        }
        if(arr.length > 1)
        {
            arr.sort(this.sortFun)
            arr.pop();
            for(var i=0;i<arr.length;i++)
            {
                var conn = arr[i];
                this.sendData(conn,'new_login',{})
                conn.close();
                var index = this.list.indexOf(conn)
                if(index != -1)
                {
                    this.list.splice(index,1);
                }
            }
        }
    }
    private static sortFun(a,b){
        return a.connecttime - b.connecttime
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

    public static sendToUser(gameid,head,msg,orginData?){
        var conn = this.getConnByGameid(gameid);
        console.log('callSend:'+gameid)
        if(conn)
        {
            var str = this.sendData(conn,head,msg,orginData);
            console.log('send:'+gameid + ':',str)
        }
    }

    public static sendData(conn,head,msg,orginData?){
        var oo:any = {
            head:head,
            msg:msg
        };
        if(orginData)
        {
            if(orginData.gameid)
                oo.from = orginData.gameid;
            if(orginData.callbackid)
                oo.callbackid = orginData.callbackid;
        }
        var str = JSON.stringify(oo);
        conn.sendText(str)
        return str;
    }

}
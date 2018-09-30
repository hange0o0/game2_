var PKClient = (require('./PKClient'));
var md5 = (require('../util/md5'));
module.exports = class PKUser{
    private static pool = [];
    public static createItem():PKUser{
        var item:PKUser = this.pool.pop();
        if(!item)
        {
            item = new PKUser();
        }
        item.remove();
        return item;
    }
    public static freeItem(item){
        if(!item)
            return;
        item.remove();
        if(this.pool.indexOf(item) == -1)
            this.pool.push(item);
    }


    public gameid;
    public roomid;
    public pkType;
    public pkData;
    public score;


    public actionTime;//最近一次行动时间

    public setData(data){
         this.gameid = data.gameid;
         this.roomid = 0
         this.pkType = data.pktype;
         this.pkData = data.pkdata;
         this.score = data.score;
    }

    public sendData(head,msg,callbackid?){
        PKClient.sendToUser(this.gameid,head,msg,callbackid);
    }

    public createPKResult(isWin){
        var key = md5.incode(this.gameid + '_' + this.pkData.card + '_hange0o0_server')
        return {
            iswin:true,
            key:key
        }
    }

    //清除
    public remove(){
        this.gameid = 0;
        this.roomid = 0
    }
}
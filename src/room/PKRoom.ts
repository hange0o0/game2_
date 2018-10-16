//var PKClient = (require('./PKClient'));
import PKClient from './PKClient';
module.exports = class PKRoom{
    private static pool = [];
    private static roomIndex = 1;
    public static createItem():PKRoom{
        var item:PKRoom = this.pool.pop();
        if(!item)
        {
            item = new PKRoom();
        }
        item.remove();
        item.roomid = this.roomIndex;
        this.roomIndex ++;
        return item;
    }
    public static freeItem(item){
        if(!item)
            return;
        item.remove();
        if(this.pool.indexOf(item) == -1)
            this.pool.push(item);
    }

    public static TYPE_PVP_ONLINE = 4;

    public userList=[];
    public actionRecord = [];
    public winList = [];
    public pkData;
    public startTime
    public roomid

    public removeUser(gameid){
        for(var i=0;i<this.userList.length;i++)
        {
             if(this.userList[i].gameid == gameid)
             {
                 this.userList.splice(i,1);
                 break;
             }
        }
    }

    public pairSuccess(p1,p2){
         this.userList.push(p1)
         this.userList.push(p2)
        this.startTime = Date.now();
        this.pkData = {
            seed:Math.floor(this.startTime/1000),
            players:[p1.pkData,p2.pkData]
        };
        for(var i=0;i<this.userList.length;i++)
        {
            var user = this.userList[i];
            user.roomid = this.roomid
            user.pkData.id = i+1
            user.pkData.team = i+1
        }
        console.log('success')
        this.sendToAll('pair_success',{
            pkdata:this.pkData
        })
    }

    public sendToAll(head,msg,orginData?){
         for(var i=0;i<this.userList.length;i++)
         {
             this.userList[i].sendData(head,msg,orginData)
         }
    }

    public sendToUser(gameid,head,msg,orginData?){
        for(var i=0;i<this.userList.length;i++)
        {
            if(gameid == this.userList[i].gameid)
            {
                this.userList[i].sendData(head,msg,orginData);
                break;
            }
        }
    }

    public sendToOthers(gameid,head,msg,orginData){
         for(var i=0;i<this.userList.length;i++)
         {
             if(gameid != this.userList[i].gameid)
                 this.userList[i].sendData(head,msg,orginData)
         }
    }

    private getPassTime(){
        var cd = Date.now() - this.startTime;
        if(cd < 5000)
            return 0;
        return cd - 5000;
    }

    public onRoomMsg(data){
        var head = data.head;
        var gameid = data.gameid;
        var msg = data.msg;
        var user = this.getUser(gameid);
        if(!user)
        {
            PKClient.sendToUser(gameid,head,{fail:3},data);
            return;
        }
        user.actionTime = Date.now();

        switch(head)
        {
            case 'pk_info':
                msg.passtime = this.getPassTime();
                if(Math.abs(msg.actiontime - msg.passtime) > 3000)//有问题的数据
                {
                    this.sendToUser(gameid,'pk_reset',{})
                    break;
                }
                this.actionRecord.push(msg);
                this.sendToAll('pk_info',msg,data)
                break
            case 'face':
                // msg.passtime = this.getPassTime();
                this.sendToOthers(gameid,'face',msg,data)
                break;
            case 'ispking':
                this.sendToUser(gameid,'ispking',{
                    passtime:this.getPassTime(),
                    action:this.actionRecord,
                    pkdata:this.pkData},data)
                break;
            case 'pk_result':
                if(msg.win)
                    this.winList.push(gameid);
                this.sendToUser(gameid,'pk_result',user.createPKResult(msg.win),data)

                //记日志
                if(this.winList.length > 1)
                {
                    
                }

                break;
            case 'get_reset_data':
                this.sendToUser(gameid,'get_reset_data',{
                    pkdata:this.pkData,
                    action:this.actionRecord,
                    passtime:this.getPassTime(),
                },data)

                break;
        }
    }

    private getUser(gameid){
        for(var i=0;i<this.userList.length;i++)
        {
            if(gameid == this.userList[i].gameid)
            {
                return this.userList[i];
            }
        }
        return null;
    }

    //清除
    public remove(){

        this.userList.length = 0
        this.actionRecord.length = 0
    }
}
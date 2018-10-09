import {setInterval} from "timers";
var PKUser = (require('./PKUser'));
var PKRoom = (require('./PKRoom'));
var PKClient = (require('./PKClient'));
module.exports = class PKHall{
    private static _instance: PKHall;

    public static getInstance(): PKHall {
        if (!this._instance)
            this._instance = new PKHall();
        return this._instance;
    }

    public roomList = {}
    public userData = {}

    public start(){
        setInterval(()=>{
            this.onTimer();
        },1000)
    }

    //执行定时任务
    private onTimer(){
        // console.log(999)
        var tt = Date.now();
        //处理空了的房间
        for(var s in  this.roomList)
        {
            var room = this.roomList[s];
            if(room.userList.length == 0 || tt - room.startTime > 60*6*1000)//大于6分钟
            {
                PKRoom.freeItem(this.roomList[s])
                console.log('remove room:' + s,tt - room.startTime)
                delete this.roomList[s];
            }
        }


        //玩家分类
        var data = {};
        for(var s in this.userData)
        {
            var user = this.userData[s];

            //处理玩家死尸

            if(tt - user.actionTime > 6*60*1000)//大于6分钟
            {
                this.removeUser(s);
                continue;
            }

            if(user.roomid)
                continue;
            if(!data[user.pkType])
                data[user.pkType] = [];
            data[user.pkType].push(user);
        }

        //排序并匹配
        for(var s in data)
        {
            var arr = data[s];

            if(arr.length < 2)
                continue;
            arr.sort(this.sortFun);
            while(arr.length >= 2)
            {
                 var user = arr.shift();
                 this.pairOne(user,arr);
            }
        }
    }

    //在列表中找一个合适的
    private pairOne(user,list){
        var find//分数最接近的
        var dec = Number.MAX_VALUE;
        for(var i=0;i<list.length;i++)
        {
            var item = list[i];
             if(!find || dec > Math.abs(user.score - item.score))
             {
                 find = item;
                 dec = Math.abs(user.score - item.score);
                 if(dec == 0)
                     break;
             }
        }

        var timeDec = (Date.now() - user.actionTime)/1000
        if(timeDec < 5 && dec > 30)
            return
        if(timeDec < 10 && dec > 100)
            return


        //成功
        var index = list.indexOf(find);
        list.splice(index,1);

        var room = PKRoom.createItem();
        room.pairSuccess(user,find)
        this.roomList[room.roomid] = room;
    }

    private sortFun(a,b){
        return a.actionTime - b.actionTime
    }

    public getUser(gameid){
         return this.userData[gameid];
    }

    public addUser(data){
        var user = PKUser.createItem(data)
        user.setData(data);
        user.actionTime = Date.now();
        this.userData[user.gameid] = user;
    }



    public removeUser(gameid){
        if(this.userData[gameid])
        {
            if(this.userData[gameid].roomid)
            {
                var room = this.getRoom(this.userData[gameid].roomid);
                room && room.removeUser(gameid)
            }
            delete this.userData[gameid];
            console.log('remove user:',gameid)
        }

    }

    public getRoom(roomid){
        return this.roomList[roomid];
    }

    public pair(){
        
    }

    public onRoomMsg(data){
        var head = data.head;
        var gameid = data.gameid;
        var msg = data.msg;
        var user = this.getUser(gameid)
        if(!user)
        {
            PKClient.sendToUser(gameid,head,{fail:1},data.callbackid);
            return;
        }
        user.actionTime = Date.now();
        var room = this.getRoom(user.roomid)
        if(!room)
        {
            PKClient.sendToUser(gameid,head,{fail:2},data.callbackid);
            return;
        }

        room.onRoomMsg(data)
    }
}
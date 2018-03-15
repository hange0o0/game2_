class PKData extends egret.EventDispatcher{
    private static instance:PKData;

    public static getInstance() {
        if (!this.instance) this.instance = new PKData();
        return this.instance;
    }
    public currentState = 'def'

    public quick = false//快速算出结果

    public jumpMV = false;
    public isGameOver = false //游戏结束
    public startTime = 0 //游戏开始时间
    public stopTime = 0 //游戏暂停时间
    public actionTime = 0 //游戏数据上处理过的时间

    public monsterID;//怪物ID下标累计
    public team1:PKTeamData;  //进攻方
    public team2:PKTeamData;
    public sysTeam:PKTeamData;
    public playerNum = 2;

    public monsterChange = false//怪有变化
    public randomSeed = 0//随机的种子
    public monsterList = [];//场上的怪的数据
    public playerObj = {};//场上的玩家的数据
    public myPlayer:PKPlayerData;
    public sysPlayer:PKPlayerData;
    public diamondData;

    public history = {};

        //public stateObj = [] //所有要触发动画的集合
    //public topVideoList = [] //影响关部的动画的集合
    //private topKey = ['monster_win','monster_add'];
    constructor(){
        super();
    }

    //取经过的时间
    public getPassTime(){
        return TM.nowMS() - this.startTime;
    }

    //暂停
    public stop(){
        //if(isLast)//在最后一次行动后暂停(马上停)
        //    this.stopTime = this.actionTime + 1;
        //else
            this.stopTime = TM.nowMS();
    }

    //继续
    public play(){
        if(this.stopTime)
        {
            var add = TM.nowMS() - this.stopTime;
            this.startTime += add
            //this.actionTime += add;
            this.stopTime = 0;
        }
    }

    //初始化游戏
    public init(data){
        this.quick = false
        this.history = {};
        this.monsterList.length = 0;
        this.playerObj = {};
        this.myPlayer = null;
        this.actionTime = 0;
        this.stopTime = 0;
        this.monsterID = 1;
        this.isGameOver = false;
        this.monsterChange = false;
        this.currentState = 'def';
        PKMonsterAction.getInstance().init()



        this.randomSeed = data.seed;
        this.team1 = new PKTeamData({id:1})
        this.team2 = new PKTeamData({id:2})
        this.team1.enemy = this.team2
        this.team2.enemy = this.team1
        for(var i=0;i<data.players.length;i++)
        {
            var player = new PKPlayerData(data.players[i])
            player.teamData = this.getTeamByID(data.players[i].team)
            if(player.getHandCard()[1])
            {
                player.teamData.autoDef = 0
            }
            player.teamData.hp += player.hp;
            this.playerObj[player.id] = player;
            if(player.gameid == UM.gameid)
            {
                this.myPlayer = player;
                player.teamData.atkRota = PKConfig.ROTA_LEFT
                player.teamData.enemy.atkRota = PKConfig.ROTA_RIGHT
                player.teamData.members.unshift(player);
            }
            else
                player.teamData.members.push(player);
        }

        this.sysTeam = new PKTeamData({id:'sys'})
        this.sysPlayer = new PKPlayerData({id:'sys',gameid:'sys',team:'sys'})
        this.sysPlayer.teamData = this.sysTeam;
        this.playerObj[this.sysPlayer.id] = this.sysPlayer;

        if(!this.myPlayer) //看别人的录像
        {
            this.team1.atkRota = PKConfig.ROTA_LEFT
            this.team2.atkRota = PKConfig.ROTA_RIGHT
            this.myPlayer = this.getPlayer(1)
        }
        this.team1.reInit();
        this.team2.reInit();
    }

    public random(){
        var seed = this.randomSeed;
        seed = ( seed * 9301 + 49297 ) % 233280;
        var rd = seed / ( 233280.0 );
        this.randomSeed = rd * 100000000;
        return rd;
    }

    //数据乱序
    public upsetArr(arr){
        var self = this;
        arr.sort(rdFun);
        function rdFun(){
            return self.random()>0.5?-1:1;
        }
    }

    public randomOne(arr:Array<any>,splice = false):any{
        var index = Math.floor(arr.length * this.random())
        var data = arr[index];
        if(splice)
            arr.splice(index,1);
        return data;
    }

    //开始游戏
    public start(){
        this.startTime = TM.nowMS()
        this.stopTime = 0;
    }



    //要保证只是通知改变显示，不能有逻辑
    public addVideo(data){
        if(this.quick)
            return;
        this.dispatchEventWith('video',false,data)
        //this.videoList.push(data)
        //if(this.topKey.indexOf(data.type) != -1)
        //    this.topVideoList.push(data);
    }

    public getTeamByID(teamID){
        if(teamID == 'sys')
            return this.sysTeam;
        return this.team1.id == teamID?this.team1:this.team2
    }
    public getTeamByRota(rota){
        return this.team1.atkRota == rota?this.team1:this.team2
    }

    public getPlayer(id):PKPlayerData{
        return this.playerObj[id]
    }

    //赢
    public isWin(){
        var team1 =  this.myPlayer.teamData
        var team2 =  this.myPlayer.teamData.enemy
        return team1.hp > 0 &&  team2.hp <= 0;
    }
    //平
    public isDraw(){
        var team1 =  this.myPlayer.teamData
        var team2 =  this.myPlayer.teamData.enemy
        return (team1.hp > 0 &&  team2.hp > 0) || (team1.hp <= 0 &&  team2.hp <= 0);
    }

    //找玩家对应的怪
    public getMonsterByPlayer(playerid){
        var arr = [];
        for(var i=0;i<this.monsterList.length;i++)
        {
            var oo = this.monsterList[i];
             if(oo.owner == playerid)
             {
                 arr.push(oo)
             }
        }
        return arr;
    }
    //找玩家对应的怪的占位
    public getMonsterSpaceByPlayer(playerid){
        var count = 0;
        for(var i=0;i<this.monsterList.length;i++)
        {
            var oo = this.monsterList[i];
             if(oo.owner == playerid)
             {
                 count += oo.getVO().space;
             }
        }
        return count;
    }


    //找对应的怪
    public getMonsterByID(id){
        for(var i=0;i<this.monsterList.length;i++)
        {
            var oo = this.monsterList[i];
             if(oo.id == id)
             {
                 return oo;
             }
        }
        return null;
    }
    //找玩家对应的怪
    public getMonsterByTeam(team,fun?,value?){
        var arr = [];
        for(var i=0;i<this.monsterList.length;i++)
        {
            var oo = this.monsterList[i];
             if(oo.getOwner().teamData == team)
             {
                 if(fun && !fun(oo,value))
                    continue;
                 arr.push(oo)
             }
        }
        return arr;
    }

    //找玩家对应的怪
    public getMonsterByNoTeam(team,fun?,value?){
        var arr = [];
        for(var i=0;i<this.monsterList.length;i++)
        {
            var oo = this.monsterList[i];
             if(oo.getOwner().teamData != team)
             {
                 if(fun && !fun(oo,value))
                     continue;
                 arr.push(oo)
             }
        }
        return arr;
    }

    //取队伍的最前的怪
    public getFirstItem(taamID){
        var atkRota = PKData.getInstance().getTeamByID(taamID).atkRota;
        var chooseItem
        for(var i=0;i<this.monsterList.length;i++)
        {
            var item:PKMonsterData = this.monsterList[i];
            if(item.atkRota != atkRota)
                continue
            if(item.owner == 'sys')
                continue
            if(!chooseItem)
                chooseItem = item;
            else if(atkRota == PKConfig.ROTA_LEFT && chooseItem.x<item.x)
                chooseItem = item;
            else if(atkRota == PKConfig.ROTA_RIGHT && chooseItem.x>item.x)
                chooseItem = item;
        }
        return chooseItem
    }

    public getFirstX(teamID){
         var item = this.getFirstItem(teamID);
        if(item)
            return item.x;
        return  this.getTeamByID(teamID).atkRota == PKConfig.ROTA_LEFT ? PKConfig.appearPos:PKConfig.floorWidth + PKConfig.appearPos;
    }

    //加入怪到场上
    public addMonster(data){
        var monster = new PKMonsterData(data)
        monster.id = this.monsterID;
        this.monsterID ++;
        this.monsterList.push(monster);

        this.addVideo({
            type:PKConfig.VIDEO_MONSTER_ADD,
            user:monster
        })

        MBase.getData(monster.mid).onCreate(monster);

        monster.getOwner().teamData.testState(PKConfig.LISTENER_CREATE,monster);
        this.monsterChange = true;

        this.history[monster.id] = ({
            id:monster.id,
            mid:monster.mid,
            owner:monster.owner,
            actionTime:this.actionTime
        })
        monster['xxx'] = this.actionTime + '|' + monster.id
        return monster;
    }

    //重置战场上的怪的数据
    public resetMonsterData(){
        if(!this.monsterChange)
            return;
        this.monsterChange = true;
        for(var i=0;i<this.monsterList.length;i++)
        {

        }
    }

    //移除场上怪物
    //public removeMonster(id){
    //    for(var i=0;i<this.monsterList.length;i++)
    //    {
    //        var oo = this.monsterList[i];
    //        if(oo.id == id)
    //        {
    //            this.monsterList.splice(i,1);
    //            return;
    //        }
    //    }
    //}
}
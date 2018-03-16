class PKCounter {
    private static instance:PKCounter;

    public static getInstance() {
        if (!this.instance) this.instance = new PKCounter();
        return this.instance;
    }

    public testCard(list1,list2,hp=5){
        var PD = PKData.getInstance()
        var data = {
            seed:TM.now(),
            players:[
                {id:1,gameid:'test1',team:1,autolist:list1,force:0,type:0,hp:hp},
                {id:2,gameid:'test2',team:2,autolist:list2,force:0,type:0,hp:hp}
            ]
        };
        PD.init(data);
        PD.quick = true;
        PD.start();
        PKCode.getInstance().onStep()

        if(PD.isWin())
            console.log('win')
        else if(PD.isDraw())
            console.log('draw')
        else
            console.log('fail')
    }
}
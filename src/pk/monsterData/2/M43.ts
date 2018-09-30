class M43 extends MBase {
    constructor() {
        super();
    }

    //private mvID = 103;
    public mvID2 = 8;

    public initMonster(user:PKMonsterData){
        user.atkX = 20
        user.atkY = 40
    }


    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return Math.abs(user.x - target.x)*2 + 200;
    }





    public skill(user:PKMonsterData,target:PKMonsterData){
        var buff = new PKBuffData()
        buff.user = user;
        buff.addState(PKConfig.STATE_MOMIAN);
        buff.endTime = PKData.getInstance().actionTime + 1000*user.getSkillValue(1);
        target.addBuff(buff)

        var buff = new PKBuffData()
        var skillValue = Math.floor(user.getSkillValue(2,true)/2);
        buff.id = 43;
        buff.value = skillValue;
        buff.user = user;
        buff.addValue('hpChange',skillValue);
        buff.endTime = PKData.getInstance().actionTime + 1000*user.getSkillValue(1);
        target.addBuff(buff)

        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_MONSTER_ADD_STATE,
            user:target,
            key:'momian',
            stateType:0
        })
    }

    //
    public getSkillTarget(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var atkrage = user.getVO().getAtkDis() + 100;
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            if(target.isInState(PKConfig.STATE_MOMIAN))
                continue;

            var des = Math.abs(user.x - target.x);
            if(des<=atkrage)
            {
                return [target]
            }
        }
        return [];
    }

}
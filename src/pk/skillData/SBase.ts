class SBase {
    private static baseData = {};

    public static getData(id):SBase {
        if (!this.baseData[id]) {
            var myClass = eval("S" + id);
            this.baseData[id] = new myClass();
        }
        return this.baseData[id];
    }


    public type = 'skill'

    constructor() {
    }

    public initSkill(user:PKPosCardData){

    }

    public onDie(user:PKPosCardData){

    }

    public onIll(buff:PKBuffData){

    }

    //预加载
    public preload() {

    }

    //技能动画
    public skillMV(target:PKMonsterData){

    }

    //生效时的逻辑
    public onSkill(user:PKPosCardData){
         return [];
    }



    //////////////////////////////////////////////////上面的为要设的内容

    //实现技能
    public skill(user:PKPosCardData){
        //var svo = SkillVO.getObject(user.mid);

        var targets = this.onSkill(user);//技能效果
        if(targets)
        {
            for(var i=0;i<targets.length;i++)
            {
                this.skillMV(targets[i]);//技能动画
            }
        }

        //if(svo.state)
        //{
        //    user.getOwner().teamData.addStateLister(svo.state,user)
        //    return;
        //}
        //var targets = this.getSkillTarget(user);
        //for(var i=0;i<targets.length;i++)
        //{
        //
        //}
    }

    /*
    *  对最前方的#1范围内的敌人造成$1点伤害
    * 在最前方建立一个治疗图腾，对#1范围内的友军每秒回复$2血量
    * 加快所有单位#1%速度，持续#2秒
    * 消灭地图上所有的单位
    *
    *
    *
    * */


}
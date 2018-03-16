class AtkMVCtrl {
    private static instance:AtkMVCtrl;

    public static getInstance() {
        if (!this.instance) this.instance = new AtkMVCtrl();
        return this.instance;
    }

    public preLoadMV(id){

    }
    public preLoadPNG(id){

    }
    public preLoadPNGLocal(id){

    }
    public playAniOn(id,mvid):any{
         return {};
    }

    public mAtkMV(mid,user,target,actionTime,endTime){

    }
    public mSkillMV(mid,user,target,actionTime,endTime){

    }

    public sSkillMV(mid,target:PKMonsterData){

    }
}

var UM:any = {}
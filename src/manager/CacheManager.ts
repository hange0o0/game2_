class CacheManager{

    private static _instance:CacheManager;
    public static getInstance():CacheManager {
        if (!this._instance)
            this._instance = new CacheManager();
        return this._instance;
    }
    public registerData = {};
    public table = {};

    private cacheLoad = {};

    public constructor() {
        this.register(MonsterVO);
        this.register(SkillVO);
        this.register(PropVO);
        this.register(HangVO);
        this.register(TecVO);
        //this.register(MonsterSkillVO);
        //this.register(TaskVO);
        //this.register(LeaderSkillVO);
    }

    private register(cls)
    {
        this.registerData[cls.dataKey] = cls;
    }

    //初始化数据
    public initData(data){
        for(var s in data)
        {
            if(!this.table[s])
                this.table[s] = {};
            if(this.registerData[s])
            {
                var cls = this.registerData[s];
                var key = cls.key;
                var oo = data[s];
                for(var ss in oo)
                {
                    var vo:any = new cls();
                    vo.fill(oo[ss]);
                    this.table[s][vo[key]] = vo;
                }
            }
        }
    }

    //静态数据初始化后调用
    public initFinish(){
        // MonsterVO.initFinish();
        //TaskVO.initFinish();
    }

    public getCardVO(id):MonsterVO|SkillVO{
        if(id<100)
            return MonsterVO.getObject(id);
        return SkillVO.getObject(id);
    }
}

var CM = CacheManager.getInstance();
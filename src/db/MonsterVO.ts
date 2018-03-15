class MonsterVO {
    public static dataKey = 'monster_base';
    public static key = 'id';
    public static getObject(id): MonsterVO{
        return CM.table[this.dataKey][id];
    }
    public static get data(){
        return CM.table[this.dataKey]
    }

    public isMonster = true;

    public width: number;
    public height: number;
    public atk: number;
    public type: number;
    public headoff: number;
    public heightoff: number;
    public atkcd: number;
    public cost: number;
    public space: number;
    public def: number;
    public cd: number;
    public num: number;
    public atkrage: number;
    public level: number;
    public mcnum: number;
    public mcheight: number;
    public name: string;
    //public num2: number;
    public des: string;
    public speed: number;
    public hp: number;
    public skillcd: number;
    public id: number;
    public mcwidth: number;
    public atk2: number;
    public mv_atk: number;
    public mv_atk2: number;
    public sv1: number;
    public sv2: number;
    public sv3: number;


    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.width = data.width
        this.height = data.height
        this.atk = data.atk
        this.type = data.type
        this.headoff = data.headoff
        this.heightoff = data.heightoff
        this.atkcd = data.atkcd * 1000
        this.cost = data.cost
        this.space = data.space
        this.def = data.def
        this.cd = data.cd * 1000
        this.num = data.num
        //this.num2 = data.num2
        this.atkrage = data.atkrage
        this.level = data.level
        this.mcnum = data.mcnum
        this.mcheight = data.mcheight
        this.name = data.name
        this.des = data.des
        this.speed = data.speed
        this.hp = data.hp
        this.id = data.id
        this.sv1 = data.sv1
        this.sv2 = data.sv2
        this.sv3 = data.sv3
        this.mcwidth = data.mcwidth
        this.atk2 = data.atk2
        this.skillcd = data.skillcd * 1000
        this.mv_atk = data.mv_atk * 1000
        this.mv_atk2 = data.mv_atk2
    }

    public getImage(gay){
        if(gay)
            return Config.localResRoot + 'card_gay/card_'+this.id+'.jpg';
        return Config.localResRoot + 'card/card_'+this.id+'.jpg';
    }

    public getBG(){
        if(this.type == 1)
            return 'border_7_png';
        if(this.type == 2)
            return 'border_6_png';
        return 'border_8_png';
    }

    public getTypeIcon(){
        return 'icon_type'+this.type+'_png'
    }

    public preLoad(){
        RES.getResAsync('"enemy'+this.id+'_png',function(){},this)
         MBase.getData(this.id).preload();
    }

    public getAdd(force,type?){
        if(type)
            var typeAdd = this.type == type?PKConfig.typeAdd:0
        else
            var typeAdd = 0;
        var add = (1+force/100)*(1+typeAdd/100);
        return add;
    }

    public getSkillValue(index,force=0){
        var sv = this['sv' + index];
        if(!force)
            return sv
        return Math.floor(sv * (1+force/100));
    }

    public getDes(forceRate){
        return this.des.replace('#1',this.sv1 + '').replace('#2',this.sv2 + '').replace('#3',this.sv3 + '')
            .replace('$1',this.changeValue(this.sv1,forceRate) + '').replace('$2',this.changeValue(this.sv2,forceRate) + '').replace('$3',this.changeValue(this.sv3,forceRate) + '')
    }
    private changeValue(v,forceRate){
        if(!v)
            return;
        return Math.ceil(v*forceRate);
    }

    public getAtkDis(){
        return this.width/2 + this.atkrage
    }


}
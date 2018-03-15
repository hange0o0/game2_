class SkillVO {
    public static dataKey = 'skill_base';
    public static key = 'id';
    public static getObject(id): SkillVO{
        return CM.table[this.dataKey][id];
    }
    public static get data(){
        return CM.table[this.dataKey]
    }

    public isMonster = false;

    public des: string;
    public cd: number;
    public cost: number;
    public name: string;
    public num: number;
    public sv1: number;
    public sv2: number;
    public sv3: number;
    public sv4: number;
    public id: number;
    //public state: string;
    public level: number;
    public type: number;


    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.des = data.des
        this.cd = data.cd * 1000
        this.cost = data.cost
        this.name = data.name
        this.num = data.num
        this.id = data.id
        //this.state = data.state
        this.level = data.level
        this.type = data.type

        this.sv1 = data.sv1
        this.sv2 = data.sv2
        this.sv3 = data.sv3
        this.sv4 = data.sv4
    }

    public getImage(gay){
        if(gay)
            return Config.localResRoot + 'card_gay/card_'+101+'.jpg';
        return Config.localResRoot + 'card/card_'+101+'.jpg';
        //return Config.localResRoot + 'card/card_'+this.id+'.jpg';
    }
    public getBG(){
        return 'border_14_png';
    }
    public getTypeIcon(){
        return 'skill_type'+this.type+'_png';
    }
    public getTypeColor(){
        return [0x0,0xFC7B64,0x63FF63,0x60B5FF,0xE36BFF,0xFFE460][this.type];
    }

    public preLoad(){
         SBase.getData(this.id).preload();
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

    public getAdd(force,type?){
        if(type)
            var typeAdd = this.type == type?PKConfig.typeAdd:0
        else
            var typeAdd = 0;
        var add = (1+force/100)*(1+typeAdd/100);
        return Math.floor(add);
    }

    public getSkillValue(index,force=0){
        var sv = this['sv' + index];
        if(!force)
            return sv
        return Math.floor(sv * (1+force/100));
    }


}
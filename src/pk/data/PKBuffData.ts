class PKBuffData {
    public user;
    public owner;

    public endTime = 0;//到期时间  为0则为图腾类效果
    public add = {};  //改变的值
    public state = {};  //改变的状态
    public haveState = false
    public haveValue = false


    //以下为唯一技能才用到
    public id;//唯一ID
    public ing//这BUFF是否有起作用
    public value;//技能等级数值,用于比较相同ID下哪个BUFF强



    constructor(obj?) {
        //if (obj)
        //    this.fill(obj);
        //
        //if (this.nick)
        //    this.nick = Base64.decode(this.nick);
        //else
        //    this.nick = '守卫者' + this.id;
    }

    public addValue(key,value){
        this.add[key] = value
        this.haveValue = true
    }

    public addState(key){
        this.state[key] = true
        this.haveState = true
    }

    //使技能生效
    public enable(){
        if(this.ing)
            return;
        this.ing = true;
        for(var s in this.add)
            this.owner[s] += this.add[s];
    }

    //使技能无效
    public disable(){
        if(!this.ing)
            return;
        this.ing = false;
        for(var s in this.add)
            this.owner[s] -= this.add[s];

    }
}
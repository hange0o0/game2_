/**
 *
 * @author 
 *
 */
class ObjectUtil {
	public constructor() {
	}
		
	public static arrayToObj(array:Array<any>, key:string, value:any):any{
    	key = key || "key";
    	value = value || "value";
    	var o: any = {};
    	for(var s in array){
        	var o2 = array[s];
        	if(value == '@whole')
            	o[o2[key]] = o2;
            	else
            	o[o2[key]] = o2[value];
    	}
    	return o;
	}
    	
    public static objToArray(obj:any):Array<any>{
        var list = [];
        for(var key in obj)
            list.push(obj[key]);
        return list;
    }
    
        	
    public static objLength(obj: any,removeEmpty?): number {
        var count = 0;
        for(var key in obj)
        {
            if(removeEmpty && !obj[key])
                continue;
            count++;
        }
        return count;
    }

	public static clone (source) {
		return JSON.parse(JSON.stringify(source))    //++add   临时
	}

    public static swapKey(data,key1,key2){
        var temp = data[key1]
        data[key1] = data[key2]
        data[key2] = temp;
    }
}

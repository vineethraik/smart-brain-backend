import {createHash,createHmac} from "crypto";

export const getHash=(data,key)=>{
let value='';
const salt=createHash('sha256').update(String(key)).digest('hex');
const secret=createHash('sha256').update('it fun time fo 100% vegans').digest('hex');

/* extra salting */
{
    let iterator=0;
    for(let c of String(data)){
        value+=c.concat(salt[iterator%salt.length])
        iterator++;
    }
}

return createHmac('sha256',secret).update(String(data)).digest('hex');

}



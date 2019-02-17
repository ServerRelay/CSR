const fs=require('fs')
const path=require('path')

function load(file){
    let data
    try{
        data=fs.readFileSync(path.resolve(file))
    }
    catch(e){
        return
    }
    data=data.toString()
    data=data.replace('\r','')
    data=data.split('\n')
    for(let i of data){
        let vals=i.split('=')
        process.env[vals[0]]=vals[1]
    }
}
exports.load=load

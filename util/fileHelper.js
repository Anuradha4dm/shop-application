const fs=require('fs');

exports.deleteFile=(filePath)=>{
    fs.unlink(filePath,(err)=>{

        if(err){
            throw err;
        }
        console.log(filePath+"image is removed");

    })
}
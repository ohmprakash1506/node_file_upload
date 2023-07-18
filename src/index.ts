import http from 'node:http';
import fs from "node:fs";
import path from 'node:path';
import fileNameGenerator from './functions/nameFunction';

const host = 'localhost';
const port = 8000;

const serverActive = (req:any, res:any) =>{
    if(req.url =='/upload' && req.method == 'POST'){
        let dataArray: any[] = [];
        let fileName: any = ''

        req.on('data', (dataStream: any) =>{
            dataArray.push(dataStream);
        })
        
        req.on('end', () =>{
            const filedata = Buffer.concat(dataArray);

            const fileNameHeader = req.headers['content-disposition'];
            const name = /filename="(.+)"/;
            const nameBuild = name.exec(fileNameHeader);

            if(nameBuild && nameBuild[1]){
                fileName = nameBuild[1]
            }else{
                fileName = fileNameGenerator();
            }

            const uploadDir = `uploaded_files`;
            if(!fs.existsSync(uploadDir)){
                fs.mkdirSync(uploadDir);
            }
            const filePath = path.join(uploadDir, fileName);

            fs.writeFile(filePath, filedata, (error) =>{
                if(error){
                    console.error(error);
                    res.statuscode = 500;
                    res.end(`File upload failed....!`);
                    return;
                }
                res.statuscode = 200;
                res.end(`File uploded successfully.... file name : ${fileName}`)
            })
        })
    }else{
        res.statuscode = 404;
        res.end(`Server not found...!`)
    }
}

const server = http.createServer(serverActive);

server.listen(port,host, () => {
    console.log(`Server listening at portal http://${host}/${port}`);
})

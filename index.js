const { authorize } = require('./authorize');
const { transferFile } = require('./transfer-file');
const fileId = process.env.fileId;
const targetEmail = process.env.targetEmail;


authorize()
    .then((client)=>{
        console.log("Google API Access Granted");
        return client;
    })
    .then(client => transferFile(client, fileId, targetEmail))
    .catch(console.error);

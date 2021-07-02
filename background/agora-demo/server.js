const connect = require('connect');
const serveStatic = require('serve-static');
const open = require('open');

const agoraAppId = process.env.AGORA_APP_ID;
const vectorlyToken = process.env.VECTORLY_TOKEN;


connect()
    .use(serveStatic(__dirname + '/src/'))
    .listen(8080, () =>{
        if(agoraAppId && vectorlyToken)  open(`http://localhost:8080/index.html?appid=${agoraAppId}&vectorlyToken=${vectorlyToken}&channel=test`);
        else  open('http://localhost:8080/')
        console.log('Server running on 8080...')
    });
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});
const express = require('express')
const fastFolderSize = require('fast-folder-size')
const app = express()
app.engine('html', require('ejs').renderFile);
const async = require('async');
//const concatstream = require('mp3-concat');
const fs = require("fs");
const audioconcat = require('audioconcat')
const YIPIS=["YIPIS.mp3","YIPIS.1.mp3","YIPIS.2.mp3"]

function insertion(my_array){
    var n=my_array.length,
        k=0;
    while(k<n-1){
        k++;
        my_array.splice(k,0,"./audio/phrases/dot.mp3");
        n++;
	k++;
    }
    return my_array;
}

const ip2sound=(ip,res)=>{
	if((ip.match(/\./g) || []).length!=3){return res.send("NOOOOOOOOOOOOOOOOOOOOOOO")}
	const btf_ip=ip.replace(/\./g,"-")
	const FILE_path=`./static/generated/${btf_ip}.mp3`;
//	console.log(typeof fs.statSync(FILE_path).mtime,fs.statSync(FILE_path).mtime,fs.statSync(FILE_path).mtime.getTime(),Date.now(),Date.now()-fs.statSync(FILE_path).mtime.getTime())
//	var concatenater = concatstream();
	//concatenater.pipe(res)

	if(!fs.existsSync(FILE_path)){
	console.log(`./static/generated/${btf_ip}.mp3`)
	var FILES=ip.split(".").map(r=>`./audio/nums/${r}.mp3`)
	FILES=insertion(FILES)
	audioconcat(["./audio/phrases/baka.mp3","./audio/phrases/"+YIPIS[Math.floor(Math.random() * YIPIS.length)],...FILES])
		.concat(FILE_path)
		.on('end', function (output) {
			res.sendFile(__dirname+`/static/generated/${btf_ip}.mp3`)
		})
}else{
	res.sendFile(__dirname+`/static/generated/${btf_ip}.mp3`)
}
}
const randomint=()=>{return Math.floor(Math.random() * 9)}
const ip2img=(ip)=>{
	return [...ip].map(r=>{
		if(r!="."){return `<img class="IP" src="/static/img/numbers/${r}_${randomint()}.png">`}
		else{return "<dot></dot>"}
	}).join("");
}

app.use(express.static('static'));

app.use((req,res,next)=>{
	req.IP=req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	next()
})
app.get(/\/*\.mp3/,(req,res)=>{
        ip2sound(req.IP,res)
})

app.get('/api',(req,res)=>{
	if(req.query.ip){
		ip2sound(req.query.ip,res)
	}else{
		ip2sound(req.IP,res)
	}
})



app.get('/',(req,res)=>{
	if((req.IP.match(/\./g) || []).length!=3){return res.send("NOOOOOOOOOOOOOOOOOOOOOOO")}
	res.render("index.ejs",{IP:req.IP,IMAGES:ip2img(req.IP)})
//	res.writeHeader(200, {"Content-Type": "text/html"});
//	res.write(`>${req.IP}<br> <iframe src="/api?ip=${req.IP}"></iframe>`);
//	res.write(ip2img(req.IP));
	res.end()
})

app.listen()
setInterval(()=>{
	const directory = "./static/generated/";
	if(fs.existsSync(directory)){
		fastFolderSize('.', (err, bytes) => {
			  if (!err && bytes > 100000000) {
		fs.rmdir(directory, { recursive: true }).then(() => console.log('directory removed!'));
			  }
})
	}
},10*60*1000)

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});
const express = require('express')
const app = express()
const async = require('async');
//const concatstream = require('mp3-concat');
const fs = require("fs");
const audioconcat = require('audioconcat')


const ip2sound=(ip,res)=>{
	const btf_ip=ip.replace(/\./g,"-")
//	var concatenater = concatstream();
	//concatenater.pipe(res)
	console.log(`./static/generated/${btf_ip}.mp3`)
//	concatenater.pipe(fs.createWriteStream(`./static/generated/${btf_ip}.mp3`));
	//const FILES=ip.split(".").map(r=>`audio/nums/${r}.mp3`)
	console.log(["audio/phrases/baka.mp3"]);
	audioconcat(["audio/phrases/baka.mp3"])
		.concat(`./static/generated/${btf_ip}.mp3`)
		.on('end', function (output) {
			const btf_ip=req.IP.replace(/\./g,"-");
			res.sendFile(__dirname+`/static/generated/${btf_ip}.mp3`)
		})
//			const btf_ip=req.IP.replace(/\./g,"-");
//	  // ... and pipe them into the concatenater
//	  fs
//	    .createReadStream(file)
//	    .on('end', cb)
//	    .pipe(concatenater, { end: false });
//	}, function() {
//	  // Finally, when all files have been read, close the stream
//	  concatenater.end();
//	});
}

app.use((req,res,next)=>{
	req.IP=req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	next()
})

app.get('/api',(req,res)=>{
	if(req.query.ip){
		ip2sound(req.IP)
	}else{
		res.send(`YO ${req.IP} ${JSON.stringify(req.query)}`)
	}
})



app.get('/',(req,res)=>{
	res.send(`>${req.IP}`)
})

app.listen()

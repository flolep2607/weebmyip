const express = require('express')
const app = express()
const async = require('async');
const concatstream = require('mp3-concat');
const fs = require("fs");



const ip2sound=(ip,res)=>{

	res.writeHead(200, {
	    'Content-Type': 'audio/mpeg'
	  });
	concatenater = concatstream();
	concatenater.pipe(res)
	concatenater.on('error', (Error,String)=>console.log(Error,String))
	//concatenater.pipe(fs.createWriteStream('concat.mp3'));
	const FILES=ip.split(".").map(r=>`audio/nums/${r}.mp3`)
	console.log(FILES);
	async.eachSeries(["audio/phrases/baka.mp3",...FILES], (file, cb) => {
	  // ... and pipe them into the concatenater
	  fs
	    .createReadStream(file)
	    .on('end', cb)
	    .on('error',r=>console.log)
	    .pipe(concatenater, { end: false });
	}, () => {
	  // Finally, when all files have been read, close the stream
	  concatenater.end();
	});
}

app.use((req,res,next)=>{
	req.IP=req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	next()
})

app.get('/api',async (req,res)=>{
	if(req.query.ip){
		ip2sound(req.IP,res)
	}else{
		res.send(`YO ${req.IP} ${JSON.stringify(req.query)}`)
	}
})



app.get('/',(req,res)=>{
	res.send(`>${req.IP}`)
})

app.listen()

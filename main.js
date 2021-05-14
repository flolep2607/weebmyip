const express = require('express')
const app = express()
const async = require('async');
const concatstream = require('mp3-concat');

const ip2sound=(ip)=>{
	concatenater = concatstream();
	concatenater.pipe(res)
	const FILES=ip.split(".").map(r=>"./audio/nums/"+r)
	async.eachSeries(["./audio/phrases/baka.mp3",...FILES], function(file, cb) {
	  // ... and pipe them into the concatenater
	  fs
	    .createReadStream(file)
	    .on('end', cb)
	    .pipe(concatenater, { end: false });
	}, function() {
	  // Finally, when all files have been read, close the stream
	  concatenater.end();
	});
}

app.use((req,res,next)=>{
	req.IP=req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	next()
})

app.get('/',(req,res)=>{
	res.send(`>${req.IP}`)
})

app.listen()

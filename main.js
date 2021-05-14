process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});
const express = require('express')
const app = express()
const async = require('async');
//const concatstream = require('mp3-concat');
const fs = require("fs");
const audioconcat = require('audioconcat')

function insertion(my_array){
    var n=my_array.length,
        k=0;
    while(k<n){
        k++;
        my_array.splice(k,0,"./audio/phrases/dot.mp3");
        n++;
    }
    return my_array;
}

const ip2sound=(ip,res)=>{
	const btf_ip=ip.replace(/\./g,"-")
//	var concatenater = concatstream();
	//concatenater.pipe(res)
	fs.unlinkSync(`./static/generated/${btf_ip}.mp3`);
	console.log(`./static/generated/${btf_ip}.mp3`)
//	concatenater.pipe(fs.createWriteStream(`./static/generated/${btf_ip}.mp3`));
	var FILES=ip.split(".").map(r=>`./audio/nums/${r}.mp3`)
	FILES=insertion(FILES)
	console.log(["./audio/phrases/baka.mp3",...FILES]);
	audioconcat(["./audio/phrases/baka.mp3",...FILES])
		.concat(`./static/generated/${btf_ip}.mp3`)
		.on('end', function (output) {
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
		ip2sound(req.IP,res)
	}else{
		res.send(`YO ${req.IP} ${JSON.stringify(req.query)}`)
	}
})



app.get('/',(req,res)=>{
	res.send(`>${req.IP}`)
})

app.listen()

const express = require('express')
const app = express()

app.use((req,res,next)=>{
	req.IP=req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	next()
})

app.get('/',(req,res)=>{
	res.send(`>${req.IP}`)
})

app.listen()

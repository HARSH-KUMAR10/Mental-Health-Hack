const express = require('express');
const app = express();
const PORT = process.env.PORT || 8001;
const fs = require("fs");
var PDF="WHITE.PDF";

var nodemailer = require('nodemailer');
const { dirname } = require('path');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'javascriptextreme@gmail.com',
    pass: 'extreme@javaScript'
  }
});


app.use(express.static("html"))

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/html/index.html");
});

app.get('/getQuestions',(req,res)=>{
    var Qfile =fs.readFileSync(__dirname+"/jsons/questions.json");
    var questionList = JSON.parse(Qfile);
    res.json(questionList);
});

app.get('/getResult',(req,res)=>{
    var result = req.query.result;
    var email = req.query.email;
    var date = new Date();
    var uData = fs.readFileSync(__dirname+"/jsons/data.json");
    var userData = JSON.parse(uData);
    var user = {
        userEmail:email,
        userResult:result,
        userData:date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()
    }
    userData.users[userData.users.length]=user;
    fs.writeFile(__dirname+'/jsons/data.json',JSON.stringify(userData),(err)=>{
        if(err){
            throw err;
        }
    });
    var total = parseInt(result);
    if(total>16){
        PDF="red.pdf";
        res.json({"color":"red"});
    }else if(total>8){
        PDF="yellow.pdf";
        res.json({"color":"yellow"});
    }else{
        PDF="green.pdf";
        res.json({"color":"green"});
    }
    sendMail(email);
});

function sendMail(email){
    let info = transporter.sendMail({
        from: 'javascriptextreme@gmail.com', // sender address
        to: email, // list of receivers
        subject: "Your Yoga and Food Plan", // Subject line
        text: "Check attached pdf.\n\n\nThank You\nJavaScriptX",
        attachments: [
          {
            filename: PDF,
            path: __dirname + "/pdfs/"+PDF,
          },
        ],
      });
}

app.get('/red',(req,res)=>{
    res.sendFile(__dirname+"/pdfs/red.pdf");
})

app.get('/yellow',(req,res)=>{
    res.sendFile(__dirname+"/pdfs/yellow.pdf");
})

app.get('/green',(req,res)=>{
    res.sendFile(__dirname+"/pdfs/green.pdf");
})

app.listen(PORT,()=>{
    console.log("http://localhost:"+PORT);
});
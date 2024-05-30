const express = require("express");  // calling express framework
const app = express();          // creating object of express
const cors = require("cors");  // calling cors origin library to allow data communication between 2 server
app.use(cors());             // creating object of cors library
app.use(express.json());    // injecting .json to send and receive data in json between 2 server


var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "project1"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get("/", function (req, res) {
  res.write("<h1> Api Server is Live </h1>");
  res.end(); // end of response - nothing left after this.
});


//http://localhost:2222/emplist
app.get("/emplist", function (req, res) {
  let sql = "select * from emp order by empid desc";
  con.query(sql, function (err, result) {
    if (err) throw err;
    let jsonData = JSON.stringify(result);
    res.send(jsonData);
    res.end();
  });
})



//http://localhost:2222/saveemp
app.post("/saveemp", function(req, res){
  let n = req.body.myname;
  let s = req.body.mysalary;
  let city = req.body.mycity;
  let dept = req.body.mydept;
  let sql="insert into emp(empname, salary, city, dept) values('"+ n +"', '"+ s +"', '"+ city +"', '"+ dept+"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    let jsonData = JSON.stringify({"message":"Employee Created"});
    res.send(jsonData);
    res.end();
  });
})


//http://localhost:2222/updateemp
app.put("/updateemp", function(req, res){
  let name = req.body.myname;
  let salary = req.body.mysalary;
  let city = req.body.mycity;
  let dept = req.body.mydept;

  let sql="update emp set empname='"+ name +"' , salary='"+ salary +"' , city='"+ city +"' , dept='"+ dept +"' where empid="+req.body.id;
  con.query(sql, function (err, result) {
    if (err) throw err;
    let jsonData = JSON.stringify({"message":"Employee Updated Successfully..."});
    res.send(jsonData);
    res.end();
  });
})


//http://localhost:2222/empdetails
app.post("/empdetails", function(req, res){
  let id = req.body.id;
  let sql="select * from emp where empid="+id;
  con.query(sql, function (err, result) {
    if (err) throw err;
    let jsonData = JSON.stringify(result);
    res.send(jsonData);
    res.end();
  });
})


//http://localhost:2222/deleteemp
app.delete("/deleteemp", function(req, res){
  let id = req.body.id;
  let sql="delete from emp where empid="+id;
  con.query(sql, function (err, result) {
    if (err) throw err;
    let jsonData = JSON.stringify({"message":"Employee Deleted Successfully"});
    res.send(jsonData);
    res.end();
  });
})


// customer api start
app.post("/savecustomer", (req, res)=>{
  let name = req.body.fname;
  let mobile = req.body.mobile;
  let city = req.body.city;
  let pro = req.body.product;
  let cost = req.body.price;
  let qty = req.body.quantity;

  let sql = `insert into customer(fullname, mobile, city, product, cost, qty)
  values('${name}', '${mobile}', '${city}', '${pro}', '${cost}', '${qty}')`;

  con.query(sql, function (err, result) {
    if (err) throw err;
    let jsonData = JSON.stringify({"message":"Customer Added Successfully"});
    res.send(jsonData);
    res.end();
  });
});

app.get("/customerlist", (req, res)=>{
  let sql = "select * from customer order by id desc";
  con.query(sql, function (err, result) {
    if (err) throw err;
    let jsonData = JSON.stringify(result);
    res.send(jsonData);
    res.end();
  });
}); 


//http://localhost:2222/deletecustomer
app.delete("/deletecustomer", function(req, res){
  let id = req.body.id;
  let sql="delete from customer where id="+id;
  con.query(sql, function (err, result) {
    if (err) throw err;
    let jsonData = JSON.stringify({"message":"Customer Deleted Successfully"});
    res.send(jsonData);
    res.end();
  });
})


app.post("/searchemp", (req, res)=>{
  let key = req.body.keyword;
  let sql = `select * from emp where empname like '%${key}%' OR salary like '%${key}%' OR city like '%${key}%'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    let jsonData = JSON.stringify(result);
    res.send(jsonData);
    res.end();
  });
}); 


// for hr login
app.post("/login", (req, res)=>{
  let email = req.body.email;
  let password = req.body.password;

  let sql = `select * from hr where email='${email}' and mypassword='${password}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    let jsonData = JSON.stringify(result);
    res.send(jsonData);
    res.end();
  });
}); 



app.post("/newhr", (req, res)=>{
  let myemail = req.body.email;
  let mypassword = req.body.password;
  let myfullname = req.body.fullname;
  let mymobile = req.body.mobile;

  let sql =`insert into hr(email, mypassword, fullname, mobile) values('${myemail}','${mypassword}','${myfullname}','${mymobile}')`;

  con.query(sql, function(err, result){
    if(err) throw err;
    let jsonData = JSON.stringify({"message" : "HR Added Successfully"});
    res.send(jsonData);
    res.end();
  })
})



//http://localhost:2222/deletehr
app.delete("/deletehr", function(req, res){
  let id = req.body.id;
  let sql="delete from hr where hrid="+id;
  con.query(sql, function (err, result) {
    if (err) throw err;
    let jsonData = JSON.stringify({"message":"hr Deleted Successfully"});
    res.send(jsonData);
    res.end();
  });
})


// for email
app.post("/sendemail", (req, res)=>{
  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gonenitheesh@gmail.com',
      pass: 'nitheesh@123'
    }
  });

  var mailOptions = {
    from: 'gonenitheesh@gmail.com',
    to: 'siyaramyadav18@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      let jsonData = JSON.stringify({"message":"Network Error"})
      res.send(jsonData);
      res.end();
    } else {
      let jsonData = JSON.stringify({"message":"e-Mail Sent"})
      res.send(jsonData);
      res.end();
    }
  });
}); 

//http://localhost:2222/statelist
app.get("/statelist", function (req, res) {
  let sql = "select * from state order by statename asc";
  con.query(sql, function (err, result) {
    if (err) throw err;
    let jsonData = JSON.stringify(result);
    res.send(jsonData);
    res.end();
  });
})

//http://localhost:2222/citylist
app.get("/citylist", function (req, res) {
  let sql = "select * from city order by cityname asc";
  con.query(sql, function (err, result) {
    if (err) throw err;
    let jsonData = JSON.stringify(result);
    res.send(jsonData);
    res.end();
  });
})

app.post("/citylist", (req, res)=>{
  let stateid = req.body.stateid;
  let sql = `select * from city where stateid='${stateid}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    let jsonData = JSON.stringify(result);
    res.send(jsonData);
    res.end();
  });
}); 
app.listen(2222, function () {
  console.log("Sever Started on http://localhost:2222");
})


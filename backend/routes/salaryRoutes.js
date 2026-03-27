const express = require("express");
const router = express.Router();

router.post("/predict",(req,res)=>{

const {skill} = req.body;

let salary;

switch(skill.toLowerCase()){

case "javascript":
salary="₹8L - ₹15L";
break;

case "python":
salary="₹10L - ₹20L";
break;

case "java":
salary="₹9L - ₹18L";
break;

case "react":
salary="₹12L - ₹22L";
break;

default:
salary="₹5L - ₹10L";
}

res.json({salary});

});

module.exports = router;
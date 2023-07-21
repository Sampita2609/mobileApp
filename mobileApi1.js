let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
});
const port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  password: "sampita123*",
  port: 5432,
  host: "db.exsooxwehydzqqxtlknu.supabase.co",
  ssl: { rejectUnauthorized: false },
});
client.connect(function (res, error) {
  console.log(`connected!!!`);
});


app.get("/mobiles", function (req, res, next) {
  let brand = req.query.brand;
  let ram = req.query.ram;
  let rom = req.query.rom;
  let os = req.query.os;
  const query=`SELECT * FROM mobiles`;
  client.query(query,function(err,result){
    if(err) res.status(404).send(err);
    else{
      let arr1=result.rows;
      if(brand){
        let brands=brand.split(",");
        arr1=arr1.filter((m1)=>brands.find((val)=>val===m1.brand));
      }
      if(ram){
        let rams=ram.split(",");
        arr1=arr1.filter((m1)=>rams.find((val)=>val===m1.ram));
      }
      if(rom){
        let roms=rom.split(",");
        arr1=arr1.filter((m1)=>roms.find((val)=>val===m1.rom))
      }
      if(os){
        let oss=os.split(",");
        arr1=arr1.filter((m1)=>oss.find((val)=>val===m1.os));
      }
      res.send(arr1);
    }
  })
});

app.get("/mobiles/:name", function (req, res, next) {
  let name = req.params.name;
  const query = `SELECT * FROM mobiles WHERE name=$1`;
  client.query(query, [name], function (err, result) {
    if (err) res.status(404).send(err);
    else res.send(result.rows);
  });
});

app.post("/mobiles", function (req, res, next) {
  console.log("Inside post of mobiles");
  var values = Object.values(req.body);
  console.log(values);
  const query = `INSERT INTO mobiles (name,price,brand,ram,rom,os) VALUES ($1,$2,$3,$4,$5,$6)`;
  client.query(query, values, function (err, result) {
    if (err) res.status(400).send(err);
    else res.send(`${result.rowCount} insertion successful`);
  });
});

app.put("/mobiles/:name", function (req, res, next) {
  console.log("Inside put of mobiles");
  let name = req.params.name;
  let price = req.body.price;
  let brand = req.body.brand;
  let ram = req.body.ram;
  let rom = req.body.rom;
  let os = req.body.os;
  let values = [price, brand, ram, rom, os, name];
  const query = `UPDATE mobiles SET price=$1,brand=$2,ram=$3,rom=$4,os=$5 WHERE name=$6`;
  client.query(query, values, function (err, result) {
    if (err) res.status(400).send(err);
    else res.send(`${result.rowCount} updation successful`);
  });
});

app.delete("/mobiles/:name", function (req, res, next) {
  let name = req.params.name;
  const query = `DELETE FROM mobiles WHERE name=$1`;
  client.query(query, [name], function (err, result) {
    if (err) res.status(404).send(err);
    else res.send(`${result.rowCount} delete successful`);
  });
});

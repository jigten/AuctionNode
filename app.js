const express = require("express")
const app = express()
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var props = [
  { name: "Nike Air Mags", image: "https://mgtvwcmh.files.wordpress.com/2016/10/img_0037.jpg" },
  { name: "Beauty and the Beast Dress", image: "https://www.dhresource.com/600x600/f2/albu/g5/M00/19/6F/rBVaI1jTjDyAHAOuAAW60_EjGQs999.jpg" }
]

app.get("/", function(req, res) {
  res.render("landing")
})

app.get("/props", function(req, res) {
  res.render("props", {props})
})

app.listen(3000, () => {
  console.log("Server running on port 3000...")
})

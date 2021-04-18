//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _= require('lodash');
const lowerCase = require('lodash.lowercase');

const homeStartingContent = "A daily journal blog posting space where anyone can compose and post a story/content with the headline in the space. It also gives users the right to edit and delete respective posts.";
const aboutContent = "A daily journal blog posting space where anyone can compose and post a story/content with the headline in the space. It also gives users the right to edit and delete respective posts.";
const contactContent = "A daily journal blog posting space where anyone can compose and post a story/content with the headline in the space. It also gives users the right to edit and delete respective posts.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-roshni:123@cluster0.nsi4r.mongodb.net/blogDB",{useNewUrlParser:true, useUnifiedTopology:true});

const postSchema = new mongoose.Schema({
title: String,
content: String
});

const Post = mongoose.model("Post",postSchema);

//const composeTexts = [];


app.get("/",function(req,res){

  Post.find({}, function(err,foundPosts){
    if(!err){
      res.render("home",{homeContent: homeStartingContent, composeText: foundPosts});
    }
  });
  //console.log(composeTexts);
});

app.get("/about",function(req,res){
  res.render("about",{aboutContent: aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactContent: contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.get("/topic/:postId", function(req, res){
//console.log("req.param.composeTextName");
var requestedId = req.params.postId;
//var requestedLowerTitle = _.lowerCase(requestedTitle);
//composeTexts array define

Post.findOne({_id:requestedId},function(err,foundPost){
 if(foundPost){
   res.render("post",{topics: foundPost});
 }
});
//
// composeTexts.forEach(function(post){
//  var storedTitle = _.lowerCase(post.Title);
//
//
//  if(storedTitle === requestedTitle){
//    //console.log("Match found");
//    res.render('post',{topics:post});
//  } else {
//    console.log("not a match");
//  }
// });

});


app.post("/compose",function(req,res) {
  // create new document with mongoose
  //
  const post = new Post ({
    title: req.body.postTitle,
    content:  req.body.postBody
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });

});

app.post("/delete", function(req,res){

const requestedDeletePost = req.body.deletepost;

Post.deleteOne({_id: requestedDeletePost},function(err){
  if(!err) {
    console.log("post deleted");
    res.redirect("/");
  }

});
});












let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});

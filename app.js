const express = require("express");
const _ = require('lodash');
const ejs = require("ejs");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://<USER ID>:<PASSWORD>@cluster0.phqu2.mongodb.net/BlogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const blogSchema = new mongoose.Schema({
  name: String,
  content: String,
  post_name: String
});

const Blog = new mongoose.model("blog", blogSchema);


const home = new Blog({
  name: "Home",
  post_name: "home",
  content: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."


const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."







const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get('/', (req, res) => {
  Blog.find(function (err, results) {
    if (err) {
      console.log(err);
    } else {
      if (results.length === 0) {
        // 
        home.save()
        res.redirect('/');
      } else {
        res.render('home', {
          results: results
        })

      }
    }

  })



});


app.get('/about', (req, res) => {
  res.render('about', {
    aboutContent: aboutContent
  });
});

app.get('/contact', (req, res) => {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get('/compose', (req, res) => {
  res.render('compose', {});
});


app.post('/compose', (req, res) => {
  const post = {
    postBody: req.body.textBody,
    postTitle: req.body.textTitle,
  };
  const blog = new Blog({
    name: post.postTitle,
    content: post.postBody,
    post_name: _.lowerCase(post.postTitle)
  })
  console.log(_.lowerCase(post.postTitle));
  if (post.postBody.length === 0 || post.postTitle.length === 0) {
    res.redirect("/");
  } else {
    blog.save();
    res.redirect("/");

  }


});



app.get('/posts/:postId', function (req, res) {
  // let requestedTitle = _.lowerCase(req.params.postId);

  Blog.findOne({
    post_name: _.lowerCase(req.params.postId)
  }, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      res.render('post', {
        postTitle: results.name,
        postBody: results.content,
        post_nameId: results.post_name
      });
    }
  })


});

app.post('/posts/:postId', function (req, res) {
  let requestedTitle = _.lowerCase(req.params.postId);

  Blog.deleteOne({
    post_name: requestedTitle
  }, function (err) {
    if (err) {
      console.log(err);
    }
  })
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
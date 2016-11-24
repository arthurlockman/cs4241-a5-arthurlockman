
Assignment 5 - AJAX
===

## Technical Achievement - A5

In addition to the achievements from A4 (detailed below), I improved A5 in the following ways.

Technical Achievement - A4
---

To earn the technical credit, I did a few things to make my movie list search engine better. I used JQuery to make my edit form look nice, and Amazon S3 to persist the movie list across Heroku dyno restarts.

#### JQuery

I used JQuery in this assignment to show and hide the edit elements on my movie list. If you click on the *Edit* button at the bottom of the screen, an add movie input will appear along with delete buttons for each of the movies in the list. Clicking on one of these buttons will send a POST request to the server to delete the movie from the movie list and store that change on disk. Similarly, adding a movie through the edit field will send a POST to the server to add that movie to the list and save the change. JQuery allowed me to show and hide these elements more easily. Code for this is partly in the [html template](http://cs4241-a4-arthurlockman.herokuapp.com/template.html), partly in the [server code](http://cs4241-a4-arthurlockman.herokuapp.com/server.js), and partly in the [page JS](http://cs4241-a4-arthurlockman.herokuapp.com).

#### Amazon S3

I noticed in building this site that any time Heroku deploys the application or restarts the application dyno, the movie list is reset to what it was at deploy time regardless of any changes that had been added or removed from the web page. I decided to fix this using Amazon S3. I created an S3 bucket to hold the movie list text file, and set up Node to read and write to this file in the S3 bucket instead of the file on disk:

```javascript
s3 = new aws.S3()

function loadFromS3()
{
  var params = {Bucket: 'cs4241', Key: 'movies.txt'}
  s3.getObject(params, function(err, data) {
    if (err) {
      console.log(err, err.stack)
    } else {
      movies = data.Body.toString().split('\n')
    }
  })
}
```

I wrote a similar function to save to S3. This makes it so that the movie list is persisted across dyno restarts, and ensures that everyone is always getting the same movie list when they visit the web page. The movie list can be seen [here](https://s3.amazonaws.com/cs4241/movies.txt), and all of the code for reading and writing S3 files can be seen in the [server](http://cs4241-a4-arthurlockman.herokuapp.com/server.js).

## Assignment details

Do the following to complete this assignment:

1. Clone the starting project code. DO NOT FORK THE REPO and DO NOT MAKE IT PUBLIC. Since this is an extension of Assignment 4, you can just copy your code over into this repository. Please make sure to copy all the required files into this repository. 
2. The goal of this project is to expand on Assignment 4: 
   - Implement adding, deleteing, and filtering of a list, as before. 
   - However, this time the list must be pulled and manipulated from the server using AJAX (XMLHttpRequest). 
   - This means: all functionality should work without reloading the page.
   - On the server side, ensure that you have routes and function calls that match up with the XMLHttpRequests you make from the client side.
   - Technical challenge ideas:
     - Updating the URL on the client side in this case is not required, but is a good technical challenge.
     - Also, for additional challenge, implement inline editing of the list items.
3. Deploy your project to Heroku.
   - Ensure that your project has the proper naming scheme (cs4241-a5-yourGitHubUsername) so we can find it.
4. The project will be graded against the following rubric (120 total):
   - 100: Fulfilling the requirements above
   - 10: Good theming and layout
   - 10: Technical Achievement: Have fun here! Check out advanced resources for some ideas. Don't forget to include an explanation of your achievement on your page.
5. Include a README.md describing your technical achievement to recieve credit. 
   - Your README.md should be served when an attempt to access <your-url>/README.md is made.



Resources

AJAX pages on MDN:

- XMLHttpRequest Documentation
- AJAX Getting Started
- Using XMLHttpRequest

A good resource for general HTML/CSS/Javascript is the Mozilla Developer Network. This contains all the references you need for front-end design.

A good resource for font is the Google Fonts project, with hundreds of different fonts to choose from so that you don't have to stick with Comic Sans. Or Impact.

If you want icons, look into Font Awesome.



Advanced Resources

Note that none of these are required for a good assignment, but it's generally a good idea to master a couple of frameworks if you are interested in developing web application in a real environment. As always, you should master the basics first before moving on to other parts

[API Example] (https://www.npmjs.com/package/imdb-api) : It's possible to query databases and sites using API. Even GitHub provides its own API. Check out this example that queries movie and television data. Something similar could be used to build a list, and even filter it!

Bootstrap is a popular front-end framework for building responsive web pages and in general makes your life easier. 

UIKit is another alternative to Bootstrap that you could look into. It is lighter than Bootstrap and supports animation, if that's what you are into. 

Sass is an extension to CSS that makes maintaining/writing CSS easier and more fun. You basically write in Sass, and the complier will output a CSS file to use in production. 



## Puerto Rico 360
My Codetrotters Intro to JavaScript final project.

### Overview
An educational 360 gallery of cool places in Puerto Rico, made with WebVR.

Explore Puerto Rico in 360. From key touristic places, to hidden gems of our nature and history.

### Technologies
  * A-Frame (WebVR) core library and components for the VR experience
  * Prismic.io as headless CMS for content management and servicing
  * Node.js + Express.js server to render the VR scenes (EJS templates) with data and media serviced by Prismic.io repository
  * Hosted on Heroku

### User Requirements
  * A modern, up-to-date web browser
  * VR headset recommended for best experience. Google Cardboard supported. No controller necessary.

### Demo
Visit http://gentle-shore-30705.herokuapp.com/ from your PC or smartphone

### To-Do's
  * Set different rotation for each panorama, change on selection
  * Set scene title text above menu, change on selection
  * Include points of interest in scene
  * Implement gaze selection on POI's and update modal content on selection
  * Show modal on POI gaze selection and hide on cursor mouseleave event
  * Deploy application to Heroku

### Deployment
#### Deploying NodeJS application to Heroku

An easy way to deploy your NodeJS application is to use [Heroku](http://www.heroku.com). Just follow these few simple steps once you have successfully [signed up](https://id.heroku.com/signup/www-header) and [installed the Heroku toolbelt](https://toolbelt.heroku.com/):

Create a `Procfile` file at your application root (project's folder), to declare the server command:

```
web: node app.js
```

Create a new Heroku application (still inside the application root / project folder):

```
$ heroku create
```

Push your code to heroku:

```
$ git push heroku master
```

Ensure you have at least one node running: (NodeJS Server)

```
$ heroku ps:scale web=1
```

You can now browse your application online:

```
$ heroku open
```

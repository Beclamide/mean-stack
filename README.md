# Bare-bones Angular Full-stack Application
### By John Bower
[@beclamide](http://www.twitter.com/beclamide)

---

#### Setting up the template

Install the NPM modules and Bower components by opening a terminal window and running:

```
$ npm install
```

```
$ bower install
```

---

#### Running the app

To start the application, install [grunt-cli](http://gruntjs.com/getting-started) and run:
```
$ grunt serve
```

Grunt will watch files for changes and automatically run JSHint on recently edited files, and Karma / E2E tests on the server and client.

To start the tests manually, run:
```
$ grunt test
```

---

#### Building the app

To prepare the app for deployment run:

```
$ grunt build
```

Grunt will run a number of tasks that optimize the site, ready for deployment to the production server.

---

#### Deploying the app

To deploy to Heroku, set the Heroku git repo address in the Gruntfile and run:

```
$ grunt buildcontrol:heroku
```

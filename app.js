const Prismic = require('prismic-javascript');
const PrismicDOM = require('prismic-dom');
const request = require('request');
const Cookies = require('cookies');
const PrismicConfig = require('./prismic-configuration');
const Onboarding = require('./onboarding');
const app = require('./config');

const PORT = app.get('port');

app.listen(PORT, () => {
  Onboarding.trigger();
  process.stdout.write(`Point your browser to: http://localhost:${PORT}\n`);
});

// Middleware to inject prismic context
app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: PrismicConfig.apiEndpoint,
    linkResolver: PrismicConfig.linkResolver,
  };
  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM;
  Prismic.api(PrismicConfig.apiEndpoint, {
    accessToken: PrismicConfig.accessToken,
    req,
  }).then((api) => {
    req.prismic = { api };
    next();
  }).catch((error) => {
    next(error.message);
  });
});

/*
 *  --App Routes--
 */

app.get('/scene/:id', (req, res, next) => {
       // We store the param uid in a variable
       const id = req.params.id;
       // We are using the function to get a document by its uid
       req.prismic.api.getByID('scene', id)
       .then((sceneContent) => {
               if (sceneContent) {
                   // sceneContent is a document, or null if there is no match
                   res.render('scene', {
                   // Where 'scene' is the name of your pug template file (scene.pug)
                          id: sceneContent.id,
                          uid: sceneContent.uid,
                          title: sceneContent.data.title[0].text
                   });
               } else {
                   res.status(404).send('404 not found');
               }
       })
       .catch((error) => {
               next(`error when retreiving scene ${error.message}`);
       });
});

/*
 * Gallery Menu
 */
app.get('/', (req, res, next) => {
  // Get all scenes data
  req.prismic.api.query(Prismic.Predicates.at('document.type', 'scene'),
   {
     orderings : '[my.scene.title]'
   }).then((response) => {
     console.log(JSON.stringify(response.results));
     var data = [];
     response.results.forEach(function(result){
       data.push({
         id: result.id,
         uid: result.uid,
         title: result.data.title[0].text || '',
         descriptionHTML: result.data.description || '',
         pois: [],
         panoramaUrl: result.data['360_photo'].url || '',
         thumbnailUrl: result.data['360_photo'].Thumbnail.url || '',
         startPosition: {
           x: 0,
           y: 0,
           z: 0
         }
       });
     });
     res.render('menu', {
       scenes: data
     });
   })
   .catch((error) => {
     next(`error when retrieving content: ${error.message}`);
   });
});


/*
 * Preconfigured prismic preview
 */
app.get('/preview', (req, res) => {
  const token = req.query.token;
  if (token) {
    req.prismic.api.previewSession(token, PrismicConfig.linkResolver, '/')
    .then((url) => {
      const cookies = new Cookies(req, res);
      cookies.set(Prismic.previewCookie, token, { maxAge: 30 * 60 * 1000, path: '/', httpOnly: false });
      res.redirect(302, url);
    }).catch((err) => {
      res.status(500).send(`Error 500 in preview: ${err.message}`);
    });
  } else {
    res.send(400, 'Missing token from querystring');
  }
});

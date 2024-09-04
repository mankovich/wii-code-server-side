const express = require("express");
const allRoutes = require("./routes")
// const cors = require("cors");
const sequelize = require("./config/connection");
const url = require('url');
const { File } = require('./models')

const app = express();
// app.use(cors());
const PORT = process.env.PORT || 3001;

// const { User } = require("./models");

const mimeTypes = {
  'css': 'text/css',
  'html': 'text/html',
  'js': 'application/javascript',
  'json': 'application/json',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'svg': 'image/svg+xml',
  'pdf': 'application/pdf',
  // Add more mappings as needed
};

//URL TO RENDER ROOM WILL BE /render/:projectId
//Current implementation does not allow for directories
async function loadFileMiddleware(req, res, next){
  const referer = req.get('Referer');
  if (referer) {
      const refererUrl = new URL(referer);
      const path = refererUrl.pathname;
      const parts = path.split('/'); // Split the string by '/'
      const projectId = parts[2];
      // Check if referer matches the pattern "/render/:projectId"
      const match = path.match(/^\/render\/([^\/]+)$/);

      if (match) {
          const requestPath = req.url;
          const parsedUrl = url.parse(requestPath);
          const path = parsedUrl.pathname;
          
          // Split the path by '/' and get the last segment
          const segments = path.split('/');
          const lastSegment = segments.pop() || segments.pop();
          const file = await File.findOne({
              where: {
                  fileName: lastSegment,
                  project: projectId
              }
          })
          if (!file){
              return res.status(404).json({error: "Could not find file!"});
          }
          const textDecoder = new TextDecoder();
          file.content = textDecoder.decode(new Uint8Array(file.content));
          const extension = file.fileName.split('.').pop().toLowerCase();
          const mimeType = mimeTypes[extension];
          res.setHeader('Content-Type', mimeType);
          return res.send(file.content);
      }
  }
  next();
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(loadFileMiddleware);
app.use(allRoutes);
// rs


sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});
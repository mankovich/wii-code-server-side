const router = require('express').Router();
const sequelize = require("sequelize");
const { File } = require('../../models');

//URL TO RENDER ROOM WILL BE /render/:projectId
async function loadIndexHtmlMiddleware(req, res){
    const projectId = req.params.projectId;
    if (!projectId){
        return res.status(400).json({error: "No projectId supplied"});
    }
    const indexHtml = await File.findOne({
        where: {
            fileName: "index.html",
            project: projectId
        }
    });
    const textDecoder = new TextDecoder();
    indexHtml.content = textDecoder.decode(new Uint8Array(indexHtml.content)) 
    if (!indexHtml){
        return res.status(400).json({error: "Project has no index.html"});
    }
    res.setHeader('Content-Type', 'text/html');
    return res.send(indexHtml.content);
}

router.get("/:projectId", (req, res) => loadIndexHtmlMiddleware(req, res));

module.exports = router;
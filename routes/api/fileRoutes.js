const router = require("express").Router();
const express = require('express');
const { Project, File } = require('../../models');
const sequelize = require("sequelize");
const { validateToken, findUserByEmail, validateRequest } = require("../../controllers/authController");

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const utf8Encode = {
    encode: (content) => Array.from(textEncoder.encode(content)),
    decode: (content) => textDecoder.decode(new Uint8Array(content)) // Use TextDecoder and convert array back to Uint8Array
};

router.post("/", async (req, res) => {
    //add check that project is users project
    let user = null;
    try{
        user = await validateRequest(req, res);
    } catch {
        return res.status(401).json({error: "Invalid token!"});
    }
    //check that its not a duplicate name
    const file = req.body;
    console.log("Adding file of:");
    console.log(file);
    const projectFiles = await File.findAll({
        where: {project: file.project}
    })
    for (curFile of projectFiles){
        if (file.fileName === curFile.fileName){
            return res.status(409).json({error: "Duplicate file name!"});
        }
    }
    //end check
    file.content = utf8Encode.encode(file.content);
    const rereadFile = await File.create(file);
    rereadFile.content = utf8Encode.decode(rereadFile.content);
    return res.status(200).json(rereadFile);
});
router.delete("/:id", async (req, res) => {
    //add check that project is users project
    let user = null;
    try{
        user = await validateRequest(req, res);
    } catch {
        return res.status(401).json({error: "Invalid token!"});
    }
    const id = req.params.id;
    const num = await File.destroy({
        where: {ID: id}
    });
    return res.status(200).json({numDeleted: num});
}) 
router.put("/:id", async (req, res) => {
    //Add check that this is the users file
    let user = null;
    try{
        user = await validateRequest(req, res);
    } catch {
        return res.status(401).json({error: "Invalid token!"});
    }
    const id = req.params.id;
    const updateJson = req.body;
    if ("content" in updateJson){
        updateJson.content = utf8Encode.encode(updateJson.content);
    }
    const file = await File.findOne({ where: { ID: id } });
    if (!file) {
        return res.status(404).json({ message: 'No file with this ID!' });
    }
    await file.update(updateJson);
    file.content = utf8Encode.decode(file.content);
    return res.json(file);
})

module.exports = router;
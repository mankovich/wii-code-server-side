const router = require("express").Router();
const express = require('express');
const { Project, File } = require('../../models');
const sequelize = require("sequelize");
const connection = require("../../config/connection")
const { validateToken, findUserByEmail, validateRequest } = require("../../controllers/authController");

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const utf8Encode = {
    encode: (content) => Array.from(textEncoder.encode(content)),
    decode: (content) => textDecoder.decode(new Uint8Array(content)) // Use TextDecoder and convert array back to Uint8Array
};

router.get("/:userId", async (req, res) => {
    let user = null;
    try{
        user = await validateRequest(req, res);
    } catch {
        return res.status(401).json({error: "Invalid token!"});
    }
    console.log("Recieved request to read all projects");
    console.log("For user ", req.params.userId);
    const projects = await Project.findAll({
        where: {
            ownerId: req.params.userId
        }
    })
    for (let project of projects){
        const files = await File.findAll({
            where: {"project": project.ID}
        });
        console.log(files);
        for (let file of files){
            file.content = utf8Encode.decode(file.content);
        }
        project.dataValues.files = files;
    }
    return res.status(200).json(projects);
})
router.get("/:userId/:projectId", async (req, res) => {
    let user = null;
    try{
        user = await validateRequest(req, res);
    } catch {
        return res.status(401).json({error: "Invalid token!"});
    }
    console.log("Recieved request to read one project");
    console.log("For user ", req.params.userId);
    console.log("For project ", req.params.projectId);
    const project = await Project.findAll({
        where: {
            ID: req.params.projectId,
            ownerId: req.params.userId
        }
    })
    console.log(project);
    const files = await File.findAll({
        where: {"project": project[0].dataValues.ID}
    });
    // console.log(files);
    for (let file of files){
        file.content = utf8Encode.decode(file.content);
    }
    project[0].dataValues.files = files;
    return res.status(200).json(project);
})
router.post("/", async (req, res) => {
    let user = null;
    try{
        user = await validateRequest(req, res);
    } catch {
        return res.status(401).json({error: "Invalid token!"});
    }
    console.log("Recieved request to create a project");
    const requestData = req.body;
    const projectJson = requestData.project;
    console.log("For user with ID:" + user.ID);
    projectJson.ownerId = user.ID;
    const fileData = requestData.files;
    //Start an acid transaction so we don't leave the db in a undefined state
    const t = await connection.transaction();
    try {
        const project = await Project.create(projectJson, { transaction: t});
        const files = [];
        if (fileData){
            for (const file of fileData){
                file.project = project.ID
                file.content = utf8Encode.encode(file.content);
                const rereadFile = await File.create(file, {transaction: t});
                rereadFile.content = utf8Encode.decode(rereadFile.content);
                files.push(rereadFile);
            }
        }
        //We did it, no errors
        await t.commit()
        res.status(200).json({project: project, files: files});
    } catch (error){
        //we failed, lets roll back
        await t.rollback();
        return res.status(500).json({error: error.message});
    }
});
router.delete("/:projectId", async (req, res) => {
    let user = null;
    try{
        user = await validateRequest(req, res);
    } catch {
        return res.status(401).json({error: "Invalid token!"});
    }
    console.log("Recieved request to delete a project");
    const numDeleted = await Project.destroy({
        where: {
            ID: req.params.projectId
        }
    });
    if ( numDeleted ){
        return res.status(200).json({message: "Sucessfully deleted project"})
    } else {
        return res.status(404).json({error: "Couldn't find project!"})
    }
});

module.exports = router;
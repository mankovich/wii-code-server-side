const router = require("express").Router();
const express = require('express');
const { Project, File } = require('../../models');
const sequelize = require("sequelize");



router.get("/:userId", async (req, res) => {
    //VERIFY TOKEN
    console.log("Recieved request to read all projects");
    console.log("For user ", req.params.userId);
    const projects = await Project.findAll({
        where: {
            ownerId: req.params.userId
        }
    })
    return res.status(200).json(projects);
})
router.get("/:userId/:projectId", async (req, res) => {
    //VERIFY TOKEN
    console.log("Recieved request to read one project");
    console.log("For user ", req.params.userId);
    console.log("For project ", req.params.projectId);
    const project = await Project.findAll({
        where: {
            ID: req.params.projectId,
            ownerId: req.params.userId
        }
    })
    return res.status(200).json(project);
})
router.post("/", async (req, res) => {
    //VERIFY TOKEN
    console.log("Recieved request to create a project");
    const requestData = req.body;
    const projectJson = requestData.project;
    const fileData = requestData.files;
    //Start an acid transaction so we don't leave the db in a undefined state
    const t = await sequelize.transaction();
    let utf8Encode = new TextEncoder();
    try {
        const project = await Project.create(projectJson, { transaction: t});
        const files = [];
        if (fileData){
            for (const file of fileData){
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
        res.status(500).json({error: error});
    }
});
router.delete("/:projectId", async (req, res) => {
    //VERIFY TOKEN
    console.log("Recieved request to delete a project");
    const numDeleted = await Project.destroy({
        where: {
            ID: req.params.projectId
        }
    });
    if ( numDeleted ){
        res.status(200).json({message: "Sucessfully deleted project"})
    } else {
        res.status(404).json({error: "Couldn't find project!"})
    }
});

module.exports = router;
const router = require("express").Router();
const express = require('express');
const { Project, File } = require('../../models');
const sequelize = require("sequelize");

router.post("/", async (req, res) => {
    //VERIFY TOKEN
    const file = req.body;
    file.content = utf8Encode.encode(file.content);
    const rereadFile = await File.create(file, {transaction: t});
    rereadFile.content = utf8Encode.decode(rereadFile.content);
    res.status(200).json(rereadFile);
});
router.delete("/:id", async (req, res) => {
    //VERIFY TOKEN
    const id = req.params.id;
    const num = await File.destroy({
        where: {ID: id}
    });
    res.status(200).json({numDeleted: num});
}) 
router.put("/:id", async (req, res) => {
    //VERIFY TOKEN
    const id = req.params.id;
    const updateJson = req.body;
    const updatedFile = await File.findOneAndUpdate(
        { _id: id },
        { $set: updateJson },
        { runValidators: true, new: true }
    );
    if (!updatedFile) {
        return res.status(404).json({ message: 'No file with this id!' });
    }
    res.json(updatedFile);
})

module.exports = router;
const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const { isAuthenticated } = require("../helpers/auth");

router.get("/add", isAuthenticated, (req,res)=>{
    res.render("notes/new-notes");
});

router.post("/new-note", isAuthenticated, async (req,res)=>{
    const { title, description } = req.body;
    const errors = [];

    if(!title){
        errors.push({text: "Please Write a Title"});
    }
    if(!description){
        errors.push({text: "Please Write a Description"});
    }
    if(errors.length >0){
        res.render("notes/new-notes",{
            errors,
            title,
            description
        });
    }
    else{
        const newNote = new Note({title, description});
        newNote.user = req.user.id;
        await newNote.save();
        req.flash("success_msg", "Note Added Successfully")
        res.redirect("/notes");
    }
    
});

router.get("/", isAuthenticated, async(req,res)=>{
    const notes = await Note.find({user: req.user.id}).sort({date: "desc"});
    res.render("notes/all-notes", {notes});
});

router.get("/edit/:id", isAuthenticated, async(req,res)=>{
    const note = await Note.findById(req.params.id);
    res.render("notes/edit-note", { note });
});

router.put("/edit-note/:id", isAuthenticated,  async (req,res)=>{
    const {title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title,description});
    req.flash("success_msg", "Note Updated Succesfully");
    res.redirect("/notes");
});

router.delete("/delete/:id", isAuthenticated,  async (req,res)=>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Note Removed Succesfully");
    res.redirect("/notes");
});

module.exports = router;
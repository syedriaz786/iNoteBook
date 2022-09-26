const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note  = require('../models/Note');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all the Notes  using: GET "/api/notes/getuser". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {


try{
    const notes = await Note.find({ user: req.user.id })
    res.json(notes)
}
catch(error) {
    console.error(error.message)
    res.status(500).send("Internal Server Error");
}
})


// ROUTE 2: Add a new Note using: POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [

    body('title', 'Enter Valid Title').isLength({ min: 3 }),
    body('description', 'description Must be be atleat 5 character').isLength({ min: 5 }),



], async (req, res) => {

    try {
        

    const {title, description, tag} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const note  =new Note({

        title, description, tag, user:  req.user.id
    })

    const savedNote = await note.save()

    res.json(savedNote)

} catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Server Error");
}
})


// ROUTE 3: udate an existing Note using: POST "/api/notes/updatenote". Login required


router.put('/updatenote/:id', fetchuser,  async (req, res) => {

    const {title,description,tag}= req.body;

    // create new note object

    try
     {
    const newNote ={};

    if(title)
    {
        newNote.title = title
    };

    if(description)
    {
        newNote.description = description
    };

    if(tag)
    {
        newNote.tag = tag
    };


    // find the node to be updated and  update it

    let note = await Note.findById(req.params.id);
    if(!note){
      return  res.status(404).send("Note Found");
    }

    if(note.user.toString() !==req.user.id){

        return res.status(401).send("Note Allowed");

    }

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});

    res.json({note});

} catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Server Error");
}
})



// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required

router.delete('/deletenote/:id', fetchuser,  async (req, res) => {

   

try {
    // find the node to be deleted and delete it

    let note = await Note.findById(req.params.id);
    if(!note){
      return  res.status(404).send("Note Found");
    }

    if(note.user.toString() !==req.user.id){

        return res.status(401).send("Note Allowed");

    }

    note = await Note.findByIdAndDelete(req.params.id);

    res.json({"Success": "Note has been deleted", note: note });

} catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Server Error");
}
})









module.exports = router
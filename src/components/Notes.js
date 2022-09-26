import React, { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../context/notes/noteContext";
import AddNote from "./AddNote";
import Noteitem from "./Noteitem";


function Notes(props) {

  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;
  useEffect(() => {

    getNotes()
    // eslint-disable-next-line
  }, [])

  const ref = useRef(null)
  const refClose = useRef(null)

  const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "default" })

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag })

  }



  const handleClick = (e) => {
    console.log("Updating the note..." + note)
    editNote(note.id, note.etitle, note.edescription, note.etag)
    refClose.current.click();
    // e.preventDefault();
    // addNote(note.title, note.description, note.tag)


  }
  const onChange = (e) => {

    setNote({ ...note, [e.target.name]: e.target.value })

  }



  return (
    <>
      <AddNote showAlert={props.showAlert} />


      <button type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal" ref={ref}>
        Launch demo modal
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="m-3">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input type="text" className="form-control" id="etitle" name="etitle" aria-describedby="emailHelp" value={note.etitle} onChange={onChange} minLength={5} required />

                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} minLength={5} required />
                </div>

                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">Tag</label>
                  <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} />
                </div>


              </form>
            </div>
            <div className="modal-footer">
              <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button disabled={note.etitle.length < 5 || note.edescription.length < 5} type="button" className="btn btn-primary" onClick={handleClick}>Update Note</button>
            </div>
          </div>
        </div>
      </div>



      <div className="row my-3">

        <h2>Your Notes</h2>
        <div className="container">
          {notes.length === 0 && "You Have No Notes "}
        </div>
        {notes.map((note) => {
          return <Noteitem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />

        })}

      </div>

    </>
  )
}

export default Notes
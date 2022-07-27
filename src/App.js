import {useState, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Notes from './components/Notes'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [show, setShow] = useState(false);
  const [archive, setArchive] = useState(false);
  const [notes, setNotes] = useState([
    {
        "title": "Hello Word!",
        "content": "Try adding some new notes here!",
        "categories": "•Other",
        "archived": false,
        "key": "4455cde3-07ea-4380-9cb4-1fbe7f3837b9"
    },
    {
      "title": "Options",
      "content": "You can edit, delete and archive your notes.",
      "categories": "•Work",
      "archived": false,
      "key": "4a55cde3-07ea-4380-9cb4-1fbe7f3837b9"
  },
  {
    "title": "Categories",
    "content": "Try category filter! Hope you like it!",
    "categories": "•Daily",
    "archived": false,
    "key": "4b55cde3-07ea-4380-9cb4-1fbe7f3837b9"
  },
  {
    "title": "The Archive",
    "content": "Welcome! This is an archived note.",
    "categories": "•Info",
    "archived": true,
    "key": "4b55mde3-07ea-4380-9cb4-1fbe7f3837b9"
  }
]);


  // Gets localStorage or welcome text
  useEffect (() => {
    const notesInLocal = localStorage.getItem("notes")

    if(notesInLocal !== null) {
        const notesArray = JSON.parse(notesInLocal)
        setNotes(notesArray)
    } else {
      localStorage.setItem("notes", JSON.stringify(notes));  
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // FORM OPEN CLOSE
  const handleClose = () => {
    setShow(false);
  }
  const handleShow = () => setShow(true);
  

  // CREATE NEW NOTE
  const handleCreate = (e) => {
    e.preventDefault()
    setShow(false);
    const savedNotes = localStorage.getItem("notes")
    let tempNotes;

    if(savedNotes === null) {
      tempNotes = []
    } else {
      tempNotes = JSON.parse(savedNotes)
    }

    // grabs new note info from form
    const btn = e.currentTarget.parentElement.parentElement;
    const title = btn.querySelector('input[name="title"]').value
    const content = btn.querySelector('[name="content"]').value
    const key = uuidv4()
    const categories = btn.querySelector('[name="categories"]').value
    const archived = false

    const newNote = {
      title,
      content,
      categories,
      archived, 
      key
    };
    tempNotes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(tempNotes));
    setNotes(tempNotes)
    document.getElementById("select").value = ''
  }


  // DELETE NOTE
  const removeNote = (e) => {
    e.preventDefault()
    const savedNotes = localStorage.getItem("notes")
    let tempNotes = JSON.parse(savedNotes)
    let keyToDelete = e.currentTarget.parentElement.parentElement.querySelector(".id-key").innerText

    Swal.fire({
      title: 'Do you want to delete this note?',
      showDenyButton: true,
      denyButtonText: `No`,
      confirmButtonColor: '#3085d6',
      denyButtonColor: '#3085d6',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        let remainingNotes = tempNotes.filter(oneNote => {
          return oneNote.key !== keyToDelete
        });
        localStorage.setItem("notes", JSON.stringify(remainingNotes));
        setNotes(remainingNotes)
        document.getElementById("select").value = ''
      }
    })
  }

  // CATEGORY FILTER
  const categoryFilter = (e) => {
    e.preventDefault()
    const value = e.target.value
    const savedNotes = localStorage.getItem("notes")
    let tempNotes = JSON.parse(savedNotes)
    
    if (value !== "") {
      let filteredNotes = tempNotes.filter(oneNote => {
        return oneNote.categories === value && oneNote.archived === archive
      })
      setNotes(filteredNotes)
    } else {
      setNotes(tempNotes)
    }
  }

  // NOTE STATE INFO UPDATER
  const updater = () => {
    const notesInLocal = localStorage.getItem("notes")
    setNotes(JSON.parse(notesInLocal))
  }

  

  return (
    <div className='body'>
      <div className='head'>

        <div className='header'>
          <div className='take-note-create'>
          {!archive && <h1>Take note!</h1>} 
          {archive && <h1>Archive</h1>} 

          {!archive && <Button variant="outline-light" onClick={handleShow}>Create</Button>} 
          </div>
          
        </div>
        <p><a href="https://guidocalciano.com.ar" className='by-Guido'>By Guido Calciano</a></p>
        
        {!archive && <><i className="fa-solid fa-box archived-icon"></i><button onClick={()=>setArchive(true)} className="archived-button">Archived Notes</button></>} 
        {archive && <><i className="fa-solid fa-note-sticky"></i><button onClick={()=>setArchive(false)} className="archived-button">Back to Notes</button></>} 

        <div className='filter'>
          <Form.Group className="mb-3 form-content" controlId="formCategories">
              <Form.Label className='category-filter'>Category filter:</Form.Label>
              <Form.Select className='filter-form' onChange={categoryFilter} id="select" name="categories" aria-label="Default select example">
              <option value="">All</option>
              <option value="•Info" >Info</option>
              <option value="•Daily">Daily</option>
              <option value="•Work">Work</option>
              <option value="•Fun">Fun</option>
              <option value="•Other">Other</option>
              </Form.Select>
          </Form.Group>
        </div> 




        <div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>New Note</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleCreate}>
                <Form.Group className="mb-3" controlId="formTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    name="title"
                    type="text"
                    placeholder="Note Title"
                    autoFocus
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formContent">
                  <Form.Label>Content</Form.Label>
                  <Form.Control name="content" as="textarea" rows={3} />
                </Form.Group>


                <Form.Group className="mb-3" controlId="formCategories">
                  <Form.Label>Category</Form.Label>
                  <Form.Select name="categories" aria-label="Default select example">
                  <option value="">Select One</option>
                  <option value="•Info" defaultValue>Info</option>
                  <option value="•Daily">Daily</option>
                  <option value="•Work">Work</option>
                  <option value="•Fun">Fun</option>
                  <option value="•Other">Other</option>
                  </Form.Select>
                </Form.Group>

              </Form>
            </Modal.Body>
            <Modal.Footer >
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" variant="primary" onClick={handleCreate}>
                Create Note
              </Button>
            </Modal.Footer>
          </Modal>
        </div>


        <div>
          <Notes notes={notes} removeNote={removeNote} archive={archive} updater={updater}/>
        </div>

      </div>
    </div>

  );
}

export default App;

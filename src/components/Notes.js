import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';

function Notes(props) {

    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [categories, setCategories] = useState("")
    const [key, setKey] = useState("")
    const [archivedBool, setArchivedBool] = useState(false)


    const handleClose = () => {
        setShow(false);
      }
    
    const handleShow = (e) => {
        e.preventDefault()
        setShow(true);

        const btn = e.currentTarget.parentElement.parentElement;
        setTitle (btn.querySelector('h2').innerText)
        setContent (btn.querySelector('.content-info').innerText);
        setCategories (btn.querySelector('.category-text').innerText);
        setKey (btn.querySelector('.id-key').innerText)
        setArchivedBool (btn.querySelector('.id-bool').innerText)
    }
    

    // EDIT CARD
    const handleEdit = (e) => {
        e.preventDefault();
        setShow(false);
        const savedNotes = localStorage.getItem("notes")
        let tempNotes =JSON.parse(savedNotes)
        const btn = e.currentTarget.parentElement.parentElement;
        const title = btn.querySelector('input[name="title"]').value
        const content = btn.querySelector('[name="content"]').value
        const categories = btn.querySelector('[name="categories"]').value
        const archived = archivedBool === "true"

        const editedNote = {
        title,
        content,
        categories,
        archived,
        key};
        const finalNotes = tempNotes.map(note => (note.key === editedNote.key ? editedNote : note) )
        localStorage.setItem("notes", JSON.stringify(finalNotes));
        props.updater()
    }

    // ARCHIVE CARD
    const archiveCard = (e) => {
        e.preventDefault()
        const savedNotes = localStorage.getItem("notes")
        let tempNotes = JSON.parse(savedNotes)
        const btn = e.currentTarget.parentElement.parentElement;
        const title = btn.querySelector('h2').innerText
        const content = (btn.querySelector('.content-info').innerText);
        const categories = (btn.querySelector('.category-text').innerText);
        const key = (btn.querySelector('.id-key').innerText)
     
        if (props.archive === false) {
            
        Swal.fire({
            title: 'Do you want to archive this note?',
            showDenyButton: true,
            denyButtonText: `No`,
            confirmButtonColor: '#3085d6',
            denyButtonColor: '#3085d6',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
                const editedNote = {
                    title,
                    content,
                    categories,
                    "archived": true,
                    key};
                    const finalNotes = tempNotes.map(note => (note.key === editedNote.key ? editedNote : note) )
                    localStorage.setItem("notes", JSON.stringify(finalNotes));
                    props.updater()}})
        } else {
            
        Swal.fire({
            title: 'Do you want to take it back?',
            showDenyButton: true,
            denyButtonText: `No`,
            confirmButtonColor: '#3085d6',
            denyButtonColor: '#3085d6',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
                const editedNote = {
                    title,
                    content,
                    categories,
                    "archived": false,
                    key};
                    const finalNotes = tempNotes.map(note => (note.key === editedNote.key ? editedNote : note) )
                    localStorage.setItem("notes", JSON.stringify(finalNotes));
                    props.updater()}})
        }
    }
  


  return (

    <>  
        <div className='card-container'>
            {!props.notes.length && <p className="add-text">Try adding some new notes!</p>}

            {props.notes.map((oneNote) => {
                    return (
                        
                        (props.archive === oneNote.archived ) &&
                        <div className={`note-card ${oneNote.categories}`} key={oneNote.key} >

                            <h2 className='note-title'>{oneNote.title}</h2>
                            <p className='note-text content-info'>{oneNote.content}</p>
                            <p className='note-text id-key d-none'>{oneNote.key}</p>
                            <p className='note-text id-bool d-none'>{oneNote.archived? "true" : "false"}</p>
                            <div className='category-group'>
                                <span className='note-text category-text'>{oneNote.categories}</span>
                            </div>
                            
                                <div className='icons'>
                                    {props.archive === false && 
                                    <button 
                                        onClick={archiveCard} 
                                        className="note-bin">
                                        <i className="fa-solid fa-box"></i>
                                    </button>}
                                    
                                    {props.archive === true &&
                                    <button 
                                        onClick={archiveCard} 
                                        className="note-bin">
                                        <i className="fa-solid fa-box-open"></i>
                                    </button>}

                                    <button 
                                        onClick={handleShow} 
                                        className="note-bin">
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </button>

                                    <Modal show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                        <Modal.Title>Edit Note</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                        <Form onSubmit={handleEdit}>
                                            <Form.Group className="mb-3" controlId="formTitle">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control
                                                name="title"
                                                type="text"
                                                placeholder="Note Title"
                                                autoFocus
                                                value={title}
                                                onChange={e => setTitle(e.target.value)}
                                            />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formContent">
                                            <Form.Label>Content</Form.Label>
                                            <Form.Control 
                                                name="content" 
                                                as="textarea" 
                                                rows={3}
                                                value={content}
                                                onChange={e => setContent(e.target.value)}
                                                 />
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formCategories">
                                                <Form.Label>Categories</Form.Label>
                                                <Form.Select name="categories" defaultValue={categories} onChange={e => setCategories(e.target.value)} aria-label="Default select example">
                                                    <option value="">Select One</option>
                                                    <option value="•Info">Info</option>
                                                    <option value="•Daily">Daily</option>
                                                    <option value="•Work">Work</option>
                                                    <option value="•Fun">Fun</option>
                                                    <option value="•Other">Other</option>
                                                </Form.Select>
                                            </Form.Group>

                                        </Form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>
                                            Close
                                        </Button>
                                        <Button type="submit" variant="primary" onClick={handleEdit}>
                                            Save
                                        </Button>
                                        </Modal.Footer>
                                    </Modal>


                                    <button 
                                        onClick={props.removeNote} 
                                        className="note-bin">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                        </div>
                    )
                })
            }
        </div>
    </>
  )
}

export default Notes
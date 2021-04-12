import React from "react";
import {Alert, Button, Form, Modal} from "react-bootstrap";
import CSVReader from "react-csv-reader";
import {useDispatch} from "react-redux";
import {addNewCollectionInfo} from "../practice/practiceSlice";
import {useHistory} from "react-router-dom";
import {v4 as uuidv4} from 'uuid';

export const Import = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const processNewCollection = (data) => {
        let newCollection = []
        console.log(data)
        for (let d of data) {
            let question = {
                "question": d[0],
                "options": [],
                "answer": [...d[d.length - 2].trim()].map(i => Number.parseInt(i)),
                "time": Number.parseInt(d[d.length - 1]),
                "level": 1,
                "correct_count": 0,
                "id": uuidv4()
            }
            for (let i = 1; i < d.length - 2; i++) {
                question.options.push(d[i].trim())
            }
            newCollection.push(question)
        }
        dispatch(addNewCollectionInfo({"id": uuidv4(), "name": "new col", question: newCollection}))
    }


    return (
        <div>
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Import new collection</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Select your file</p>
                    <CSVReader onFileLoaded={(data, fileInfo) => processNewCollection(data)}/>
                    <Form>
                        <Form.Label>Collection Title</Form.Label>
                        <Form.Control/>
                    </Form>
                    <Alert variant='warning'>
                        Format:
                        <p>Question Text; [...Options]; [Answer]; Time Limit (seconds) </p>
                        Example:
                        <p>
                            "Capital of Illinois"; "Chicago"; "Champaign"; "SpringField"; "3"; 300
                        </p>
                    </Alert>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => history.push("/")}>Close</Button>
                    <Button variant="primary" onClick={() => history.push("/")}>Save changes</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    )
}

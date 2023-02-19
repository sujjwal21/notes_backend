const express = require("express")
const { authenticate } = require("../Middlewares/authenticate.middleware")
const { NoteModel } = require("../Models/Note.mode")
const noteRouter = express.Router()

noteRouter.use(authenticate)
/**
* @swagger
* components:
*   schemas:
*       Note:
*           type: object
*           properties:
*               title:
*                   type: string
*                   description: The auto-generated id of the note
*               body:
*                   type: string
*                   description: The note title
*               user:
*                   type: string
*                   description: The user id
*/

/**
* @swagger
* tags:
*   name: Notes
*   description: All the API routes related to notes
*/


/**
 * @swagger
 * /notes:
 *  get:
 *      summary: this will going to give yoy all notes
 *      tags: [Notes]
 *      responses:
 *          200:
 *              description: The list of all Notes
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          item:
 *                              $ref: "#/components/schemas/Note"
 */
noteRouter.get("/", async (req, res) => {
    const note = await NoteModel.find({ user: req.body.user })
    // const notes=await NoteModel.find()
    console.log(req.body.user)
    res.send({ "note": note })
})
noteRouter.get("/all", async (req, res) => {
    const note = await NoteModel.find()
    // const notes=await NoteModel.find()
    console.log(req.body.user)
    res.send({ "Notes": note })
})

/**
 * @swagger
 * /notes/create:
 *   post:
 *      summary: To Post the details of new notes
 *      tags: [Notes]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#components/schemas/Note"
 *      responses:
 *          200:
 *              description: The note is successfully added
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Note"
 *          500:
 *              description: Server error
 */
noteRouter.post("/create", async (req, res) => {
    const payload = req.body
    try {
        const note = new NoteModel(payload)
        await note.save()
        res.send("Notes added")
    } catch (err) {
        res.send({ "msg": "Notes addion failed", "error": err })
    }
})
/**
 * @swagger
 * /notes/update/{id}:
 *  patch:
 *      summary: It will update notes details
 *      tags: [Notes]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Note id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Note"
 *      responses:
 *          200:
 *              description: the note details has been updated
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Note"
 *          404:
 *              description: the note is not found
 *          500:
 *              description: Server error
 */

noteRouter.patch("/update/:id", async (req, res) => {
    const id = req.params.id
    const payload = req.body
    const note = await NoteModel.findOne({ "_id": id })
    const nodeID = note.user
    try {
        if (req.body.user !== nodeID) {
            res.send({ "msg": "You are not Authorized" })
        } else {
            await NoteModel.findByIdAndUpdate({ "_id": id }, payload)
            res.send(" Note Updated")
        }
    } catch (err) {
        res.send(err)
    }

})

/**
 * @swagger
 * /notes/delete/{id}:
 *   delete:
 *      summary: remove the note by id
 *      tags: [Notes]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: the note id
 *      responses:
 *          200:
 *              description: The note was deleted
 *          404:
 *              description: the note not found
 */

noteRouter.delete("/delete/:id", async (req, res) => {
    const id = req.params.id
    const payload = req.body
    const note = await NoteModel.findOne({ "_id": id })
    const nodeID = note.user
    try {
        console.log(req.body.user, nodeID)
        if (req.body.user !== nodeID) {
            res.send({ "msg": "You are not Authorized" })
        } else {
            await NoteModel.findByIdAndDelete({ _id: id })
            res.send(" Note deleted")
        }
    } catch (err) {
        res.send(err)
    }
})

module.exports = {
    noteRouter
}
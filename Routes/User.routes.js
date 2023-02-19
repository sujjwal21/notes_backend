const express = require("express")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UserModel } = require("../Models/User.model");
const { authenticate } = require("../Middlewares/authenticate.middleware");
const userRouter = express.Router()

/**
* @swagger
* components:
*   schemas:
*       User:
*           type: object
*           properties:
*               name:
*                   type: string
*                   description: The auto-generated id of the user
*               email:
*                   type: string
*                   description: The user name
*               pass:
*                   type: string
*                   description: The user email
*               age:
*                   type: number
*                   description: The user email
*/

/**
* @swagger
* tags:
*   name: Users
*   description: All the API routes related to User
*/

/**
 * @swagger
 * /users:
 *  get:
 *      summary: this will going to give yoy all users
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: The list of all Users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          item:
 *                              $ref: "#/components/schemas/User"
 */
userRouter.get("/",async(req,res)=>{
    try{
        const users=await UserModel.find()
        res.send({"users":users})
    }catch(err){
        res.send({"msg":err.message})
    }
})

/**
 * @swagger
 * /users/register:
 *   post:
 *      summary: To Post the details of new User
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#components/schemas/User"
 *      responses:
 *          200:
 *              description: The note is successfully added
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/User"
 *          500:
 *              description: Server error
 */
userRouter.post("/register", async (req, res) => {
    const { name, email, pass,age } = req.body
    try {
        bcrypt.hash(pass, 3, async (err, hash) => {
            // ?Store hash in your password DB.
            if (err) {
                res.send({ "msg": "Something wrong", "error": err })
            } else {
                const user = new UserModel({ name, email, pass: hash,age })
                await user.save()
                res.send({ "msg": "New user has been registered" })
            }
        });
    } catch (err) {
        res.send({ "msg": "Something wrong", "error": err })
    }
})

/**
 * @swagger
 * /users/login:
 *   post:
 *      summary: To Post the details of User and get token
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#components/schemas/User"
 *      responses:
 *          200:
 *              description: The note is successfully added
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/User"
 *          500:
 *              description: Server error
 */
userRouter.post("/login", async (req, res) => {
    const { email, pass } = req.body
    try {
        const user = await UserModel.find({ email })
        if (user.length > 0) {
            bcrypt.compare(pass, user[0].pass, async (err, result) => {
                if (result) {
                    let token = jwt.sign({ userID: user[0]._id}, "ujjwal")
                    res.send({ "msg": "New user has been registered", "token": token })
                } else {
                    res.send({ "msg": "Wrong password" })

                }
            });

        } else {
            res.send({ "msg": "User not found" })
        }
    } catch (err) {
        res.send({ "msg": "Something wrong", "error": err })
    }
})


module.exports = {
    userRouter
}
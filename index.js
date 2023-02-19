const express = require("express");
const { connection } = require("./db");
const cors = require("cors");
const { userRouter } = require("./Routes/User.routes");
const { noteRouter } = require("./Routes/Note.routes");
const swaggerJSdoc=require("swagger-jsdoc")
const swaggerUi=require("swagger-ui-express")

const app = express();
app.use(express.json())
app.use(cors())
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Learning Swagger",
            version: "1.0.0"
        },
        servers: [
            {
                url: "https://localhost:8080"
            }
        ]
    },
    apis: ["./routes/*.js"]
}
const swaggerSpec = swaggerJSdoc(options)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get("/", (req, res) => {
    res.send("Welcome to Home Page")
})

app.use("/users", userRouter)

app.use("/notes", noteRouter)

app.listen(8080, async () => {
    try {
        await connection
        console.log("Connected to db")
    } catch (err) {
        console.log("Connection failed to db")
    }
    console.log("Connected to serevr 8080")
})
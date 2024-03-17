import express from "express";
const cors = require('cors')
const dotenv = require('dotenv');

import { connectDB } from "./config/connectDb";
import { DATABASE_URL, PORT } from "./config/envConfig";
import router from "./routes/index.router";

const app = express();
dotenv.config()

app.use(cors({
    origin: "*"
}))

app.use(express.json())

app.use("/api/v1", router)

connectDB(DATABASE_URL as string);

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
})

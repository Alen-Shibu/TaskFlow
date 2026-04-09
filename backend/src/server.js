import express from 'express'
import 'dotenv/config'
import authRoutes from './routes/auth.routes.js'
import taskRoutes from './routes/task.routes.js'
import {connectDB} from './lib/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : "https://task-flow-pearl-seven.vercel.app", 
  credentials: true,               
}));

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/task",taskRoutes)

const startServer = async() => {
    try {
        await connectDB();
        app.listen(PORT,()=>{
            console.log(`App is Running on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log('Failed to Start Server:',error.message)
        process.exit(1)
    }
}

startServer();
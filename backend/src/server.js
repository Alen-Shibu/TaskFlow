import express from 'express'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT

app.get('/',(req,res)=>{
    res.send("Working")
})

app.listen(PORT,()=>{
    console.log(`App is listening on http://localhost:${PORT}`)
})
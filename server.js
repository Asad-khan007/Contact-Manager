const express = require("express");
const connectDB = require('./config/db');

const app = express();

//Connect to the MongoDB Database
connectDB();

app.get('/' , (req, res) => res.json({msg:"Welcome to the Contact Manager API's"}) )

//Define Routes Here
app.use('/api/user', require('./Routes/user'))
app.use('/api/auther', require('./Routes/auther'))
app.use('/api/contacts', require('./Routes/contacts'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port${PORT}`));
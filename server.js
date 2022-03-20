const express = require('express');
const connectDB = require('./config/db');
const app = express();

connectDB();

app.use(express.json( {extended: false }));

app.get('/',(req,res) => res.send('API running'));

//define routes
app.use('/api/users/hod', require('./routes/api/users/hod'));  
app.use('/api/hauth', require('./routes/api/hauth'));
app.use('/api/profile/pmentor', require('./routes/api/profile/pmentor'));
app.use('/api/profile/pstud', require('./routes/api/profile/pstud'));
//app.use('/api/posts', require('./routes/api/posts'));


const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => console.log(`server started on port ${PORT} `));

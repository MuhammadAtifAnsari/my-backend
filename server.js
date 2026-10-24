import app from "./src/app.js";
import mongoDB_Connect from './src/db/db.js';


const port = 3000;

mongoDB_Connect();

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
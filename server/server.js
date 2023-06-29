import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from "body-parser";
import path from "path"
import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js'
import dalleRoutes from './routes/dalleRoutes.js'
 
dotenv.config();

const app = express();
if (process.env.NODE_ENV === 'production') {
  //*Set static folder up in production
  app.use(express.static('client/dist'));

  app.get('*', (req,res) => res.sendFile(path.resolve(__dirname, 'client', 'dist','index.html')));
}
app.use(cors({ credentials: true, origin: true }));
app.use(express.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({ extended: true,limit:'50mb' }));
app.use(express.urlencoded({ extended: true,limit:'50mb' }));
app.use(bodyParser.json({limit:'50mb'}));


app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello from DALL.E!',
  });
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(8080, () => console.log('Server started on port 8080'));
  } catch (error) {
    console.log(error)
  }
};

startServer();

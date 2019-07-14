/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import express from 'express';
import path from 'path';
import router from './routes/routes';

const app = express();

app.use(express.json());
app.use(router);

app.use(express.static(path.join(__dirname, '..')));
// app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => res.status(200).send({
  status: 'success',
  data: 'Welcome to Property Pro Lite! Congratulations on making it this far!'
}));

app.all('*', (req, res) => {
  res.status(404).send('Error 404, route not found');
});

// start server on port
const server = app.listen(process.env.PORT || 3000, () => {
  // eslint-disable-next-line no-console
  console.log('Property-Pro-Lite Backend server running on port: ', server.address().port);
});

export default app;

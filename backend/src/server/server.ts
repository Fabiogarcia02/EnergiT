import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('EnergiTrack API rodando 🚀');
});

app.listen(3333, () => {
  console.log('Servidor rodando em http://localhost:3333');
});

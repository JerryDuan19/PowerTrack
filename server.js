const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const dataModel = require('./dataModel');

app.post('/api/trainings', (req, res) => {
  const newTraining = req.body;
  dataModel.addTraining(newTraining);
  res.status(201).json(newTraining);
});

app.get('/api/trainings', (req, res) => {
  const trainings = dataModel.getAllTrainings();
  res.json(trainings);
});

// 添加其他必要的路由

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
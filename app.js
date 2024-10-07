const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const sequelize = require('./config/database');
const Task = require('./src/models/Task');

const app = express();
app.use(bodyParser.json());

// Test de connexion à la base de données
sequelize.authenticate()
  .then(() => console.log("Connected to MySQL database"))
  .catch((error) => console.log("Unable to connect to MySQL database:", error));

// Synchroniser le modèle avec la base de données
sequelize.sync()
  .then(() => console.log("Database synced"))
  .catch((error) => console.log("Error syncing database:", error));

// Créer une tâche
app.post('/tasks', [
  body('title').isString().notEmpty().withMessage('Title is required'),
  body('status').optional().isIn(['pending', 'completed']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const task = await Task.create(req.body);
    res.status(201).json({ message: 'Task added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Lire toutes les tâches
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Lire une tâche par ID
app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Mettre à jour une tâche
app.put('/tasks/:id', [
  body('title').optional().isString().notEmpty(),
  body('status').optional().isIn(['pending', 'completed']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.update(req.body);
    res.json({ message: 'Task updated successfully'});
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Supprimer une tâche
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

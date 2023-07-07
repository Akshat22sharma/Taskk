// routes/tasks.js

const express = require('express');
const router = express.Router();
const passport = require('passport');

const Task = require('/models/Task.js');

// Create a task
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      assignedUser: req.user._id,
    });

    newTask
      .save()
      .then(task => res.json(task))
      .catch(err => console.log(err));
  }
);

// Get all tasks
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Task.find({ assignedUser: req.user._id })
      .then(tasks => res.json(tasks))
      .catch(err => console.log(err));
  }
);

// Update a task
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Task.findById(req.params.id)
      .then(task => {
        if (!task) {
          return res.status(404).json({ error: 'Task not found' });
        }

        task.title = req.body.title;
        task.description = req.body.description;
        task.dueDate = req.body.dueDate;
        task.status = req.body.status;

        task
          .save()
          .then(updatedTask => res.json(updatedTask))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

// Delete a task
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Task.findByIdAndDelete(req.params.id)
      .then(() => res.json({ success: true }))
      .catch(err => console.log(err));
  }
);

module.exports = router;

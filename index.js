require('dotenv').config();
const express = require('express');
const controllers = require('./database/controllers/controllers')
const db = require('./db')
const models = require('./database/models/models')
const app = express()

app.use(express.json())

app.get('/qa/questions', (req, res) => {
  controllers.getAllQsController(req.query.product_id, req.query.page || 1, req.query.count || 5)
  .then(results => {console.log(results); res.send(results)})
  .catch(err => res.statusCode(500).send(err))
})

app.get('/qa/questions/:question_id/answers', (req, res) => {
  controllers.getAllAsController(req.params.question_id, req.query.page || 1, req.query.count || 5)
  .then(results => res.send(results))
  .catch(err => res.statusCode(500).send(err))
})

app.post('/qa/questions', (req, res) => {
  controllers.postQController(req.body.body, req.body.name, req.body.email, req.body.product_id)
  .then(() => {res.sendStatus(201)})
  .catch(err => res.statusCode(500).send(err))
})

app.post('/qa/questions/:question_id/answers', (req, res) => {
  controllers.postAController(req.params.question_id, req.body.body, req.body.name, req.body.email, req.body.photos)
  .then(() => res.sendStatus(201))
  .catch(err => res.statusCode(500).send(err))
})

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  controllers.putQHelpfulController(req.params.question_id)
  .then(() => res.sendStatus(204))
  .catch(err => res.statusCode(500).send(err))
})

app.put('/qa/questions/:question_id/report', (req, res) => {
  controllers.putQReportedController(req.params.question_id)
  .then(() => res.sendStatus(204))
  .catch(err => res.statusCode(500).send(err))
})

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  controllers.putAHelpfulController(req.params.answer_id)
  .then(() => res.sendStatus(204))
  .catch(err => res.statusCode(500).send(err))
})

app.put('/qa/answers/:answer_id/report', (req, res) => {
  controllers.putAReportedController(req.params.answer_id)
  .then(() => res.sendStatus(204))
  .catch(err => res.statusCode(500).send(err))
})

app.listen(process.env.PORT, () => {
  console.log(`App listening on port: ${process.env.PORT}`)
})


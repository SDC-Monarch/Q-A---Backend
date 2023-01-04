const models = require('../models/models.js');

const getAllQsController = (product_id, page, count) => {
  models.getAllQs(product_id, page, count)
  .then((res) => console.log(res))
  .catch(err => {console.log('Error: ', err)})
}

const getAllAsController = (question_id, page, count) => {
  return models.getAllAs(question_id, page, count)
  .catch(err => {console.log(err)})
}

const postQController = (body, name, email, product_id) => {
  return models.postQ(body, name, email, product_id)
  .catch(err => {console.log('Error: ', err)})
}

const postAController = (question_id, body, name, email, photos) => {
  return models.postA(question_id, body, name, email, photos)
  .catch(err => {console.log(err)})
}

const putQHelpfulController = (question_id) => {
  return models.putQHelpful(question_id)
  .catch(err => {console.log('Error: ', err)})
}

const putQReportedController = (question_id) => {
  return models.putQReported(question_id)
  .catch(err => {console.log('Error: ', err)})
}

const putAHelpfulController = (answer_id) => {
  return models.putAHelpful(answer_id)
  .catch(err => {console.log('Error: ', err)})
}

const putAReportedController = (answer_id) => {
  return models.putAReported(answer_id)
  .catch(err => {console.log('Error: ', err)})
}

module.exports = {
  getAllQsController: getAllQsController,
  getAllAsController: getAllAsController,
  postQController: postQController,
  postAController: postAController,
  putQHelpfulController: putQHelpfulController,
  putQReportedController: putQReportedController,
  putAHelpfulController: putAHelpfulController,
  putAReportedController: putAReportedController
}

getAllQsController(1, 1, 100)

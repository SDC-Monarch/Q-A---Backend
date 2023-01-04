const db = require('../../db');
let answerCount = 6879306;

const getAllQs = (product_id, page, count) => {
  const query = (
    `SELECT
    product_id,
    COALESCE(json_agg(
      json_build_object(
        'question_id', id,
        'question_body', question_body,
        'question_date', to_timestamp(question_date / 1000),
        'asker_name', asker_name,
        'question_helpfulness', question_helpfulness,
        'reported', reported::boolean,
        'answers', (
          SELECT
            COALESCE(json_object_agg(answers.id,
              json_build_object(
                'id', id,
                'body', body,
                'date', to_timestamp(date_written / 1000),
                'answerer_name', answerer_name,
                'helpfulness', helpful,
                'reported', answer_reported,
                'photos', (
                  SELECT COALESCE(json_agg(url), '[]')
                  FROM answers_photos
                  WHERE answers_photos.answer_id = answers.id
                )
              )
            ), '{}')
          FROM answers
          WHERE answers.question_id = questions.id AND answer_reported = 0
        )
      )
    ), '[]') AS results
  FROM questions
  WHERE product_id = $1 AND reported = 0
  GROUP BY product_id`
  )

  return db.pool.query(query, [product_id])
  .then(res => res.rows)
}

const getAllAs = (question_id, page, count) => {
  const query = (
    `SELECT
    *, COALESCE(answers_photos.answer_id, answers.id) AS answer_id
    FROM answers LEFT JOIN answers_photos ON answers.id = answers_photos.answer_id WHERE question_id = $1 AND answer_reported = 0`)


  db.pool.query(query, [question_id])
  .then(res => {console.log(res.rows)})
}

const postQ = (body, name, email, product_id) => {
  const query = (
    `INSERT INTO
    questions (id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
    VALUES (nextval('question_id_seq'), $1, $2, $3, $4, $5, $6, $7)`
    )

  return db.pool.query(query, [product_id, body, Date.now(), name, email, 0, 0])
  .catch(err => {console.log('Error: ', err)})
}

const postA = (question_id, body, name, email, photos) => {
  answerCount++;
  const query1 = (
    `INSERT INTO answers (id, question_id, body, date_written, answerer_name, answerer_email, answer_reported, helpful)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`
  )

  const query2 = (
    `INSERT INTO answers_photos (id, answer_id, url)
    SELECT nextval('answer_photo_seq'), answer_id, url
    FROM json_populate_recordset(null::answers_photos, $1);`
  )

  return db.pool.query(query1, [answerCount, question_id, body, Date.now(), name, email, 0, 0])
  .then(() => {
    const newPhotos = photos.map((photo) => {
      const urlObject = {
        answer_id: answerCount,
        url: photo
      }
      return urlObject;
    })

    return db.pool.query(query2, [JSON.stringify(newPhotos)])
    .catch(err => {console.log('Error: ', err)})
  })
  .catch(err => {console.log('Error: ', err)})
}

const putQHelpful = (question_id) => {
  const query = ('UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE id = $1')

  return db.pool.query(query, [question_id])
  .catch(err => {console.log('Error: ', err)})
}

const putQReported = (question_id) => {
  const query = ('UPDATE questions SET reported = reported + 1 WHERE id = $1')

  return db.pool.query(query, [question_id])
  .catch(err => {console.log('Error: ', err)})
}

const putAHelpful = (answer_id) => {
  const query = ('UPDATE answers SET helpful = helpful + 1 WHERE id = $1')

  return db.pool.query(query, [answer_id])
  .catch(err => {console.log('Error: ', err)})
}

const putAReported = (answer_id) => {
  const query = ('UPDATE answers SET answer_reported = answer_reported + 1 WHERE id = $1')

  return db.pool.query(query, [answer_id])
  .catch(err => {console.log('Error: ', err)})
}

getAllAs(3510000,1,1)


module.exports = {
  getAllQs: getAllQs,
  getAllAs: getAllAs,
  postQ: postQ,
  postA: postA,
  putQHelpful: putQHelpful,
  putQReported: putQReported,
  putAHelpful: putAHelpful,
  putAReported: putAReported
}


//Actually because the ids are sequential, you don't need offset. If you are passed in page 5 with a limit of 1000. You can start off with WHERE id > 5000
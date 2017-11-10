function handleError (res) {
  return function errorHandler (err) {
    console.error(err.message)
    return res.status(500).send(err)
  }
}

function returnResponse (res) {
  return function responseHandler (data) {
    if (!data) return res.status(404).send({ msg: 'No data' })
    res.send(data)
  }
}

function constructPageQuery (req, populate) {
  const { p, l, s } = req.query
  return {
    page: p || 1,
    limit: l || 20,
    sort: s || {},
    lean: true,
    leanWithId: true,
    populate: [ 'createdBy', 'updatedBy' ].concat(populate)
  }
}

module.exports = {
  handleError,
  returnResponse,
  constructPageQuery
}

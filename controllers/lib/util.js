function handleError (res) {
  return function errorHandler (err) {
    console.error(err.message)
    return res.status(500).send(err)
  }
}

function returnResponse (res) {
  return function responseHandler (data) {
    res.send(data)
  }
}

module.exports = {
  handleError,
  returnResponse
}

var nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')
var transporter = nodemailer.createTransport(mg({
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
}))

/**
 * GET /contact
 */
exports.contactGet = function (req, res) {
  res.render('contact', {
    title: 'Contact'
  })
}

/**
 * POST /contact
 */
exports.contactPost = function (req, res) {
  req.assert('name', 'Name cannot be blank').notEmpty()
  req.assert('email', 'Email is not valid').isEmail()
  req.assert('email', 'Email cannot be blank').notEmpty()
  req.assert('message', 'Message cannot be blank').notEmpty()
  req.sanitize('email').normalizeEmail({ remove_dots: false })

  var errors = req.validationErrors()

  if (errors) {
    return res.status(400).send(errors)
  }

  var mailOptions = {
    from: req.body.name + ' ' + '<' + req.body.email + '>',
    to: 'matt.a.elphy@gmail.com',
    subject: '✔ Contact Form | Manapot',
    text: req.body.message
  }

  transporter.sendMail(mailOptions, function (err) {
    if (err) return res.status(500).send(err)
    res.send({ msg: 'Thank you! Your feedback has been submitted.' })
  })
}

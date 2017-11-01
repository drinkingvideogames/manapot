const FormData = require('form-data')
const axios = require('axios')
const schemas = require('../../models/schemas/components')
const siteUrl = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || '3000'}`

function createComponentAssetMiddleware () {
  return function componentAssetMiddleware (req, res, next) {
    const authorizationHeader = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token
    if (req.body.layout && req.body.layout.length) {
      const preparedComponents = req.body.layout.reduce((componentWithFiles, component) => {
        const componentSchema = schemas[component.componentKey]
        const componentFileFields = getComponentFiles(componentSchema, component)
        if (componentFileFields && componentFileFields.length) {
          componentWithFiles.push(Object.assign({}, component, { __files: componentFileFields }))
        }
        return componentWithFiles
      }, [])
      const componentAssetCreates = preparedComponents.map((component) => {
        return new Promise((resolve, reject) => {
          const data = new FormData()
          component.__files.forEach((field) => {
            if (component.state[field] && !component.state[field].file) {
              data.append(field, component.state[field])
            }
          })
          axios(`${siteUrl}/api/asset`, { method: 'POST', headers: { Authorization: `Bearer ${authorizationHeader}` }, data })
            .then((res) => {
              console.log('UPLOADED ASSET')
              resolve(res.data)
            })
            .catch((err) => {
              console.error('FAILED TO UPLOAD ASSET')
              reject(err)
            })
        })
      })
      Promise.all(componentAssetCreates)
        .then((data) => {
          console.log('success!', data)
          next()
        })
        .catch((err) => {
          console.error('FAILED SOMETHING?', err)
          next(err)
        })
    } else {
      next()
    }
  }
}

function getComponentFiles (schema, component) {
  if (schema.state) {
    return Object.keys(schema.state).reduce((fileFields, field) => {
      if (schema.state[field] === 'File') fileFields.push(field)
      return fileFields
    }, [])
  } else {
    return []
  }
}

module.exports = createComponentAssetMiddleware

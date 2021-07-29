const savePhoto = require('./savePhoto/index')
const delPhoto = require('./delPhoto/index')
const selectPhoto = require('./selectPhoto/index')


// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'save':
      return await savePhoto.main(event, context)
    case 'del':
      return await delPhoto.main(event, context)
    case 'select':
      return await selectPhoto.main(event, context)
  }
}

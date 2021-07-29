const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    return await db.collection('photos').where({
      openid: event.userInfo.openId
    }).skip(event.start).limit(event.limit).get()
  } catch {
    return 'databse select fail'
  }
}
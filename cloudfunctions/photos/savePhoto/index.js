const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContent = cloud.getWXContext();
  // 存至云存储
  const tempFilePath = event.tempFilePath;
  let res = await cloud.uploadFile({
    cloudPath: 'photos/' + new Date().getTime() + '.png',
    fileContent: Buffer.from(tempFilePath, 'base64')
  });
  // 数据库与云存储做链接
  const due = new Date();
  const openid = wxContent.OPENID;
  const fileID = res.fileID
  const dbres = await db.collection('photos').add({
    data: {
      openid,
      due,
      fileID
    }
  })
  const _id = dbres._id
  return {
    _id,fileID,openid,due
  }
}
const express = require('express') // 引入express
const bodyParser = require('body-parser')
// 解析带文件上传的表单需要
const formidable = require('formidable')
const app = express() // 实例化express
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/test', (req, res, next) => {
  res.json({ code: '1', message: '操作成功'})
})
app.post('/upload', (req, res, next) => {
  var form = new formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    res.json({ code: '1', message: '操作成功', data: files.file.name })
  })
})
app.post('/upload2', (req, res, next) => {
  res.json({ code: '-1', message: '操作失败' })
})
app.listen('3000', () => {
  console.log('监听端口 3000')
})


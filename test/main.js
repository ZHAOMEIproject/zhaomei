var gm = require('gm')
  , resizeX = 343
  , resizeY = 257

gm('/home/ubuntu/zwj-learn/zhaomei/test/image.jpg')
.blur(30, 20)
.resize(resizeX, resizeY)
.autoOrient()
.write(response, function (err) {

});

// gm('/home/ubuntu/zwj-learn/zhaomei/test/image.jpg')
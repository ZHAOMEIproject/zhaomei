const { createCanvas, loadImage } = require('canvas')

// Draw cat with lime helmet
loadImage('xmind.png').then((image) => {
  ctx.drawImage(image, 100, 50, 1000, 500)
 
  console.log('<img src="' + canvas.toDataURL() + '" />')
    
})


test();
async function test(){
    const canvas = createCanvas(500, 250)
    const ctx = canvas.getContext('2d')
    // Write "Awesome!"
    ctx.font = '30px Impact'
    ctx.fillText('2555!', 50, 100) 

    const ap = await loadImage('xmind.png');

    ctx.drawImage(image, 100, 50, 1000, 500)

    console.log('<img src="' + canvas.toDataURL() + '" />')

}
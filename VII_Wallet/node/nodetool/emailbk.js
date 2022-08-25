
let nodemailer = require("nodemailer")
let setinfo = global.secret;
let transporter = nodemailer.createTransport({
    // host: 'smtp.163.com',
    service: setinfo.email.transporter.service, //邮箱类型 例如service:'163'
    secure: setinfo.email.transporter.secure, //是否使用安全连接，对https协议的
    // port: 465, //qq邮件服务所占用的端口
    auth: {
        user: setinfo.email.transporter.auth.user,//开启SMTP的邮箱，发件人
        pass: setinfo.email.transporter.auth.pass// qq授权码
    }
})

// main()

// async function main(){
//     sendEmail()
// }

async function sendEmail(subject,text){
    let options = {
        from: setinfo.email.from, //发送方
        to: setinfo.email.to,//接收方
        subject: subject,//邮件主题
        text: text,//邮件正文
        //html:'',//html模板
        //附件信息
        /*attachments:[
  			{filename:'',path:'',}
		]*/
    }
    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err);
            // res.send(err)
        } else {
            console.log(info);
            // res.send(info)
        }
    })
}
module.exports = {
    sendEmail
}
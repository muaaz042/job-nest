nodemailer = require("nodemailer");
const speakeasy = require('speakeasy'); 

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "jobnest07@gmail.com",
        pass: "tnbbunwcmcfcgsln",
    },
});

async function sendEmail(receiverEmail) {

    // Generate a secret key with a length of 20 characters 
    const secret = speakeasy.generateSecret({ length: 20 }); 
    // Generate a TOTP code using the secret key 
    const code = speakeasy.totp({ 
        secret: secret.base32, 
        encoding: 'base32'
    }); 

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: `Job-nest <jobnest07@gmail.com>`, // sender address
        to: receiverEmail, // list of receivers
        subject: "Your Jobnest link for verification", // Subject line
        text: `Your verification code is: ${code}`, // plain text body
        html: `<p>Your verification code is: <strong>${code}</strong></p>`, // html body
    });

    return code;
}

module.exports = sendEmail;

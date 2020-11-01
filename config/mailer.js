const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport")

let mailConfig;

if (process.env.ENVIRONMENT === "development") {
    // https://ethereal.email/
    console.log("EMAILER: ", "https://ethereal.email/");
    mailConfig = {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'dale.mante@ethereal.email',
            pass: '23hmEBheZr5PcJwJDq'
        }
    };
    
}
else if (process.env.ENVIRONMENT === "production") {
    // https://signup.sendgrid.com/
    console.log("EMAILER: ", "https://signup.sendgrid.com/");
    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_KEY
        }
    }
    mailConfig = sgTransport(options)
}


module.exports = nodemailer.createTransport(mailConfig);

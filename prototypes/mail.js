const nodemailer = require("nodemailer");

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: 'aspmx.l.google.com',
  port: 587,
  secure: false, // use SSL
  auth: {
    user: 'princeadigwe29@gmail.com',
    pass: '23618421pP;',
  }
});

const mailOptions = {
    from: 'princeadigwe29@gmail.com', // sender address
    to: 'themanprvnce@example.com', // list of receivers
    subject: 'Hello from Node.js!', // Subject line
    text: 'Hello, this is a test email sent from Node.js!', // plain text body
    // You can also use HTML format:
    // html: '<b>Hello, this is a test email sent from Node.js!</b>'
};

//send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error occurred:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});
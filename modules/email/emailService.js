const transporter =
require("./smtpProvider");

async function sendEmail({

    to,

    replyTo,

    subject,

    text,

    html

}){

    return transporter.sendMail({

        from:
            process.env.EMAIL_FROM,

        to,

        replyTo,

        subject,

        text,

        html

    });

}

module.exports={

    sendEmail

};

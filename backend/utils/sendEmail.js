const nodemailer = require("nodemailer");

async function sendEmailWithAttachment(to, subject, text, attachmentPath) {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: `"Event Booking" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        attachments: [
            {
                filename: "ticket.pdf",
                path: attachmentPath
            }
        ]
    });
}

module.exports = sendEmailWithAttachment;

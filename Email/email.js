const path = require('path');
const AWS = require('aws-sdk');
const Email = require('email-templates');
const handlebars = require('handlebars') //We are using handlebars for email templates

const email = new Email();

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: SESAccessKeyId,
  secretAccessKey: SESSecretAccessKey,
});

const companyName = 'Company Name';
const senderEmail = 'company@company.co'; //You need to verify this email in AWS SES
const templateDir = path.resolve(__dirname + '/templates')

const SES = new AWS.SES();

const sendSESEMail = (email, html, text, subject, replyTo, callback) => {
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: html,
        },
        Text: {
          Charset: 'UTF-8',
          Data: text,
        },
      },
    },
    Source: `"${companyName}" <${senderEmail}>`,
    ReplyToAddresses: replyTo
  };
  SES.sendEmail(params, (error, result) => {
    if (error) {
      return callback(error, null);
    }
    return callback(null, result);
  });
}

const sendEmail = async (receiverEmail, subject, templateName, templateData) => {

  return new Promise((resolve, reject) => {
    Promise
      .all([
        email.render(`${templateDir}/${templateName}/html.hbs`, templateData),
        email.render(`${templateDir}/${templateName}/text.hbs`, templateData)
      ])
      .then(([ html, text ]) => {
        const replyTo = [];

        sendSESEMail(receiverEmail, html, text, subject, replyTo, (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        });
      })
      .catch((error) => {
        reject(error)
      });
  });
}


const templateData = {
  name: 'Jon Doe',
  companyName
};

const receiverEmail = 'jondoe@gmail.com'

const initializeEmail = async () => {
  try {
    const result = await sendEmail(receiverEmail, `Welcome to ${companyName}`, 'welcome', templateData);
    console.log({result})
  } catch (error) {
    console.log({error});
  }
}

initializeEmail();
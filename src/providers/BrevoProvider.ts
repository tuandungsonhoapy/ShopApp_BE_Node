import SibApiV3Sdk from '@getbrevo/brevo'
import { env } from '~/configs/enviroment.js'

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, env.BREVO_API_KEY || '')

const sendEmail = async (recipientEmail: string, customSubject: string, htmlContent: string) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

  sendSmtpEmail.sender = {
    name: env.ADMIN_EMAIL_NAME,
    email: env.ADMIN_EMAIL_ADDRESS
  }

  sendSmtpEmail.to = [{ email: recipientEmail }]

  sendSmtpEmail.subject = customSubject

  sendSmtpEmail.htmlContent = htmlContent

  // * Send email
  try {
    return await apiInstance.sendTransacEmail(sendSmtpEmail)
  } catch (error) {
    console.error(error)
  }
}

export const BrevoProvider = {
  sendEmail
}

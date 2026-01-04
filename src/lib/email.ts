import emailjs from '@emailjs/browser'

type MessagePayload = {
  name: string
  email: string
  message: string
}

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export const sendMessage = async (payload: MessagePayload) => {
  if (!serviceId || !templateId || !publicKey) {
    throw new Error('EmailJS environment variables are missing')
  }

  await emailjs.send(serviceId, templateId, payload, publicKey)
}


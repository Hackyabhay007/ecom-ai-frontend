import Medusa from "@medusajs/medusa-js"

const medusaClient = new Medusa({ 
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL, 
  maxRetries: 3 
})

if (process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
  medusaClient.setPublishableKey(process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY)
}

export default medusaClient

import Stripe from 'stripe'

//Initiate the stripe
export const stripe = new Stripe(process.env.STRIPE_API_KEY as string)

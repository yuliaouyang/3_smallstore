import Stripe from "stripe"
import '../../../envConfig.js'

const API_KEY = process.env.STRIPE_SECRET_KEY
const stripe = new Stripe(API_KEY)

export async function GET() {
    try {
        // fetch all the active products from stripe
        const products = await stripe.products.list({ active: true })

        // fetch all the prices that are active
        const prices = await stripe.prices.list({ active: true })

        // combine the products and their associated prices
        const combinedData = products.data.map((product) => {
            const productPrices = prices.data.filter((price) => {
                return price.product === product.id
                /**选出 price 这个价格对象所对应的 product, 刚好等于当前正在处理的 product.id */ 
                /** Select the price object whose associated product matches the current product's id */

            })

            return {
                ...product,
                prices: productPrices.map((price) => {
                    return {
                        id: price.id,
                        unit_amount: price.unit_amount,
                        currency: price.currency,
                        recurring: price.recurring
                    }
                })
            }
        })


        // send the combined data as json
        return Response.json(combinedData)

    } catch (err) {
        console.error('Error fetching data from stripe: ', err.message)
        return Response.json({ error: 'Failed to fetch data from stripe' })
    }
}


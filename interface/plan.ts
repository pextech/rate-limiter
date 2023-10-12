export enum PLANS {
    FREEMIUM = "FREEMIUM",
    PREMIUM = "PREMIUM",
    PRO = "PRO"
}

export const overallRateLimit = 100

export const defaultPlans = [
    {
        name: PLANS.FREEMIUM,
        price: 0,
        requestPerMinute: 5,
        requestPerSecond: 1,
        monthlyRequests: 43200
    },
    {
        name: PLANS.PREMIUM,
        price: 2000,
        requestPerSecond: 2,
        requestPerMinute: 10,
        monthlyRequests: 86400
    }
]
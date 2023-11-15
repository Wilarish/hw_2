export type RateLimitType = {
    limit: [{IP: string,
            URL: string,
            date: Date}]
}
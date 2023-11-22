import mongoose from "mongoose";

export type RateLimitType = {
    IP: string,
    URL: string,
    date: Date
}

export const RateLimitSchema = new mongoose.Schema<RateLimitType>({
    IP: String,
    URL: String,
    date: Date
})
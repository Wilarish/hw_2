import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";
import {RateLimitType} from "../../types/rateLimit-types";
import {RateLimitModel} from "../../domain/models/models";

export const rateLimit = async (req: Request, res: Response, next: NextFunction) => {

    if (req.ip) {
        const rate: RateLimitType = new RateLimitType(
            req.ip,
            req.url,
            new Date())
        await RateLimitModel.insertMany(rate)
    }


    let currentDate = new Date();
    let tenSecondsAgo = new Date(currentDate.getTime() - 10000);

    const requests = await RateLimitModel.find({
        date: {$lt: currentDate, $gt: tenSecondsAgo},
        IP: req.ip,
        URL: req.url
    }).lean()
    if (requests.length > 5) return res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS_429)
    return next()

}
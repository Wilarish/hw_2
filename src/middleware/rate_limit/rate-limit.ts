import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";
import {RateLimitType} from "../../types/rateLimit-types";
import {RAteLimitModel} from "../../data/DB";

export const rateLimit = async (req: Request, res: Response, next: NextFunction) => {

    //let userIp = req.headers['x-forwarded-for'] || [req.socket.remoteAddress]
    if (req.ip) {
        const rate: RateLimitType = {
            IP: req.ip,
            URL: req.url,
            date: new Date()
        }
        await RAteLimitModel.insertMany(rate)
    }


    let currentDate = new Date();
    let tenSecondsAgo = new Date(currentDate.getTime() - 10000);

    const requests = await RAteLimitModel.find({
        date: {$lt: currentDate, $gt: tenSecondsAgo},
        IP: req.ip,
        URL: req.url
    }).lean()
    if (requests.length > 5) return res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS_429)
    return next()

}
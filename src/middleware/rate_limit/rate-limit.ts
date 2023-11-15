import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../data/HTTP_STATUSES";
import {rateLimit_db} from "../../data/DB";
import {RateLimitType} from "../../types/rateLimit-types";

export const rateLimit = async (req: Request, res: Response, next: NextFunction) => {

    let userIp = req.headers['x-forwarded-for'] || [req.socket.remoteAddress]
    if (req.ip) {
        const rate: RateLimitType = {
            IP: req.ip,
            URL: req.url,
            date: new Date()
        }
        await rateLimit_db.insertOne(rate)
    }




    let currentDate = new Date();
    let tenSecondsAgo = new Date(currentDate.getTime() - 10000);

    const requests = await rateLimit_db.find({
        date: {$lt: currentDate, $gt: tenSecondsAgo},
        IP: req.ip,
        URL: req.url
    }).toArray()
    if (requests.length > 5) return res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS_429)
    return next()

}
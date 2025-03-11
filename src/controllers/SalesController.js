/**
 * 
 */
import { validationResult, matchedData } from 'express-validator';
import { Sales } from '../models/Sales.js';
export default class SalesController {
    constructor() { }

    static async leaderboard(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(({ msg }) => msg);
                throw {
                    code: 400,
                    errors: errorMessages
                }
            }
            const queryParameters = matchedData(req, { locations: ['query'] });
            let timestamp;
            if (queryParameters.from && queryParameters.to) {
                timestamp = {
                    $gte: queryParameters.from,
                    $lte: queryParameters.to
                }
            } else if (queryParameters.from && !queryParameters.to) {
                timestamp = {
                    $gte: queryParameters.from
                }
            } else if (!queryParameters.from && queryParameters.to) {
                timestamp = {
                    $lte: queryParameters.to
                }
            } else {
                timestamp = {
                    $lte: new Date()
                }
            }
            const leaderboard = await Sales.getLeaderboard(timestamp);
            res.status(200).json({
                success: true,
                data: leaderboard
            });
        } catch (e) {
            res.status(500).json({
                success: false,
                errors: e.errors || ['Unable to get leaderboard']
            });
        }
    }


    static async leaderboardByCustomer(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(({ msg }) => msg);
                throw {
                    code: 400,
                    errors: errorMessages
                }
            }
            const queryParameters = matchedData(req);
            let timestamp;
            if (queryParameters.from && queryParameters.to) {
                timestamp = {
                    $gte: queryParameters.from,
                    $lte: queryParameters.to
                }
            } else if (queryParameters.from && !queryParameters.to) {
                timestamp = {
                    $gte: queryParameters.from
                }
            } else if (!queryParameters.from && queryParameters.to) {
                timestamp = {
                    $lte: queryParameters.to
                }
            } else {
                timestamp = {
                    $lte: new Date()
                }
            }

            const leaderboard = await Sales.getLeaderboard(timestamp, queryParameters.id, undefined);

            res.status(200).json({
                success: true,
                data: leaderboard
            });
        } catch (e) {
            res.status(500).json({
                success: false,
                errors: e.errors || ['Unable to get leaderboard']
            });
        }
    }

    static async leaderboardByProduct(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(({ msg }) => msg);
                throw {
                    code: 400,
                    errors: errorMessages
                }
            }
            const queryParameters = matchedData(req);
            let timestamp;
            if (queryParameters.from && queryParameters.to) {
                timestamp = {
                    $gte: queryParameters.from,
                    $lte: queryParameters.to
                }
            } else if (queryParameters.from && !queryParameters.to) {
                timestamp = {
                    $gte: queryParameters.from
                }
            } else if (!queryParameters.from && queryParameters.to) {
                timestamp = {
                    $lte: queryParameters.to
                }
            } else {
                timestamp = {
                    $lte: new Date()
                }
            }

            const leaderboard = await Sales.getLeaderboard(timestamp, undefined,queryParameters.id);

            res.status(200).json({
                success: true,
                data: leaderboard
            });
        } catch (e) {
            res.status(500).json({
                success: false,
                errors: e.errors || ['Unable to get leaderboard']
            });
        }
    }

    // static async salesCart(req, res) {}

    // static async salesHistory(req, res) {}

    // static async salesDetails(req, res) {}

    // static async newSales(req, res) {}
}
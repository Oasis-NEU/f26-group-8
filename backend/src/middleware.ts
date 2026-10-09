import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export type TokenPayload = {username: string}

//I'm not confident explaining this but what I know that it creates a new request type for express
 declare global {
      namespace Express {
          interface Request {
              user?: TokenPayload
          }
      }
  }

export function authenticateToken(req: Request, res: Response, next: NextFunction ) {
    const authHeader = req.get('Authorization')
    const token = authHeader && authHeader.split(' ')[1];
    //only runs the split function if authHeader exists which prevents errors
    //We must split the header because it is in the form of Bearer: token

    if (!token) {
        return res.status(401).json({error: "Token doesn't exist"})
    }

    const key = process.env.JWT_KEY
    if (!key) {
        return res.status(500).json({error: "Token Key does not exist"})
    }

    jwt.verify(token, key, (err, decoded) => {
        if (err) {
            return res.status(403).json({error: "Invalid Token"})}
        req.user = decoded as TokenPayload
        next()
    })
    }

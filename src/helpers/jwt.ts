import jwt from 'jsonwebtoken';

const secret = process.env.SECRET_JWT || undefined;

export function signToken(payload: object) {
    if (secret === undefined) {
        throw new Error("Secret key is not defined");
    } else {
        return jwt.sign(payload, secret, { expiresIn: "15m", });
    }
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, secret || "");
    } catch (err) {
        return null;
    }
}
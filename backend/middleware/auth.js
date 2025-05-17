import jwt from "jsonwebtoken";

export async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.status(401).send({ message: "No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = { id: decoded.id };
        next();
        return req.user;
    } catch (error) {
        console.log(error);
        return res.status(403).send({ message: "Token has already expired" });
    }
}

import jwt from "jsonwebtoken";
import prisma from "../client";
import bcrypt from "bcrypt";
import "dotenv/config";

export async function employeeLogin(req, res) {
    const { user } = req.body;

    const fetchedUser = await prisma.user.findUnique({
        where: {
            username: user.username,
        },
    });

    if (fetchedUser === null || !fetchedUser) {
        return res.status(404).send({ message: "User cannot be found" });
    }

    if (fetchedUser.isActive === false) {
        return res
            .status(403)
            .send({ message: "Cannot login with a deactivate account" });
    }

    if (fetchedUser.roleId === 1) {
        return res.status(403).send({
            message:
                "Attempted to perform an employee login with a non-employee account",
        });
    }

    return await login(req, res);
}

export async function adminLogin(req, res) {
    const { user } = req.body;

    const fetchedUser = await prisma.user.findUnique({
        where: {
            username: user.username,
        },
    });

    if (fetchedUser === null || !fetchedUser) {
        return res.status(404).send({ message: "User cannot be found" });
    }

    if (fetchedUser.isActive === false) {
        return res
            .status(403)
            .send({ message: "Cannot login with a deactivate account" });
    }

    if (fetchedUser.roleId === 2) {
        return res.status(403).send({
            message:
                "Attempted to perform an admin login with a non-admin account",
        });
    }

    return await login(req, res);
}

export async function login(req, res) {
    const { user } = req.body;

    try {
        const fetchedUser = await prisma.user.findUnique({
            where: {
                username: user.username,
            },
        });

        const isPasswordCorrect = bcrypt.compareSync(
            user.password,
            fetchedUser.password
        );

        if (!isPasswordCorrect) {
            return res.status(401);
        }

        const accessToken = jwt.sign(
            { id: fetchedUser.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "12h" }
        );

        res.json({ accessToken: accessToken });
        res.status(200);
        return { accessToken: accessToken };
    } catch (error) {
        console.log(error);
        return res.status(500);
    }
}

export async function logout(req, res) {}

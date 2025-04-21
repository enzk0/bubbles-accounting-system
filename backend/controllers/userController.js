import prisma from "../client";
import bcrypt from "bcrypt";

const saltRounds = 10;

export async function createUser(req, res) {
    const { userInformation } = req.body;

    if (!userInformation.name || !userInformation.password) {
        return res.status(422);
    }

    const hashedPassword = bcrypt.hashSync(
        userInformation.password,
        saltRounds
    );

    try {
        const user = await prisma.user.create({
            data: { ...userInformation, password: hashedPassword },
        });

        res.status(201);
        return user;
    } catch (error) {
        return res.status(500);
    }
}

export async function deleteUser(req, res) {
    const { userInformation } = req.body;

    try {
        const user = await prisma.user.delete({
            where: {
                name: userInformation.name,
            },
        });

        res.status(200);
        return user;
    } catch (error) {
        return res.status(500);
    }
}

import prisma from "../client";
import bcrypt from "bcrypt";

const saltRounds = 10;

export async function createUser(req, res) {
    const { user } = req.body;

    if (!user.name || !user.password) {
        return res.status(422);
    }

    const hash = bcrypt.hashSync(user.password, saltRounds);

    try {
        const created = await prisma.user.create({
            data: { ...user, password: hash },
        });

        res.status(201);
        return created;
    } catch (error) {
        return res.status(500);
    }
}

export async function deleteUser(req, res) {
    const { user } = req.body;

    try {
        const deleted = await prisma.user.delete({
            where: {
                name: user.name,
            },
        });

        res.status(200);
        return deleted;
    } catch (error) {
        return res.status(500);
    }
}

export async function changePassword(req, res) {
    const { user, newPassword } = req.body;

    if (!user.name || !newPassword) {
        return res.status(422);
    }

    const hash = bcrypt.hashSync(newPassword, saltRounds);

    try {
        const updated = await prisma.user.update({
            where: {
                name: user.name,
            },
            data: {
                password: hash,
            },
        });

        res.status(200);
        return updated;
    } catch (error) {
        return res.status(500);
    }
}

export async function assignRole(req, res) {
    const { user, role } = req.body;

    try {
        const updated = await prisma.user.update({
            where: {
                id: user.name,
            },
            data: {
                role: {
                    connect: {
                        id: role.id,
                    },
                },
            },
        });

        res.status(200);
        return updated;
    } catch (error) {
        return res.status(500);
    }
}

export async function getUser(req, res) {
    const { user } = req.body;

    try {
        const found = await prisma.user.findUnique({
            where: user,
        });

        if (!found || found === null) {
            res.status(404);
            return found;
        }

        res.status(200);
        res.json(found);
        return found;
    } catch (error) {
        return res.status(500);
    }
}

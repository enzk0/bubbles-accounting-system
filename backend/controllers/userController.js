import prisma from "../client";
import bcrypt from "bcrypt";

const saltRounds = 10;

export async function createUser(req, res) {
    const { user } = req.body;

    if (!user.username || !user.password || !user.firstName || !user.lastName) {
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
                username: user.username,
            },
        });

        res.status(200);
        return deleted;
    } catch (error) {
        return res.status(500);
    }
}

export async function editUser(req, res) {
    const { user, edit } = req.body;

    if (!edit.username || !edit.firstName || !edit.lastName) {
        return res.status(422);
    }

    try {
        const found = await prisma.user.findUnique({
            where: {
                username: user.username,
            },
        });

        if (found === null) {
            return res.status(404);
        }

        const updated = await prisma.user.update({
            where: {
                username: user.username,
            },
            data: user,
        });

        res.status(200);
        return updated;
    } catch (error) {
        console.log(error);
        return res.status(500);
    }
}

export async function editPassword(req, res) {
    const { user, newPassword } = req.body;

    if (!user.username || !newPassword) {
        return res.status(422);
    }

    try {
        const hash = bcrypt.hashSync(newPassword, saltRounds);
        const updated = await prisma.user.update({
            where: {
                username: user.username,
            },
            data: {
                password: hash,
            },
        });

        res.status(200);
        return updated;
    } catch (error) {
        console.log(error);
        return res.status(500);
    }
}

export async function assignRole(req, res) {
    const { user, role } = req.body;

    try {
        const updated = await prisma.user.update({
            where: {
                username: user.username,
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
        console.log("assignRole() error: ", error);
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

export async function getAllUsers(req, res) {
    try {
        const found = await prisma.user.findMany();

        if (found.length === 0) {
            res.status(404);
            res.json({
                users: found,
            });
            return found;
        }

        res.status(200);
        res.json({
            users: found,
        });
        return found;
    } catch (error) {
        return res.status(500);
    }
}

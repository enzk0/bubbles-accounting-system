import { Prisma } from "@prisma/client";
import prisma from "../client.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

export async function createUser(req, res) {
    const { user } = req.body;

    if (!user.username || !user.password || !user.firstName || !user.lastName) {
        return res.status(422).send({
            message:
                "Information provided to make a user is incomplete or invalid",
        });
    }

    const hash = bcrypt.hashSync(user.password, saltRounds);

    try {
        const created = await prisma.user.create({
            data: { ...user, password: hash },
        });

        res.status(201).send({ message: "User has been successfully created" });
        return created;
    } catch (error) {
        return res.status(500).send({
            message: "An error has occurred with the database client",
            error: error,
        });
    }
}

export async function deactivateUser(req, res) {
    const { id: rawId } = req.params;
    const id = parseInt(rawId);

    try {
        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: {
                isActive: false,
            },
        });

        res.status(200).send({
            message: `User with id ${updatedUser.id} has been successfully deactivated`,
        });
        return updatedUser;
    } catch (error) {
        console.log(error);
        if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
            return res.status(500).send({
                message: "An error with the database client has occurred",
                error: error,
            });
        }
        if (error.code === "P2025") {
            return res.status(404).send({
                message: "The user to be deactivated cannot be found",
                error: error,
            });
        }
    }
}

export async function editUser(req, res) {
    const { id: rawId } = req.params;
    const { username, firstName, lastName, roleId, branchId } = req.body;

    const id = parseInt(rawId);

    if (!username || !firstName || !lastName) {
        return res.status(422).send({
            message: "Update values for certain user fields are invalid",
        });
    }

    try {
        if (roleId && branchId) {
            await prisma.user.update({
                where: { id: id },
                data: {
                    role: {
                        connect: { id: roleId },
                    },
                    branch: {
                        connect: { id: branchId },
                    },
                },
            });
        }

        const updated = await prisma.user.update({
            where: { id: id },
            data: {
                username: username,
                firstName: firstName,
                lastName: lastName,
            },
        });

        res.status(200).send({
            message: `User with id ${updated.id} has been updated successfully`,
        });
        return updated;
    } catch (error) {
        console.log(error);
        if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
            return res.status(500).send({
                message: "An error with the database client has occurred",
                error: error,
            });
        }
        if (error.code === "P2025") {
            return res.status(404).send({
                message: "The user to be updated cannot be found",
                error: error,
            });
        }
    }
}

export async function editPassword(req, res) {
    const { user, newPassword } = req.body;

    if (!(!user.id || !user.username) || !newPassword) {
        return res.status(422).send({
            message: "The  new password fields are invalid",
        });
    }

    try {
        const hash = bcrypt.hashSync(newPassword, saltRounds);
        const updated = await prisma.user.update({
            where: user,
            data: {
                password: hash,
            },
        });

        res.status(200).send({
            message: "The user's password has been successfully updated",
        });
        return updated;
    } catch (error) {
        console.log(error);
        if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
            return res.status(500).send({
                message: "An error with the database client has occurred",
                error: error,
            });
        }
        if (error.code === "P2025") {
            return res.status(404).send({
                message:
                    "The user whose password is to be updated cannot be found",
                error: error,
            });
        }
    }
}

export async function getUser(req, res) {
    const { id: rawId } = req.params;
    const id = parseInt(rawId);

    if (!id) {
        res.status(422).send({ message: "User id provided is invalid" });
    }

    try {
        const found = await prisma.user.findUnique({
            where: { id: id },
        });

        if (!found || found === null) {
            res.status(404).send({ message: "User not found" });
            return found;
        }

        res.status(200);
        res.json(found);
        return found;
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error with the database client has occurred",
            error: error,
        });
    }
}

export async function getAllUsers(req, res) {
    const { isActive, branchId } = req.query;

    let filter = {};

    if (isActive !== undefined) {
        filter.isActive = isActive === "true";
    }

    if (branchId !== undefined && Number(branchId) !== NaN) {
        filter.branchId = parseInt(branchId);
    }

    try {
        const found = await prisma.user.findMany({
            where: filter,
        });

        if (found.length === 0) {
            res.status(404).send({
                message: "No users can be found in the database",
            });
            res.json({
                users: found,
            });
            return found;
        }

        res.status(200);
        res.json(found);
        return found;
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error has occurred with the database client",
            error: error,
        });
    }
}

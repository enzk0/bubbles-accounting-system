import { Prisma } from "@prisma/client";
import prisma from "../client";

export async function createBranch(req, res) {
    const { requester, branch } = req.body;

    if (!branch.code || !branch.name || !branch.address) {
        return res.status(422).send({
            message:
                "The information provided to create a branch is incomplete",
        });
    }

    try {
        const newBranch = await prisma.branch.create({
            data: branch,
        });

        res.status(201).send({
            message: "Branch has been successfully created",
        });
        return newBranch;
    } catch (error) {
        console.log(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return res.status(500).send({
                    message:
                        "Attempted to create a branch with non-unique values on unique constraint fields",
                    error: error,
                });
            }
        }
        return res.status(500).send({
            message: "An error has occurred with the database client",
            error: error,
        });
    }
}

export async function getBranch(req, res) {
    const { requester, branch } = req.body;

    try {
        if (branch.id === null || branch.id === undefined || branch.id < 1) {
            return res
                .status(422)
                .send({ message: "A branchId was not provided" });
        }

        const foundBranch = await prisma.branch.findUnique({
            where: {
                id: branch.id,
            },
        });

        if (!foundBranch || foundBranch == null) {
            return res.status(404).send({ message: "Branch not found" });
        }

        res.status(200);
        res.json(foundBranch);
        return foundBranch;
    } catch (error) {
        console.log(error);
        return res.status(500);
    }
}

export async function getAllBranches(req, res) {
    const { requester, filter } = req.body;

    try {
        const foundBranches = await prisma.branch.findMany({ where: filter });

        if (foundBranches.length === 0) {
            res.json([]);
            return res
                .status(404)
                .send({ message: "No branches can be found in the database" });
        }

        res.status(200);
        res.json(foundBranches);
        return foundBranches;
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error has occurred with the database client",
            error: error,
        });
    }
}

export async function editBranch(req, res) {
    const { requester, branch, edit } = req.body;

    if (!edit.name || !edit.address) {
        return res
            .status(422)
            .send({ message: "Branch new name or new address is not valid" });
    }

    try {
        const editedBranch = await prisma.branch.update({
            where: {
                id: branch.id,
            },
            data: edit,
        });

        res.status(200).send({
            message: `Branch with id of ${branch.id} has been successfully updated`,
        });
        return editedBranch;
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error has occurred with the database client",
            error: error,
        });
    }
}

export async function deactivateBranch(req, res) {
    const { requester, branch } = req.body;

    if (branch.id === null || branch.id == undefined || branch.id < 1) {
        return res.status(422).send({
            message:
                "Branch id provided is invalid because it is null, undefined, or < 1",
        });
    }

    try {
        const updatedBranch = prisma.branch.update({
            where: {
                id: branch.id,
            },
            data: {
                isActive: false,
            },
        });

        res.status(200).send({
            message: `Branch with id of ${branch.id} has been successfully deactivated`,
        });
        return updatedBranch;
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .send({
                message: "An error has occured with the database client",
                error: error,
            });
    }
}

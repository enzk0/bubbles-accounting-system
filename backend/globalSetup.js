import prisma from "./client";
import bcrypt from "bcrypt";

export async function setup() {
    const users = await prisma.user.findMany();

    for (const user of users) {
        const hash = bcrypt.hashSync(user.password, 10);

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hash,
            },
        });
    }
}

export async function teardown() {
    const users = await prisma.user.findMany();

    for (const user of users) {
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: "password",
            },
        });
    }
}

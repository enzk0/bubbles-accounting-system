import prisma from "../client";

export function checkPrivilege(privileges) {
    return async (req, res, next) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.body.requester.id,
                },
                include: {
                    role: {
                        include: {
                            privileges: true,
                        },
                    },
                },
            });

            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }

            const hasPrivilege = privileges.every((required) =>
                user.role.privileges.some(
                    (privilege) => privilege.name === required
                )
            );

            if (!hasPrivilege) {
                return res.status(403).send({
                    message: "User does not have required privileges",
                });
            }

            next();
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                message: "An error has occurred with the database client",
                error: error,
            });
        }
    };
}

import { PrismaClient } from "@prisma/client";
import "dotenv/config";

async function seed() {
    if (
        process.env.DATABASE_URL !==
        "postgresql://prisma:prisma@localhost:5433/tests?schema=public"
    ) {
        console.log("Cannot seed in a non-testing database.");
        return;
    }

    const prisma = new PrismaClient();

    await prisma.jobOrderItem.deleteMany();
    await prisma.jobOrder.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();
    await prisma.privilege.deleteMany();
    await prisma.role.deleteMany();
    await prisma.product.deleteMany();
    await prisma.branch.deleteMany();

    await prisma.$queryRaw`ALTER SEQUENCE "Branch_id_seq" RESTART WITH 1`;
    await prisma.$queryRaw`ALTER SEQUENCE "Product_id_seq" RESTART WITH 1`;
    await prisma.$queryRaw`ALTER SEQUENCE "Privilege_id_seq" RESTART WITH 1`;
    await prisma.$queryRaw`ALTER SEQUENCE "Role_id_seq" RESTART WITH 1`;
    await prisma.$queryRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`;
    await prisma.$queryRaw`ALTER SEQUENCE "Customer_id_seq" RESTART WITH 1`;
    await prisma.$queryRaw`ALTER SEQUENCE "JobOrderItem_id_seq" RESTART WITH 1`;

    await prisma.branch.createMany({
        data: [
            {
                code: "AB",
                name: "Abracadabra",
                address: "Somewhere City",
            },
            {
                code: "CD",
                name: "Cordova",
                address: "Nowhere Street",
            },
            {
                code: "EF",
                name: "Efferessence",
                address: "Everywhere Alley",
            },
            {
                code: "GH",
                name: "Ghotta",
                address: "Out-Of-Nowhere Boulevard",
            },
            {
                code: "IJ",
                name: "Ijerag",
                address: "Anywhere Avenue",
            },
            {
                code: "KL",
                name: "Klariso",
                address: "Anytime Region",
            },
            {
                code: "NO",
                name: "Noberton",
                address: "Dazzling Town",
            },
        ],
    });

    await prisma.product.createMany({
        data: [
            {
                name: "WASH",
                price: 60.0,
            },
            {
                name: "DRY",
                price: 70.0,
            },
            {
                name: "DETERGENT",
                price: 15.0,
            },
            {
                name: "FABCON",
                price: 15.0,
            },
            {
                name: "LOAD",
                price: 20.0,
            },
            {
                name: "FOLD",
                price: 20.0,
            },
            {
                name: "DROPOFF",
                price: 180.0,
            },
        ],
    });

    await prisma.privilege.createMany({
        data: [
            {
                name: "admin",
                description:
                    "The admin privilege gives full-access to the system",
            },
            {
                name: "employee",
                description:
                    "The employee privilege gives partial-access to the system",
            },
        ],
    });

    await prisma.role.createMany({
        data: [
            {
                name: "admin",
                description:
                    "The admin role is a role assigned to the administrators of the system",
            },
            {
                name: "employee",
                description:
                    "The employee role is a roles assigned to the employees/operators of the business",
            },
        ],
    });

    await prisma.role.update({
        where: {
            id: 1,
        },
        data: {
            privileges: {
                connect: { id: 1 },
            },
        },
    });

    await prisma.role.update({
        where: {
            id: 2,
        },
        data: {
            privileges: {
                connect: { id: 2 },
            },
        },
    });

    await prisma.user.createMany({
        data: [
            {
                username: "cinderella",
                firstName: "Cinderella",
                lastName: "Grimms",
                password: "password",
                branchId: 1,
            },
            {
                username: "snow_white",
                firstName: "Snow White",
                lastName: "Grimms",
                password: "password",
                branchId: 1,
            },
            {
                username: "dorothy",
                firstName: "Dorothy",
                lastName: "Grimms",
                password: "password",
                branchId: 7,
            },
            {
                username: "rapunzel",
                firstName: "Rapunzel",
                lastName: "Grimms",
                password: "password",
                branchId: 4,
            },
            {
                username: "little_mermaid",
                firstName: "Siren",
                lastName: "Grimms",
                password: "password",
                branchId: 3,
            },
            {
                username: "hansel",
                firstName: "Hansel",
                lastName: "Grimms",
                password: "password",
                branchId: 2,
            },
            {
                username: "gretel",
                firstName: "Gretel",
                lastName: "Grimms",
                password: "password",
                branchId: 2,
            },
        ],
    });

    const employee_names = [
        "cinderella",
        "snow_white",
        "dorothy",
        "rapunzel",
        "little_mermaid",
        "hansel",
        "gretel",
    ];

    for (const employee_name of employee_names) {
        await prisma.user.update({
            where: {
                username: employee_name,
            },
            data: {
                role: {
                    connect: { id: 2 },
                },
            },
        });
    }

    console.log(
        await prisma.user.findMany({
            where: {
                roleId: 2,
            },
            include: {
                role: true,
            },
        })
    );

    await prisma.user.createMany({
        data: [
            {
                username: "grave",
                firstName: "Grave",
                firstName: "Grimms",
                password: "password",
            },
            {
                username: "andersen",
                firstName: "Andersen",
                firstName: "Central",
                password: "password",
            },
            {
                username: "lilith",
                firstName: "Lilith",
                firstName: "Goddess",
                password: "password",
            },
        ],
    });

    const admin_names = ["grave", "andersen", "lilith"];

    for (const admin_name of admin_names) {
        await prisma.user.update({
            where: {
                username: admin_name,
            },
            data: {
                role: {
                    connect: { id: 1 },
                },
            },
        });
    }

    console.log(
        await prisma.user.findMany({
            where: {
                role: {
                    name: "ADMIN",
                },
            },
            include: {
                role: true,
            },
        })
    );

    const job_order_items = [
        [
            { id: 1, quantity: 0 },
            { id: 2, quantity: 0 },
            { id: 3, quantity: 0 },
            { id: 4, quantity: 0 },
            { id: 5, quantity: 0 },
            { id: 6, quantity: 0 },
            { id: 7, quantity: 1 },
        ],
        [
            { id: 1, quantity: 1 },
            { id: 2, quantity: 0 },
            { id: 3, quantity: 1 },
            { id: 4, quantity: 1 },
            { id: 5, quantity: 1 },
            { id: 6, quantity: 1 },
            { id: 7, quantity: 0 },
        ],
        [
            { id: 1, quantity: 1 },
            { id: 2, quantity: 2 },
            { id: 3, quantity: 1 },
            { id: 4, quantity: 1 },
            { id: 5, quantity: 1 },
            { id: 6, quantity: 0 },
            { id: 7, quantity: 0 },
        ],
        [
            { id: 1, quantity: 1 },
            { id: 2, quantity: 1 },
            { id: 3, quantity: 0 },
            { id: 4, quantity: 0 },
            { id: 5, quantity: 0 },
            { id: 6, quantity: 1 },
            { id: 7, quantity: 0 },
        ],
        [
            { id: 1, quantity: 1 },
            { id: 2, quantity: 1 },
            { id: 3, quantity: 0 },
            { id: 4, quantity: 0 },
            { id: 5, quantity: 0 },
            { id: 6, quantity: 0 },
            { id: 7, quantity: 0 },
        ],
    ];

    const job_order_branches = ["AB", "AB", "CD", "EF", "GH"];

    const job_order_customers = [
        {
            firstName: "Rapi",
            lastName: "Elysion",
            address: "Outpost",
            phoneNumber: "9XX-XXX-XXXX",
        },
        {
            firstName: "Anis",
            lastName: "Tetra",
            address: "Outpost",
            phoneNumber: "9XX-XXX-XXXX",
        },
        {
            firstName: "Neon",
            lastName: "Elysion",
            address: "Outpost",
            phoneNumber: "9XX-XXX-XXXX",
        },
        {
            firstName: "Eunhwa",
            lastName: "Elysion",
            address: "Outpost",
            phoneNumber: "9XX-XXX-XXXX",
        },
        {
            firstName: "Alice",
            lastName: "Tetra",
            address: "Outpost",
            phoneNumber: "9XX-XXX-XXXX",
        },
    ];

    const job_order_employees = [
        "cinderella",
        "snow_white",
        "dorothy",
        "rapunzel",
        "little_mermaid",
    ];

    for (let index = 0; index < 5; index++) {
        let branch = await prisma.branch.findUnique({
            where: {
                code: job_order_branches[index],
            },
        });

        let customer = await prisma.customer.create({
            data: job_order_customers[index],
        });

        let job_order = await prisma.jobOrder.create({
            data: {
                idCode: branch.code,
                idNumber: branch.counter,
                branch: {
                    connect: { id: branch.id },
                },
                customer: {
                    connect: { id: customer.id },
                },
                user: {
                    connect: { id: 1 },
                },
            },
        });

        for (const product_item of job_order_items[index]) {
            const product = await prisma.product.findUnique({
                where: {
                    id: product_item.id,
                },
            });

            const job_order_item = await prisma.jobOrderItem.create({
                data: {
                    productName: product.name,
                    productPrice: product.price,
                    productQuantity: product_item.quantity,
                    product: {
                        connect: { id: product.id },
                    },
                    jobOrder: {
                        connect: {
                            idCode_idNumber: {
                                idCode: job_order.idCode,
                                idNumber: job_order.idNumber,
                            },
                        },
                    },
                },
            });
        }

        await prisma.branch.update({
            where: {
                id: branch.id,
            },
            data: {
                counter: {
                    increment: 1,
                },
            },
        });

        let final_job_order = await prisma.jobOrder.findUnique({
            where: {
                idCode_idNumber: {
                    idCode: job_order.idCode,
                    idNumber: job_order.idNumber,
                },
            },
            include: {
                customer: true,
                jobOrderItems: true,
                branch: true,
                user: true,
            },
        });

        console.log(final_job_order);

        console.log(
            final_job_order.jobOrderItems.reduce((sum, item) => {
                return sum + item.productQuantity * item.productPrice;
            }, 0)
        );
    }

    const allJobOrders = await prisma.jobOrder.findMany({
        where: {
            branchId: 1,
        },
        include: {
            branch: true,
            customer: true,
            user: true,
            jobOrderItems: true,
        },
    });

    console.dir(allJobOrders, { depth: null });
}

seed();

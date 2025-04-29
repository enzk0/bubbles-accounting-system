import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

await prisma.jobOrderItem.deleteMany();
await prisma.jobOrder.deleteMany();
await prisma.customer.deleteMany();
await prisma.user.deleteMany();
await prisma.role.deleteMany();
await prisma.product.deleteMany();
await prisma.branch.deleteMany();

await prisma.$queryRaw`ALTER SEQUENCE "Branch_id_seq" RESTART WITH 1`;
await prisma.$queryRaw`ALTER SEQUENCE "Product_id_seq" RESTART WITH 1`;
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

await prisma.role.createMany({
    data: [
        {
            name: "ADMIN",
            description: "The admin has full-access to the system",
        },
        {
            name: "EMPLOYEE",
            description: "The employee has partial-access to the system",
        },
    ],
});

await prisma.user.createMany({
    data: [
        {
            name: "cinderella",
            password: "password",
        },
        {
            name: "snow_white",
            password: "password",
        },
        {
            name: "dorothy",
            password: "password",
        },
        {
            name: "rapunzel",
            password: "password",
        },
        {
            name: "little_mermaid",
            password: "password",
        },
        {
            name: "hansel",
            password: "password",
        },
        {
            name: "gretel",
            password: "password",
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
            name: employee_name,
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
            name: "grave",
            password: "password",
        },
        {
            name: "andersen",
            password: "password",
        },
        {
            name: "lilith",
            password: "password",
        },
    ],
});

const admin_names = ["grave", "andersen", "lilith"];

for (const admin_name of admin_names) {
    await prisma.user.update({
        where: {
            name: admin_name,
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

const job_order_branches = ["AB", "CD", "EF", "GH", "IJ"];

const job_order_customers = [
    {
        name: "Rapi",
        address: "Outpost",
        contactNo: "9XX-XXX-XXXX",
    },
    {
        name: "Anis",
        address: "Outpost",
        contactNo: "9XX-XXX-XXXX",
    },
    {
        name: "Neon",
        address: "Outpost",
        contactNo: "9XX-XXX-XXXX",
    },
    {
        name: "Eunhwa",
        address: "Outpost",
        contactNo: "9XX-XXX-XXXX",
    },
    {
        name: "Alice",
        address: "Outpost",
        contactNo: "9XX-XXX-XXXX",
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
            employeeInCharge: job_order_employees[index],
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
                JobOrder: {
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

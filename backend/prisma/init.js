import prisma from "../client";

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
        {
            name: "PERFUME",
            price: 50.0,
            isActive: true,
        },
        {
            name: "IRON",
            price: 60.0,
            isActive: false,
        },
    ],
});

await prisma.privilege.createMany({
    data: [
        {
            name: "admin",
            description: "The admin privilege gives full-access to the system",
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
            username: "admin",
            firstName: "Admin",
            lastName: "Admin",
            password: "admin",
            roleId: 1,
        },
        {
            username: "employee_1",
            firstName: "Employee",
            lastName: "Employee",
            password: "employee",
            roleId: 2,
            branchId: 1,
        },
        {
            username: "employee_2",
            firstName: "Employee",
            lastName: "Employee",
            password: "employee",
            roleId: 2,
            branchId: 2,
        },
        {
            username: "employee_3",
            firstName: "Employee",
            lastName: "Employee",
            password: "employee",
            roleId: 2,
            branchId: 3,
        },
    ],
});

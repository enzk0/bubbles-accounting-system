import prisma from "../client";

export async function createProduct(req, res) {
    const { requester, product } = req.body;

    if (
        !product.name ||
        product.price === null ||
        product.price === undefined
    ) {
        return res
            .status(422)
            .send({ message: "Some of the required fields are empty." });
    }
    try {
        const createdProduct = await prisma.product.create({
            data: {
                name: product.name,
                price: product.price,
            },
        });

        res.status(201);
        return createdProduct;
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error with the database client has occurred.",
            error: error,
        });
    }
}

export async function getProduct(req, res) {
    const { requester, product } = req.body;

    if (product.id === null || product.id === undefined || product.id < 1) {
        return res.status(422).send({
            message: "Some of the required fields are empty or invalid.",
        });
    }

    try {
        const foundProduct = await prisma.product.findUnique({
            where: {
                id: product.id,
            },
        });

        res.status(200);
        return foundProduct;
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error with the database client has occurred.",
            error: error,
        });
    }
}

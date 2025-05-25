import prisma from "../client.js";

export async function createProduct(req, res) {
    const { name, price } = req.body;

    if (!name || price === null || price === undefined) {
        return res
            .status(422)
            .send({ message: "Some of the required fields are empty." });
    }
    try {
        const createdProduct = await prisma.product.create({
            data: {
                name: name,
                price: price,
            },
        });

        res.status(201).send({
            message: "Product has been sucessfully created",
        });
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
    const { id: rawId } = req.params;
    const id = parseInt(rawId);

    if (id === null || id === undefined || id < 1) {
        return res.status(422).send({
            message: "Some of the required fields are empty or invalid.",
        });
    }

    try {
        const foundProduct = await prisma.product.findUnique({
            where: {
                id: id,
            },
        });

        if (foundProduct === null || foundProduct === undefined) {
            return res
                .status(404)
                .send({ message: "Product could not be found" });
        }

        res.status(200);
        res.json(foundProduct);
        return foundProduct;
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error with the database client has occurred.",
            error: error,
        });
    }
}

export async function getAllProducts(req, res) {
    const { isActive } = req.query;

    let filter = {};

    if (isActive !== undefined) {
        filter.isActive = isActive === "true";
    }

    try {
        const foundProducts = await prisma.product.findMany({
            where: filter,
            orderBy: {
                id: "asc",
            },
        });

        if (
            foundProducts === null ||
            foundProducts === undefined ||
            foundProducts.length === 0
        ) {
            return res
                .status(404)
                .send({ message: "No products could not be found" });
        }

        res.status(200);
        res.json(foundProducts);
        return foundProducts;
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error with the database client has occurred.",
            error: error,
        });
    }
}

export async function editProduct(req, res) {
    const { id: rawId } = req.params;
    const id = parseInt(rawId);

    const { name, price, isActive } = req.body;

    if (id === null || id === undefined || id < 1) {
        return res.status(422).send({ message: "Product id is not provided." });
    }

    if (!name || price < 0 || price === null || price === undefined) {
        return res
            .status(422)
            .send({ message: "Some of the required fields are empty." });
    }

    try {
        const updatedProduct = await prisma.product.update({
            where: {
                id: id,
            },
            data: {
                name: name,
                price: price,
                isActive: isActive,
            },
        });

        res.status(200).send({
            message: "Product has been sucessfully updated",
        });
        return updatedProduct;
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error with the database client has occurred.",
            error: error,
        });
    }
}

export async function deactivateProduct(req, res) {
    const { id: rawId } = req.params;
    const id = parseInt(rawId);

    if (id === null || id === undefined || id < 1) {
        return res.status(422).send({ message: "Product id is not provided." });
    }

    try {
        const updatedProduct = await prisma.product.update({
            where: {
                id: id,
            },
            data: {
                isActive: false,
            },
        });

        res.status(200).send({
            message: "Product has been sucessfully deactivated",
        });
        return updatedProduct;
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "An error with the database client has occurred.",
            error: error,
        });
    }
}

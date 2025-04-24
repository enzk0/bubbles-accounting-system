import jwt from "jsonwebtoken";
import prisma from "../client";
import bcrypt from "bcrypt";
import "dotenv/config";

export async function login(req, res) {
  const { user } = req.body;

  try {
    const fetchedUser = await prisma.user.findUnique({
      where: {
        name: user.name,
      },
    });

    if (fetchedUser === null || !fetchedUser) {
      return res.status(404);
    }

    const isPasswordCorrect = bcrypt.compareSync(
      user.password,
      fetchedUser.password,
    );

    if (!isPasswordCorrect) {
      return res.status(401);
    }

    const accessToken = jwt.sign(
      { id: fetchedUser.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "12h" },
    );

    res.json({ accessToken: accessToken });
    res.status(200);
  } catch (error) {
    return res.status(500);
  }
}

export async function logout(req, res) {}

import prisma from "../client";

export async function createBranch(req, res) {
  const { requester, branch } = req.body;

  if (!branch.code || !branch.name || !branch.address) {
    return res.status(422);
  }

  try {
    const newBranch = prisma.branch.create({
      branch: branch,
    });

    res.status(201);
    return newBranch;
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

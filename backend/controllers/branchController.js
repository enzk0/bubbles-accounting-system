import prisma from "../client";

export async function createBranch(req, res) {
  const { requester, branch } = req.body;

  if (!branch.code || !branch.name || !branch.address) {
    return res.status(422);
  }

  try {
    const newBranch = await prisma.branch.create({
      branch: branch,
    });

    res.status(201);
    return newBranch;
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

export async function getBranch(req, res) {
  const { requester, branch } = req.body;

  try {
    if (branch.id === null || branch.id === undefined) {
      return res.status(422);
    }

    const foundBranch = await prisma.branch.findUnique({
      where: {
        id: branch.id,
      },
    });

    if (!foundBranch || foundBranch == null) {
      return res.status(404);
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
  const { requester } = req.body;

  try {
    const foundBranches = await prisma.branch.findMany();

    if (foundBranches.length === 0) {
      res.json([]);
      return res.status(404);
    }

    res.status(200);
    res.json(foundBranches);
    return foundBranches;
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

export async function editBranch(req, res) {
  const { requester, branch, edit } = req.body;

  if (!edit.name || !edit.address) {
    return res.status(422);
  }

  try {
    const editedBranch = await prisma.branch.update({
      where: {
        id: branch.id,
      },
      data: edit,
    });

    res.status(200);
    return editedBranch;
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

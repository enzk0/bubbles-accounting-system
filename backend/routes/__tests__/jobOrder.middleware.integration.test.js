import request from "supertest";
import jwt from "jsonwebtoken";
import { test, expect, describe, vi } from "vitest";
import app from "../../app";


const testToken = (data) => {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30m",
    });
};

const testExpiredToken = (data) => {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: -10 });
};


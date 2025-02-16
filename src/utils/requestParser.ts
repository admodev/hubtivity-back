import { Request, Response } from "express";
import logger from "./logger.js";

export const validateRequestParams = (
  req: Request,
  res: Response
): Response | boolean => {
  if (!req.params) {
    logger.log({
      level: "error",
      message: "Missing parameters in the request.",
    });

    return res.status(400).json({ error: "Missing owner or repo parameters." });
  }

  return true;
};

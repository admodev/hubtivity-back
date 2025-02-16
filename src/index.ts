import * as express from "express";
import type { Request, Response } from "express";
import { Octokit } from "@octokit/rest";

// Utils
import { validateRequestParams } from "./utils/requestParser.js";
import logger from "./utils/logger.js";

const app = express.default();
const port: number = 5000;
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

app.get("/", (req: Request, res: Response) => {
  res.send("Health OK!");
});

app.get(
  "/stats/:owner/:repo",
  async (req: Request, res: Response): Promise<any> => {
    try {
      validateRequestParams(req, res);

      const { owner, repo } = req.params;

      const response = await octokit.rest.repos.getCommitActivityStats({
        owner,
        repo,
      });

      if (!response.data) {
        logger.log({
          level: "error",
          message: `No data found for the repository: ${owner}/${repo}`,
        });

        return res
          .status(404)
          .json({ error: "No data found for the repository." });
      }

      res.json(response.data);
    } catch (error: any) {
      logger.log({
        level: "error",
        message: `Error occurred while fetching data: ${error.message}`,
      });

      res.status(500).json({ error: error.message });
    }
  }
);

app.listen(port, () => {
  logger.log({
    level: "info",
    message: `Hubtivity backend is listening on port ${port}`,
  });
});

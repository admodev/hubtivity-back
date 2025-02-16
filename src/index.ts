import * as express from "express";
import type { Request, Response } from "express";
import { Octokit } from "@octokit/rest";

const app = express.default();
const port: number = 5000;
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get(
  "/stats/:owner/:repo",
  async (req: Request, res: Response): Promise<any> => {
    try {
      if (!req.params.owner || !req.params.repo) {
        return res
          .status(400)
          .json({ error: "Missing owner or repo parameters." });
      }

      const { owner, repo } = req.params;

      const response = await octokit.rest.repos.getCommitActivityStats({
        owner,
        repo,
      });

      if (!response.data) {
        return res
          .status(404)
          .json({ error: "No data found for the repository." });
      }

      console.log(response.data);
      res.json(response.data);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

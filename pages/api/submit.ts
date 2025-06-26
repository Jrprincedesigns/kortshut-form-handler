// pages/api/submit.ts

import { Client } from "@notionhq/client";
import type { NextApiRequest, NextApiResponse } from "next";

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY! });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { firstName, lastName, email, message } = req.body;

  try {
  await notion.pages.create({
    parent: { database_id: process.env.NOTION_DATABASE_ID! },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: `${firstName} ${lastName}`,
            },
          },
        ],
      },
      Email: {
        email,
      },
      Message: {
        rich_text: [
          {
            text: {
              content: message,
            },
          },
        ],
      },
    },
  });

  return res.status(200).json({ message: "Success" });
} catch (error: any) {
  console.error("Notion error:", error.body || error);
  return res.status(500).json({ message: "Internal Server Error" });
}
}

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "node:fs";
import dotenv from "dotenv";
dotenv.config();
const apiKey = process.env.API_KEY;
console.log(apiKey);
if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment variables");
  }
const genAI = new GoogleGenerativeAI(apiKey);

async function scanLocalImage(imagePath: string) {
  const base64Image = fs.readFileSync(imagePath, { encoding: "base64" });

  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image,
      },
    },
    {
      text: `Extract item name, price, and purchase date from this receipt. Format as JSON:
[
  { "item": "item name", "price": "$amount", "date": "MM/DD/YYYY" }
]`,
    },
  ]);

  const response = await result.response;
  return await response.text();
  console.log(await response.text());
}

async function scanImageFromURL(imageUrl: string) {
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  const base64Image = Buffer.from(buffer).toString("base64");

  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "image/jpeg", // or image/png
        data: base64Image,
      },
    },
    {
      text: `Extract item names, prices, and purchase date from this receipt. Return result as JSON:
[
  { "item": "string", "price": "$amount", "date": "MM/DD/YYYY" }
]`,
    },
  ]);

  const output = await result.response.text();
  return await response.text();
  console.log(output);
}

// checking
async function main() {
  await scanLocalImage("receipts/sample-receipt.jpg");
  await scanImageFromURL("https://example.com/receipt.jpg");
}
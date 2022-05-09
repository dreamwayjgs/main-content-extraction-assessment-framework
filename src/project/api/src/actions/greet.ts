import { Context } from "koa";
import { mongo } from "../app";


export async function greet(ctx: Context) {
  console.log("Hello!")

  ctx.body = {
    status: "Hello",
    greet: "Hi!",
  }
}


const testWebpages = [
  {
    url: "https://www.who.int/health-topics/coronavirus",
    source: '__testset'
  },
  {
    url: "https://www1.nyc.gov/site/coronavirus/index.page",
    source: '__testset'
  },
  {
    url: 'https://hidot.hawaii.gov/coronavirus/',
    source: '__testset'
  }
]


export async function generateTestSet(ctx: Context) {
  console.log("Generating test set...")

  const existingTestsets = await mongo.webpage.count({
    where: { source: '__testset' }
  })

  if (existingTestsets > 0) {
    await mongo.webpage.createMany(
      { data: testWebpages }
    )
    console.log("Done!")
  } else {
    console.log("Test set already exists!")
  }

  ctx.body = {
    status: "Test set generated",
    greet: "Hi!",
  }
}
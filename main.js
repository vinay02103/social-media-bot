const { TwitterApi } = require("twitter-api-v2");
const schedule = require("node-schedule");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");

const app = express();
app.use(bodyParser.json());
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Twitter API credentials
const client = new TwitterApi({
  appKey: "EDleSMfDiozyBZhITQetm97yv",
  appSecret: "JZiVEb16JpfyTtaj6SPEokKp4UtV5TFUmkOzQOYpTYEepRGJB8",
  accessToken: "1795404842359500801-ZpV9tpWpq63itg2pqT0DAItr4rhgK6",
  accessSecret: "HQEsXMryLJZfe8msZ8HAnRgxXMDA3aU7EsGu97DaPmT7",
});

async function main() {
  // Scheduled Posting
  schedule.scheduleJob("*/5 * * * *", async () => {
    try {
      const tweet = await client.v2.tweet("Scheduled Tweet");
      console.log("Tweet posted:", tweet.data.id);
    } catch (error) {
      console.error("Error posting tweet:", error);
    }
  });

  // User Interaction: Like, comment, follow
  try {
    const searchResponse = await client.v2.search("nodejs");
    if (searchResponse.data && searchResponse.data.length > 0) {
      const tweetId = searchResponse.data[0].id;
      const userId = searchResponse.data[0].author_id;

      await client.v2.like(tweetId);
      await client.v2.reply("Nice tweet!", tweetId);
      await client.v2.follow(userId);
      console.log("Interacted with tweet:", tweetId);
    } else {
      console.log("No tweets found for the search term.");
    }
  } catch (error) {
    console.error("Error interacting with tweets:", error);
  }

  // Data Scraping
  try {
    const tweets = await client.v2.search("javascript");
    fs.writeFileSync("tweets.json", JSON.stringify(tweets, null, 2));
    console.log("Tweets saved to tweets.json");
  } catch (error) {
    console.error("Error scraping tweets:", error);
  }

  // Trend Monitoring
  try {
    const trends = await client.v1.get("trends/place.json", { id: 1 }); // 1 for global trends
    console.log("Current trends:", trends[0].trends);
  } catch (error) {
    console.error("Error fetching trends:", error);
  }

  // Analytics and Reporting
  try {
    const user = await client.v2.userByUsername("TwitterDev");
    const userMetrics = await client.v2.user(user.data.id, {
      "user.fields": "public_metrics",
    });
    console.log("User metrics:", userMetrics.data.public_metrics);
  } catch (error) {
    console.error("Error fetching user metrics:", error);
  }
}

main().catch(console.error);

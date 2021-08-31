const Twitter = require("twitter")
const dotenv = require("dotenv")
const fs = require("fs")

dotenv.config()
module.exports.sendTweets = async function sendTweets(msg,img_path) {

  console.log("TWEET:",img_path)
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})
let img_address=toString(img_path);
let tweet_text=toString(msg);
const imageData = fs.readFileSync(img_path) //replace with the path to your image

client.post("media/upload", {media: imageData}, function(error, media, response) {
  if (error) {
    console.log(error)
  } else {
    const status = {
      status: tweet_text,
      media_ids: media.media_id_string
    }

    client.post("statuses/update", status, function(error, tweet, response) {
      if (error) {
        console.log(error)
      } else {
        console.log("Successfully tweeted an image!")
      }
    })
  }
})
}
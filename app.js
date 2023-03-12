//We need to install the npm module @mailchimp/mailchimp_marketing.
////We need to install the npm module @mailchimp/mailchimp_marketing.
//npm install @mailchimp/mailchimp_marketing
const mailchimp = require("@mailchimp/mailchimp_marketing");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const https = require("https");

app.use(bodyParser.urlencoded({ extended: true }));
//The public folder which holds the CSS and images
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//Setting up MailChimp
mailchimp.setConfig({
  //replace with your api key
  apiKey: "0f81284cb3183bb88960efe6c16fd4be-us14",
  //replace with last us-XX from api key
  server: "us14",
});

app.post("/", function (req, res) {
  //change the values to according to your input attributes in html
  const firstName = req.body.fname;
  const secondName = req.body.lname;
  const email = req.body.email;

  //Your list/audience id
  const listId = "f67848398b";

  //Creating an object with the users data
  const subscribingUser = {
    firstName: firstName,
    lastName: secondName,
    email: email,
  };

  //Uploading the data to the server
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });

    //If all goes well logging the contact's id
   
    res.sendFile(__dirname + "/success.html");
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${response.id}.`
    );
  }
  //Running the function and catching the errors (if any)
  //If anything goes wrong send the faliure page
  run().catch((e) => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server is running at port 3000");
});

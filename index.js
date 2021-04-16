const exp = require("express");
const app = exp();
const bp = require("body-parser");
const request = require("request");
const https = require("https");

app.use(exp.static(__dirname + '/public'));
app.use(bp.urlencoded({extended: true}));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    let fn = req.body.fn;
    let ln = req.body.ln;
    let em = req.body.email;
    console.log(fn + " " + ln + " " + em);
    let data = {
        members: [
            {
                email_address: em,
                status: "subscribed",
                update_existing: true,
                merge_fields: {
                    FNAME: fn,
                    LNAME: ln
                }
            }
        ]
    };
    let JSDAT = JSON.stringify(data);

    const url = "https://us1.api.mailchimp.com/3.0/lists/d0feef4b9f"

    const options = {
        method: "POST",
        auth: "masterchief164:b9b715a0263611c5227f55111dcc8fa0-us1"
    };
    const request = https.request(url, options, function (response) {
        response.on("data", function (data) {
            console.log(JSON.parse(data));
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        });
    });
    request.write(JSDAT);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server Running");
});


//API key
//b9b715a0263611c5227f55111dcc8fa0-us1

//list id
//d0feef4b9f
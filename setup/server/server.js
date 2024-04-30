const express = require("express");
const app = express();
const cors = require('cors');
var methodOverride = require('method-override');

const port = 5000;

app.listen(port, () =>{
  console.log(`Server listening on port: ${port}`);
});

//text parser middleware 
app.use(express.text({type:"*/*"}));

//https://philipm.at/2017/method-override_in_expressjs.html
// by default method-override only examines POST requests. You can configure it to look at GET requests:
app.use(methodOverride('_method', { methods: ['POST', 'GET','PUT','PATCH'] }));
app.use(methodOverride('X-HTTP-Method-Override', { methods: ['POST', 'GET','PUT','PATCH'] }));

app.post('/api/change-email', (req, res) => {
    console.log("Requesting URL: ",req.get('origin'));
    console.log("Request body received: ",req.body);
    console.log("Cookies received: ",req.headers.cookie);

    res.cookie('session','test_session',{httpOnly: true, secure: true});
    res.status(200).send({message:"Email updated successfully!"});
  }) ;

### No preflight request when performing fetch with 'x-www-form-urlencoded':
```javascript
//CLIENT
const submitButton = document.getElementById("submitReq");
submitButton.addEventListener("click",()=>{
    fetch("http://localhost:5000/test", {
        method: "POST",
         credentials: 'include',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({"name":"ivory"})
    })
    .then(res =>{
        if(res.status==200){
            return res.json();
        }else{
           return;
        }
    })
    .then((data) =>{
        console.log("data from backend: ",data);
    })
    .catch(err =>{
        console.log("error occured: ",err);
        return;
    })
});

//SERVER
const express = require("express");
const app = express();
const cors = require('cors');
const port = 5000;
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
  let corsOptions = {
    origin: 'http://localhost:6000',
    credentials: true, // ******* DO NOT set credentials attr to true for all the paths
  }
  app.use(cors(corsOptions));
  app.post('/test', (req, res) => {
    console.log("req is: ",req.body);
    console.log(JSON.stringify(req.headers))
   // res.cookie('appACookie','app-A',{httpOnly: true, secure: true });
    res.status(200).send({message:"Here! have your response"});
  })
app.listen(port, () =>{
    console.log(`listening on port: ${port}`);
});
```

Setting the credentials to be included in the request to make sure it triggers a preflight request.
As you can see in the server side code that the CORS is set to allow only origin "http://localhost:6000".
Client side Origin is "http://localhost:8000".
Backend running on "http://localhost:5000"
Request goes to the server and you can see that the server returns 200 response. But we still see an error in the browser.

![[Pasted image 20231102223835.png]]

Server received the request:
![[Pasted image 20231102224023.png]]

Browser CORS error: it says the fetch failed. Request reached the server though. That should be enough for my CSRF attack.

![[Pasted image 20231102223707.png]]


### Content-Type 'application-json' in fetch request:
Change content type in the request to 'application/json':
```javascript
headers:{
	'Content-Type':'application/json'
 },
```

You see that a pre flight request was sent to the server.

![[Pasted image 20231102230002.png]]
Response from header shows that only origin allowed is 'http://localhost:6000'
![[Pasted image 20231102230130.png]]

You will also see an error in the browser console:
![[Pasted image 20231102230256.png]]

The server did not receive any request:
![[Pasted image 20231102230314.png]]

### Set 'mode' to 'no-cors' in request with 'application/json' content type:

```javascript
mode: 'no-cors'
```

No preflight request is sent.
server returns 200 status code.
![[Pasted image 20231102230748.png]]

No data returned by the server though:
![[Pasted image 20231102230914.png]]


Hence no data written to console from out javascript console.log statement:
![[Pasted image 20231102230843.png]]

In the server also there is no data that was received:
![[Pasted image 20231102231001.png]]

What's going on????


TODO: build a cors proxy to bypass preflight requests and allow credentials to be sent.
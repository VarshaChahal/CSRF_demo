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
As you can see in the server-side code the CORS is set to allow only origin "http://localhost:6000".
Client-side Origin is "http://localhost:8000".
Backend running on "http://localhost:5000"
Request goes to the server and you can see that the server returns a 200 response. But we still see an error in the browser.

![Pasted image 20231102223835](https://github.com/VarshaChahal/SameOriginPolicy_experiments/assets/17961153/598cbe48-ab04-4bd7-9708-919ed031b6ff)


The server received the request:
![Pasted image 20231102224023](https://github.com/VarshaChahal/SameOriginPolicy_experiments/assets/17961153/928737f6-be35-42c8-8ff1-d58a134c378b)


Browser CORS error: it says the fetch failed. The request reached the server though. That should be enough for my CSRF attack.
![Pasted image 20231102223707](https://github.com/VarshaChahal/SameOriginPolicy_experiments/assets/17961153/95c7d296-f621-4c42-a7f9-5c3d3050aff1)


### Content-Type 'application-json' in fetch request:
Change the content type in the request to 'application/json':
```javascript
headers:{
	'Content-Type':'application/json'
 },
```

You see that a pre-flight request was sent to the server.
![Pasted image 20231102230002](https://github.com/VarshaChahal/SameOriginPolicy_experiments/assets/17961153/9415a9dc-6c1c-48c0-942f-d54b3cfba83c)

Response from header shows that the only origin allowed is 'http://localhost:6000'
![Pasted image 20231102230130](https://github.com/VarshaChahal/SameOriginPolicy_experiments/assets/17961153/b07c30be-dfba-4023-b0d6-dbe81e43937e)

You will also see an error in the browser console:
![Pasted image 20231102230256](https://github.com/VarshaChahal/SameOriginPolicy_experiments/assets/17961153/0b0038ef-b614-4f48-99db-9dc8a86748bd)

The server did not receive any requests:
![Pasted image 20231102230314](https://github.com/VarshaChahal/SameOriginPolicy_experiments/assets/17961153/19544044-df2a-4655-a1b3-f0c349fdd1f2)

### Set 'mode' to 'no-cors' in request with 'application/json' content-type:

```javascript
mode: 'no-cors'
```

No preflight request is sent.
server returns a 200 status code.
![Pasted image 20231102230748](https://github.com/VarshaChahal/SameOriginPolicy_experiments/assets/17961153/7b6d737a-e863-439b-8657-72cda788adab)

No data was returned by the server though:
![Pasted image 20231102230914](https://github.com/VarshaChahal/SameOriginPolicy_experiments/assets/17961153/3376f57a-e617-467f-bd4b-87a644cde9ad)


Hence no data was written to the console from our javascript console.log statement:
![Pasted image 20231102230843](https://github.com/VarshaChahal/SameOriginPolicy_experiments/assets/17961153/9e0174fb-8c0d-4a45-b65d-9a5df0d3faff)


In the server also there is no data that was received:
![Pasted image 20231102231001](https://github.com/VarshaChahal/SameOriginPolicy_experiments/assets/17961153/357a63da-3d4b-4f1d-b271-d9dd271c9be4)

What's going on????

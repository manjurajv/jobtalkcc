var express        = require('express'),
    bodyParser     = require('body-parser'),
    https          = require('https'),
    request        = require('request'),
    app            = express(),
    fs             = require('fs'),
    MongoClient    = require('mongodb').MongoClient,
    assert         = require('assert'),
    url            = 'mongodb+srv://dbuseradmin:dbuser@cluster0.lrjnl.mongodb.net/FirstDB?retryWrites=true&w=majority',
    token          = 'EAAFrJwSS3GEBAH6Jrog6OhvPY8ZBPppMZAYbTyphEVrJapOoKA38cx8y81NlGrVhnUjMCQkZBXZCRUeALCC9MddGaZCaiZC6oLJtxaAbKkhdxE8D9B7SJeeqCqyZAQAEV6Kgfra2yXFJOaTgfeaoA9EKqNY0OrOVRVCZCEal4FaKiwZDZD',
    MongoClient = require('mongodb').MongoClient,
        sslOpts        = {
      "key":fs.readFileSync("/etc/letsencrypt/live/ujwalchatbot.ml/privkey.pem"),
      "cert":fs.readFileSync('/etc/letsencrypt/live/ujwalchatbot.ml/fullchain.pem')
    }
const dbName = 'FirstDB';
// accept JSON bodies.
app.use(bodyParser.json({}));

// accept incoming messages
app.post('/fb', function(req, res){
  var id = req.body.entry[0].messaging[0].sender.id;
  var text = req.body.entry[0].messaging[0].message.text;
  console.log(JSON.stringify(req.body))
   // here we add the logic to insert the user data into the database
   MongoClient.connect(url, function(err, client) {
    assert.equal(null,err);
    const db = client.db(dbName);
    console.log("Connected successfully to the server");
    if(err) {
      console.log(err)
    }
    app.findDocument(id, db, function(doc) {
      if(doc === null){
        app.initUserHomework({session:id, homework:[]}, db, function(doc){
          client.close();
        })
      }
    });
  });
  app.speechHandler(text, id, function(speech){
    app.messageHandler(speech, id, function(result){
      console.log("Async Handled: " + result)
    })
  })
  res.send(req.body)
})
//new edit
app.initUserHomework = function(data, db, callback) {
    // Get the documents collection
    var collection = db.collection('homework');
    // Insert some documents
    collection.insertOne(data, function(err, result) {
      if(err) throw err;
      callback(result);
    });
  }

  app.updateHomework = function(data, db, callback) {
    // Get the documents collection
    var collection = db.collection('homework');
    // Insert some documents
    collection.insert
    collection.insert(data, function(err, result) {
      if(err) throw err;
      callback(result);
    });
  }
app.findDocument = function(sessionID, db, callback) {
    // Get the documents collection
    var collection = db.collection('homework');
    // Find some docHiuments
    collection.findOne({'session': sessionID}, function(err, doc) {
      if(err){ throw err; }
      callback(doc);
    });
  }

//new edit
app.messageHandler = function(text, id, cb) {
  var data = {
    "recipient":{
        "id":id
    },
    "message":{
        "text":text
    }
  };
  var reqObj = {
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: data
  };
  console.log(JSON.stringify(reqObj))
  request(reqObj, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', JSON.stringify(error));
      cb(false)
    } else if (response.body.error) {
      console.log("API Error: " + JSON.stringify(response.body.error));
      cb(false)
    } else{
      cb(true)
    }
  });
}
app.speechHandler = function(text, id, cb) {

    const projectId = 'codementor-yons';
    const sessionId = '981dbc33-7c54-5419-2cce-edf90efd2170';
    const query = text;
    const languageCode = 'en-US';
    const dialogflow = require('dialogflow');

    let privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQClnV6/fGYj0YRu\naG+pXPjB4zystI2P45iRakh0lE3iHOeQxZ9t5F3bwv3a6bNIKWtL7Ndt4dq6V8xa\nuF9tbewEaCvUjLU4kx94M/iFMQmQWzSK9EACpJpckPOD0DSFePKC0uX/9ayiHzFq\nP1G4QKUaTT6eeI/4Vq6uquXEhL6Qpj068APq700rBcal7P3ftH5iW3Lzqz+MowMW\ncze+WLzr00OtPqLow2KUFRkAllf7gYvcxYdqRZsRY/PrUw/+ziNi3/jJkEIuk9O7\n5VRosHyWUMVo3U8cBqK+lZ+fCiBImpaVucjYgLe1O8CdR7oyOoQ/A+LD8n0cNoil\nlkRJFt9BAgMBAAECggEAErwfcoZ6UH18X3gJf62Ah4BzBe+D3x3mTbbp/OQk/ln6\nOSad/zK5Cmn/ySKsURK8bFGd2jSVR4S0naOjSfAIJcR6BtinDIAaLIEmkTynohCr\nPDfewN3Jh4SvQ39LXbj9qB5+/cpXLdzc/HGuxyrq8nOADLHDSZrWtnQnO2iv3RF+\ndTk5nnAXaFaVUBDUPH/h5+EIPNh9kLIAM366Mq6z2RKkutSIBwOYxFd84hvekCrA\nU3yDc6yxQ8AdI6WzAjJ4kNc8qpRV92ZCItgmi20oxSv7wLk6VP18KRVcjAElTQm9\nsa4B3TQl00z05Q2j2aSvbMNoA+lc5VVAA/NN7DRaFQKBgQDgIqChwDvkhwRRAVFO\nCLlnV254dg5FKXAoSYRheRxn+io4WKpJJmllYGvW0HEdHnGZCb6Aox1ofoRfe7bz\n2DXQiP1U1znQM5aJwRiaaRdItJ4aEBXo5ylYmxD/C4MVRg2nHNHnETYfx+2bzcxs\nDKK8KJ9ZRqeFv2K3sM6nhumKhQKBgQC9KOVJF5KD5W68CWoz9YlBTIS1tdRZx7BF\n1hykwcXq0ox38Coj0jJbDsGwj66ywrRomXQXzbixN0+9DVDc3mJKrITmD72CJCRV\nQkswgRSdxDM++Xm/PFaDGlutpFzy0KcRJGciOxslzAruo/jceuqXg3i4GDNYcCsE\n+lzU07WEjQKBgHQL+bdF3Ly521ZFpF8OzU/gSOY92a2dguCZD92X40lCkVGTNreh\nF7jRb4RNcANvm8ls7iGUUsmjl84IM/WU4GgURXYD6X8O9sZkH+TyvId8XM+JvI5W\nAWZLA0XKJBiDqNX5agSFOMzDqxacO1dGQ4vATKDgoCPzr50EAjti8tAxAoGADw+M\nge9QiRPhZzNQs2ZfUUWoY1dg2u0dSdIsYanT+khdSsdic4uu2rUoEsi93hnGh3WA\nWszUYbfHr4O55nwGU2+8/RxPuGbsRaWLmwcL/yu58M+oM+O396RHnGGzzNl0E9dU\nJtOR68Z9MFb534Qh3YJoQDAdFnOH2VOdxIw+rZkCgYA/FIuTTfLOQ5RfebtPKU9h\nMPxIHtTG5nP/yNAdrHsO+JW1FxGAiCilY9Ud7seuPlJIrNgT9/li1ZLlydeG13He\nZfCa9XM8EfqZmdlsKHX+1jYfH+NTsOHCyI71NCNRPogccZn9MpmnnnYQB3Ia4Aj8\n6KLQEWGqiMM8adbhoms5Ww==\n-----END PRIVATE KEY-----\n";
    let clientEmail = "jobtalkuj@codementor-yons.iam.gserviceaccount.com";
    let config = {
        credentials: {
          private_key: privateKey,
          client_email: clientEmail
        }
      }
      const sessionClient = new dialogflow.SessionsClient(config);

      // Define session path
      const sessionPath = sessionClient.sessionPath(projectId, sessionId);

      // The text query request.
      var request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: query,
            languageCode: languageCode,
          },
        },
      };

      sessionClient
      .detectIntent(request)
      .then(responses => {
        console.log('Detected intent');
        const result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);
        if (result.intent) {
          console.log(`  Intent: ${result.intent.displayName}`);
          console.log(result.fulfillmentText);
          if(result.parameters.due !== "" && result.parameters.subject !== "")
          {
            // here we have enough information to  save our homework assignment to the database.
            MongoClient.connect(url, function(err, client) {
                const db = client.db(dbName);
              if(err) {
                console.log(err)
              }
            
            
                    app.initUserHomework({due:result.parameters.due, subject:result.parameters.subject},  db, function(doc){
                      client.close();
                    });
        
            });
          } 
          cb(result.fulfillmentText);
        } else {
          console.log(`  No intent matched.`);
        }
      })
      .catch(err => {
        console.error('ERROR:', err);
        cb(false)
      });
  var reqObj = {
  };
}

// verify token to subscribe
app.get('/fb', function(req, res) {
  if (req.query['hub.verify_token'] === 'Chatb0tt0ken!!') {
     res.send(req.query['hub.challenge']);
   } else {
     res.send('Error, wrong validation token');
   }
});

// create a health check endpoint
app.get('/health', function(req, res) {
  res.send('okay');
});

// set port
app.set('port', process.env.PORT || 443);

// start the server
https.createServer(sslOpts, app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

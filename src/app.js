const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cities = require('cities.json');
const fs = require('fs');
const request = require('request');
const fetch = require('node-fetch');
const port = process.env.PORT || 5000;
const puretext = require('puretext');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = new Sequelize({
  database: 'byu',
  username: 'lauraarafat',
  // password: '',
  dialect: 'postgres',
  default: {
    timestamp: false
  },
  storage: './session.postgres'
})
app.set('views', './src/views')
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(session({
  store: new SequelizeStore({
    db: sequelize, //values are passed from const sequelize
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 24 * 60 * 60 * 1000
  }),
  secret: "safe",
  saveUnitialized: true,
  resave: false
}))
//
//Define the User with Sequelize
const User = sequelize.define('users', {
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false
  },
  time: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
})


/////////HOME///////////
app.get('/', (req, res) => {
  let darksky = 'https://api.darksky.net/forecast/';
  let key = 'f562afd42a54911c6f4ef7c2b4e505bc';
  let lat = 52.3680;
  let lng = 4.9036;
  let city = "Amsterdam, NL";
  let units = "units=si"
  let uri = darksky + key + '/' + lat + ',' + lng + '?' + units;
  console.log(uri);

  fetch(new fetch.Request(uri))
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error
      }
    })
    .then((json) => {
      for (let i = 0; i < json.daily.data.length; i++) {
        var time = new Date(json.daily.data[i].sunriseTime * 1000).getTime()
        var date = new Date(time);
        var time2 = new Date(json.daily.data[i].sunsetTime * 1000).getTime()
        var date2 = new Date(time2);
        var time4 = new Date(json.daily.data[i].time * 1000).getTime()
        var date4 = new Date(time4);
        json.daily.data[i].sunriseTime = date.toString();
        json.daily.data[i].sunsetTime = date2.toString();
        json.daily.data[i].time = date4.toString().substring(0, 10);
      }
      for (let i = 0; i < json.hourly.data.length; i++) {
        var time5 = new Date(json.hourly.data[i].time * 1000).getTime()
        var date5 = new Date(time5);
        json.hourly.data[i].time = date5.toString().substring(16, 21);
      }
      // console.log(cities)
      res.render('index', {
        daily: json.daily,
        hourly: json.hourly,
        city:city,
        cities:cities
      })
    })
    .catch((err) => {
      console.log(err.message);
    })
})
//////////city search///////////

app.post('/search',(req,res)=>{
  let city = req.body.query;
  console.log("0000------------" +city)
  var result = {};
  for (let i = 0; i < cities.length; i++) {
    var base = cities[i].name.toLowerCase()
    if (base.includes(city)) {
      result[i] = cities[i].name +', '+cities[i].country;
    };
  };
    res.send(result);
})
//////////HOME - SEARCHED FOR CITY///////////
app.post('/', (req, res) => {
  let city = req.body.city;
  console.log("----------------"+ city)

  // console.log(cities)
  for (let i = 0; i < cities.length; i++) {
    if (city == cities[i].name+', '+cities[i].country) {
      // console.log("++++++++++++++++++" + cities[i])
      let darksky = 'https://api.darksky.net/forecast/';
      let key = 'f562afd42a54911c6f4ef7c2b4e505bc';
      let lat = cities[i].lat;
      let lng = cities[i].lng;
      let city = cities[i].name+", "+cities[i].country;
      let units = "units=si";
      let uri = darksky + key + '/' + lat + ',' + lng + '?' + units;

      fetch(new fetch.Request(uri))
        .then((response) => {
          if (response.ok) {
            console.log("+++++++++++++++"+response.json)
            return response.json();
          } else {
            throw Error
          }
        })
        .then((json) => {
          // console.log(JSON.stringify(json.daily.data))
          // console.log("+++++++++++++++++++++" + json.daily.summary + json.hourly.data)

          for (let i = 0; i < json.daily.data.length; i++) {
            var time = new Date(json.daily.data[i].sunriseTime * 1000).getTime()
            var date = new Date(time);

            var time2 = new Date(json.daily.data[i].sunsetTime * 1000).getTime()
            var date2 = new Date(time2);

            var time3 = new Date(json.daily.data[i].precipIntensityMaxTime * 1000).getTime()
            var date3 = new Date(time3);
            var time4 = new Date(json.daily.data[i].time * 1000).getTime()
            var date4 = new Date(time4);

            json.daily.data[i].sunriseTime = date.toString();
            json.daily.data[i].sunsetTime = date2.toString();
            json.daily.data[i].precipIntensityMaxTime = date3.toString();
            json.daily.data[i].time = date4.toString().substring(0, 10);
          }
          for (let i = 0; i < json.hourly.data.length; i++) {
            var time5 = new Date(json.hourly.data[i].time * 1000).getTime()
            var date5 = new Date(time5);
            json.hourly.data[i].time = date5.toString().substring(16, 21);
          }
          // console.log(cities)
          res.render('index', {
            daily: json.daily,
            hourly: json.hourly,
            city:city,
            cities:cities,
          })
        })
        .catch((err) => {
          console.log(err.message);
        })
      return;
    }
  }
})


//////////SEND TEST MESSAGE//////////
var now = new Date();
var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0, 0) - now;
if (millisTill10 < 0) {
     millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
}

setTimeout(function(){message()}, millisTill10);
function message(){
  let text = {
    // To Number is the number you will be sending the text to.
    toNumber: session.user.phone,
    // From number is the number you will buy from your admin dashboard
    fromNumber: '+15512311441',
    // Text Content
    smsBody: "It's a beautiful day!",
    //Sign up for an account to get an API Token
    apiToken: 'gdcw4h'
  };

  puretext.send(text, function(err, response) {
    if (err) console.log(err);
    else console.log(response)
  })
}
app.get('/message', (req, res) => {
      // console.log("++++++++++++++++++" + cities[i])
      let darksky = 'https://api.darksky.net/forecast/';
      let key = 'f562afd42a54911c6f4ef7c2b4e505bc';
      let lat = '52.3680';
      let lng = '4.9036';
      let city = 'Amsterdam';
      let units = "units=si";
      let uri = darksky + key + '/' + lat + ',' + lng + '?' + units;

      fetch(new fetch.Request(uri))
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw Error
          }
        })
        .then((json) => {

            var time5 = new Date(json.hourly.data[0].time * 1000).getTime()
            var date5 = new Date(time5);
            json.hourly.data[0].time = date5.toString().substring(16, 21);


            console.log("----------"+json.hourly)
  let text = {
    // To Number is the number you will be sending the text to.
    toNumber: '+'+req.session.user.phone,
    // From number is the number you will buy from your admin dashboard
    fromNumber: '+15512311441',
    // Text Content
    smsBody: "The chance for rain in the next hour is: " + (json.hourly.data[0].precipProbability * 100) + "%. Have a lovely day! :)",
    //Sign up for an account to get an API Token
    apiToken: 'gdcw4h'
  }

  puretext.send(text, function(err, response) {
    if (err) console.log(err);
    else console.log(response)
    res.redirect('/')
  })
}).catch((err)=>{
  console.log(err,err.stack)
  res.redirect('/')
})
})
//TEXTBELT_____________________________________
// app.get('/message',(req,res)=>{
//   request.post('https://textbelt.com/text', {
//   form: {
//     phone: '+31682256978',
//     message: 'Hello world',
//     key: '8e878a000427f88d45b7ccea3f28ed0aede2f6d2ElvR8kpwScWanFx4YVgYUAPit',
//   },
// }, function(err, httpResponse, body) {
//   if (err) {
//     console.error('Error:', err);
//     return;
//   }
//   console.log(JSON.parse(body));
// })
// });
//TWILIO_______________________________
// app.get('/message',(req,res)=>{
//   const client = new twilio('AC30e6274976a582606cf24be4326a5a4d', '8c9061df0922b92bec4950639cda0280')
// client.messages.create({
//   to:'31682256978',
//   from:'twilio',
//   body:'testing from twilio'
// })
//
// })
//NEXMO________________________________
// app.get('/message', (req,res)=>{
//
//   const from = 'Nexmo'
//   const to = '31682256978'
//   const text = 'Yo'
//
//   nexmo.message.sendSms(from, to, text)
// })

///LOGIN///////////////
app.post('/login', (req,res)=>{
let username = req.body.username
let password = req.body.password
if (req.body.password == null || req.body.password.length < 8 ||
        req.body.username == null || req.body.username.length == 0) {
        return;
    }
    User.findOne({
      where: {username:req.body.username}
    }).then((user)=>{
      console.log("--------------" + user.id)

      if(user==null){
        console.log(err,err.stack)
      } else{
        bcrypt.compare(req.body.password, user.password)
        .then((result)=>{
          console.log("--------------" + result)

          if(result){
            console.log("--------------" + user.id)

            req.session.user=user;
            res.render('profile', {user:user})
          }else{error}
        })
      }
    })
    // .catch((err)=>{
    //   console.log(err,err.stack)
    //   res.redirect('/')
    // })
  })


///REGISTER///////////
app.post('/register', (req,res)=>{
  // console.log("=====================" + req.body.password)

bcrypt.hash(req.body.password, 10).then(hash =>{
  // console.log("=====================" + hash)
  User.create({
    username: req.body.username,
    phone:req.body.phone,
    location:req.body.location,
    time:req.body.time,
    password:hash
}).then((user)=>{
  console.log("=====================" + user)

    req.session.user = user;
    // req.session.user.id=user.id
    // req.session.user.location=location
    res.redirect('/profile', {user:user})
  }).catch((err)=>{
    console.log(err,err.stack)
    res.redirect('/')
  })
})
})

///PROFILE///////////////
app.get('/profile', (req,res)=>{
  console.log("=====================" + req.session.user)
  if (req.session.user==undefined) {
    res.redirect('/')
  }
  else {
User.findOne({
  where: {id:req.session.user.id}
}).then(user=>{
 res.render('profile',{user:user})
})

//
// .then(user=>{
//   console.log("=====================" + user)
//
//   res.render('profile',{user:user})
// }).catch((err)=>{
//   console.log(err,err.stack)
//   res.redirect('/')
// })

}
})
sequelize.sync()
app.listen(port, () => {
  console.log('Listening on ' + port)
})

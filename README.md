# Bring Your umbrella
#### _An app which sends a phone or email notification at a given time, telling you if you should bring your umbrella to work (e.g., if it is going to rain in your area that day)_

To run: download, install packages and run src/app.js
***
<strong>What is the problem:
* Having to remember to consult multiple apps in the morning before going out is replaced by receiving one concise message with the information which the user desires, daily, at a time of their choosing.

<strong>Who is the audience:
* Anyone who lives in places like Amsterdam with changeable weather and frequent rain.

<strong>Specific goals:
* Use an API with high quality information
* Enable users to receive email and sms messages
* Message users based on their choice of time, location and information
* Present data in a clear, user friendly manner

<strong>The business:

* A free to use app which may be sold to an interested party
* Potential to introduce ads
* Costs consist of development and upkeep, and API fees if demand reaches above x requests per day.

<strong>The competition:

* A number of weather apps competing for accuracy.
* This app will provide clear oversight in the morning to prepare for the day because people dress for the day in the morning and often don't get back until the afternoon, so weather alerts at the time when the rain begins is not useful.
* In Amsterdam there is high demand and competition in apps relating to weather and rain.

<strong>Technical specifications:

* Database to store single user table to store data including: Name, email, phone number, location, time of notification, choice between email or text message.
* A home page which displays the weather forecast for any searched city
* Register - to fill the Database and sign up for notifications
* Account details page to update database information and notification settings

*** Challenge will be to combine the weather API and notification sending.

<strong>Timeline
1. Choose API, libraries and packages
2. Construct the basic shell of the website including ejs pages and base routing
3. Set up the weather API and be able to search and receive information
4. Set up user information input and database
5. Implement notifications package to send emails and sms
6. Style website
7. Style notifications
8. Final debug
9. Launch website

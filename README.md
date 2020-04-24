
# Ride Decide 4Mike2Bike

ABOUT

Allows for rating weather on a certain day by like/dislike. Tracks the history of these ratings.

The app displays the forecast for one week. Each day displays predictions as % (maybe?) for "liking" three characterists: 
the sky conditions, temperature, and wind speed. The algorithm takes into account combinations of
conditions that occur together on days that liked or disliked. 

(Requirement #6 took most of the time I spent working on this, so it's not as feature-rich as I'd hoped. Also, 
the code is not as polished.I'm fairly pleased with the results for this step because I had no idea what to do, and 
although I don't know if the methodology is sound, it was interesting.) 

APPROACH

Predictions are calculated by collaborative filtering similar to a recommendation engine. 
I ported a C++ node package to pure JavaScript in order to use it in React Native 
(could have also dropped the C++ into a custom-built native module).

The day's weather is broken into conditions based on my own qualitative judgement. 
Each new day is like a "user" for whom a rating will be predicted for the "products" which
are ranges of conditions. We can (maybe) score "products" for a new "user" based on past rating and
what kind of conditions occur together for that rating. If you were to like a breeze on a hot day,
and less wind on a cool day, the same wind speed would score higher on the hot day and the temperature's
score for that hot day would be lower. It appears <b>relatively</b> accurate, though probably not a true percentage.
It's up for interpretation, so I just display the raw scores. 

In the matrix below t0..tn represent an arbitrary, fixed 
range of temperatures I judged to be "similar", i.e., t0 might be >= 95, t1 85 to 95, t2 75 to 85.
Sky conditions like clear, partly cloudy, cloudy, precipitation, etc. Wind ranges by what I've
seen displayed in the forecast calm at 0 to 5, breezy at 5 to 15, windy above 15, etc. These 
could be adjusted manually by a developer for tweaking based on observed usage (temp ranges could be
made smaller, etc.). I also mark "groups" of these ranges that are similar, such as when one
likes a clear day, he/she would probably by my own judgement enjoy a partly cloudy day, so both are marked. 
Arbitrary groupings like this are made. All of the groups applicable to that day are marked with
100 for a "like", 50 by default, and 1 for a dislike. To predict a day, a new row is added with
the default values, the applicable characteristics set to 0 (unrated) and each zeroed cell is 
calculated as the prediction. The past days come from saved history.

```  
     |  t0 | t1  | t2  | tn | s0 | s1 | sn | w0 | w1 | wn
-----+-----+-----+-----+----+----+----+----+----+----+----
d0   | 100 | 100 | 50  | 50 | 50 |100 | 50 |100 |100 | 50  // like t0, s1, w0
-----+-----+-----+-----+----+----+----+----+----+----+----
d1   |  50 |  1  |  1  | 50 | 50 | 50 | 1  | 50 | 50 | 1   // dislike t1, sn, wn
-----+-----+-----+-----+----+----+----+----+----+----+----
d2   |     |     |     |    |    |    |    |    |    |   
-----+-----+-----+-----+----+----+----+----+----+----+----
d3   |
-----+-----+-----+-----+----+----+----+----+----+----+----
dn   |  0  | 50  | 50  | 50 | 50 |  0 | 50 | 0  | 50 | 50 // setup day0 w/ 0's
                                                             a char's. Req'd for
                                                             algorithm. 
```

HISTORY

The scores update dynamically. The last screen of the app will allow you to toggle some sample
data from a real recent week's forecast. Only liked and disliked days are saved, no unrated days. 

Each row of the history screen can be tapped to toggle the rating for that day so that one may
observe the effect on a rating. 

WHITELIST or STRICTLY GOOD DAY CRITERIA

User can also set a set of weather conditions that are always considered acceptable regardless
of like/dislike history. These won't affect scoring so that the scoring stays true to organic
ratings. The front screen will display the pass/fail status of the day. A day passes if it 
meets any specified set of conditions: <br/>
hi/lo temp, max wind speed, rain that day, rain the previous day.

PERSISTENCE

The state of the app will be saved, other than the sample history's being turned on or off.

SCREENS

|   |   |   |   |
|---|---|---|---|
|<img src="https://raw.githubusercontent.com/mitchellsullivan/ride-decide/master/readme/screen_home.png" width="200"/> | <img src="https://raw.githubusercontent.com/mitchellsullivan/ride-decide/master/readme/screen_whitelist.png" width="200"/> | <img src="https://raw.githubusercontent.com/mitchellsullivan/ride-decide/master/readme/screen_history.png" width="200"/> | <img src="https://raw.githubusercontent.com/mitchellsullivan/ride-decide/master/readme/screen_debug.png" width="200"/> |


/*
==========================================================================

 * Created by tim on 10/6/21.
 
 
 ==========================================================================
twitty.js in twitty

Author:   Tim Erickson

Copyright (c) 2018 by The Concord Consortium, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==========================================================================

*/

const twitty = {

    allTweets : [],
    currentTweets : null,

    initialize: function () {
        // define all the foul words
        foulWords = ["anal","arse","bastard","bitch", "anus", "ballsack", "blowjob", "blow job","boner","clitoris","cock","cunt","dick","dildo","dyke","fag","fuck","jizz","labia","muff",
            "nigger","nigga","dickhead","prick","penis","piss","pussy","scrotum","sex","shit","slut","smegma","spunk","twat","vagina","wank","whore"]

        //  read all the tweets into our internal format
        //  `theTweets` is a global defined in `med-tweets.js`.
        theTweets.forEach( (t) => {
        // if the tweet does not contain bad words, then push the tweet into allTweets
            found = 0;
            foulWords.forEach( (i) => {
                if (t.content.includes(i)) {
                    found = 1;
                }

            });
            if (found === 0)  {
                this.allTweets.push(new Tweet(t));
            }
        });
        console.log(`read in ${this.allTweets.length} tweets`);
    },

    handleActionButton: function () {
        startDateControl = document.getElementById("startDateInput");
        endDateControl = document.getElementById("endDateInput");
        const theWord = document.getElementById("wordfilter").value.toString().toLowerCase();
        this.state.startDate = startDateControl.valueAsDate;
        this.state.endDate = endDateControl.valueAsDate;
        console.log(`State is ${JSON.stringify(twitty.state)}`);

        //  filter the tweets by date & keyword
        this.currentTweets = [];    //  empty the `currentTweets` array
        let listGuts = "";
        this.allTweets.forEach( (t) => {
            tweetContent = t.what.toString().toLowerCase();
            if (t.when >= this.state.startDate && t.when <= this.state.endDate && tweetContent.includes(theWord)) {
                this.currentTweets.push(t);
                const theText = t.what;
                listGuts += `<li onclick="twitty.displayOneTweet(${t.id})">${theText.slice(0,19)}...</li>`;
            }
        });

        currentTweetList = document.getElementById("foundTweetList");
        currentTweetList.innerHTML = `<p>Click on the text below...</p><ul>${listGuts}</ul>`;

        console.log(`Found ${this.currentTweets.length} tweets. The first is 
        ${this.currentTweets[0]}`);

    },

    displayOneTweet : function(id) {
        let theTweet
        this.allTweets.forEach( (t) => {
            if (id === t.id) {
                theTweet = t;
            }
        });

        if (theTweet) {
            document.getElementById("selectedTweet").innerHTML = theTweet.what;

            const tWhere = theTweet.where ? `at ${theTweet.where}` : ``;
            const theInfo =  `<strong>Who Tweeted:</strong> ${theTweet.who} (@${theTweet.username}) \n<strong>When:</strong> ${theTweet.when.toISOString().slice(0, 10)}\n<strong>Location:</strong> ${tWhere}\n<strong>Retweet count:</strong> ${theTweet.retweet}\n<strong>Like count:</strong> ${theTweet.like}\n<strong>Follower count:</strong> ${theTweet.followers}\n<strong>URL:</strong> ${theTweet.url}`;
            document.getElementById("selectedTweetInfo").innerHTML = theInfo;
        }
    },

    state: {
        startDate: null,
        endDate: null,
    },

    constants: {
        version: "000a",
    }
}
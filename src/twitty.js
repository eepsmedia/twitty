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
    strings : null,

    initialize: async function () {

        //  read all the tweets into our internal format
        //  `theTweets` is a global defined in `med-tweets.js`.
        theTweets.forEach( (t) => {
            this.allTweets.push(new Tweet(t));
        });
        console.log(`read in ${this.allTweets.length} tweets`);
        this.strings = await strings.initializeStrings();     //  defaults to English
        codapConnect.initialize();
    },

    handleActionButton: function () {
        startDateControl = document.getElementById("startDateInput");
        endDateControl = document.getElementById("endDateInput");
        this.state.startDate = startDateControl.valueAsDate;
        this.state.endDate = endDateControl.valueAsDate;
        console.log(`State is ${JSON.stringify(twitty.state)}`);

        //  filter the tweets by date
        this.currentTweets = [];    //  empty the `currentTweets` array
        this.allTweets.forEach( (t) => {
            if (t.when >= this.state.startDate && t.when <= this.state.endDate) {
                this.currentTweets.push(t);
            }
        });

        this.displayCurrentTweets();

        console.log(`Found ${this.currentTweets.length} tweets. The first is 
        ${this.currentTweets[0]}`);

    },

    displayCurrentTweets : function() {
        let listGuts = "";
        currentTweetList = document.getElementById("foundTweetList");
        this.currentTweets.forEach( tw => {
            const theText = tw.what;
            listGuts += `<li onclick="twitty.displayOneTweet(${tw.id})">${theText.slice(0,19)}...</li>`;

        })
        currentTweetList.innerHTML = `<p>Click on the text below to see the whole tweet...</p><ul>${listGuts}</ul>`;
    },

    handleEmitButton : function() {
        if (this.currentTweets) {
            codapConnect.emitTweets(this.currentTweets);
        }
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
            const theInfo = `${theTweet.who} on ${theTweet.when.toISOString().slice(0, 10)} ${tWhere}`;
            document.getElementById("selectedTweetInfo").innerHTML = theInfo;
        }
    },

    setSelectedSet : function(iTweetIDs) {
        this.currentTweets = [];
        this.allTweets.forEach( tw => {
            if (iTweetIDs.includes(tw.id)) {
                this.currentTweets.push(tw);
            }
        })
        this.displayCurrentTweets();

        if (this.currentTweets.length === 1) {
            this.displayOneTweet(this.currentTweets[0].id);
        }
    },

    state: {
        startDate: null,
        endDate: null,
    },

    constants: {
        version: "000b",
        pluginName : "twitty",
        dimensions : {
            height : 300,
            width : 400,
        },
        kTweetsDatasetName : "tweets",
    }
}
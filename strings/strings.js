strings = {

    initializeStrings : async function(iLang = `en`) {
        const theStrings = strings[iLang];

        for (const theID in theStrings.staticStrings) {
            if (theStrings.staticStrings.hasOwnProperty(theID)) {
                const theValue = theStrings.staticStrings[theID];
                try {
                    document.getElementById(theID).innerHTML = theValue;
                    //  console.log(`Set string for ${theID} in ${iLang}`);
                } catch (msg) {
                    console.log(msg + ` on ID = ${theID}`);
                }
            }
        }

        return theStrings;
    },

    languageNames: {
        en: "English",
        es: "Español",
    },


    en : {
        staticStrings : {
            startDateInputLabel : `start:`,
            endDateInputLabel : `end:`,
            wordFilterLabel : `keyword:`,
            actionButton : `get tweets!`,
            emitButton : `emit!`,
            subtitle : `A CODAP plugin for getting tweets for analysis`,
        },

        sTweetsDatasetTitle : "Tweets",
        sTweetsDatasetDescription : "the tweets you have downloaded",
        sTweetsCollectionName : "Tweets",

        //  san = string attribute name
        sanWhen : "when",
        saWhenDescription : "the date of the tweet",
        sanLikes : "likes",
        saLikesDescription : "how many likes",
        sanWhat : "what",
        saWhatDescription : "the text of the tweet",
        sanRetweets : "retweets",
        saRetweetsDescription: "how many retweets",
        sanFollowers: "followers",
        saFollowersDescription: "number of followers",
        sanUsername: "username",
        saUsernameDescription: "twitter username",
        sanLocation: "location",
        saLocationDescription: "location of tweet",
        sanURL: "url",
        saURLDescription: "URL of tweet"

    }

}
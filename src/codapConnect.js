codapConnect = {

    datasetSubscriberIndex: null,      //  in case we need to invalidate subscriptions. See scrambler for why and how
    selectedCaseIDs : [],

    initialize: async function () {
        await codapInterface.init(this.iFrameDescriptor, null);
        this.createOutputDatasets();
        this.allowReorg();      //  applies to the iFrame, not the dataset

    },

    iFrameDescriptor: {
        name: twitty.constants.pluginName,
        title: twitty.constants.pluginName,
        version: twitty.constants.version,
        dimensions: twitty.constants.dimensions,      //      dimensions,
    },


    registerForEvents: function (iDSName) {
        const sResource = `dataContextChangeNotice[${iDSName}]`;    //  includes selection
        const subscribed = this.datasetSubscriberIndex = codapInterface.on(
            'notify',
            sResource,
            //'selectCases',
            codapConnect.handleDatasetChange,
        );
        console.log(`registered for changes to dataset ${iDSName}. Index ${this.datasetSubscriberIndex}`);

    },

    createOutputDatasets: async function () {
        await pluginHelper.initDataSet(this.tweetsDatasetSetupObject());
        this.registerForEvents(twitty.constants.kTweetsDatasetName);

    },

    handleDatasetChange: function (iMessage) {
        console.log(`handling dataset change`);
        switch (iMessage.values.operation) {
            case "selectCases":
                //  we have selected tweets in CODAP, highlight them in twitty
                let theTweetIDs = [];
                iMessage.values.result.cases.forEach( c => {
                    theTweetIDs.push(c.values.id);
                })
                twitty.setSelectedSet(theTweetIDs);
                break;

            default:
                break;
        }
    },

    /**
     *
     * @param iTweets
     */
    emitTweets: async function (iTweets) {
        let theValues = [];
        let duplicates = 0;
        const currentCaseIDs = await this.getCurrentCaseIDs();

        iTweets.forEach( (t) => {
            if (currentCaseIDs.includes(t.id)) {
                duplicates++;
            } else {
                const aValue = {
                    id: t.id,
                    what: t.what,
                    when: t.when,
                    retweets: Number(t.retweets),
                    followers: Number(t.followers),
                    username: t.username,
                    location: t.where,
                    url: t.url,
                    favourites: Number(t.favourites),
                    source: t.source
                }
                theValues.push(aValue);
            }
        });

        console.log(`emitting ${theValues.length} tweet(s), avoided emitting ${duplicates} duplicate(s).`)

        if (theValues.length > 0 ) {
            pluginHelper.createItems(
                theValues,
                twitty.constants.kTweetsDatasetName,
            );

            //  make sure the table appears

            codapInterface.sendRequest({
                "action": "create",
                "resource": "component",
                "values": {
                    "type": "caseTable",
                    "dataContext": twitty.constants.kTweetsDatasetName,
                }
            })
        }
    },

    /**
     * Go to CODAP to get an array contianing all the `id` fields, that is, the Twitter ids, in the data.
     * This is so we can check for duplicates.
     * @returns {Promise<*[]>}
     */
    getCurrentCaseIDs : async function() {
        let out = [];

        const tMessage = {
            action : "get",
            resource : `dataContext[${twitty.constants.kTweetsDatasetName}].itemSearch[*]`,
        }

        const tResult = await codapInterface.sendRequest(tMessage);
        if (tResult.success) {
            tResult.values.forEach( (v) => {
                out.push(v.values.id)
            })
        } else {
            console.log(`problem retrieving codap tweet items`);
        }
        return out;
    },

    allowReorg: async function () {
        const tMutabilityMessage = {
            "action": "update",
            "resource": "interactiveFrame",
            "values": {
                "preventBringToFront": false,
                "preventDataContextReorg": false
            }
        };

        codapInterface.sendRequest(tMutabilityMessage);
    },

    tweetsDatasetSetupObject: function () {
        return {
            name: twitty.constants.kTweetsDatasetName,
            title: twitty.strings.sTweetsDatasetTitle,
            description: twitty.strings.sTweetsDatasetDescription,
            collections: [
                {
                    name: twitty.strings.sTweetsCollectionName,
                    labels: {
                        singleCase: "tweet",
                        pluralCase: "tweets",
                        setOfCasesWithArticle: "the tweets"
                    },

                    attrs: [
                        {
                            name: twitty.strings.sanWhen,
                            title: twitty.strings.sanWhen,
                            type: 'date',
                            description: twitty.strings.saWhenDescription
                        },
                        {
                            name: twitty.strings.sanRetweets,
                            title: twitty.strings.sanRetweets,
                            type: 'numeric',
                            description: twitty.strings.saRetweetsDescription
                        },
                        {
                            name: twitty.strings.sanFollowers,
                            title: twitty.strings.sanFollowers,
                            type: 'numeric',
                            description: twitty.strings.saFollowersDescription
                        },
                        {
                            name: twitty.strings.sanFavourites,
                            title: twitty.strings.sanFavourites,
                            type: 'numeric',
                            description: twitty.strings.saFavouritesDescription
                        },
                        {
                            name: twitty.strings.sanWhat,
                            title: twitty.strings.sanWhat,
                            type: 'categorical',
                            description: twitty.strings.saWhatDescription
                        },
                        {
                            name: twitty.strings.sanSource,
                            title: twitty.strings.sanSource,
                            type: 'string',
                            description: twitty.strings.saSourceDescription
                        },
                        {
                            name: twitty.strings.sanUsername,
                            title: twitty.strings.sanUsername,
                            type: 'string',
                            description: twitty.strings.saWhatDescription
                        },
                        {
                            name: twitty.strings.sanLocation,
                            title: twitty.strings.sanLocation,
                            type: 'string',
                            description: twitty.strings.saLocationDescription
                        },
                        {
                            name: twitty.strings.sanURL,
                            title: twitty.strings.sanURL,
                            type: 'string',
                            description: twitty.strings.saLocationDescription
                        },
                        {
                            name: `id`,
                            title: "id",
                            type: 'numeric',
                            description: "internal tweet ID",
                            editable: false,
                            hidden: true
                        }
                    ]
                },
            ]   //  end of collections
        }   // end of return object
    },
}
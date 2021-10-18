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
                //  we have selected tweetys in CODAP, highlight them in twitty
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
    
    emitTweets: function (iTweets) {
        let theValues = [];

        iTweets.forEach( (t) => {
            const aValue = {
                id : t.id,
                what : t.what,
                when : t.when,
                likes : Number(t.likes),
                retweets: Number(t.retweets),
                followers: Number(t.followers),
                username: t.username,
                location: t.where,
                url : t.url
            }
            theValues.push(aValue);
        });

        console.log(`emitting tweets`);
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
                            name: twitty.strings.sanLikes,
                            title: twitty.strings.sanLikes,
                            type: 'numeric',
                            description: twitty.strings.saLikesDescription
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
                            name: twitty.strings.sanWhat,
                            title: twitty.strings.sanWhat,
                            type: 'categorical',
                            description: twitty.strings.saWhatDescription
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
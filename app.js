require('dotenv-extended').load();
/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  //process.env.MicrosoftAppId
  //process.env.MicrosoftAppPassword
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: null,
    appPassword: null,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
});

var LUIS_MODEL_URL = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/95842f66-e786-4384-859b-a42ae3c10094?subscription-key=f6092ff10fcc4d079fda3d5983410ad1&verbose=true&timezoneOffset=0&q=";
var recognizer = new builder.LuisRecognizer(LUIS_MODEL_URL);
bot.recognizer(recognizer);

bot.dialog('help', function (session) {
    session.endDialog("피자 주문을 도와드리겠습니다! 어떤 피자를 원하세요? \"○○ 피자 주문하겠습니다\"라고 말씀해주세요.");
}).triggerAction({
    matches: 'help'
});

bot.dialog('orderPizza', [
    function (session, args, next) {
        var pizzaNameEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'pizzaName');
        if (!pizzaNameEntity) {
            builder.Prompts.text(session, '피자 종류를 말씀해주세요.');
        }
        
        session.dialogData.pizzaName = pizzaNameEntity.entity;
        builder.Prompts.text(`${session.dialogData.pizzaName}피자를 주문하시는게 맞나요?`);
        //builder.Prompts.text(session, "배달은 어디로 해드릴까요?");
        //session.beginDialog('SetDestination');
    }/*,
    function (session, results) {
        console.log("results : " + JSON.stringify(results));

        // results.response : 유저가 입력한 메세지

        session.dialogData.destination = results.response;
        builder.Prompts.text(session, "\"" + results.response + "\"으로 배달해드리겠습니다. 결제는 어떻게 하시겠어요?");
    },
    function (session, results) {
        session.dialogData.paymentMethod = results.response;
        builder.Prompts.text(session, "\"" + results.response + "\"으로 결제하겠습니다.");
    }*/
]).triggerAction({
    matches: 'orderPizza',
    onInterrupted: function (session) {
        session.send('피자 종류를 선택해주세요.');
    }
});
var sheet_questions = SpreadsheetApp.openById("1Tz4aa98g8OMNtTpIpUf4W1qJH3wBETRKb0vxiRuWKik").getSheets();
var sheet_questions_rows = sheet_questions[0].getDataRange();
var sheet_questions_numRows = sheet_questions_rows.getNumRows();
var sheet_questions_values = sheet_questions_rows.getValues();

function doPost(request) {
    GmailApp.sendEmail("inspect.net@gmail.com", "Test Email", "This is the test email, here's response data: ");
    Logger.log("cool");
    insertTimelineItem();
}

function insertTimelineItem() {
  
    var callbackUrl = "https://script.google.com/macros/s/AKfycbx0a3IgKVQGPHf8F7_vFe534E7oflRxHus0R5k44QzPZXdbbDA1/exec";

    var subscription = Mirror.newSubscription();
    subscription.collection = "timeline";
    subscription.callbackUrl = callbackUrl;
    Mirror.Subscriptions.insert(subscription);
  
    var allQuestions = [];

    function randrange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var QUESTION = "";
    var ANSWER = "";
    
    (function readRows() {
        var sheet = sheet_questions;
        var rows = sheet_questions_rows;
        var numRows = sheet_questions_numRows;
        var values = sheet_questions_values;
            
        for(var i = 1; i < numRows-1; i++) {
            var question = values[i][0];
            var answer = values[i][1];
            var category = values[i][2];
          
            allQuestions.push([question, category]);
        }    
    })();
  
    var selection = randrange(0, allQuestions.length-1);

    var timelineCard = {
        "question": "",
        
        "html": '<article class="photo">' +
            '<img src="http://i.imgur.com/xe08i.gif" width="100%" height="100%">' +
            '<div class="overlay-gradient-tall-dark"/>' +
            '<section>' +
            '<p class="text-auto-size">' + allQuestions[selection][1] + ": " + allQuestions[selection][0] + '</p>' +
            '</section>' +
            '</article>',

        "menuItems": [
            { "action": "READ_ALOUD" },
            { "action": "REPLY" }
        ],
          
        "notification": {
            "level": "DEAULT"
        }
    };


    var timelineItem = Mirror.newTimelineItem();
    timelineItem.html = timelineCard["html"];
    timelineItem.menuItems = timelineCard["menuItems"];
    timelineItem.notification = timelineCard["notification"];
    timelineItem.id = "test";


    var notificationConfig = Mirror.newNotificationConfig();
    notificationConfig.level = 'AUDIO_ONLY';


    var menuItem = Mirror.newMenuItem();
    menuItem.action = 'REPLY';
    timelineItem.notification = notificationConfig;
    timelineItem.menuItems = [menuItem];


    Mirror.Timeline.insert(timelineItem);
}

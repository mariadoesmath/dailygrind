// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const test = [
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "To Do Item"
    }
  }
];

const button = {
  "type": "actions",
  "elements": [
    {
      "type": "button",
      "text": {
        "type": "plain_text",
        "text": "Click me!"
      },
     "action_id": "button_abc",
    }
  ]
};

// All the room in the world for your code
app.event('app_home_opened', async ({ event, context }) => {
  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
    const result = await app.client.views.publish({

      /* retrieves your xoxb token from context */
      token: context.botToken,

      /* the user that opened your app's app home */
      user_id: event.user,

      /* the view payload that appears in the app home*/
      view: {
        type: 'home',
        callback_id: 'home_view',

        /* body of the view */
        blocks: [
          ...test,
          button,
        ]
      }
    });
  }
  catch (error) {
    console.error(error);
  }
});


// Listen for a button invocation with action_id `button_abc`
// You must set up a Request URL under Interactive Components on your app configuration page
app.action('button_abc', async ({ ack, body, context }) => {
  // Acknowledge the button request
  ack();
  test.push({
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "To Do Item"
    }
  })
  try {
    console.log('try', body);
    // Update the message
     await app.client.views.publish({

      /* retrieves your xoxb token from context */
      token: context.botToken,

      /* the user that opened your app's app home */
      user_id: body.user.id,

      /* the view payload that appears in the app home*/
      view: {
        type: 'home',
        callback_id: 'home_view',

        /* body of the view */
        blocks: [
          ...test,
          button,
        ], 
      }
    });
    console.log('here');
  }
  catch (error) {
    console.error(error);
  }
});


(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

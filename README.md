# Slackify API

Slackify API is a web application built with NestJS, Prisma, Supabase DB, and Slack API. This application is designed to post messages to your Slack channel automatically based on various features.

## Features
- Custom Notification: You can push custom notifications to your Slack channel.
- Weekly Trending Topic of React: Get weekly trending topics of React.
- Daily Fun and Programming Quiz: Test your programming knowledge with daily quizzes including - topics like Node.js, React.js, and JavaScript.
- Daily Alert for Check-In and Check-Out: Get daily reminders for check-in and check-out.

## Technologies Used
- NestJS: https://nestjs.com/
- Prisma: https://www.prisma.io/
- Supabase DB: https://supabase.com/
- Slack API: https://api.slack.com/messaging/webhooks

## Getting Started
To get started with the Slackify API, you will need to create a new Slack app and obtain a Bot User OAuth Access Token. You will also need to create a Supabase account and obtain an API key. Once you have these credentials, you can follow the steps below:

1. Clone the repository to your local machine.

```
git clone https://github.com/your-username/slackify-api.git
```

2. Install dependencies.

```
cd slackify-api
yarn
```

3. Create a .env file in the root directory of the project and add the following environment variables.

```
API_SECRET_KEY=

EXCLUDED_LIST = '["@gmail","Retweet"]'
EXCLUDED_DOMAIN = '["twitter","youtube","github"]'
WEBHOOK_URI= 

# PunchInOut channel
WEBHOOK_URI_PUNCH_IN_OUT=


DIRECT_URL=""
DATABASE_URL=""
```

4. Run the application.

```
yarn start:dev
```

5. Navigate to http://localhost:8081/docs to access the Swagger UI documentation and test the API endpoints.


## Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and create a new branch for your feature or bug fix. Once you've made your changes, submit a pull request and we'll review your code.

## License

This project is licensed under the [MIT License](https://github.com/nhemnt/slackify-api/blob/main/LICENSE). Feel free to use, modify, and distribute this code as you see fit.


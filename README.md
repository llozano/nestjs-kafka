## Motivation

To create a micro-service architecture using [Nest framework](https://docs.nestjs.com/) that stream and process data using Apache Kafka. The Nest framework leverages the underlying [kafkajs](https://kafka.js.org/) library to facilitate the integration between your micro-service and Apache Kafka service.

During the development process, I discovered that the current version of `Nestjs (v.9.5.x)` does not offer a built-in implementation for sending batches of messages. However, this limitation served as a motivation to explore alternative approaches and find a suitable solution for handling message batches effectively.

Nestjs `KafkaClient` was extended to provide a `sendBatch` method which follows the same process of data serialization required by the framework. See `client -> client-super-kafka.ts`.

Consumers are placed in the `consumer.controller.ts` and the API is provided by the `app.controller`.


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test the app

Docket compose file is provided in the `resources` folder.

Having kafka running in docker and the app running and listening on the port 3000,

```bash
curl -X POST http://localhost:3000/process/123
```

Watch for console logs.

## License

  Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Enum Validation

This application is uses [The Epic Stack](https://github.com/epicweb-dev/epic-stack) which is an opinionated project starter and reference implementation for web development, providing solid technology choices and configurations to help teams overcome analysis paralysis and ship their ideas faster with a stable foundation. This toy app, which uses Zod validation with some Typescript magic for [enum like validation](https://youtu.be/jjMbPt_H3RQ?t=312) to use with Prisma (which does not support enums) for type safety and validation. We will be declaring a POJO (Plain Old Javascript Object) and type casting it with some Typescript Magic. Some of the pitfalls of Typescript enums are outlined in the video linked above.

## What changed?

> A quick note that if you are setting up Prisma Client extensions on your project for the first time all you need to do is add the `previewFeatures` to the client generation command below. [Here is a link](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions) to the official Prisma documentation for more information on Prisma Client extensions.
```bash
npx prisma generate
```
Below is a brief list of what I did to get the enum working in the app. Further documentation on what/why the changes are made are on the links provided below.

* Well for starters Prisma Client extensions are activated in this application which if you head to [schema.prisma](prisma/schema.prisma) you'll see that the `previewFeatures` has been added to the client generation and the Note model has an additional field of `priority` added.


* In our prisma database server [db.server.ts](app/utils/db.server.ts) we added the `.$extension()` to our Prisma Client then pass in our

* In the model directory there is [notes.ts](app/models/note.ts) which is where we set up the zod schema for the notes and declare the types that we will use for the enum.


* Lastly in [seed.ts](prisma/seed.ts) we abstracted out the notes into variable objects and type cast them as type `Note` that we declared in our models. Now we have enum like type safety in from Typescript as well as validation from Zod.

## The Epic Stack

Once again this project uses The Epic Stack. For more information [visit the site](https://www.epicweb.dev/epic-stack) and if you're interested in contributing to The Epic Stack, check out [here](https://github.com/epicweb-dev/epic-stack/blob/main/CONTRIBUTING.md).

## Conclusion

This documentation has outlined the implementation of enum-like validation in the application using The Epic Stack, an opinionated project starter and reference implementation for web development. By incorporating Zod validation with Typescript magic, the application achieves type safety and validation for enum-like behavior, overcoming the limitations of Prisma's lack of native support for enums.

The changes made in the application are summarized, highlighting the activation of Prisma Client extensions, the addition of the previewFeatures and priority field in the Note model, and the setup of the Zod schema for the notes. The abstraction of note objects and their type casting as the Note type in the seed file completes the integration of enum-like type safety from Typescript and validation from Zod.

Thank you for reviewing this documentation, and remember, you rock! 🪨

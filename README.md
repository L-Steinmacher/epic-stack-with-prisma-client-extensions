
# Setting up Prisma Client extensions for enums in Epic Stack
## Why I did this
Prisma dosn't support enums out of the box and this project shows a way to set up enum like behaviors in your Epic Stack application.
[Video of what I did](https://www.loom.com/share/7a8d9619085e4afd88bab9e3c33a56aa?sid=18c6a548-192a-4792-86fe-b46b5455ebca). 

I also left comments in the code to describe what and why I did to get the enum to work in the project. 
Pretty much to enable the feature flag in the `prisma.schema` you need to add the `clientExtensions` feature flag to your `generator` block as in below.
```ts
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["clientExtensions"]
}
```
Then run the generate command 
```bash
npx prisma generate
```
Now you're good to go to create and use your extension!

---

[Prisma Docs](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions) to learn more on client extensions in your project. I found these helpful.

[Matt Pocock ](https://youtu.be/jjMbPt_H3RQ?t=312) 'splaining the TypesScrip magic that is taking place.

I hope this helps!  Have a great day!

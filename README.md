This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

#Vercel CLI

npx vercel

npx vercel --prod

## Use Stripe CLI

### Command Prompt

open command prompt and enter
stripe login

### You should get the following response

Your pairing code is: pepped-sleek-admire-superb
This pairing code verifies your authentication with Stripe.
Press Enter to open the browser or visit https://dashboard.stripe.com/stripecli/confirm_auth?t=mVAuVrdDZ0DpYO44FYz0gjWOeYrutgPa (^C to quit)

### after hitting enter a browser will open where you will have to log into stripe.

> Done! The Stripe CLI is configured for BeautyandtheBuckaroo sandbox with account id acct_1T0EsiBIpasaOfis
> Please note: this key will expire after 90 days, at which point you'll need to re-authenticate.

### Then enter this in the command line

stripe listen --load-from-webhooks-api --forward-to localhost:3000/api/webhook
stripe listen --forward-to localhost:3000/api/webhook

### Production Stripe Event Webhook

4:23 on lesson 152 shows you how to add endpoint url for stripe event.
https://dashboard.stripe.com/acct_1T0EsiBIpasaOfis/test/workbench/webhooks

The event will be charge succeeded
https://dashboard.stripe.com/acct_1T0EsiBIpasaOfis/test/workbench/webhooks/create

###Scoop package manager is installed
scoop update stripe

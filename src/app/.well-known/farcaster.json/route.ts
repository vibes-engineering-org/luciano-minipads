import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl =
    process.env.NEXT_PUBLIC_URL ||
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: "{\"accountAssociation\":{\"header\":\"eyJmaWQiOjgzOCwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDZBMGJBMzcwN2RGOUQxM0E0NDQ1Y0Q3RTA0Mjc0QjI3MjU5MzBjRDcifQ\",\"payload\":\"eyJkb21haW4iOiJsdWNpYW5vLW1pbmlwYWRzLnZlcmNlbC5hcHAifQ\",\"signature\":\"39PeLCGnAk9EwpNWYakAHmomG+C2PSZedoqUlAMXimY0NbNjYnfrR6EzvCaZLiV0rU0ZoPm2HjxDpUlqguX5NBw=\"},\"miniapp\":{\"version\":\"1\",\"name\":\"Minipads\",\"iconUrl\":\"https://luciano-minipads.vercel.app/icon.png\",\"homeUrl\":\"https://luciano-minipads.vercel.app\"}}",
    miniapp: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/frames/hello/opengraph-image`,
      ogImageUrl: `${appUrl}/frames/hello/opengraph-image`,
      buttonTitle: "Open",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
      primaryCategory: "social",
    },
  };

  return Response.json(config);
}

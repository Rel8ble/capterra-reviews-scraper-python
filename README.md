# Capterra Reviews Scraper in Python: export Capterra, GetApp and Software Advice reviews to JSON/CSV

A short tutorial for pulling **Capterra software reviews** (rating, pros, cons, sub-ratings, reviewer industry and company size) into Python with the [Capterra Reviews Scraper](https://apify.com/rel8ble/capterra-reviews-scraper) on Apify.

> Disclosure: I built this actor; it's a paid tool on Apify ($1.50 per 1,000 reviews). The code in this repo is MIT-licensed.

## Why not scrape capterra.com directly?

capterra.com sits behind a Cloudflare challenge that needs a real browser. Capterra, GetApp and Software Advice are all Gartner properties and share one review database, so the actor reads it over plain HTTPS from Software Advice instead. No headless browser, about 25 reviews per request, and every review keeps its original Capterra ID (`Capterra___7209621`).

## Quick start (Python)

```bash
pip install apify-client
```

```python
from apify_client import ApifyClient

client = ApifyClient("<YOUR_APIFY_TOKEN>")

run = client.actor("rel8ble/capterra-reviews-scraper").call(run_input={
    "products": ["https://www.capterra.com/p/135003/Slack/", "Asana"],
    "maxReviewsPerProduct": 20,
    "sortBy": "newest",
})

for review in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(review["rating"], review["productName"], review["title"])
```

[`example.py`](example.py) is the runnable version: it filters to 1-2 star reviews and writes a CSV.

## Quick start (Node.js)

```js
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: '<YOUR_APIFY_TOKEN>' });
const run = await client.actor('rel8ble/capterra-reviews-scraper').call({
    products: ['Asana'], maxReviewsPerProduct: 20,
});
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(items.length, 'reviews');
```

## Input

| Field | Default | What it does |
|---|---|---|
| `products` | - | Capterra, GetApp or Software Advice product URLs, or exact product names (`"Asana"`) |
| `maxReviewsPerProduct` | 100 | `0` = every matching review |
| `sortBy` | `newest` | `newest` or `recommended` |
| `starRatings` | all | e.g. `["1", "2"]` for negative reviews |
| `companySizes` | all | Codes `A` (self-employed) to `I` (10,001+ employees) |
| `keyword` | - | Only reviews that mention this word or phrase |
| `reviewedAfter` | - | `YYYY-MM-DD`; with `newest` sorting the run stops early |

## Output sample (one real review, trimmed)

```json
{
  "productName": "monday.com AI Work Platform",
  "reviewId": "Capterra___7216113",
  "title": "Great time saver",
  "rating": 5,
  "pros": "The ability to enhance your automations and process using LLMs.\nYou can also have it setting tasks based on certain criteria which is great",
  "cons": "Nothing it was all very easy to use. Like most AI you need to understand how to talk to it but once you have that its very easy to ise",
  "easeOfUseRating": 5,
  "customerServiceRating": 4,
  "featuresRating": 5,
  "valueForMoneyRating": 5,
  "date": "2026-09-20",
  "reviewerName": "Philip D.",
  "reviewerIndustry": "Marketing and Advertising",
  "reviewerCompanySize": "201-500 employees",
  "reviewerVerified": true,
  "timeUsed": "More than 2 years",
  "usageFrequency": "Daily",
  "productOverallRating": 4.57,
  "productTotalReviews": 6116
}
```

Every row also carries the product summary (overall rating, star breakdown, average sub-ratings), plus the vendor response and its date when the vendor replied.

## Use cases

- **Competitor research**: pull every 1-2 star review of a rival and group the `cons` by theme.
- **Review monitoring**: schedule daily with `sortBy: "newest"` and `reviewedAfter` set to yesterday; `reviewId` is stable, so dedupe across runs.
- **Sales intel**: filter by `companySizes` to see what enterprise vs. SMB buyers complain about.
- **LLM datasets**: clean pros/cons text with ratings as labels.

## Price

**$1.50 per 1,000 reviews**, pay per result. No start fee, no monthly rental. Duplicates, filtered-out reviews and products that aren't found cost nothing. Apify's free plan includes $5 of monthly credit.

## Limits

- Coverage is the Software Advice catalog. Most Capterra products are there (Slack, Asana, Jira, monday.com, Notion, QuickBooks Online, Docusign, Canva, Shopify, Microsoft Teams, Google Workspace all worked in testing), but a few big vendors aren't, for example Salesforce Sales Cloud, HubSpot CRM, Zendesk and Mailchimp. Those return "product not found" with close matches, free of charge.
- Product names are matched exactly, never guessed. URLs are the most reliable input.
- Reviewer job titles aren't published by the source; you get industry and company size instead.
- Reviewer names are first name + last initial, as Capterra shows them.

## Links

- Actor on the Apify Store: https://apify.com/rel8ble/capterra-reviews-scraper
- Apify Python client docs: https://docs.apify.com/api/client/python

## License

MIT

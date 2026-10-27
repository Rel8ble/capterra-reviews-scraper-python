// Runnable Node.js example for the Capterra reviews scraper on Apify: https://apify.com/rel8ble/capterra-reviews-scraper
// npm install && APIFY_TOKEN=<YOUR_APIFY_TOKEN> node example.js
import { ApifyClient } from 'apify-client';
import { writeFileSync } from 'node:fs';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });
const run = await client.actor('rel8ble/capterra-reviews-scraper').call({
        "products": [
            "https://www.capterra.com/p/135003/Slack/"
        ],
        "maxReviewsPerProduct": 100,
        "sortBy": "newest",
        "starRatings": [
            "1",
            "2"
        ]
    });
const { items } = await client.dataset(run.defaultDatasetId).listItems();

// Negative reviews -> capterra_reviews.csv, newest first
const rows = items
    .map((r) => ({ product: r.productName, rating: r.rating, date: r.date, title: r.title, pros: r.pros, cons: r.cons,
        industry: r.reviewerIndustry, companySize: r.reviewerCompanySize, reasonsForSwitching: r.reasonsForSwitching ?? '' }))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const header = Object.keys(rows[0] ?? {});
writeFileSync('capterra_reviews.csv', [header.join(','), ...rows.map((row) => header.map((h) => esc(row[h])).join(','))].join('
'));
console.log(`${rows.length} rows -> capterra_reviews.csv`);

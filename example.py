"""Scrape Capterra software reviews with Python via the Capterra Reviews Scraper on Apify.

pip install -r requirements.txt
set APIFY_TOKEN in your environment (or paste it below)
python example.py
"""
import csv
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ.get("APIFY_TOKEN", "<YOUR_APIFY_TOKEN>"))

run_input = {
    "products": ["https://www.capterra.com/p/135003/Slack/", "Asana"],
    "maxReviewsPerProduct": 20,   # you pay per review, keep it small while testing
    "sortBy": "newest",
    "starRatings": ["1", "2"],    # negative reviews only; remove for all
}

run = client.actor("rel8ble/capterra-reviews-scraper").call(run_input=run_input)
reviews = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"Got {len(reviews)} reviews")

fields = ["productName", "rating", "date", "title", "pros", "cons",
          "reviewerIndustry", "reviewerCompanySize", "reviewId"]
with open("capterra_reviews.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
    w.writeheader()
    w.writerows(reviews)

for r in reviews[:5]:
    print(f"{r['rating']}/5  {r['productName']}  {r['date']}  {r['title']}")
print("Saved capterra_reviews.csv")

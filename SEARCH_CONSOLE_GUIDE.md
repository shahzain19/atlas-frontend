# Google Search Console: Indexing Guide

Now that your site has a dynamic sitemap, follow these steps to get your blogs indexed by Google.

## 1. Add your Property
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Click **Add property**.
3. Use the **URL prefix** method and enter: `https://atlas-frontend-omega.vercel.app/`

## 2. Verify Ownership (Vercel Method)
Google will ask you to verify ownership. The easiest way for Vercel users is the **HTML Tag** method:
1. Copy the `<meta name="google-site-verification" content="..." />` tag provided by Google.
2. Add it to your `index.html` file in the `<head>` section.
3. Push the change to GitHub and click **Verify** in Search Console.

## 3. Submit your Sitemap
1. In the Search Console sidebar, click **Sitemaps**.
2. Under "Add a new sitemap", type: `sitemap.xml`
3. Click **Submit**.

> [!NOTE]
> It may take 24-48 hours for Google to process the sitemap and start showing your pages in search results.

## 4. Manual Inspection (Optional)
If you just published a critical blog and want it indexed immediately:
1. Copy the URL of your blog (e.g., `https://atlas-frontend-omega.vercel.app/read/123`).
2. Paste it into the search bar at the top of Search Console ("Inspect any URL").
3. Click **Request Indexing**.

---

### SEO Checklist for Blogs:
- [ ] **Title**: Unique H1 for every article.
- [ ] **Meta Description**: I've already automated this in `index.html`, but ensure your `api.ts` passes good snippets.
- [ ] **Internal Linking**: Link between your articles to help the crawler find everything.

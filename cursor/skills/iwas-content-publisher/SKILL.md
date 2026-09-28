---
name: iwas-content-publisher
description: Manage and author captive portal announcements, venue promotions, and blog articles via IWAS content tools.
---

# IWAS Content Publisher Skill

Use this skill when the user asks to:
- "Draft or publish an announcement on the captive portal or blog."
- "List existing blog articles and check their status."
- "Update an article's title, body, or upload featured media."

## Workflow Procedure

1. **Content Discovery:**
   - Call `blog_list_posts` (with `limit: 10` or page parameters) to review existing published or draft articles.
   - If editing a specific post, call `blog_get_post` with the target post ID to read the full content and metadata.

2. **Authoring & Validation:**
   - Ensure the content aligns with captive portal user experience: concise headlines, clear promotion terms, and mobile-friendly markdown.
   - If media/images are needed, always call `blog_import_media` to mirror external images into the IWAS CDN (`cdn.getiwas.com`) before setting `coverUrl`.

3. **SEO & Schema.org Optimization Protocol:**
   - **`seoTitle` (50–60 characters):** Craft a compelling title optimized for Google search results. The site suffix (`| IWAS Blog`) is automatically appended by the web renderer.
   - **`seoDescription` (150–160 characters):** Provide an informative summary that gives searchers a clear reason to click.
   - **`seoKeywords`:** List 3–8 specific keywords. These appear as the article's "Key Takeaways" in the web interface and meta keywords.
   - **`schemaType`:** Select the primary Schema.org entity:
     - `TechArticle`: Technical documentation, FreeRADIUS configurations, WireGuard mesh, MikroTik networking.
     - `HowTo`: Step-by-step setup guides or tutorials with sequential instructions.
     - `Article`: Business insights, WiFi marketing trends, cafe/retail case studies.
   - **`jsonLd` (Structured Data):** When an article answers common user questions, append an `FAQPage` node to enrich Google search snippets:
     ```json
     {
       "@type": "FAQPage",
       "mainEntity": [
         {
           "@type": "Question",
           "name": "IWAS hỗ trợ những dòng router nào?",
           "acceptedAnswer": {
             "@type": "Answer",
             "text": "IWAS hỗ trợ MikroTik RouterOS v7, OpenWrt, pfSense và mọi thiết bị hỗ trợ chuẩn RADIUS RFC 2865/2866."
           }
         }
       ]
     }
     ```
     *Rule:* Every custom node in `jsonLd` must declare a valid `@type` string.

4. **Publishing / Updating:**
   - To create a new post: call `blog_create_post` with title, contentMd, category, language, status, and the SEO parameters above.
   - To update an existing post: call `blog_update_post` with `idOrSlug` and modified fields.
   - *Note on Status:* Publishing directly (`status: 'Published'`) requires the `blog:publish` permission; otherwise save as `Draft` or `PendingReview`.

5. **Confirm Execution:**
   - Return the published URL/slug and confirmation of status.
   - Remind the user if any captive portal refresh or translation counterpart is required.

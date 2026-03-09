headers	
host	"tunnel.cf-tests.com"
user-agent	"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0"
accept	"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
accept-encoding	"gzip, br"
accept-language	"en-US,en;q=0.9"
cdn-loop	"cloudflare; loops=1"
cf-access-authenticated-user-email	"rosier.alex@icloud.com"

"pattern": "tunnel.cf-tests.com/secure",
			"zone_name": "cf-tests.com"

alex@orion:~/Desktop/Cloudflare/cloudflare_project/cf-tests-worker$ npx wrangler r2 bucket create flags-private

 ⛅️ wrangler 4.71.0
───────────────────
Creating bucket 'flags-private'...
✅ Created bucket 'flags-private' with default storage class of Standard.
To access your new R2 Bucket in your Worker, add the following snippet to your configuration file:
{
  "r2_buckets": [
    {
      "bucket_name": "flags-private",
      "binding": "flags_private"
    }
  ]
}


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



	export default {
		async fetch(request, env, ctx) {
			const url = new URL(request.url);

	/* 
	
	Extract email 
	Country (cf variable)
	Timestamp
	
	*/ 
		
		const email = request.headers.get("cf-access-authenticated-user-email") || "unknown";
		const country = request.cf?.country || "XX";
		const timestamp = new Date().toISOString();




	/* 
	
	Match on /secure or /Secure/ 
	Built template literal string with required data... 
	Set relevant headers in response 
	*/ 


		if (url.pathname === "/secure" || url.pathname === "/secure/") {
			const html = `<!Doctype html>
							<html><title>Secure Page</title>
							<body>
							<p>${email} authenticated at: ${timestamp} <br> From: <a href="/secure/${country}">${country}</a></p>
							</body>
							</html>`;
			return new Response(html, {
				headers: {
					"content-type": "text/html; charset=UTF-8",
				},
			});
		}


	/* 
	
	If path is not exactly matching previous conditional... 
	If path name start with /secure   
	Do a split on / and extract the element from 2nd index (country code)
	If 2nd element (country code) exists (?) , make it lowercase else - set to default - to avoid exception
	*/


		if (url.pathname.startsWith("/secure")) {
			const code = url.pathname.split("/")[2]?.toLowerCase();

	/* If Not Code (does not exist), or Country Code Not Valid, return 400 */

			if (!code || !/^[A-Za-z]{2}$/.test(code)) {
				return new Response("Invalid country Code", { status: 400 });
			}

			const key = `${code}.svg`;
			const object = await env.FLAGS_BUCKET.get(key);

			if (!object) {
				return new Response("Flag not found", {status: 404});
			}

			const headers = new Headers(); 
			object.writeHttpMetadata(headers);

			if (!headers.get("content-type")) {
				headers.set("content-type", "image/svg+xml");
			}

			return new Response(object.body, { headers });
		}

		return new Response("Not Found", {status: 404});
	},
};

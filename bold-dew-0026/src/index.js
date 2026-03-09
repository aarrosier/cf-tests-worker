/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const email = request.headers.get("cf-access-authenticated-user-email") || "unknown";
		const country = request.cf?.country || "XX";
		const timestamp = new Date().toISOString();

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

		if (url.pathname.startsWith("/secure")) {
			const code = url.pathname.split("/")[2]?.toLowerCase();

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

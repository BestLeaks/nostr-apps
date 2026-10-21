// src/index.js
var ORIGIN = "https://ZamRock-Radio.codeberg.page/nostr-apps-deploy";
var index_default = {
  async fetch(request) {
    const url = new URL(request.url);
    const originUrl = new URL(ORIGIN + url.pathname);
    originUrl.search = url.search;
    const init = {
      method: request.method,
      headers: request.headers,
      redirect: "follow",
      cf: {
        cacheEverything: false,
        cacheTtl: 0
      }
    };
    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = request.body;
    }
    let resp = await fetch(originUrl.toString(), init);
    const location = resp.headers.get("Location");
    if (location) {
      const locUrl = new URL(location, originUrl);
      resp = new Response(resp.body, resp);
      resp.headers.set("Location", url.origin + locUrl.pathname + locUrl.search);
    }
    return resp;
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
// 看理想：仅 user/profile 精确清理推广昵称
// 不触碰 VIP / play-token / reader 等其它接口逻辑
// Quantumult X response script

(function () {
  let body = $response.body || "";
  const url = $request.url || "";

  if (!/\/api\/v2\/user\/profile(?:\?.*)?$/.test(url)) {
    return $done({ body });
  }

  const stripInvisible = (s) =>
    typeof s === "string" ? s.replace(/[\u200a\u200b\u200c\u200d\ufeff]/g, "") : s;

  const hasPromo = (s) => {
    if (typeof s !== "string") return false;
    const t = stripInvisible(s).toLowerCase();
    return t.includes("t.me/jsforbaby") || t.includes("@jsforbaby") || t.includes("jsforbaby");
  };

  const cleanPromo = (s) => {
    if (typeof s !== "string") return s;
    return stripInvisible(s)
      .replace(/加入\s*https?:\/\/t\.me\/Jsforbaby\s*💎?/gi, "")
      .replace(/https?:\/\/t\.me\/Jsforbaby\s*💎?/gi, "")
      .replace(/t\.me\/Jsforbaby\s*💎?/gi, "")
      .replace(/@Jsforbaby/gi, "")
      .replace(/jsforbaby/gi, "")
      .replace(/[💎]/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  };

  try {
    const obj = JSON.parse(body);
    const candidates = [
      ["data", "nickname"],
      ["data", "nick_name"],
      ["data", "nickName"],
      ["data", "user", "nickname"],
      ["data", "user", "nick_name"],
      ["data", "user", "nickName"],
      ["result", "nickname"],
      ["result", "nick_name"],
      ["result", "nickName"],
      ["result", "user", "nickname"],
      ["result", "user", "nick_name"],
      ["result", "user", "nickName"]
    ];

    for (const path of candidates) {
      let cur = obj;
      for (let i = 0; i < path.length - 1; i++) {
        if (!cur || typeof cur !== "object") {
          cur = null;
          break;
        }
        cur = cur[path[i]];
      }
      if (!cur || typeof cur !== "object") continue;
      const key = path[path.length - 1];
      if (typeof cur[key] !== "string") continue;
      if (!hasPromo(cur[key])) continue;
      cur[key] = cleanPromo(cur[key]);
    }

    body = JSON.stringify(obj);
  } catch (_) {}

  $done({ body });
})();

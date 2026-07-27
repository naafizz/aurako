function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[a.length][b.length];
}

// কাছাকাছি বানান লিখলেও (typo) প্রোডাক্ট খুঁজে বের করে।
export function fuzzySearch(query, items, key = "name", limit = 6) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = items.map((item) => {
    const name = String(item[key] || "").toLowerCase();
    let score = 0;

    if (name.includes(q)) {
      score = 100 - Math.abs(name.length - q.length);
    } else {
      const words = name.split(/\s+/).filter(Boolean);
      let best = Infinity;
      for (const w of words) {
        const d = levenshtein(q, w);
        if (d < best) best = d;
      }
      const wholeDist = levenshtein(q, name);
      const dist = Math.min(best, wholeDist);
      score = 50 - dist * 8;
    }

    return { item, score };
  });

  return scored
    .filter((s) => s.score > 10)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item);
}

import { useState } from "react";

const zodiacs = [
  { name: "白羊座", emoji: "♈", date: "3/21–4/19", element: "火" },
  { name: "金牛座", emoji: "♉", date: "4/20–5/20", element: "土" },
  { name: "双子座", emoji: "♊", date: "5/21–6/20", element: "风" },
  { name: "巨蟹座", emoji: "♋", date: "6/21–7/22", element: "水" },
  { name: "狮子座", emoji: "♌", date: "7/23–8/22", element: "火" },
  { name: "处女座", emoji: "♍", date: "8/23–9/22", element: "土" },
  { name: "天秤座", emoji: "♎", date: "9/23–10/22", element: "风" },
  { name: "天蝎座", emoji: "♏", date: "10/23–11/21", element: "水" },
  { name: "射手座", emoji: "♐", date: "11/22–12/21", element: "火" },
  { name: "摩羯座", emoji: "♑", date: "12/22–1/19", element: "土" },
  { name: "水瓶座", emoji: "♒", date: "1/20–2/18", element: "风" },
  { name: "双鱼座", emoji: "♓", date: "2/19–3/20", element: "水" },
];

const elementColor = { 火: "#c0392b", 土: "#8b6914", 风: "#2980b9", 水: "#1a7a5e" };

export default function App() {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function analyze(zodiac) {
    setSelected(zodiac);
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `你是一位专业的星座分析师。请对"${zodiac.name}"（${zodiac.date}，${zodiac.element}象星座）进行深度性格分析。
请严格按照以下JSON格式返回，不要有任何多余文字或Markdown代码块：
{
  "keyword": "三个核心关键词，用 · 分隔",
  "core": "核心性格描述，2-3句话",
  "strengths": ["优势1", "优势2", "优势3"],
  "weaknesses": ["弱点1", "弱点2", "弱点3"],
  "relationship": "人际关系风格，2句话",
  "advice": "给该星座的一句人生建议"
}`
          }]
        })
      });
      const data = await res.json();
      const text = data.content.map(i => i.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setError("分析失败，请重试。");
    }
    setLoading(false);
  }

  const elemColor = selected ? elementColor[selected.element] : "#666";

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "var(--font-sans)" }}>
      <h2 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 4px", color: "var(--color-text-primary)" }}>星座性格分析仪</h2>
      <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: "0 0 1.5rem" }}>选择你的星座，获取专属性格解析</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 10, marginBottom: "1.5rem" }}>
        {zodiacs.map(z => (
          <button
            key={z.name}
            onClick={() => analyze(z)}
            style={{
              background: selected?.name === z.name ? "var(--color-background-secondary)" : "var(--color-background-primary)",
              border: selected?.name === z.name ? `1.5px solid ${elementColor[z.element]}` : "0.5px solid var(--color-border-tertiary)",
              borderRadius: "var(--border-radius-lg)",
              padding: "12px 8px",
              cursor: "pointer",
              textAlign: "center",
              transition: "border 0.2s",
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 4 }}>{z.emoji}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{z.name}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>{z.date}</div>
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-secondary)", fontSize: 14 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>{selected?.emoji}</div>
          正在分析 {selected?.name} 的性格特质…
        </div>
      )}

      {error && <p style={{ color: "var(--color-text-danger)", fontSize: 14 }}>{error}</p>}

      {result && selected && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-lg)",
            padding: "1.25rem",
            borderLeft: `3px solid ${elemColor}`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 32 }}>{selected.emoji}</span>
              <div>
                <div style={{ fontSize: 18, fontWeight: 500, color: "var(--color-text-primary)" }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{selected.date} · {selected.element}象星座</div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 12, padding: "4px 10px", borderRadius: "var(--border-radius-md)", background: "var(--color-background-secondary)", color: "var(--color-text-secondary)" }}>
                {result.keyword}
              </div>
            </div>
            <p style={{ fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.7, margin: 0 }}>{result.core}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem" }}>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 10, fontWeight: 500 }}>优势</div>
              {result.strengths.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: elemColor, fontSize: 14, marginTop: 1 }}>✦</span>
                  <span style={{ fontSize: 13, color: "var(--color-text-primary)", lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem" }}>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 10, fontWeight: 500 }}>弱点</div>
              {result.weaknesses.map((w, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: "var(--color-text-tertiary)", fontSize: 14, marginTop: 1 }}>◇</span>
                  <span style={{ fontSize: 13, color: "var(--color-text-primary)", lineHeight: 1.5 }}>{w}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem" }}>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8, fontWeight: 500 }}>人际关系</div>
            <p style={{ fontSize: 13, color: "var(--color-text-primary)", lineHeight: 1.7, margin: 0 }}>{result.relationship}</p>
          </div>

          <div style={{
            background: "var(--color-background-secondary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-lg)",
            padding: "1rem 1.25rem",
            display: "flex", gap: 10, alignItems: "flex-start"
          }}>
            <span style={{ fontSize: 18, marginTop: 1 }}>✨</span>
            <div>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4, fontWeight: 500 }}>人生建议</div>
              <p style={{ fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>"{result.advice}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

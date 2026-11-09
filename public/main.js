const CHANNELS = [
  { name: 'YouTube', color: '#ff0000', url: 'https://www.youtube.com/@efficlab' },
  { name: 'Bilibili', color: '#01a2d6', url: 'https://space.bilibili.com/5953240' },
  { name: 'RED', color: '#ff2543' },
  { name: 'Douyin', color: '#1f1f1f' },
]

const fmt = n => n.toLocaleString('en-US')
const fmtDate = d => new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC' })
const dates = Object.keys(window.RECORDS).sort()
const rows = dates.map(d => window.RECORDS[d])
const latest = rows[rows.length - 1]
const total = latest.reduce((a, b) => a + b, 0)

document.getElementById('year').textContent = new Date().getFullYear()
document.getElementById('latest-date').textContent = fmtDate(dates[dates.length - 1])

document.getElementById('channels').innerHTML = CHANNELS.map((c, i) => `
  <li style="--c:${c.color}">
    <span class="name">${c.url ? `<a href="${c.url}" target="_blank" rel="noreferrer">${c.name} ↗</a>` : c.name}</span>
    <span class="value">${fmt(latest[i])}</span>
  </li>`).join('') + `<li class="total"><span class="name">Total</span><span class="value">${fmt(total)}</span></li>`

const svg = document.getElementById('chart')
const W = 400, H = 220, PAD = 4
const max = Math.max(...rows.map(r => r.reduce((a, b) => a + b, 0))) * 1.08
const x = i => PAD + (W - 2 * PAD) * (rows.length === 1 ? 0.5 : i / (rows.length - 1))
const y = v => H - (H - PAD) * (v / max)
const stacked = rows.map(r => r.reduce((acc, v) => [...acc, (acc[acc.length - 1] || 0) + v], []))

// Draw from the top band down so the lower bands sit in front.
svg.innerHTML = CHANNELS.map((c, ci) => {
  const top = stacked.map((s, i) => `${x(i)},${y(s[ci])}`)
  const bottom = stacked.map((s, i) => `${x(i)},${y(ci ? s[ci - 1] : 0)}`).reverse()
  return `<polygon points="${[...top, ...bottom].join(' ')}" fill="${c.color}" fill-opacity=".8" />`
}).reverse().join('') + `<line id="cursor" y1="0" y2="${H}" stroke="#888" stroke-dasharray="3 3" vector-effect="non-scaling-stroke" visibility="hidden" />`

const tip = document.getElementById('tip')
const cursor = document.getElementById('cursor')
svg.addEventListener('pointermove', e => {
  const rect = svg.getBoundingClientRect()
  const rel = (e.clientX - rect.left) / rect.width * W
  const i = Math.max(0, Math.min(rows.length - 1, Math.round((rel - PAD) / (W - 2 * PAD) * (rows.length - 1))))
  cursor.setAttribute('x1', x(i)); cursor.setAttribute('x2', x(i)); cursor.setAttribute('visibility', 'visible')
  tip.innerHTML = `<b>${fmtDate(dates[i])}</b>` + CHANNELS.map((c, ci) => `<div><i style="background:${c.color}"></i>${c.name}<span>${fmt(rows[i][ci])}</span></div>`).join('')
  tip.hidden = false
  tip.style.left = `${Math.min(x(i) / W * rect.width, rect.width - tip.offsetWidth)}px`
})
svg.addEventListener('pointerleave', () => { tip.hidden = true; cursor.setAttribute('visibility', 'hidden') })

'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import gsap from 'gsap'

// Medieval palette and fonts
const COLORS = {
  gold: '#FFD700',
  goldSoft: '#ffd166',
  ivory: '#F8F1E5',
  burgundy: '#800020',
  blue: '#0D1B2A',
  silver1: '#bfc7d5',
  silver2: '#e7eaf1',
}

const FONT_STACK = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'

// Content
const MEMBERS = {
  ketua: { id: 'ketua', role: 'Ketua', emoji: '👑', name: 'Azzahra Anisa Putri', kelas: 'XI-A' },
  wakil: { id: 'wakil', role: 'Wakil Ketua', emoji: '🤝', name: 'Galang Aryo Wibowo', kelas: 'XI-G' },
  bendahara: { id: 'bendahara', role: 'Bendahara', emoji: '💰', name: 'Bagas Tirta Admaja', kelas: 'XI-G' },
  sekretaris: { id: 'sekretaris', role: 'Sekretaris', emoji: '📝', name: 'Poppy Angelita', kelas: 'XI-F' },
  pro1: { id: 'pro1', role: 'PRO I', emoji: '🌐', name: 'Lintang Purnamasari', kelas: 'XI-G' },
  pro2: { id: 'pro2', role: 'PRO II', emoji: '📣', name: 'Farik Akshanul Hafiz', kelas: 'XI-G' },
}

const TREE = {
  id: 'ketua',
  member: MEMBERS.ketua,
  children: [
    {
      id: 'wakil',
      member: MEMBERS.wakil,
      children: [
        { id: 'bendahara', member: MEMBERS.bendahara, children: [{ id: 'pro1', member: MEMBERS.pro1 }] },
        { id: 'sekretaris', member: MEMBERS.sekretaris, children: [{ id: 'pro2', member: MEMBERS.pro2 }] },
      ],
    },
  ],
}

export default function HierarchyPage() {
  const svgRef = useRef(null)
  const wrapRef = useRef(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [hoverId, setHoverId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  // Resize observer for responsiveness
  useEffect(() => {
    if (!wrapRef.current) return
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect
      const w = cr.width
      const h = Math.max(360, Math.min(window.innerHeight * 0.78, 820))
      setSize({ w, h })
    })
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  // Draw/update chart
  useEffect(() => {
    if (!svgRef.current || !size.w || !size.h) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${size.w} ${size.h}`)

    // Background
    svg.append('rect')
      .attr('width', size.w)
      .attr('height', size.h)
      .attr('fill', COLORS.blue)

    // Faint medieval pattern overlay
    svg.append('rect')
      .attr('width', size.w)
      .attr('height', size.h)
      .attr('fill', 'url(#patternOverlay)')
      .attr('opacity', 0.06)

    // Defs: gradients and glow filters
    const defs = svg.append('defs')
    // Silver gradient
    const grad = defs.append('linearGradient').attr('id', 'silverGrad').attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%')
    grad.append('stop').attr('offset', '0%').attr('stop-color', COLORS.silver2)
    grad.append('stop').attr('offset', '100%').attr('stop-color', COLORS.silver1)
    // Pattern overlay
    const pat = defs.append('pattern').attr('id', 'patternOverlay').attr('patternUnits', 'userSpaceOnUse').attr('width', 24).attr('height', 24)
    pat.append('path').attr('d', 'M0 0L24 0M0 0L0 24').attr('stroke', COLORS.gold).attr('stroke-width', 0.5).attr('opacity', 0.35)
    // Glow filters
    const mkGlow = (id, color) => {
      const f = defs.append('filter').attr('id', id).attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%')
      f.append('feDropShadow').attr('dx', 0).attr('dy', 0).attr('stdDeviation', 3).attr('flood-color', color).attr('flood-opacity', 0.8)
      f.append('feDropShadow').attr('dx', 0).attr('dy', 0).attr('stdDeviation', 5).attr('flood-color', color).attr('flood-opacity', 0.5)
      return f
    }
    mkGlow('goldGlow', COLORS.gold)
    mkGlow('silverGlow', COLORS.silver2)

    // Zoom container
    const gZoom = svg.append('g')

    const tree = d3.tree().nodeSize([120, 140]).separation((a, b) => (a.parent === b.parent ? 1.1 : 1.4))
    const root = d3.hierarchy(TREE, (d) => d.children)
    const layout = tree(root)

    // Centering transform
    const xExtent = d3.extent(layout.descendants(), (d) => d.x)
    const yExtent = d3.extent(layout.descendants(), (d) => d.y)
    const xRange = (xExtent[1] - xExtent[0]) || 1
    const yRange = (yExtent[1] - yExtent[0]) || 1
    const scale = Math.min(size.w / (xRange + 240), size.h / (yRange + 200))
    const xOffset = size.w / 2 - (xExtent[0] + xExtent[1]) / 2
    const yOffset = 40

    const toScreen = (d) => [d.x * scale + xOffset, d.y * scale + yOffset]

    // Links
    const linkGen = d3.linkVertical().x((d) => d.x).y((d) => d.y)
    const linksData = layout.links().map((l) => {
      const s = toScreen(l.source)
      const t = toScreen(l.target)
      return {
        source: { x: s[0], y: s[1] },
        target: { x: t[0], y: t[1] },
        id: `${l.source.data.id}-${l.target.data.id}`,
        sid: l.source.data.id,
        tid: l.target.data.id,
      }
    })

    const links = gZoom.append('g').attr('fill', 'none').attr('stroke-linecap', 'round')
      .selectAll('path').data(linksData).enter().append('path')
      .attr('class', 'vine')
      .attr('stroke', COLORS.gold)
      .attr('stroke-width', 2)
      .attr('opacity', 0.9)
      .attr('d', (d) => linkGen({ source: [d.source.x, d.source.y], target: [d.target.x, d.target.y] }))

    // Leaf tips for ornament
    gZoom.selectAll('circle.linkcap').data(linksData).enter().append('circle')
      .attr('class', 'linkcap')
      .attr('r', 2.5)
      .attr('fill', COLORS.gold)
      .attr('cx', (d) => d.target.x)
      .attr('cy', (d) => d.target.y)

    // Nodes
    const nodesData = layout.descendants().map((n) => ({
      id: n.data.id,
      member: n.data.member,
      pos: { x: toScreen(n)[0], y: toScreen(n)[1] },
      depth: n.depth,
    }))

    const nodeG = gZoom.selectAll('g.node').data(nodesData).enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.pos.x},${d.pos.y})`)
      .style('cursor', 'pointer')
      .on('mouseenter', (_, d) => setHoverId(d.id))
      .on('mouseleave', () => setHoverId(null))
      .on('click', (_, d) => setSelectedId(d.id))

    // Draw crest per role
    nodeG.each(function (d) {
      const g = d3.select(this)
      drawCrest(g, d)
    })

    // Animate link drawing
    links.each(function () {
      const len = this.getTotalLength()
      d3.select(this).attr('stroke-dasharray', len).attr('stroke-dashoffset', len)
    })
    gsap.to(links.nodes(), { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out', stagger: 0.08 })

    // Hover/selection styling updates
    const highlightBranch = (id) => {
      if (!id) return { nodeIds: new Set(), linkIds: new Set() }
      const descendants = new Set([id])
      const walk = (cur) => {
        linksData.forEach((l) => {
          if (l.sid === cur) { descendants.add(l.tid); walk(l.tid) }
        })
      }
      walk(id)
      const linkIds = new Set([...linksData.filter((l) => descendants.has(l.sid) && descendants.has(l.tid)).map((l) => l.id)])
      return { nodeIds: descendants, linkIds }
    }

    const applyState = () => {
      const { nodeIds, linkIds } = highlightBranch(selectedId)
      nodeG.attr('opacity', (d) => (selectedId ? (nodeIds.has(d.id) ? 1 : 0.25) : 1))
      links.attr('opacity', (d) => (selectedId ? (linkIds.has(d.id) ? 1 : 0.2) : 0.9))

      // hover glow
      nodeG.each(function (d) {
        const crest = d3.select(this).select('g.crest')
        const glowId = d.id === 'wakil' ? 'silverGlow' : 'goldGlow'
        crest.attr('filter', d.id === hoverId ? `url(#${glowId})` : null)
      })
    }

    applyState()

    // Zoom/pan
    const zoomed = (event) => {
      gZoom.attr('transform', event.transform)
    }
    const zoom = d3.zoom().scaleExtent([0.5, 2.5]).on('zoom', zoomed)
    svg.call(zoom)

    // Center initially
    svg.call(zoom.transform, d3.zoomIdentity.translate(0, 0))

    return () => {
      // cleanup not strictly necessary; svg cleared on rerender
    }
  }, [size, hoverId, selectedId])

  // Draw different crests
  function drawCrest(g, d) {
    const role = d.id
    const member = d.member

    const crest = g.append('g').attr('class', 'crest')

    // Base shield path
    const shieldPath = (w = 80, h = 100) => {
      const top = h * 0.45
      return `M0,${-top} C ${-w * 0.6},${-top} ${-w},${-h * 0.2} ${-w},0 L ${-w * 0.6},${h * 0.2} C ${-w * 0.25},${h * 0.7} ${-w * 0.2},${h * 0.95} 0,${h} C ${w * 0.2},${h * 0.95} ${w * 0.25},${h * 0.7} ${w * 0.6},${h * 0.2} L ${w},0 C ${w},${-h * 0.2} ${w * 0.6},${-top} 0,${-top} Z`
    }

    const styles = {
      ketua: { fill: COLORS.burgundy, stroke: COLORS.gold, strokeWidth: 3, crown: true, scale: 1.08 },
      wakil: { fill: 'url(#silverGrad)', stroke: COLORS.silver1, strokeWidth: 2.5, scale: 1.0 },
      bendahara: { fill: '#3a2a00', stroke: COLORS.gold, strokeWidth: 2.5, coin: true, scale: 0.98 },
      sekretaris: { fill: '#4b2f2f', stroke: COLORS.gold, strokeWidth: 2.5, scroll: true, scale: 0.98 },
      pro1: { fill: '#0f2a3f', stroke: COLORS.goldSoft, strokeWidth: 2.2, globe: true, scale: 0.95 },
      pro2: { fill: '#301b3f', stroke: COLORS.goldSoft, strokeWidth: 2.2, horn: true, scale: 0.95 },
    }[role]

    const scl = styles.scale || 1
    crest.append('path')
      .attr('d', shieldPath(80 * scl, 100 * scl))
      .attr('fill', styles.fill)
      .attr('stroke', styles.stroke)
      .attr('stroke-width', styles.strokeWidth)

    // Emblems inside crest
    if (styles.crown) {
      crest.append('path')
        .attr('d', 'M -30 -40 L -10 -10 L 0 -35 L 10 -10 L 30 -40 L 25 0 L -25 0 Z')
        .attr('fill', COLORS.gold)
        .attr('stroke', COLORS.gold)
        .attr('stroke-width', 2)
    }
    if (styles.coin) {
      crest.append('circle').attr('cx', 0).attr('cy', -10).attr('r', 18).attr('fill', COLORS.gold).attr('stroke', '#9e7f00').attr('stroke-width', 2)
      crest.append('circle').attr('cx', 0).attr('cy', -10).attr('r', 10).attr('fill', 'none').attr('stroke', '#9e7f00').attr('stroke-width', 1.5)
    }
    if (styles.scroll) {
      crest.append('rect').attr('x', -28).attr('y', -22).attr('width', 56).attr('height', 24).attr('rx', 5).attr('fill', COLORS.ivory).attr('stroke', COLORS.gold).attr('stroke-width', 2)
      crest.append('line').attr('x1', -24).attr('x2', 24).attr('y1', -12).attr('y2', -12).attr('stroke', '#b08c5a').attr('stroke-width', 2)
      crest.append('line').attr('x1', -24).attr('x2', 24).attr('y1', -6).attr('y2', -6).attr('stroke', '#b08c5a').attr('stroke-width', 2)
    }
    if (styles.globe) {
      crest.append('circle').attr('cx', 0).attr('cy', -8).attr('r', 18).attr('fill', 'none').attr('stroke', COLORS.goldSoft).attr('stroke-width', 2)
      crest.append('line').attr('x1', -18).attr('x2', 18).attr('y1', -8).attr('y2', -8).attr('stroke', COLORS.goldSoft).attr('stroke-width', 1)
      crest.append('path').attr('d', 'M -12 -8 C -12 -22, 12 -22, 12 -8 M -12 -8 C -12 6, 12 6, 12 -8').attr('fill', 'none').attr('stroke', COLORS.goldSoft).attr('stroke-width', 1)
    }
    if (styles.horn) {
      crest.append('path').attr('d', 'M -10 -10 C 10 -20, 20 -5, 10 10 C 0 5, -5 0, -10 -10 Z').attr('fill', COLORS.goldSoft).attr('stroke', COLORS.gold).attr('stroke-width', 2)
    }

    // Text inside crest
    const textGroup = crest.append('g').attr('font-family', FONT_STACK).attr('fill', COLORS.ivory)
    textGroup.append('text').attr('y', 20).attr('text-anchor', 'middle').attr('font-size', 12).attr('opacity', 0.95).text(`${member.emoji} ${member.role}`)
    textGroup.append('text').attr('y', 38).attr('text-anchor', 'middle').attr('font-size', 15).attr('font-weight', 700).text(member.name)
    textGroup.append('text').attr('y', 56).attr('text-anchor', 'middle').attr('font-size', 12).attr('opacity', 0.9).text(`Kelas: ${member.kelas}`)
  }

  return (
    <div className="relative min-h-[calc(100vh-0px)]" style={{ background: COLORS.blue }}>
      {/* Header */}
      <div className="relative z-10 border-b border-yellow-300/10 px-4 py-4 text-center backdrop-blur-md" style={{ background: 'rgba(13,27,42,0.65)' }}>
        <h1 className="text-xl md:text-2xl font-bold tracking-wide" style={{ color: COLORS.ivory, fontFamily: FONT_STACK }}>
          Hierarki Kepengurusan SMANESI Olympiad Club
        </h1>
        <p className="text-xs md:text-sm" style={{ color: 'rgba(248,241,229,0.8)', fontFamily: FONT_STACK }}>
          Susunan Kabinet Periode II Masa Bakti 2024–2025
        </p>
      </div>

      {/* Chart */}
      <div ref={wrapRef} className="relative h-[75vh] md:h-[78vh]">
        <svg ref={svgRef} className="absolute inset-0 w-full h-full" />
        {/* Decorative golden glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,215,128,0.15), transparent 60%)' }} />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,200,86,0.12), transparent 60%)' }} />
      </div>
    </div>
  )
}

"use client"

import {
  type MotionValue,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion"
import * as React from "react"
import { cn } from "../lib/utils"
import type { ComponentProps } from "./component.types"

export interface BoxProps extends ComponentProps<HTMLElement> {
  as?: React.ElementType<any, keyof React.JSX.IntrinsicElements>
}

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}

export const Box = ({
  as: tag = "div",
  children,
  className,
  inView,
  enter,
  exit,
  style,
  parallax = 0,
  ...props
}: BoxProps) => {
  const ref = React.useRef(null)
  const isInView = useInView(ref as any, {
    once: true,
    ...inView,
  })

  const { scrollYProgress } = useScroll({ target: ref })
  const y = useParallax(scrollYProgress, parallax)

  let Component = motion.div

  // @ts-ignore
  if (tag === "a") Component = motion.a // @ts-ignore
  if (tag === "abbr") Component = motion.abbr // @ts-ignore
  if (tag === "address") Component = motion.address // @ts-ignore
  if (tag === "area") Component = motion.area // @ts-ignore
  if (tag === "article") Component = motion.article // @ts-ignore
  if (tag === "aside") Component = motion.aside // @ts-ignore
  if (tag === "audio") Component = motion.audio // @ts-ignore
  if (tag === "b") Component = motion.b // @ts-ignore
  if (tag === "base") Component = motion.base // @ts-ignore
  if (tag === "bdi") Component = motion.bdi // @ts-ignore
  if (tag === "bdo") Component = motion.bdo // @ts-ignore
  if (tag === "big") Component = motion.big // @ts-ignore
  if (tag === "blockquote") Component = motion.blockquote // @ts-ignore
  if (tag === "body") Component = motion.body // @ts-ignore
  if (tag === "br") Component = motion.br // @ts-ignore
  if (tag === "button") Component = motion.button // @ts-ignore
  if (tag === "canvas") Component = motion.canvas // @ts-ignore
  if (tag === "caption") Component = motion.caption // @ts-ignore
  if (tag === "center") Component = motion.center // @ts-ignore
  if (tag === "cite") Component = motion.cite // @ts-ignore
  if (tag === "code") Component = motion.code // @ts-ignore
  if (tag === "col") Component = motion.col // @ts-ignore
  if (tag === "colgroup") Component = motion.colgroup // @ts-ignore
  if (tag === "data") Component = motion.data // @ts-ignore
  if (tag === "datalist") Component = motion.datalist // @ts-ignore
  if (tag === "dd") Component = motion.dd // @ts-ignore
  if (tag === "del") Component = motion.del // @ts-ignore
  if (tag === "details") Component = motion.details // @ts-ignore
  if (tag === "dfn") Component = motion.dfn // @ts-ignore
  if (tag === "dialog") Component = motion.dialog // @ts-ignore
  if (tag === "div") Component = motion.div // @ts-ignore
  if (tag === "dl") Component = motion.dl // @ts-ignore
  if (tag === "dt") Component = motion.dt // @ts-ignore
  if (tag === "em") Component = motion.em // @ts-ignore
  if (tag === "embed") Component = motion.embed // @ts-ignore
  if (tag === "fieldset") Component = motion.fieldset // @ts-ignore
  if (tag === "figcaption") Component = motion.figcaption // @ts-ignore
  if (tag === "figure") Component = motion.figure // @ts-ignore
  if (tag === "footer") Component = motion.footer // @ts-ignore
  if (tag === "form") Component = motion.form // @ts-ignore
  if (tag === "h1") Component = motion.h1 // @ts-ignore
  if (tag === "h2") Component = motion.h2 // @ts-ignore
  if (tag === "h3") Component = motion.h3 // @ts-ignore
  if (tag === "h4") Component = motion.h4 // @ts-ignore
  if (tag === "h5") Component = motion.h5 // @ts-ignore
  if (tag === "h6") Component = motion.h6 // @ts-ignore
  if (tag === "head") Component = motion.head // @ts-ignore
  if (tag === "header") Component = motion.header // @ts-ignore
  if (tag === "hgroup") Component = motion.hgroup // @ts-ignore
  if (tag === "hr") Component = motion.hr // @ts-ignore
  if (tag === "html") Component = motion.html // @ts-ignore
  if (tag === "i") Component = motion.i // @ts-ignore
  if (tag === "iframe") Component = motion.iframe // @ts-ignore
  if (tag === "img") Component = motion.img // @ts-ignore
  if (tag === "input") Component = motion.input // @ts-ignore
  if (tag === "ins") Component = motion.ins // @ts-ignore
  if (tag === "kbd") Component = motion.kbd // @ts-ignore
  if (tag === "keygen") Component = motion.keygen // @ts-ignore
  if (tag === "label") Component = motion.label // @ts-ignore
  if (tag === "legend") Component = motion.legend // @ts-ignore
  if (tag === "li") Component = motion.li // @ts-ignore
  if (tag === "link") Component = motion.link // @ts-ignore
  if (tag === "main") Component = motion.main // @ts-ignore
  if (tag === "map") Component = motion.map // @ts-ignore
  if (tag === "mark") Component = motion.mark // @ts-ignore
  if (tag === "menu") Component = motion.menu // @ts-ignore
  if (tag === "menuitem") Component = motion.menuitem // @ts-ignore
  if (tag === "meta") Component = motion.meta // @ts-ignore
  if (tag === "meter") Component = motion.meter // @ts-ignore
  if (tag === "nav") Component = motion.nav // @ts-ignore
  if (tag === "noindex") Component = motion.noindex // @ts-ignore
  if (tag === "noscript") Component = motion.noscript // @ts-ignore
  if (tag === "object") Component = motion.object // @ts-ignore
  if (tag === "ol") Component = motion.ol // @ts-ignore
  if (tag === "optgroup") Component = motion.optgroup // @ts-ignore
  if (tag === "option") Component = motion.option // @ts-ignore
  if (tag === "output") Component = motion.output // @ts-ignore
  if (tag === "p") Component = motion.p // @ts-ignore
  if (tag === "param") Component = motion.param // @ts-ignore
  if (tag === "picture") Component = motion.picture // @ts-ignore
  if (tag === "pre") Component = motion.pre // @ts-ignore
  if (tag === "progress") Component = motion.progress // @ts-ignore
  if (tag === "q") Component = motion.q // @ts-ignore
  if (tag === "rp") Component = motion.rp // @ts-ignore
  if (tag === "rt") Component = motion.rt // @ts-ignore
  if (tag === "ruby") Component = motion.ruby // @ts-ignore
  if (tag === "s") Component = motion.s // @ts-ignore
  if (tag === "samp") Component = motion.samp // @ts-ignore
  if (tag === "search") Component = motion.search // @ts-ignore
  if (tag === "slot") Component = motion.slot // @ts-ignore
  if (tag === "script") Component = motion.script // @ts-ignore
  if (tag === "section") Component = motion.section // @ts-ignore
  if (tag === "select") Component = motion.select // @ts-ignore
  if (tag === "small") Component = motion.small // @ts-ignore
  if (tag === "source") Component = motion.source // @ts-ignore
  if (tag === "span") Component = motion.span // @ts-ignore
  if (tag === "strong") Component = motion.strong // @ts-ignore
  if (tag === "style") Component = motion.style // @ts-ignore
  if (tag === "sub") Component = motion.sub // @ts-ignore
  if (tag === "summary") Component = motion.summary // @ts-ignore
  if (tag === "sup") Component = motion.sup // @ts-ignore
  if (tag === "table") Component = motion.table // @ts-ignore
  if (tag === "template") Component = motion.template // @ts-ignore
  if (tag === "tbody") Component = motion.tbody // @ts-ignore
  if (tag === "td") Component = motion.td // @ts-ignore
  if (tag === "textarea") Component = motion.textarea // @ts-ignore
  if (tag === "tfoot") Component = motion.tfoot // @ts-ignore
  if (tag === "th") Component = motion.th // @ts-ignore
  if (tag === "thead") Component = motion.thead // @ts-ignore
  if (tag === "time") Component = motion.time // @ts-ignore
  if (tag === "title") Component = motion.title // @ts-ignore
  if (tag === "tr") Component = motion.tr // @ts-ignore
  if (tag === "track") Component = motion.track // @ts-ignore
  if (tag === "u") Component = motion.u // @ts-ignore
  if (tag === "ul") Component = motion.ul // @ts-ignore
  if (tag === "video") Component = motion.video // @ts-ignore
  if (tag === "wbr") Component = motion.wbr // @ts-ignore
  if (tag === "webview") Component = motion.webview // @ts-ignore
  if (tag === "svg") Component = motion.svg // @ts-ignore
  if (tag === "animate") Component = motion.animate // @ts-ignore
  if (tag === "animateMotion") Component = motion.animateMotion // @ts-ignore
  if (tag === "animateTransform") Component = motion.animateTransform // @ts-ignore
  if (tag === "circle") Component = motion.circle // @ts-ignore
  if (tag === "clipPath") Component = motion.clipPath // @ts-ignore
  if (tag === "defs") Component = motion.defs // @ts-ignore
  if (tag === "desc") Component = motion.desc // @ts-ignore
  if (tag === "ellipse") Component = motion.ellipse // @ts-ignore
  if (tag === "feBlend") Component = motion.feBlend // @ts-ignore
  if (tag === "feColorMatrix") Component = motion.feColorMatrix // @ts-ignore
  if (tag === "feComponentTransfer") Component = motion.feComponentTransfer // @ts-ignore
  if (tag === "feComposite") Component = motion.feComposite // @ts-ignore
  if (tag === "feConvolveMatrix") Component = motion.feConvolveMatrix // @ts-ignore
  if (tag === "feDiffuseLighting") Component = motion.feDiffuseLighting // @ts-ignore
  if (tag === "feDisplacementMap") Component = motion.feDisplacementMap // @ts-ignore
  if (tag === "feDistantLight") Component = motion.feDistantLight // @ts-ignore
  if (tag === "feDropShadow") Component = motion.feDropShadow // @ts-ignore
  if (tag === "feFlood") Component = motion.feFlood // @ts-ignore
  if (tag === "feFuncA") Component = motion.feFuncA // @ts-ignore
  if (tag === "feFuncB") Component = motion.feFuncB // @ts-ignore
  if (tag === "feFuncG") Component = motion.feFuncG // @ts-ignore
  if (tag === "feFuncR") Component = motion.feFuncR // @ts-ignore
  if (tag === "feGaussianBlur") Component = motion.feGaussianBlur // @ts-ignore
  if (tag === "feImage") Component = motion.feImage // @ts-ignore
  if (tag === "feMerge") Component = motion.feMerge // @ts-ignore
  if (tag === "feMergeNode") Component = motion.feMergeNode // @ts-ignore
  if (tag === "feMorphology") Component = motion.feMorphology // @ts-ignore
  if (tag === "feOffset") Component = motion.feOffset // @ts-ignore
  if (tag === "fePointLight") Component = motion.fePointLight // @ts-ignore
  if (tag === "feSpecularLighting") Component = motion.feSpecularLighting // @ts-ignore
  if (tag === "feSpotLight") Component = motion.feSpotLight // @ts-ignore
  if (tag === "feTile") Component = motion.feTile // @ts-ignore
  if (tag === "feTurbulence") Component = motion.feTurbulence // @ts-ignore
  if (tag === "filter") Component = motion.filter // @ts-ignore
  if (tag === "foreignObject") Component = motion.foreignObject // @ts-ignore
  if (tag === "g") Component = motion.g // @ts-ignore
  if (tag === "image") Component = motion.image // @ts-ignore
  if (tag === "line") Component = motion.line // @ts-ignore
  if (tag === "linearGradient") Component = motion.linearGradient // @ts-ignore
  if (tag === "marker") Component = motion.marker // @ts-ignore
  if (tag === "mask") Component = motion.mask // @ts-ignore
  if (tag === "metadata") Component = motion.metadata // @ts-ignore
  if (tag === "mpath") Component = motion.mpath // @ts-ignore
  if (tag === "path") Component = motion.path // @ts-ignore
  if (tag === "pattern") Component = motion.pattern // @ts-ignore
  if (tag === "polygon") Component = motion.polygon // @ts-ignore
  if (tag === "polyline") Component = motion.polyline // @ts-ignore
  if (tag === "radialGradient") Component = motion.radialGradient // @ts-ignore
  if (tag === "rect") Component = motion.rect // @ts-ignore
  if (tag === "set") Component = motion.set // @ts-ignore
  if (tag === "stop") Component = motion.stop // @ts-ignore
  if (tag === "switch") Component = motion.switch // @ts-ignore
  if (tag === "symbol") Component = motion.symbol // @ts-ignore
  if (tag === "text") Component = motion.text // @ts-ignore
  if (tag === "textPath") Component = motion.textPath // @ts-ignore
  if (tag === "tspan") Component = motion.tspan // @ts-ignore
  if (tag === "use") Component = motion.use // @ts-ignore
  if (tag === "view") Component = motion.view

  return (
    <Component
      {...props}
      className={cn(
        "relative transition-all duration-500",
        className,
        isInView && enter,
        !isInView && exit
      )}
      ref={ref}
      style={{ ...style, ...(parallax ? { y } : {}) }}
    >
      {children}
    </Component>
  )
}
Box.displayName = "Box"

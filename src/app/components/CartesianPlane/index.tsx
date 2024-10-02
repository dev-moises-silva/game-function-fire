import { useEffect, useRef } from "react"
import { useCirc, useLine } from "../../hooks"

import { Coords } from "../../types/Coords"

type Props = {
  equation?: string
  coords: Coords[]
}

export function CartesianPlane({equation, coords}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const { width, height } = canvas
    const midX = width / 2
    const midY = height / 2

    // função que desenha os eixos do plano cartesiano
    function drawAxes(){
      ctx.beginPath()
      ctx.moveTo(0, midY)
      ctx.lineTo(width, midY)
      ctx.moveTo(midX, 0)
      ctx.lineTo(midX, height)
      ctx.stroke()
    }

    // função que desenha o gráfico da função do 1° grau
    function drawnLine(a: number, b: number) {
      ctx.beginPath()

      // definir coordenadas de dois pontos para o desenho da reta
      let x1 = -midX, y1 = a * x1 + b
      let x2 = midX, y2 = a * x2 + b

      // converter para coordenadas no canvas
      x1 += midX
      y1 = midY - y1
      x2 += midX
      y2 = midY - y2

      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    function drawCircle(h: number, k: number, r: number) {
      ctx.beginPath()

      // converter as coordenadas do centro para o canvas
      const x = midX + h
      const y = midY - k
      ctx.arc(x, y, r, 0, 2 * Math.PI)
      ctx.stroke()
    }

    function drawnPoint(x: number, y: number, color = "red") {
      ctx.beginPath()
      ctx.arc(midX + x, midY - y, 5, 0, 2 * Math.PI)
      ctx.fillStyle = color
      ctx.fill()

      // exibir as coordenadas do ponto
      ctx.fillStyle = "black"
      ctx.font = "12px Arial"
      ctx.fillText(`(${x}, ${y})`, midX + x + 5, midY - y + 5)
    }

    ctx.clearRect(0, 0, width, height)

    drawAxes()

    coords.forEach((coord) => {
      const { x, y } = coord
      drawnPoint(x, y)
    })

    if(equation) {
      const lineCoef = useLine(equation)

      if(lineCoef) {
        const { a, b} = lineCoef
        drawnLine(a, b)
      }

      const circCoef = useCirc(equation)

      if(circCoef) {
        const { h, k, r } = circCoef
        drawCircle(h, k, r)
      }
    }
  }, [equation, coords])

  return (
    <canvas ref={canvasRef} width="500" height="500"></canvas>
  )
}
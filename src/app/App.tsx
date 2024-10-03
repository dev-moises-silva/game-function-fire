import { useEffect, useState } from "react"

import Swal from "sweetalert2"

import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"

import { CartesianPlane } from "./components/CartesianPlane"
import { EquationInput } from "./components/EquationInput"
import { CoordInput } from "./components/CoordInput"
import { Coords } from "./types/Coords"
import { useCirc, useLine } from "./hooks"
import { AlertHeading } from "react-bootstrap"

export function App() {
  const [coordsSet, setCoordsSet] = useState<Coords[]>([])
  const [playerOnePoints, setPlayerOnePoints] = useState(0)
  const [playerTwoPoints, setPlayerTwoPoints] = useState(0)
  const [playerOneIsNext, setPlayerOneIsNext] = useState(false)
  const [currentEquation, setCurrentEquation] = useState<string>()
  const [gameIsRunning, setGameIsRunning] = useState(false)
  const [equationInputReadeOnly, setEquationInputReadeOnly] = useState(false)
  const hasActiveCoords = coordsSet.filter(coords => coords.active).length > 0
  
  function restartGame() {
    setPlayerOneIsNext(false)
    setPlayerOnePoints(0)
    setPlayerTwoPoints(0)
    setCurrentEquation("")
    setCoordsSet([])
    setEquationInputReadeOnly(false)
    setGameIsRunning(false)
  }

  function toNextRound() {
    setCurrentEquation("")
    setEquationInputReadeOnly(false)
    Swal.fire({
      titleText: `Vez do jogador ${playerOneIsNext ? "1": "2"}.`,
      icon: "info"
    })
    setPlayerOneIsNext(!playerOneIsNext)
  }

  function addCoords(coords: Coords) {
    setCoordsSet([...coordsSet, coords])
  }

  function play(){
    setGameIsRunning(true)
    Swal.fire({
      titleText: "Vez do jogador 1.",
      icon: "info"
    })
  }

  useEffect(() => {
    if(!currentEquation) return

    setEquationInputReadeOnly(true)

    let points = 0
    let newCoords = coordsSet.map(coords => ({...coords}))

    function quaseEqual(a: number, b: number, tolerancia = 0.0001) {
      return Math.abs(a - b) < tolerancia;
    }
    
    const lineCoef = useLine(currentEquation)
    const circCoef = useCirc(currentEquation)

    if (lineCoef) {
      const { a, b } = lineCoef

      newCoords.forEach((coords) => {
        const { x, y } = coords

        if(quaseEqual(y, a * x + b)) {
          coords.active = false
          ++points
        }
      })
    }
    
    if (circCoef) {
      const { h, k, r } = circCoef

      newCoords.forEach((coords) => {
        const { x, y } = coords

        if(quaseEqual(r ** 2, (x - h) ** 2 + (y - k) ** 2) ) {
          coords.active = false
          points+=2
        }
      })
    }

    if(playerOneIsNext) {
      setPlayerTwoPoints(playerTwoPoints + points)
    } else {
      setPlayerOnePoints(playerOnePoints + points)
    }

    const message = `O jogador ${playerOneIsNext ? "2" : "1"} fez ${points} pontos!`

    Swal.fire({
      icon: points ? "success" : "warning",
      titleText: message
    }).then(() => {
      setCoordsSet(newCoords)
    })
  }, [currentEquation])

  useEffect(() => {
    if(!hasActiveCoords && gameIsRunning) {
      if(playerOnePoints === playerTwoPoints) {
        Swal.fire({
          titleText: "Deu empate",
          icon: "info"
        })
      } else {
        const message = `O jogador ${playerOnePoints > playerTwoPoints ? "1" : "2"} ganhou!`
        Swal.fire({
          titleText: message,
          icon: "success"
        })
      }
    }
  }, [coordsSet])
  
  return (
    <>
      {gameIsRunning && hasActiveCoords && (
        <div className={`text-bg-${playerOneIsNext ? "danger" : "primary"} fs-5 p-2 text-center mb-2 rounded-2`}>
          Vez do jogador {playerOneIsNext ? "2" : "1"}
        </div>
      )}
      {gameIsRunning && (
        <Alert variant="dark" className="mb-2">
          Jogador 1: {playerOnePoints} pontos <br />
          Jogador 2: {playerTwoPoints} pontos
        </Alert>
      )}
      {!gameIsRunning && (
        <div className="d-flex justify-content-between mb-2">
          <CoordInput addCoords={addCoords}/>
          <Button disabled={!hasActiveCoords} variant="outline-success" onClick={play}>jogar</Button>
        </div>
        )}
      {gameIsRunning && hasActiveCoords && !equationInputReadeOnly && <EquationInput readOnly={equationInputReadeOnly} setEquation={setCurrentEquation}/>}
      {gameIsRunning && !hasActiveCoords && (
        <Button onClick={restartGame} variant="outline-success" className="mb-2">
          Começar o jogo novamente
        </Button>
      )}
      {equationInputReadeOnly && hasActiveCoords && (
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Button onClick={toNextRound} variant="outline-success">
            Ir para o próximo jogador
          </Button>
          <div className="fw-bold fs-5">
            {currentEquation}
          </div>
        </div>
      )}
      <div className="w-100 d-flex justify-content-center">
        <CartesianPlane coords={coordsSet} equation={currentEquation}/>
      </div>
    </>
  )
}

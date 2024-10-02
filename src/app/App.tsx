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
    let newCoords
    
    const lineCoef = useLine(currentEquation)
    const circCoef = useCirc(currentEquation)

    if (lineCoef) {
      const { a, b } = lineCoef

      newCoords = coordsSet.filter((coord) => {
        const { x, y } = coord

        return y != a * x + b
      })

      points = (coordsSet.length - newCoords.length) * 2
    } else if (circCoef) {
      const { h, k, r } = circCoef

      newCoords = coordsSet.filter((coord) => {
        const { x, y } = coord

        return r ** 2 != (x - h) ** 2 + (y - k) ** 2
      })

      points = (coordsSet.length - newCoords.length) + 4
    } else {
      newCoords = coordsSet
    }

    setCoordsSet(newCoords)

    if(playerOneIsNext) {
      setPlayerTwoPoints(playerTwoPoints + points)
    } else {
      setPlayerOnePoints(playerOnePoints + points)
    }

    const message = `O jogador ${playerOneIsNext ? "2" : "1"} fez ${points} pontos!`

    Swal.fire({
      icon: points ? "success" : "warning",
      titleText: message
    })
  }, [currentEquation])

  useEffect(() => {
    if(coordsSet.length === 0 && gameIsRunning) {
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

  console.log(!!coordsSet);
  
  return (
    <>
      {gameIsRunning && coordsSet.length > 0 && (
        <>
          <Alert>
            <AlertHeading>Vez do jogador {playerOneIsNext ? "2" : "1"}!</AlertHeading>
          </Alert>
        </>
      )}
      {gameIsRunning && (
        <Alert variant="info">
          Jogador 1: {playerOnePoints} pontos <br />
          Jogador 2: {playerTwoPoints} pontos
        </Alert>
      )}
      {!gameIsRunning && (
        <div className="d-flex justify-content-between mb-3">
          <CoordInput addCoords={addCoords}/>
          <Button disabled={coordsSet.length === 0} variant="success" onClick={play}>jogar</Button>
        </div>
        )}
      {gameIsRunning && coordsSet.length > 0 && <EquationInput readOnly={equationInputReadeOnly} setEquation={setCurrentEquation}/>}
      {gameIsRunning && coordsSet.length === 0 && (
        <Button onClick={restartGame} variant="success">
          Começar o jogo novamente
        </Button>
      )}
      {equationInputReadeOnly && coordsSet.length > 0 && (
        <Button onClick={toNextRound} variant="success">
          Próxima rodada
        </Button>
      )}
      <CartesianPlane coords={coordsSet} equation={currentEquation}/>
    </>
  )
}

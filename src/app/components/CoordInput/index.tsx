import InputGroup from "react-bootstrap/InputGroup"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { IoAdd } from "react-icons/io5"
import { useFormik } from "formik"
import { Coords } from "../../types/Coords"

type Props = {
  addCoords: (coords: Coords) => void
}

export function CoordInput({ addCoords }: Props) {
  const formik = useFormik({
    initialValues: {
      x: 0,
      y: 0
    },
    onSubmit: (values, { resetForm }) => {
      addCoords(values)
      resetForm()
    }
  })
  return (
    <Form onSubmit={formik.handleSubmit}>
      <InputGroup
        style={{
          maxWidth: "250px"
        }}
      >
        <Button type="submit" variant="outline-secondary" title="adicionar coodenadas">
          <IoAdd />
        </Button>
        <Form.Control name="x" value={formik.values.x} required type="number" min={-250} max={250} onChange={formik.handleChange}/>
        <InputGroup.Text>
        ,
        </InputGroup.Text>
        <Form.Control name="y" value={formik.values.y} required type="number" min={-250} max={250} onChange={formik.handleChange}/>
      </InputGroup>
    </Form>
  )
}
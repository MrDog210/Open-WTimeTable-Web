import Select from "react-select";
import classes from './StyledSelect.module.css'

function StyledSelect(props) {
  return <Select {...props} classNames={{
    container: () => classes.container,
    control: () => classes.control,
    valueContainer: () => classes["value-container"],
    option: () => classes.option,
    menu: () => classes.menu
  }}/>
}

export default StyledSelect
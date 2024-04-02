import IonIcon from "@reacticons/ionicons"
import classes from "./IconButton.module.css"

function IconButton({href = "", text, icon, target = "_blank"}) {
  return (
    <a href={href} target={target}>
      <button>
        <IonIcon name={icon} size="large" />
        <span style={{ paddingLeft: 10}}>{text}</span>
      </button>
    </a>
  )
}

export default IconButton
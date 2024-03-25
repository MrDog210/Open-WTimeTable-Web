import { fetchToken, fetchWithToken } from "../util/http"

function SchoolCodeInputPage({changePath}) {

  async function test() {

  }

  return (
    <div>
      <div>Enter school code</div>
      <div>
        <input type="text"></input>
        <button onClick={test}>Confirm</button>
      </div>
    </div>
  )
}

export default SchoolCodeInputPage
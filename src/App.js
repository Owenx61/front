import {useState} from "react"
import './App.css';
import axios from "axios"

function App() {
  const [ files, setFiles ] = useState(null)
  const [ progress, setProgress ] = useState({started: false, pc: 0})
  const [msg, setMsg] = useState(null)

  function handleUpload(){
    if(!files){
      setMsg('No file selected')
      return
    }

    const fd = new FormData()
    for (let i = 0;i<files.length; i++){
      fd.append(`files${i+1}`, files[i])
    }

    setMsg("Uploadin...")
    setProgress(prevState => {
      return {...prevState, started: true}
    })
    axios.post('http://httpbin.org/post', fd,{
      onUploadProgress: (progressEvent)=> {setProgress(prevState => {
        return {...prevState, pc: progressEvent.progress*100}
      })},
      headers: {
        "Custom-Header": "value",
      }
    })
    .then (res => {
      setMsg("Upload successful")
      console.log(res.data)})
    .catch(err => {
      setMsg("Upload failed")
      console.error(err)})
  }

  return (
    <div className="App">
      <h1>Uploading Files</h1>
      <input onChange={ (e) => {setFiles(e.target.files[0])}} type='file' multiple/>
      <button onClick={handleUpload}>Upload</button>
      <br/>
      {progress.started && <progress max="100" value={progress.pc}></progress>}
      {msg && <div>{msg}</div>}
    </div>
  );
}

export default App;

import {  useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  let [responsedata, setresponse] = useState<any>(null)
  let [inputque, setinputque] = useState<string>("")
  let [loading, setLoading] = useState<boolean>(false); // Track loading state

  // let [localvalue, setlocalvalue] = useState<any>(null)
  let allData: Array<{ key: string | null, value: string | null }> = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i); // Get the key at the current index
    const value = localStorage.getItem(key); // Retrieve the value associated with that key
    allData.push({ key, value }); // Store the key-value pair in an array
  }

  // Now allData contains all local storage entries
  console.log(allData);

  // Remove fetchans from useEffect if you want to trigger it on form submission
  let fetchans = async (inputque: string): Promise<void> => {
    try {
      setLoading(true); // Start loading

      let response = await axios({
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAUzTpPt76bXGtVx9MaPiq39hyZq6bW2EI',
        data: { "contents": [{ "parts": [{ "text": inputque }] }] }
      });
      console.log('Response from server:', response.data);
      setresponse(response.data) // Update state with response data
    } catch (error) {
      setLoading(false); // Start loading

      console.error('Error fetching response:', error);
    }
  }

  let localstoragefun = (responsedata: any): void => {
    const parts = responsedata?.candidates[0]?.content?.parts;
    if (parts) {
      parts.forEach((part: any, index: number) => {
        localStorage.setItem(`myKey_${index}`, part.text); // Use backticks for dynamic key
        setresponse(null);
      });
    }
  }

  let submithandler = async (e: any): Promise<void> => {
    e.preventDefault();
    await fetchans(inputque);
    localstoragefun(responsedata); // Now `responsedata` is updated after `fetchans`
  }

  let inputhandler = (e: any): void => {
    setinputque(e.target.value);
  }

  return (
    <>
      <h1> CHAT BOT </h1>
      <input type='text' onChange={inputhandler} placeholder='write your text here' />
      <button onClick={submithandler}>Submit</button>
      {responsedata &&
        responsedata.candidates[0].content?.parts.map((part: any, index: number) => (
          <div key={index}> {/* Added key prop */}
            {!loading ? (
              <h1>...loading</h1> // Show loading while fetching
            ) : (
              responsedata && <h1>ANSWER</h1> // Show answer when responsedata is available
            )}  <pre style={{
              color: "white",
              backgroundColor: "black",
              padding: "10px",
              borderRadius: "5px",
              fontSize: "16px",
              lineHeight: "1.5",
              fontFamily: "monospace",
              maxWidth: "100%",
              overflow: "auto",
              whiteSpace: "pre-wrap"
            }}>
              {part.text}
            </pre>
          </div>
        ))
      }
      <h1> Previous Responses </h1>
      {/* Render previous responses */}
      {allData.map((data, idx) => (
        <div key={idx}>
          <p>{data.key}: {data.value}</p>
        </div>
      ))}
    </>
  )
}

export default App;

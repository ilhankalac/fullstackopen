import { useState } from 'react'

const Options = ({ onGoodClick, onNeutralClick, onBadClick }) => { 
  return (
    <div>
      <button onClick={onGoodClick}>good</button>
      <button onClick={onNeutralClick}>neutral</button>
      <button onClick={onBadClick}>bad</button>
    </div>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = (good / all) * 100

  return (
    <div> 
      <h1>statistics</h1>
      <div>good {good}</div>
      <div>neutral {neutral}</div>
      <div>bad {bad}</div>
      <div>all {all}</div>
      <div>average {isNaN(average) ? 0 : average}</div>
      <div>positive {isNaN(positive) ? 0 : positive} %</div>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Options 
        onGoodClick={() => setGood(good + 1)} 
        onNeutralClick={() => setNeutral(neutral + 1)}
        onBadClick={() => setBad(bad + 1)}
      />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
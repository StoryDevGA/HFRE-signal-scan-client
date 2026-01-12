import { useParams } from 'react-router-dom'

function Results() {
  const { publicId } = useParams()

  return (
    <main className="page">
      <h1>Results</h1>
      <p>Public report placeholder for id: {publicId}</p>
    </main>
  )
}

export default Results

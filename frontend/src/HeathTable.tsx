import {useState, useEffect} from "react"

function HealthTable(){
    const [entries, setEntries] = useState<Array<{type: string; name: string; calories: number; date: string}>>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("http://localhost:8000/healthData");
            const data = await response.json();
            setEntries(data.entries);
        };
        fetchData();
    }, []);

    return(
        <div>
            <h2>Health Data Table</h2>
            {/* create table */}
            <table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Name of Food</th>
                        <th>Calories Burned</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Map through health data and create a row for each entry */}
                    {entries.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.type}</td>
                            <td>{entry.name}</td>
                            <td>{entry.calories}</td>
                            <td>{new Date(entry.date).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


        </div>
    )

}

export default HealthTable;
import {useState, useEffect} from "react"

type Entry = {
    id: number;
    type: string;
    name: string;
    calories: number;
    date: string;
};



function HealthTable({ entries, onDelete }: { entries: Entry[]; onDelete: (id: number) => void }) {
   
  

    return(
        <div className="tableContainer">
            {/* create table */}
            <table >
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
                            <td>
                                <button onClick={() => onDelete(entry.id)} style={{ backgroundColor: "red" }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


        </div>
    )

}

export default HealthTable;
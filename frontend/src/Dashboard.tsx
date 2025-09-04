import HealthTable from "./HeathTable"
import { useState, useEffect} from "react";
import {
   ResponsiveContainer,BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell
} from "recharts";


function Dashboard(){
    // states for the form
    const [type,setType] = useState("");
    const [name,setName] = useState("");
    const [calories,setCalories] = useState(0);
    const [date,setDate] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [entries, setEntries] = useState<Array<{id:number; type:string; name:string; calories:number; date:string}>>([]);


    const handleSubmit = async() => {
            // input validation
        if (!type.trim() || !name.trim()) {
        setErrorMessage("Type and Name cannot be empty.");
        return;
        }
        if (calories <= 0) {
        setErrorMessage("Calories must be greater than zero.");
        return;
        }
        if (!date) {
        setErrorMessage("Please select a date.");
        return;
        }

        // Clear any previous error
        setErrorMessage("");

        const newEntry = {type, name, calories, date};
        try{
            const response = await fetch("http://localhost:8000/sendData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newEntry)
            });
            const data = await response.json();
            if (response.ok){
                console.log("Saved: ",data);

                setEntries((prev) => [...prev, { id: data.id, ...newEntry }]);
                // clear the form
                setType("");
                setName("");
                setCalories(0);
                setDate("");

            }

        }catch(error){
            console.error("Error:", error);
            setErrorMessage("Failed to save data. Try again.");
        }

    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("http://localhost:8000/healthData");
            const data = await response.json();
            setEntries(data.entries || []);
        };
        fetchData();
    },[]);


    const handleDelete = async (id: number) => {
        try {
            await fetch(`http://localhost:8000/deleteEntry/${id}`, {
                method: "DELETE"
            });
            // Remove from UI
            setEntries((prev) => prev.filter((e) => e.id !== id));
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };


    // Graph data prep
    const caloriesPerEntry = entries.map(e => ({ name: e.name, calories: e.calories }));

    const caloriesPerDay: { day: string; calories: number }[] = [];
    const dayMap: Record<string, number> = {};
    entries.forEach(e => {
        const day = e.date.split("T")[0];
        dayMap[day] = (dayMap[day] || 0) + e.calories;
    });
    for (const day in dayMap) {
        caloriesPerDay.push({ day, calories: dayMap[day] });
    }
    const lineData = caloriesPerDay;

    const typeDistribution: Record<string, number> = {};
    entries.forEach(e => {
        typeDistribution[e.type] = (typeDistribution[e.type] || 0) + 1;
    });
    const pieData = Object.entries(typeDistribution).map(([name, value]) => ({ name, value }));

    const COLORS = ["#f4a261", "#2a9d8f", "#e76f51", "#e9c46a", "#264653"];





    return(
        <div className="dashboard">
            {/* create a form */}
            <div className="formTable">
                <div className="formInput">
                <input
                type="text"
                placeholder="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                />
                <input
                type="text"
                placeholder="Name of Food"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
                <input
                type="number"
                placeholder="Calories"
                value={calories}

                onChange={(e) => setCalories(Number(e.target.value))}
                />
                <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                />
                </div>
                <button className= "formButton"onClick={handleSubmit}>Save</button>
            </div>

            {errorMessage && (
                <p style={{ color: "red", marginTop: "5px" }}>
                {errorMessage}
                </p>
            )}

            <HealthTable entries={entries} onDelete={handleDelete} />

            <div className="graphs">
            {/* Graph 1 */}
            <div className="graph graph-food">
                <h3>Calories per Food</h3>
                <ResponsiveContainer width="100%" height={250}>
                <BarChart data={caloriesPerEntry} margin={{ top: 20, right: 20, left: 20, bottom: 50 }}>
                    <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calories" fill="#264653" />
                </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Graph 2 */}
            <div className="graph graph-day">
                <h3>Total Calories per Day</h3>
                <ResponsiveContainer width="100%" height={250}>
                <LineChart data={lineData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="calories" stroke="#e9c46a" strokeWidth={2} />
                </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Graph 3 */}
            <div className="graph graph-type">
                <h3>Food Type Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip formatter={(value: number, name: string) => [`${value} entries`, name]} />
                </PieChart>
                </ResponsiveContainer>
            </div>
            </div>






    </div>
    )


}
export default Dashboard
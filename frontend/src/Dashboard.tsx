import HealthTable from "./heathTable"
import { useState, useEffect} from "react";

function Dashboard(){
    // states for the form
    const [type,setType] = useState("");
    const [name,setName] = useState("");
    const [calories,setCalories] = useState(0);
    const [date,setDate] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [entries, setEntries] = useState<Array<{id:number; type:string; name:string; calories:number; date:string}>>([]);


    const handleSubmit = async() => {
            // Input validation
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



    return(
        <div>
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

            {/* 3 graphs go here */}


        </div>
    )


}
export default Dashboard
import HealthTable from "./heathTable"
import { useState} from "react";

function Dashboard(){
    // states for the form
    const [type,setType] = useState("");
    const [name,setName] = useState("");
    const [calories,setCalories] = useState(0);
    const [date,setDate] = useState("");

    const handleSubmit = async() => {
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
            console.log("Saved: ",data);
            // clear the form
            setType("");
            setName("");
            setCalories(0);
            setDate("");

        }catch(error){
            console.error("Error:", error);
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








            <HealthTable />
        </div>
    )


}
export default Dashboard
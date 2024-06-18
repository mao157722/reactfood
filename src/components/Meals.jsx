
import useHttp from "../hooks/useHttp.js";
import MealItem from "./MealItem.jsx";
import Error from "./Error.jsx";

const requestConfig = {};

export default function Meals() {

    const { 
        data: loadedMeals, 
        isLoading, 
        error: errorLoadMeals } = useHttp('http://localhost:3000/meals', requestConfig, []);

    if(isLoading){
        return <p className="center">Fetching Meals...</p>
    }

    if(errorLoadMeals){
        return <Error title="Failed to fetch meals" message={errorLoadMeals} />
    }
    
    return (
        <ul id="meals">
            {loadedMeals.map(meal =>
                <MealItem key={meal.id} meal={meal} />
            )}
        </ul>
    );
}
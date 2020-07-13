import React from "react";
import axios from "axios";

class RandomMeal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meals: [],
      showComponent: false,
      ingredients: [],
      measures: [],
    };
  }

  _onButtonClick() {
    this.setState({
      showComponent: true,
    });
  }
  // ...............................Get Random Meal.................................
  getMeal() {
    axios
      .get("https://www.themealdb.com/api/json/v1/1/random.php")
      .then((response) => {
        // console.log(response.data.meals);
        const meals = response.data.meals;
        this.setState({ meals: meals });
        this.getIngredients(meals);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // ........................get ingredients with their respective measures..............
  getIngredients(meals) {
    meals.forEach((meal) => {
      const mealEntries = Object.entries(meal),
        [ingredientsArray, measuresArray] = ["strIngredient", "strMeasure"].map(
          (keyName) =>
            Object.assign(
              [],
              ...mealEntries
                .filter(([key, value]) => key.startsWith(keyName))
                .map(([key, value]) => ({
                  [parseInt(key.slice(keyName.length))]: value,
                }))
            )
        ),
        { finalIngredients, finalMeasures } = ingredientsArray.reduce(
          (results, value, index) => {
            if (
              (value && value.trim()) ||
              (measuresArray[index] && measuresArray[index].trim())
            ) {
              results.finalIngredients.push(value);
              results.finalMeasures.push(measuresArray[index]);
            }

            return results;
          },
          {
            finalIngredients: [],
            finalMeasures: [],
          }
        ),
       // zip both arrays
        ingredientsWithMeasures = finalIngredients.map((value, index) => [
          finalMeasures[index],
          value,
        ]);

      // Output
      console.log("Ingredients:", finalIngredients);
      console.log("Measures:", finalMeasures);

      ingredientsWithMeasures
        .map(
          ([measure, ingredient]) => `${measure || " "}  ${ingredient || " "}`
        )
        .join(" ");
      this.setState({ ingredients: ingredientsWithMeasures });
      console.log(ingredientsWithMeasures);
      console.log("Ingredients:", ingredientsArray);
      console.log("Measures:", measuresArray);
    });
  }
  // ................................end of getIngredients function.....................
  render() {
    const { meals } = this.state;

    // <..........List of Ingredients with measures................>
    const listItems = this.state.ingredients.map((ingredient) => (
      <li className="text-capitalize" key={ingredient}>
        {ingredient}
      </li>
    ));

    return (
      // .......................Initial component..................................
      <div id="meal-container" className="container">
        <div
          style={{ color: "#4e413b" }}
          className="d-flex flex-column mt-4 align-items-center"
        >
          <h1
            style={{ fontSize: "3rem" }}
            className="font-weight-bold font-italic"
          >
            Feeling Hungry?
          </h1>
          <p style={{ fontSize: "1.5rem" }}>
            Get a random meal by clicking here
          </p>
          <button
            onClick={() => {
              this.getMeal();
              this._onButtonClick();
            }}
            id="get-meal"
            className="getMeal cursor-pointer btn btn-lg btn-warning text-uppercase font-weight-bold"
            name="getMealbtn"
          >
            <span className="cursor-pointer"></span>
            get meal{" "}
            <span className="cursor-pointer" role="img" aria-label="burger">
              🍔
            </span>
          </button>
        </div>
        {/* .........................Print Random Meal on DOM with all its details.................. */}
        {this.state.showComponent ? (
          <div>
            {meals.map((meal) => (
              <div className="font-italic" key={meal.idMeal}>
                <div className="d-flex flex-row justify-content-center mt-5">
                  <div className="food-img ">
                    <div className="mr-5">
                      <img
                        style={{ width: "400px", borderRadius: "15px" }}
                        src={meal.strMealThumb}
                        alt="food-img"
                      />
                    </div>
                    <div className="font-italic ingredients mt-3">
                      <h5>
                        <span className="font-weight-bold">Category:</span>{" "}
                        {meal.strCategory}
                      </h5>
                      <h5>
                        <span className="font-weight-bold">Area: </span>
                        {meal.strArea}
                      </h5>
                      <h5 className="font-weight-bold">Ingredients:</h5>
                      <ul>{listItems}</ul>
                    </div>
                  </div>
                  <div style={{ width: "800px" }}>
                    <h2 className="font-weight-bold font-italic">
                      {meal.strMeal}
                    </h2>
                    <p>{meal.strInstructions}</p>
                  </div>
                </div>
                <div className="d-flex flex-column ">
                  <h5 className="font-weight-bold">Video Recipe</h5>
                  <div
                    className="video"
                    style={{
                      position: "relative",
                      paddingBottom: "56.25%" /* 16:9 */,
                      paddingTop: 25,
                      height: 0,
                    }}
                  >
                    <iframe
                      title="meal-video"
                      frameBorder="0"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                      src={`https://www.youtube.com/embed/${meal.strYoutube.slice(-11)}`}
                    ></iframe>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default RandomMeal;

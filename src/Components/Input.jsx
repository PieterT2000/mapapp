import React, { useState } from "react";

const Input = ({ submitHandler, places }) => {
  const [matches, setMatches] = useState([]);

  const handleInput = (e) => {
    console.log(places);
    let val = e.target.value.trim();

    // In case of empty values, reset matches
    if (val === "") return setMatches([]);

    const placeMatches = places
      .filter((place) => {
        const regex = new RegExp(`^${val}`, "gi");
        return place.match(regex);
      })
      .slice(0, 10); // We're only interested in top 10 matches
    console.log(matches);
    setMatches(placeMatches);
  };

  return (
    <form autoComplete="off">
      <div className="typeahead">
        <div className="upper">
          <div className="input-wrapper">
            <input
              placeholder={"Cyclotown"}
              onChange={(e) => handleInput(e)}
              type="text"
            />
          </div>
        </div>
        <div className="lower">
          <ul className="suggestions" hidden={!matches.length}>
            {matches.map((match, i) => (
              <li key={`${i}${match}`}>{match}</li>
            ))}
          </ul>
        </div>
      </div>
    </form>
  );
};

export default Input;

import React, { useState } from "react";

const TypeAhead = ({ submitHandler, places }) => {
  const [matches, setMatches] = useState([]);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(false);

  const handleInput = (e) => {
    let val = e.target.value;
    setInput(val);

    // In case of empty values, reset state
    if (val === "") {
      setSelected(false);
      return setMatches([]);
    }

    const placeMatches = places
      .filter((place) => {
        const regex = new RegExp(`^${val.trim()}`, "gi");
        return place.match(regex);
      })
      .slice(0, 9); // We're only interested in top 9 matches
    setMatches(placeMatches);
  };

  const handleSelection = ({ target }) => {
    if (!target.matches("li")) return;

    const placeName = target.textContent;
    setInput(placeName);
    // Remove suggestions after selection
    setMatches([]);
    // Apply styles for selected state
    setSelected(true);

    // Call Submit handler from here with selected place
    submitHandler(placeName);
  };

  const boldSearchTerm = (string) => {
    const length = input.length;
    const toBold = string.substring(0, length);
    const restOfString = string.substring(length);
    return (
      <>
        <strong> {toBold}</strong>
        {restOfString}
      </>
    );
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
      <div className="typeahead">
        <div className="upper">
          <div className={`input-wrapper ${selected && "selected"}`}>
            <input
              placeholder={"e.g. Cyclo Town"}
              onChange={(e) => handleInput(e)}
              type="text"
              value={input}
              className={input && "active"}
            />
          </div>
        </div>
        <div className="lower">
          <ul
            onClick={(e) => handleSelection(e)}
            className="suggestions"
            hidden={!matches.length}
          >
            {matches.map((match, i) => (
              <li key={`${i}${match}`}>{boldSearchTerm(match)}</li>
            ))}
          </ul>
        </div>
      </div>
    </form>
  );
};

export default TypeAhead;

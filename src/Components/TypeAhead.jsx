import "./../styles/typeahead.scss";

import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";

const TypeAhead = ({ submitHandler, places, renderComplete }) => {
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [input, setInput] = useState("");
  // A -1 value for selectedIndex means no keyboard navigation has been used yet
  const [selectedIndex, setSelectedIndex] = useState(-1);
  // Holds original user's input when they make use of keyboard selection
  const [originalInput, setOriginalInput] = useState("");

  /* This makes sure are spinner doesn't keep spinning forever once the map is gloriously loaded! */
  useEffect(() => {
    if (renderComplete) setSpinner(false);
  }, [renderComplete]);

  /**
   * Loads Suggestions based on user input
   * Triggered by: Change event on input text field
   * Effects: changes suggestions
   */
  const handleInput = (e) => {
    let val = e.target.value;
    setInput(val);

    // In case of empty values, we can't have any matches
    if (val === "") return setMatches([]);

    // No selection as soon as user edits placename after selection
    if (selected) setSelected(false);

    // Filter places where search term matches placenames (starting from beginning)
    const placeMatches = places
      .filter((place) => {
        const regex = new RegExp(`^${val.trim()}`, "gi");
        return place.match(regex);
      })
      .slice(0, 9); // We're only interested in top 9 matches
    setMatches(placeMatches);
  };

  // To be used both by click and 'Enter' events
  const handleSelection = (placeName) => {
    // Remove suggestions after selection
    setMatches([]);
    // Apply styles for selected state
    setSelected(true);
    // Call Submit handler from here with selected place -> loads new Vector Source
    submitHandler(placeName);
    // Start showing spinner till render of map is complete
    setSpinner(true);
  };

  /**
   * Triggered by: Click event on list of suggestions
   * Effects: Initiate fetching of new vector source
   */
  const handleClick = ({ target }) => {
    if (!target.matches("li") && !target.matches("strong")) return;

    // In case target is <strong> element, get content of parent <li>
    const placeName = target.matches("strong")
      ? target.parentElement.textContent.trim()
      : target.textContent.trim();
    // Put selection in text input field
    setInput(placeName);
    handleSelection(placeName);
  };

  /**
   * Accessibility for keyboard users
   * Triggered by: Keypress event on input text field
   * Effects: Navigating through matches
   */
  const handleKeypress = (e) => {
    if (!["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) return;
    const length = matches.length;
    // Don't respond to keyboard events in case of 0 matches or empty input
    if (!length || !input) return;

    const select = (i) => {
      // At first keyboard navigation event, save original input
      if (!originalInput) setOriginalInput(input);
      // Set Index for highlighting
      setSelectedIndex(i);
      // Set text input field to highlighted match
      setInput(matches[i]);
    };

    const restore = () => {
      setSelectedIndex(-1);
      setInput(originalInput);
      setOriginalInput("");
    };

    if (e.key === "ArrowDown") {
      if (selectedIndex >= length - 1) return;
      // If we haven't reached the end yet, increment index by 1
      select(selectedIndex + 1);
    } else if (e.key === "ArrowUp") {
      // Prevent Cursor from going back to index 0 in input field
      e.preventDefault();
      if (selectedIndex === -1) return select(length - 1);
      // Restore original user's text input if they navigate higher than index 0
      if (selectedIndex <= 0) return restore();
      select(selectedIndex - 1);
    } else {
      // In case Enter has been pressed
      handleSelection(matches[selectedIndex]);
      // Clean up
      setOriginalInput("");
      setSelectedIndex(-1);
    }
  };

  const boldSearchTerm = (string) => {
    // We don't want to update the bold substring whenever we navigate through the matches by keyboard
    let term_length = 0;
    // If selectedIndex is less than zero, keyboard navigation hasn't been used yet.
    if (selectedIndex < 0) term_length = input.length;
    else term_length = originalInput.length;

    const toBold = string.substring(0, term_length);
    const restOfString = string.substring(term_length);
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
              onKeyDown={(e) => handleKeypress(e)}
              type="text"
              value={input}
              className={input && "active"}
            />
          </div>
        </div>
        <div className="lower">
          <Spinner complete={!spinner} />
          <ul
            onClick={(e) => handleClick(e)}
            className="suggestions"
            hidden={!matches.length}
          >
            {matches.map((match, i) => (
              <li
                className={
                  selectedIndex >= 0 && matches[selectedIndex] === match
                    ? "kb-selected"
                    : ""
                }
                key={`${i}${match}`}
              >
                {boldSearchTerm(match)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </form>
  );
};

export default TypeAhead;

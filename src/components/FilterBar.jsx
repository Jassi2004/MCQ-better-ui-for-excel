import React from "react";

const FilterBar = ({ questions, setQuestions }) => {
    const filterByTopic = (topic) => {
        setQuestions(questions.filter((q) => q.Topic === topic));
    };

    return (
        <div className="filter-bar">
            <button onClick={() => filterByTopic("Networking")}>Networking</button>
            <button onClick={() => filterByTopic("DBMS")}>DBMS</button>
            <button onClick={() => filterByTopic("Operating Systems")}>Operating Systems</button>
            <button onClick={() => setQuestions(questions)}>Reset</button>
        </div>
    );
};

export default FilterBar;

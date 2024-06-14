import React from 'react';

// Header component
const Header = (props) => {
  console.log(props);
  return <h1>{props.course.name}</h1>;
};

// Part component
const Part = (props) => {
  console.log(props);
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  );
};

// Content component
const Content = (props) => {
  console.log(props);
  return (
    <div>
      {props.parts.map((part, index) => (
        <Part key={index} part={part} />
      ))}
    </div>
  );
};

// Total component
const Total = (props) => {
  console.log(props);
  const total = props.parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <p>Total of {total} exercises</p>
  );
};

// App component
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  };

  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default App;

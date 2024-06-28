import Part from './Part';

const Content = ({ parts }) => {
  const totalExercises = parts.reduce((sum, part) => {
    console.log('what is happening', sum, part);
    return sum + part.exercises;
  }, 0);

  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
      <p><strong>total of {totalExercises} exercises</strong></p>
    </div>
  );
};

export default Content;

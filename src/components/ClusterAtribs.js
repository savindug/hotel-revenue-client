export const ClusterAttribs = ({ index, min, max, mean, median }) => {
  return (
    <div>
      {console.log(min, max, mean, median)}
      <p>
        <h3>Star: {index++}</h3>
      </p>
      <p>Min: {min}</p>
      <p>Max: {max}</p>
      <p>Mean: {mean}</p>
      <p>Median: {median}</p>
    </div>
  );
};

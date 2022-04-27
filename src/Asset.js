function Asset({ img, name }) {
  return (
    <div className="asset">
      <img src={img} alt={name} />
      <h4>{name}</h4>
    </div>
  );
}

export default Asset;

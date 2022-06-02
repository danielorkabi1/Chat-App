export default function PrimiarAnimatedBtn({children,onClick}) {
  return (
    <button className="primiar-animated-button" onClick={onClick}>
      {children}
    </button>
  );
}

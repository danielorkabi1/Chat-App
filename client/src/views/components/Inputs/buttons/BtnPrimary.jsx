export default function BtnPrimary({ onClick, value }) {
  return (
    <button className="modal-button close-button" onClick={onClick}>
      {value}
    </button>
  );
}
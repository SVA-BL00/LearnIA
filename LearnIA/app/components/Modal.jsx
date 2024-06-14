import "../styles/modal.css";
import "../styles/main.css";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Modal({ show, onClose, onSubmit }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  if (!show) {
    return null;
  }

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = () => {
    if (selectedOption === "yes" && startDate && endDate) {
      onSubmit({ startDate, endDate });
    } else if (selectedOption === "no") {
      onSubmit({});
    }
    onClose();
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          className="modal-close"
          onClick={onClose}
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-x-lg" />
        </div>
        <h2 className="modal-title Roboto">Selección de fechas límite</h2>
        <p className="modal-subtitle">¿Te gustaría elegir fechas sugeridas para quizzes y examenes?</p>
        <div className="radio-buttons">
          <label>
            <input
              type="radio"
              value="yes"
              checked={selectedOption === "yes"}
              onChange={handleOptionChange}
            />
            Sí
          </label>
          <label>
            <input
              type="radio"
              value="no"
              checked={selectedOption === "no"}
              onChange={handleOptionChange}
            />
            No
          </label>
        </div>
        {selectedOption === "yes" && (
          <div>
            <div>
              <label style={{paddingRight:"0.5em"}}>Fecha de Inicio:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div>
              <label style={{paddingRight:"0.5em"}}>Fecha de Fin:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
              />
            </div>
          </div>
        )}
        <button onClick={handleSubmit} className="btn green" style={{marginTop:"1em"}}>Enviar</button>
      </div>
    </div>
  );
}

export default Modal;

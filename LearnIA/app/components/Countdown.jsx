import { useEffect } from "react";
import "../styles/flip.min.css";
import "../services/flip.min";

function Countdown() {
  useEffect(() => {
    const handleTickInit = () => {
        function handleTickInit(tick) {
            var nextYear = (new Date()).getFullYear() + 1;
            
            Tick.count.down(nextYear + '-01-01').onupdate = function(value) {
              tick.value = value;
            };
          }
    };

    handleTickInit();
  }, []);

  return (
    <div className="tick" data-did-init="handleTickInit">
      <div
        data-repeat="true"
        data-layout="horizontal center fit"
        data-transform="preset(d, h, m, s) -> delay"
      >
        <div className="tick-group">
          <div
            data-key="value"
            data-repeat="true"
            data-transform="pad(00) -> split -> delay"
          >
            <span data-view="flip"></span>
          </div>
          <span data-key="label" data-view="text" className="tick-label"></span>
        </div>
      </div>
    </div>
  );
}

export default Countdown;
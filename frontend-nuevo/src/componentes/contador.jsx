import React, { useEffect, useRef, useState } from 'react';
import './contador.css';

const ContadorRegresivo = ({ onFinish }) => {
  const [tiempo, setTiempo] = useState(3);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTiempo(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (onFinish) onFinish(); // Llama a onFinish cuando el tiempo llega a 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current); // Limpiar el intervalo al desmontar
  }, [onFinish]);

  return (
    <div className="contador">
      <div className="circulo">
        <span className="numero">{tiempo}</span>
      </div>
    </div>
  );
};

export default ContadorRegresivo;

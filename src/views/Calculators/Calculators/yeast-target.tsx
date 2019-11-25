import React, { useState, useEffect } from 'react';
import { l2gal } from '../../../resources/javascript/calculator';

const YeastTargetPitchingRate = (props: any) => {
  // STATE
  const [units, setUnits] = useState(props.units);
  const [og, setOg] = useState('');
  const [volume, setVolume] = useState('');
  const [target, setTarget] = useState('0.75');

  const { calculator } = props;
  let label = '';

  useEffect(() => {
    setUnits(props.units);
  }, [props]);

  const results = () => {
    const result = calculator(
      og,
      volume ? units === 'metric' ? parseFloat(l2gal(volume).toFixed(4)) : volume : undefined,
      target
    );
    if (!isNaN(result) && isFinite(result) && result > 0) {
      label = 'billion cells';
      return result;
    } else {
      label = '';
    }
  }

  return (
    <div>
      <h2>Target Yeast Pitching Rate</h2>
      <div>
        <label htmlFor="og">Original Gravity</label><br />
        <input
          name="og"
          type="number"
          value={og}
          onChange={(e) => setOg(e.target.value)}
        ></input><br />
        <label htmlFor="volume">Wort Volume ({props.labels.vol})</label><br />
        <input
          name="volume"
          type="number"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        ></input><br />
        <label htmlFor="target">Target Rate<br />(million cells / ml / °Plato)</label><br />
        <select
          name="target"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        >
          <option value="0.35">0.35 (Mfr. rate for Ale)</option>
          <option value="0.5">0.5 (Mfr. rate for Ale)</option>
          <option value="0.75">0.75 (Ale)</option>
          <option value="1.0">1.0 (Ale)</option>
          <option value="1.25">1.25 (High OG Ale)</option>
          <option value="1.5">1.5 (Lager)</option>
          <option value="1.75">1.75 (Lager)</option>
          <option value="2.0">2.0 (High OG Lager)</option>
        </select><br />
      </div>
      <div>
        <h3>Result:</h3>
        <p className="result">{results()} <label>{label}</label></p>
      </div>
    </div>
  );
}

export default YeastTargetPitchingRate;

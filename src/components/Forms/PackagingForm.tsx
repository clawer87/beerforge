import React, { useState, useEffect } from 'react';

import styles from "./Forms.module.scss"
import { BrewInterface } from '../../Store/BrewProvider';

interface Props {
  data: BrewInterface;
  dataUpdated: Function;
}

function PackagingForm(props: Props) {
  const [formData, setFormData] = useState(props.data);

  const dataChanged = (type: string) => (event: any) => {
    const data = event.currentTarget.value;
    setFormData({...formData, [type]: data});
  };

  useEffect(() => {
    props.dataUpdated(formData);
  });

  return(
    <>
      <label>Packaging Type<br />
        <select
          defaultValue={`${props.data.packagingType}`}
          onChange={dataChanged('packagingType')}
        >
          <option value="">Choose One</option>
          <option value="bottled">Bottled</option>
          <option value="kegged">Kegged</option>
        </select>
      </label>
      <label>Carbonation Method<br />
        <select
          defaultValue={`${props.data.carbonationMethod}`}
          onChange={dataChanged('carbonationMethod')}
        >
          <option value="">Choose One</option>
          {formData.packagingType !== 'bottled' ? <option value="forced">Forced CO2</option> : null}
          <option value="caneSugar">Cane Sugar</option>
          <option value="cornSugar">Corn Sugar</option>
          <option value="dme">DME</option>
        </select>
      </label>
      <div className={styles.row}>
        <label>CO2 Volume Target<br />
          <input
            type="number"
            step="0.1"
            placeholder="2.5"
            defaultValue={`${props.data.co2VolumeTarget}`}
            onChange={dataChanged('co2VolumeTarget')}
           />
        </label>
        <label>Beer Temp (°F)<br />
          <input
            type="number"
            placeholder="34"
            defaultValue={`${props.data.beerTemp}`}
            onChange={dataChanged('beerTemp')}
          />
        </label>
      </div>
    </>
  );
};

export default PackagingForm;
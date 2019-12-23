import React, { useState, useEffect } from 'react';
import axios from 'axios';

import styles from './Forms.module.scss';
import { BrewInterface, FermentableInterface } from '../../Store/BrewContext';
import { useUser } from '../../Store/UserContext';
import { lb2kg, kg2lb, SRM, OG } from '../../resources/javascript/calculator';

interface Props {
  brew: BrewInterface;
  editingData: FermentableInterface;
  dataUpdated: Function;
}

async function listAllFermentables() {
  try {
    return await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/ingredients/fermentables`)
      .then(result => {
        return result.data;
      });
  } catch (error) {
    console.log(error);
  }
}

function AddFermentableForm(props: Props) {
  // eslint-disable-next-line
  const [user, userDispatch] = useUser();
  const [formData, setFormData] = useState<FermentableInterface>({});
  const [fermentables, setFermentables] = useState<FermentableInterface[]>([]);
  const [projectedTotalSRM, setProjectedTotalSRM] = useState<number>(props.brew.srm ? props.brew.srm : 0);
  const [projectedOG, setProjectedOG] = useState<number>(props.brew.og ? props.brew.og : 0);

  useEffect(() => {
    // when formData changes, update the data in formHandler component
    let dataToSet: FermentableInterface[] = [];
    const fermentablesArray = props.brew.fermentables ? [...props.brew.fermentables] : [];
    const index = props.editingData && props.editingData.index ? props.editingData.index : -1;

    if (index > -1) {
      dataToSet = [...fermentablesArray];
      // index is passed as +1, so we need to subtract 1
      dataToSet.splice(index-1, 1, formData);
    } else {
      dataToSet = [...fermentablesArray, formData];
    }

    // Update the projected SRM and OG
    let fermentablesToCalculate = [...props.brew.fermentables];
    // if we are editing a fermentable, remove it's index from the list here and add it back
    // below so we don't end up with duplicates
    if (props.editingData !== null) {
      // @ts-ignore-line
      fermentablesToCalculate.splice(props.editingData.index-1, 1);
    }
    const brewsMalts = (formData.id && formData.id > 0) || (formData.custom && formData.custom.length > 0)
      ? [...fermentablesToCalculate, {
          potential: formData.potential ? formData.potential : 0,
          weight: formData.weight ? formData.weight : 0,
          lovibond: formData.lovibond ? formData.lovibond : 0
        }]
      : fermentablesToCalculate;
    setProjectedTotalSRM(SRM(brewsMalts, props.brew.batchSize));
    setProjectedOG(OG(brewsMalts, props.brew.systemEfficiency, props.brew.batchSize));

    // this lastIndex stuff is a check to make sure we don't submit an empty selection
    const lastIndex = dataToSet.length - 1;
    const name = dataToSet[lastIndex].name ? dataToSet[lastIndex].name : dataToSet[lastIndex].custom;
    if (name && name.length > 0) {
      props.dataUpdated({...props.brew, fermentables: dataToSet});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  useEffect(() => {
    // load fermentables when component renders
    listAllFermentables().then(result => {
      setFermentables(result);
    });
  }, []);

  useEffect(() => {
    // reset form when submitted
    setFormData({id: 0});
  }, [props.brew]);

  useEffect(() => {
    // if the form's editingData changes, we've selected something to edit.
    // set the form default valies to be the data we're editing.
    if (props.editingData !== null) {
      setFormData(props.editingData);
    } else {
      setFormData({id: 0});
    }
  }, [props.editingData]);

  const dataChanged = (type: string) => (event: any) => {
    let data: FermentableInterface = {};
    if (type === 'fermentable') {
      const choice = fermentables.find(fermentable => fermentable.id === parseInt(event.currentTarget.value));
      data = choice ? choice : {};
    } else if (type === 'custom') {
      data.custom = event.currentTarget.value;
    } else if (type === 'weight') {
      data.weight = user.units === 'metric' ? kg2lb(Number(event.currentTarget.value) + 0) : Number(event.currentTarget.value) + 0;
    } else {
      data[type] = Number(event.currentTarget.value) + 0;
    }

    if (data !== undefined) {
      if (type === 'custom' && !formData['custom']) {
        data['id'] = undefined;
        data['extract'] = undefined;
        data['lovibond'] = undefined;
        data['name'] = '';
        data['origin'] = '';
        data['potential'] = undefined;
      } else if (type === 'fermentable' && formData['custom']) {
        data['custom'] = '';
      }

      setFormData({...formData, ...data});
    }
  };

  return(
    <>
      <label>Select Fermentable<br />
        <select
          onChange={dataChanged('fermentable')}
          value={formData.id ? formData.id : 0}
          className={formData.custom ? styles.unused : ''}
        >
          <option value="0">Choose One</option>
          {fermentables.map(fermentable => (
            <option
              value={fermentable.id}
              key={fermentable.id}
            >
              {fermentable.name} - {fermentable.origin} - {fermentable.lovibond}°L
            </option>
          ))}
        </select>
      </label>
      <label><strong>Or</strong> add your own<br />
        <input
          type="text"
          placeholder="Fermentable Name"
          value={formData.custom ? formData.custom : ''}
          onChange={dataChanged('custom')}
          className={!formData.custom ? styles.unused : ''}
        />
      </label>
      {formData.custom
        ? <div className={styles.row}>
            <label>Lovibond (color)<br />
              <input
                type="number"
                step="0.1"
                placeholder="1"
                value={formData.lovibond ? formData.lovibond.toString() : ''}
                onChange={dataChanged('lovibond')}
              />
            </label>
            <label>Conversion Potential<br />
              <input
                type="number"
                step="1"
                placeholder="34"
                value={formData.potential ? formData.potential.toString() : ''}
                onChange={dataChanged('potential')}
              />
            </label>
          </div>
        : null }
      <label>Weight ({user.units === 'metric' ? 'kg' : 'lb'})<br />
        <input
          type="number"
          step="0.01"
          placeholder="0"
          value={formData.weight
            ? user.units === 'metric'
              ? parseFloat(lb2kg(formData.weight).toFixed(5))
              : formData.weight.toString() 
            : ''}
          onChange={dataChanged('weight')}
        />
      </label>
      <p className={styles.extra}>
        {props.brew.srm || (formData.lovibond && formData.weight && props.brew.batchSize)
          ? <>Projected SRM: <strong>{projectedTotalSRM}</strong><br /></>
          : null}
        {props.brew.srm || (formData.lovibond && formData.weight && props.brew.batchSize)
        ? <>Projected OG: <strong>{projectedOG}</strong></>
        : null}
      </p>
    </>
  );
};

export default AddFermentableForm;
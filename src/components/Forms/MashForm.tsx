import React, { useState, useEffect } from "react";

import { BrewInterface, MashInterface } from "../../Store/BrewContext";
import { useUser } from "../../Store/UserContext";
import {
  f2c,
  c2f,
  gal2l,
  l2gal,
  qt2l,
  l2qt
} from "../../resources/javascript/calculator";

interface Props {
  brew: BrewInterface;
  editingData: MashInterface;
  dataUpdated: Function;
}

function MashForm(props: Props) {
  // eslint-disable-next-line
  const [user, userDispatch] = useUser();
  const [formData, setFormData] = useState<MashInterface>({ type: "temperature" });

  const dataChanged = (type: string) => (event: any) => {
    let data: MashInterface = {};
    if (
      type === "targetStepTemp" ||
      type === "grainTemp" ||
      type === "spargeTemp"
    ) {
      data[type] =
        user.units === "metric"
          ? c2f(event.currentTarget.value)
          : event.currentTarget.value;
    } else if (type === "waterToGrain") {
      data.waterToGrain =
        user.units === "metric"
          ? l2qt(event.currentTarget.value)
          : event.currentTarget.value;
    } else if (type === "kettleSize") {
      data.kettleSize =
        user.units === "metric"
          ? l2gal(props.brew.kettleSize)
          : event.currentTarget.value;
    } else {
      data[type] = event.currentTarget.value;
    }
    setFormData({ ...formData, ...data });
  };

  useEffect(() => {
    // when formData changes, update the data in formHandler component
    const stepsArray = props.brew.mash ? [...props.brew.mash] : [];
    let dataToSet: MashInterface[] = [];
    const index = stepsArray.findIndex(step => step === props.editingData);

    // Take kettleSize out of the mash and put it in the main brew obj
    let kettleSize;
    const newData = {...formData};
    if (newData.kettleSize) {
      // @ts-ignore-line
      kettleSize = newData.kettleSize;
      // @ts-ignore-line
      delete newData.kettleSize;
    }

    if (index > -1) {
      dataToSet = stepsArray;
      dataToSet.splice(index, 1, newData);
    } else {
      dataToSet = [...stepsArray, newData];
    }

    // this lastIndex stuff is a check to make sure we don't submit an empty selection
    const lastIndex = dataToSet.length - 1;
    const targetStepTemp = dataToSet[lastIndex].targetStepTemp;
    const spargeTemp = dataToSet[lastIndex].spargeTemp;
    if (targetStepTemp || spargeTemp) {
      if (kettleSize) {
        props.dataUpdated({...props.brew, mash: dataToSet, kettleSize: kettleSize});
      } else {
        props.dataUpdated({...props.brew, mash: dataToSet});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  useEffect(() => {
    // reset form when submitted
    if (props.brew.mash.length > 0) {
      setFormData({ type: "temperature" });
    } else {
      if (props.brew.batchType === "BIAB") {
        setFormData({ type: "strike", kettleSize: user.kettle_size ? user.kettle_size : "" });
      } else {
        setFormData({ type: "strike" });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.brew]);

  return (
    <>
      <label>
        Step Type
        <br />
        <select
          onChange={dataChanged("type")}
          value={formData.type ? formData.type.toString() : ""}
        >
          {props.brew.mash.length > 0
            ? (<>
                <option value="temperature">Temperature</option>
                <option value="infusion">Infusion</option>
                <option value="decoction">Decoction</option>
                <option value="sparge">Sparge</option>
              </>
            ) : <option value="strike">Start with the strike step</option>}
        </select>
      </label>
      {formData.type !== "sparge" ? (
        <>
          <label>
            Target Temperature (°{user.units === "metric" ? "C" : "F"})<br />
            <input
              type="number"
              placeholder={user.units === "metric" ? "66" : "150"}
              value={formData.targetStepTemp
                ? user.units === "metric"
                  ? parseFloat(f2c(formData.targetStepTemp).toFixed(2))
                  : formData.targetStepTemp.toString()
                : ''}
              onChange={dataChanged("targetStepTemp")}
            />
          </label>
          {formData.type === "infusion" ? (
            <>
              <label>
                Current Mash Temperature (°{user.units === "metric" ? "C" : "F"}
                )
                <br />
                <input
                  type="number"
                  placeholder={user.units === "metric" ? "60" : "140"}
                  value={formData.currentMashTemp
                    ? user.units === "metric"
                      ? parseFloat(f2c(formData.currentMashTemp).toFixed(2))
                      : formData.currentMashTemp.toString()
                    : ''}
                  onChange={dataChanged("currentMashTemp")}
                />
              </label>
              <label>
                Infusion Water Temperature (°
                {user.units === "metric" ? "C" : "F"})<br />
                <input
                  name="infusionWaterTemp"
                  type="number"
                  placeholder={user.units === "metric" ? "98.89" : "210"}
                  value={formData.infusionWaterTemp
                    ? user.units === "metric"
                      ? parseFloat(f2c(formData.infusionWaterTemp).toFixed(2))
                      : formData.infusionWaterTemp.toString()
                    : ''}
                  onChange={dataChanged("infusionWaterTemp")}
                ></input>
              </label>
            </>
          ) : null}
          {formData.type === "strike" &&
          (props.brew.batchType === "allGrain" ||
            props.brew.batchType === "partialMash") ? (
            <label>
              Water to Grain Ratio ({user.units === "metric" ? "L" : "qt"})
              <br />
              <input
                type="number"
                step="0.1"
                placeholder={
                  props.brew.batchType === "partialMash" ? "1" : "1.5"
                }
                value={formData.waterToGrain
                  ? user.units === "metric"
                    ? parseFloat(qt2l(formData.waterToGrain).toFixed(5))
                    : formData.waterToGrain.toString()
                  : ''}
                onChange={dataChanged("waterToGrain")}
              />
            </label>
          ) : null}
          {formData.type === "strike" ? (
            <label>
              Initial Grain Temperature (°{user.units === "metric" ? "C" : "F"})
              <br />
              <input
                type="number"
                placeholder={user.units === "metric" ? "21" : "70"}
                value={formData.grainTemp
                  ? user.units === "metric"
                    ? parseFloat(f2c(formData.grainTemp).toFixed(2))
                    : formData.grainTemp.toString() 
                  : ''}
                onChange={dataChanged("grainTemp")}
              />
            </label>
          ) : null}
          {formData.type === "strike" && props.brew.batchType === "BIAB" ? (
            <label>
              Kettle Size ({user.units === "metric" ? "L" : "gal"})<br />
              <input
                type="number"
                placeholder={user.units === "metric" ? "37.8" : "10"}
                value={formData.kettleSize
                  ? user.units === "metric"
                    ? parseFloat(gal2l(formData.kettleSize).toFixed(5))
                    : formData.kettleSize.toString()
                  : ''}
                onChange={dataChanged("kettleSize")}
              />
            </label>
          ) : null}
          <label>
            Step Length (min)
            <br />
            <input
              type="number"
              placeholder="60"
              value={formData.stepLength ? formData.stepLength.toString() : ''}
              onChange={dataChanged("stepLength")}
            />
          </label>
        </>
      ) : null}
      {formData.type === "sparge" ? (
        <label>
          Sparge Temperature (°{user.units === "metric" ? "C" : "F"})<br />
          <input
            type="number"
            placeholder={user.units === "metric" ? "75.56" : "168"}
            value={formData.spargeTemp
              ? user.units === "metric"
                ? parseFloat(f2c(formData.spargeTemp).toFixed(2))
                : formData.spargeTemp.toString()
              : ''}
            onChange={dataChanged("spargeTemp")}
          />
        </label>
      ) : null}
    </>
  );
}

export default MashForm;

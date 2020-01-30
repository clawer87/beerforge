import React, { useState } from 'react';

import styles from '../Brew.module.scss';
import componentStyles from './BrewComponents.module.scss';
import { BrewInterface, MashInterface, processOptionsInterface } from '../../../Store/BrewContext';
import { gal2l, f2c, qt2l, l2gal, c2f, l2qt, lb2kg, strikeVolume, strikeTemp, spargeVolume } from '../../../resources/javascript/calculator';
import BrewEditableField from './BrewEditableField';

interface Props {
  readOnly: boolean;
  newBrew: boolean;
  brew: BrewInterface;
  unitLabels: any;
  openSideBar: Function;
  user: any;
  brewdayResults: boolean;
  applyEdit: Function;
  originalBrew: BrewInterface | null;
  options: processOptionsInterface;
}

const BrewMash = (props: Props) => {
  const {
    brew,
    readOnly,
    unitLabels,
    openSideBar,
    user,
    brewdayResults,
    applyEdit,
    originalBrew,
    options
  } = props;

  const [editing, setEditing] = useState(false);

  const editValue = (array: {value: any, choice: string, index: number | null}[]) => {
    const editedBrew = {...brew};
    array.forEach(change => {
      let data;
      switch (change.choice) {
        case 'strikeVolume':
        case 'spargeVolume':
          data = user.units === 'metric' ? l2gal(change.value) : change.value;
          break;
        case 'strikeTemp':
        case 'targetStepTemp':
        case 'totalMashVolume':
        case 'infusionWaterTemp':
        case 'spargeTemp':
          data = user.units === 'metric' ? c2f(change.value) : change.value;
          break;
        case 'infusionWaterVol':
          data = user.units === 'metric' ? l2qt(change.value) : change.value;
          break;
        default:
          data = change.value;
      }
      if (editedBrew.mash && change.index !== null && (change.choice !== 'totalWater' && change.choice !== 'totalMashVolume')) {
        editedBrew.mash[change.index][change.choice] = data;
      } else {
        editedBrew[change.choice] = Number(data);
      }
    });
    applyEdit(editedBrew);
  }

  const calculateRatio = (strikeVolume: number | undefined = 0, totalFermentables: number | undefined = 0) => {
    let value = (strikeVolume * 4) / totalFermentables;
    return value;
  }

  const utilityProps = {
    editValue,
    editing,
    setEditing,
    brewdayResults
  }

  return (
    <div className={`${styles.brew__section} ${styles.mash}`}>
      <div className={styles.brew__header}>
        <h2>Mash</h2>
        <span>{brew.batchType === 'BIAB' &&
          brew.totalMashVolume &&
          brew.kettleSize &&
          Number(brew.totalMashVolume) > Number(brew.kettleSize)
            ? <>Warning: Total mash volume exceeds kettle size</>
            : null}
        </span>
        {!readOnly && !brewdayResults
          ? <button
              className={`button button--icon pen ${styles.editButton}`}
              onClick={openSideBar('mash')}
            ><span>Edit</span></button>
          : null}
      </div>
      {brew && brew.mash.map((step: MashInterface, index: number) => {
        const originalStep = originalBrew !== null ? {...originalBrew.mash[index]} : null;
        return (
        <div
          key={`step${index + 1}`} className={styles.mash_step}
          onClick={!readOnly && !brewdayResults ? openSideBar('mash', {...step, index: index + 1}) : () => null}
        >
          <label className={styles.mash_label}>
            {index + 1}: {step.type ? step.type.toUpperCase() : ''}
          </label>
          <div className={styles.section__values}>
            {step.type === 'strike'
              ? <>
                <span>
                  {step.strikeVolume && brew.batchType !== 'BIAB' && step.strikeTemp
                    ? <>Strike with <strong>
                          <BrewEditableField
                            fieldName="strikeVolume"
                            value={user.units === 'metric'
                              ? parseFloat(gal2l(step.strikeVolume).toFixed(2))
                              : step.strikeVolume}
                            label={` ${unitLabels.vol}`}
                            calculate={() => {
                              let value;
                              if (brew.batchType === 'partialMash') {
                                value = strikeVolume(
                                  originalBrew && (options.units === 'metric'
                                    ? lb2kg(originalBrew.totalGrainFermentables)
                                    : originalBrew.totalGrainFermentables),
                                    step.waterToGrain
                                );
                              } else {
                                value = strikeVolume(
                                  originalBrew && (options.units === 'metric'
                                    ? lb2kg(originalBrew.totalFermentables)
                                    : originalBrew.totalFermentables),
                                    step.waterToGrain
                                );
                              }
                              editValue([{value: value, choice: 'strikeVolume', index: index}]);
                            }}
                            {...utilityProps}
                            editValue={(value: any, fieldName: any) => {
                              editValue([{value: value, choice: fieldName, index: index}])
                            }}
                          />
                        </strong> at <strong>
                          <BrewEditableField
                            fieldName="strikeTemp"
                            value={user.units === 'metric'
                              ? parseFloat(f2c(step.strikeTemp).toFixed(2))
                              : step.strikeTemp}
                            label={` °${unitLabels.temp}`}
                            calculate={() => {
                              const value = strikeTemp(
                                step.grainTemp,
                                step.targetStepTemp,
                                calculateRatio(
                                  step.strikeVolume,
                                  originalBrew && originalBrew.totalFermentables ? originalBrew.totalFermentables : 0
                                ),
                                options.strikeFactor
                              );
                              editValue([{value: value, choice: 'strikeTemp', index: index}]);
                            }}
                            {...utilityProps}
                            editValue={(value: any, fieldName: any) => {
                              editValue([{value: value, choice: fieldName, index: index}])
                            }}
                          />
                        </strong>
                        {((originalStep !== null && Number(originalStep.strikeVolume) !== Number(step.strikeVolume)) ||
                        (originalStep !== null && Number(originalStep.strikeTemp) !== Number(step.strikeTemp))) &&
                          <span className={componentStyles.originalValue}>
                            Strike with <strong>{originalStep.strikeVolume} {unitLabels.vol} </strong>
                            at <strong>{originalStep.strikeTemp} °{unitLabels.temp}</strong>
                          </span>}
                      </>
                    : null}
                  {brew.totalWater && brew.batchType === 'BIAB' && step.strikeTemp
                    ? <>Strike with <strong>
                          <BrewEditableField
                            fieldName="totalWater"
                            value={brew.totalWater.toFixed(2)}
                            label={` ${unitLabels.vol}`}
                            {...utilityProps}
                          />
                        &nbsp;</strong>at <strong>
                          <BrewEditableField
                            fieldName="strikeTemp"
                            value={user.units === 'metric'
                              ? parseFloat(f2c(step.strikeTemp).toFixed(1))
                              : step.strikeTemp}
                            label={` °${unitLabels.temp}`}
                            {...utilityProps}
                            editValue={(value: any, fieldName: any) => {
                              editValue([{value: value, choice: fieldName, index: index}])
                            }}
                          />
                        </strong>
                        {((originalBrew !== null && Number(originalBrew.totalWater) !== Number(brew.totalWater)) ||
                        (originalStep !== null && Number(originalStep.strikeTemp) !== Number(step.strikeTemp))) &&
                          <span className={componentStyles.originalValue}>
                            Strike with <strong>{originalBrew && originalBrew.totalWater} {unitLabels.vol} </strong>
                            at <strong>{originalStep && originalStep.strikeTemp} °{unitLabels.temp}</strong>
                          </span>}
                      </>
                    : null}
                </span>
                <span>
                  {step.targetStepTemp
                    ? <>Mash at <strong>
                        <BrewEditableField
                          fieldName="targetStepTemp"
                          value={user.units === 'metric'
                            ? parseFloat(f2c(step.targetStepTemp).toFixed(1))
                            : step.targetStepTemp}
                          label={` °${unitLabels.temp}`}
                          {...utilityProps}
                          editValue={(value: any, fieldName: any) => {
                            editValue([{value: value, choice: fieldName, index: index}])
                          }}
                        />
                        </strong>
                        {originalStep !== null && Number(originalStep.targetStepTemp) !== Number(step.targetStepTemp) &&
                          <span className={componentStyles.originalValue}>
                            Mash at <strong>{originalStep.targetStepTemp} °{unitLabels.temp}</strong>
                          </span>}
                      </>
                    : null}
                </span>
                <span>
                  {step.stepLength
                    ? <>Hold for <strong>
                        <BrewEditableField
                          fieldName="stepLength"
                          value={step.stepLength}
                          label=" min"
                          {...utilityProps}
                          editValue={(value: any, fieldName: any) => {
                            editValue([{value: value, choice: fieldName, index: index}])
                          }}
                        />
                        </strong>
                        {originalStep !== null && Number(originalStep.stepLength) !== Number(step.stepLength) &&
                          <span className={componentStyles.originalValue}>
                            Hold for <strong>{originalStep.stepLength} min</strong>
                          </span>}
                      </>
                    : null}
                </span>
                {brew.totalMashVolume && brew.batchType === 'BIAB'
                  ? <span>Total Mash Vol: <strong>
                        <BrewEditableField
                          fieldName="totalMashVolume"
                          value={user.units === 'metric'
                            ? parseFloat(gal2l(brew.totalMashVolume).toFixed(2))
                            : brew.totalMashVolume}
                          label={` ${unitLabels.vol}`}
                          {...utilityProps}
                        />
                      </strong>
                      {originalBrew !== null && Number(originalBrew.totalMashVolume) !== Number(brew.totalMashVolume) &&
                        <span className={componentStyles.originalValue}>
                          Total Mash Vol: <strong>{originalBrew.totalMashVolume} min</strong>
                        </span>}
                    </span>
                  : null}
              </>
              : null}
            {step.type === 'temperature' || step.type === 'decoction'
              ? <>
                <span>
                  {step.targetStepTemp
                    ? <>Raise to <strong>
                        <BrewEditableField
                          fieldName="targetStepTemp"
                          value={user.units === 'metric'
                            ? parseFloat(f2c(step.targetStepTemp).toFixed(1))
                            : step.targetStepTemp}
                          label={` °${unitLabels.temp}`}
                          {...utilityProps}
                          editValue={(value: any, fieldName: any) => {
                            editValue([{value: value, choice: fieldName, index: index}])
                          }}
                        />
                        </strong>
                        {originalStep !== null && Number(originalStep.targetStepTemp) !== Number(step.targetStepTemp) &&
                          <span className={componentStyles.originalValue}>
                            Raise to <strong>{originalStep.targetStepTemp} °{unitLabels.temp}</strong>
                          </span>}
                      </>
                    : null}
                </span>
                <span>
                  {step.stepLength
                    ? <>Hold for <strong>
                        <BrewEditableField
                          fieldName="stepLength"
                          value={step.stepLength}
                          label=" min"
                          {...utilityProps}
                          editValue={(value: any, fieldName: any) => {
                            editValue([{value: value, choice: fieldName, index: index}])
                          }}
                        />
                        </strong>
                        {originalStep !== null && Number(originalStep.stepLength) !== Number(step.stepLength) &&
                          <span className={componentStyles.originalValue}>
                            Hold for <strong>{originalStep.stepLength} min</strong>
                          </span>}
                      </>
                    : null}
                </span>
                </>
              : null}
            {step.type === 'infusion'
              ? <>
                <span>
                  {step.infusionWaterVol
                    ? <>Add <strong>
                        <BrewEditableField
                          fieldName="infusionWaterVol"
                          value={user.units === 'metric'
                            ? parseFloat(qt2l(step.infusionWaterVol).toFixed(2))
                            : step.infusionWaterVol}
                          label={` ${unitLabels.smallVol}`}
                          {...utilityProps}
                          editValue={(value: any, fieldName: any) => {
                            editValue([{value: value, choice: fieldName, index: index}])
                          }}
                        />
                        </strong>
                        {originalStep !== null && Number(originalStep.infusionWaterVol) !== Number(step.infusionWaterVol) &&
                          <span className={componentStyles.originalValue}>
                            Add <strong>{originalStep.infusionWaterVol} {unitLabels.smallVol}</strong>
                          </span>}
                      </>
                    : null}
                  {step.infusionWaterTemp
                    ? <> at <strong>
                        <BrewEditableField
                          fieldName="infusionWaterTemp"
                          value={user.units === 'metric'
                            ? parseFloat(f2c(step.infusionWaterTemp).toFixed(2))
                            : step.infusionWaterTemp}
                          label={` °${unitLabels.temp}`}
                          {...utilityProps}
                          editValue={(value: any, fieldName: any) => {
                            editValue([{value: value, choice: fieldName, index: index}])
                          }}
                        />
                        </strong>
                        {originalStep !== null && Number(originalStep.infusionWaterTemp) !== Number(step.infusionWaterTemp) &&
                          <span className={componentStyles.originalValue}>
                            at <strong>{originalStep.infusionWaterTemp} °{unitLabels.temp}</strong>
                          </span>}
                      </>
                    : null}
                </span>
                <span>
                  {step.targetStepTemp
                    ? <> Bring to <strong>
                        <BrewEditableField
                          fieldName="targetStepTemp"
                          value={user.units === 'metric'
                            ? parseFloat(f2c(step.targetStepTemp).toFixed(2))
                            : step.targetStepTemp}
                          label={` °${unitLabels.temp}`}
                          {...utilityProps}
                          editValue={(value: any, fieldName: any) => {
                            editValue([{value: value, choice: fieldName, index: index}])
                          }}
                        />
                        </strong>
                        {originalStep !== null && Number(originalStep.targetStepTemp) !== Number(step.targetStepTemp) &&
                          <span className={componentStyles.originalValue}>
                            Bring to <strong>{originalStep.targetStepTemp} °{unitLabels.temp}</strong>
                          </span>}
                      </>
                    : null}
                </span>
                <span>
                  {step.stepLength
                    ? <>Hold for <strong>
                        <BrewEditableField
                          fieldName="stepLength"
                          value={step.stepLength}
                          label=" min"
                          {...utilityProps}
                          editValue={(value: any, fieldName: any) => {
                            editValue([{value: value, choice: fieldName, index: index}])
                          }}
                        />
                        </strong>
                        {originalStep !== null && Number(originalStep.stepLength) !== Number(step.stepLength) &&
                          <span className={componentStyles.originalValue}>
                            Hold For <strong>{originalStep.stepLength} min</strong>
                          </span>}
                      </>
                    : null}
                </span>
                </>
              : null}
            {step.type === 'sparge'
              ? <span>
                {step.spargeTemp
                  ? <>Sparge&nbsp;
                    {step.spargeVolume
                      ? <>with <strong>
                          <BrewEditableField
                            fieldName="spargeVolume"
                            value={user.units === 'metric'
                              ? parseFloat(gal2l(step.spargeVolume).toFixed(2))
                              : step.spargeVolume}
                            label={` ${unitLabels.vol}`}
                            {...utilityProps}
                            calculate={() => {
                              let totalInfusionWaterVol = 0;
                              brew.mash.find((item, i) => {
                                if (item.type === 'sparge') {
                                  index = i;
                                } else if (item.type === 'infusion') {
                                  totalInfusionWaterVol = item.infusionWaterVol
                                    ? totalInfusionWaterVol + Number(item.infusionWaterVol / 4) // convert to gallons from quarts
                                    : totalInfusionWaterVol + 0
                                }
                                return null;
                              });
                              const value = spargeVolume(
                                brew.totalWater,
                                Number(brew.mash[0].strikeVolume) + totalInfusionWaterVol
                              );
                              editValue([{value: value, choice: 'spargeVolume', index: index}]);
                            }}
                            editValue={(value: any, fieldName: any) => {
                              editValue([{value: value, choice: fieldName, index: index}])
                            }}
                          />
                          </strong>
                        </>
                      : null}
                    &nbsp;at <strong>
                      <BrewEditableField
                        fieldName="spargeTemp"
                        value={user.units === 'metric'
                          ? parseFloat(f2c(step.spargeTemp).toFixed(1))
                          : step.spargeTemp}
                        label={` °${unitLabels.temp}`}
                        {...utilityProps}
                        editValue={(value: any, fieldName: any) => {
                          editValue([{value: value, choice: fieldName, index: index}])
                        }}
                      />
                      </strong>
                      {((originalStep !== null && Number(originalStep.spargeVolume) !== Number(step.spargeVolume)) ||
                        (originalStep !== null && Number(originalStep.spargeTemp) !== Number(step.spargeTemp))) &&
                          <span className={componentStyles.originalValue}>
                            Sparge with <strong>{originalStep.spargeVolume} {unitLabels.vol} </strong>
                            at <strong>{originalStep.spargeTemp} °{unitLabels.temp}</strong>
                          </span>}
                    </>
                  : null}
              </span>
              : null}
          </div>
        </div>
        );
      }
    )}
    </div>
  );
}

export default BrewMash;
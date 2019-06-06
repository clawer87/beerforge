import React from 'react';
import * as Calculator from '../resources/javascript/Calculator';

export interface FermentableInterface {
  id?: number;
  name?: string;
  weight?: number;
  unit?: 'lbs' | 'oz';
  lovibond?: number;
  potential?: number;
};

export interface HopInterface {
  id: number;
  name: string;
  weight: number;
  alphaAcid: number;
  lengthInBoil: number;
};

export interface YeastInterface {
  id: number;
  name: string;
  yeastForm: string;
  amount: number;
  mfgDate?: Date;
};

export interface BrewInterface {
  name?: string;
  batchType?: string;
  batchSize?: number;
  systemEfficiency?: number;
  targetPitchingRate?: string;
  fermentables: FermentableInterface[];
  totalFermentables?: number;
  hops: HopInterface[];
  yeast: YeastInterface[];
  strikeTempFactor?: number;
  strikeTemp?: number;
  strikeVolume?: number;
  targetMashTemp?: number;
  waterToGrain?: number;
  grainTemp?: number;
  mashLength?: number;
  spargeTemp?: number;
  boilLength?: number;
  evaporationRate?: number;
  primaryLength?: number;
  primaryTemp?: number;
  secondaryLength?: number;
  secondaryTemp?: number;
  packagingType?: string;
  carbonationMethod?: string;
  co2VolumeTarget?: number;
  beerTemp?: number;
  amountForCO2?: number;
  notes?: string;
  srm?: number;
};

const DEFAULT_STATE = {
  brew: {
    name: '',
    fermentables: [],
    hops: [],
    yeast: [],
  } as BrewInterface
};

export const ThemeContext = React.createContext(DEFAULT_STATE);

export default class Provider extends React.Component {
  state = DEFAULT_STATE;

  compareWeight = (a: FermentableInterface | HopInterface, b: FermentableInterface | HopInterface) => {
    const weightA = Number(a.weight);
    const weightB = Number(b.weight);
  
    let comparison = 0;
    if (weightA > weightB) {
      comparison = -1;
    } else if (weightA < weightB) {
      comparison = 1;
    }
    return comparison;
  };

  updateBrew = (brew: BrewInterface): void => {
    // Sort ingredients
    if (brew.fermentables) {
      brew.fermentables.sort(this.compareWeight);
    }
    if (brew.hops) {
      brew.hops.sort(this.compareWeight);
    }

    // Run Calculations
    if (brew.fermentables) {
      brew.totalFermentables = Calculator.totalFermentableWeight(brew.fermentables);
    }
    if (brew.fermentables, brew.batchSize) {
      brew.srm = Calculator.SRM(brew.fermentables, brew.batchSize);
    }
    if (brew.totalFermentables, brew.waterToGrain) {
      brew.strikeVolume = Calculator.strikeVolume(brew.totalFermentables, brew.waterToGrain);
    }
    if (brew.grainTemp, brew.targetMashTemp, brew.waterToGrain) {
      brew.strikeTemp = Calculator.strikeTemp(brew.grainTemp, brew.targetMashTemp, brew.waterToGrain, brew.strikeTempFactor);
    }
    if (brew.beerTemp, brew.co2VolumeTarget, brew.carbonationMethod, brew.batchSize) {
      brew.amountForCO2 = Calculator.CO2(brew.beerTemp, brew.co2VolumeTarget, brew.carbonationMethod, brew.batchSize);
    }

    console.log(brew);
    this.setState({brew});
  };

  render() {
    return (
      <ThemeContext.Provider
        value={{
          ...this.state,
          updateBrew: this.updateBrew,
        }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';

import styles from './Brew.module.scss';
import Card from '../../components/Card/Card';
import { getSrmToRgb } from '../../resources/javascript/srmToRgb';
import List from '../../components/List/List';
import ListItem from '../../components/ListItem/ListItem';

interface Props extends RouteComponentProps {}

class Brew extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);

    this.state = {}
  }

  render() {
    return (
      <section className={styles.brew}>
        <div className={styles.brew__pageHeading}>
          <h1>New Brew</h1>
          <button
            className={`button button--link ${styles.settings}`}
            onClick={() => {}}
          >
            Settings
          </button>
        </div>
        <Card color="brew" customClass={styles.new}>
          <div className={styles.brew__numbers}>
            <ul className={styles.brew__numbersList}>
              <li>Brew Method:</li>
              <li>Batch Size:</li>
              <li>System Efficiency:</li>
            </ul>
            <div className={styles.brew__stats}>
              <div className={styles.brew__stat}>
                <span className={styles.value}>8.1%</span>
                <label className={styles.label}>ABV</label>
              </div>
              <div className={styles.brew__stat}>
                <span className={styles.value}>80.3%</span>
                <label className={styles.label}>ATTEN.</label>
              </div>
              <div className={styles.brew__stat}>
                <span className={styles.value}>74.78</span>
                <label className={styles.label}>IBU</label>
              </div>
              <div className={styles.brew__stat}>
                <span className={styles.value}>
                  <div
                    className={styles.srmSwatch}
                    style={{backgroundColor: getSrmToRgb(7)}}
                  />
                  7
                </span>
                <label className={styles.label}>SRM</label>
              </div>
            </div>
          </div>
        </Card>
        <Card color="brew" customClass={styles.new}>
          <div className={styles.brew__header}>
            <h2>Fermentables</h2>
            <span>Total: 12.75 lbs</span>
          </div>
          <List customClass={styles.brew__ingredients}>
            <ListItem
              color="brew"
              clicked={() => {}}
            >
              <span>12.75 lbs</span>
              <span>American Two-Row</span>
              <span>1.8 SRM</span>
            </ListItem>
          </List>
        </Card>
        <Card color="brew" customClass={styles.new}>
          <div className={styles.brew__header}>
            <h2>Hops</h2>
            <span>Total: 1 oz</span>
          </div>
          <List customClass={styles.brew__ingredients}>
            <ListItem
              color="brew"
              clicked={() => {}}
            >
              <span>1 oz</span>
              <span>Horizon</span>
              <span>13% AA</span>
              <span>60 min</span>
              <span>49.12 IBU</span>
            </ListItem>
          </List>
        </Card>
        <Card color="brew" customClass={styles.new}>
          <div className={styles.brew__header}>
            <h2>Yeast</h2>
            <span>Cell Count: 200 bn</span>
          </div>
          <List customClass={styles.brew__ingredients}>
            <ListItem
              color="brew"
              clicked={() => {}}
            >
              <span>2 packs</span>
              <span>White Labs California Ale WLP001</span>
            </ListItem>
          </List>
        </Card>
        <Card color="brew" customClass={styles.new}>
          <div className={styles.brew__section}>
            <div className={styles.brew__header}><h2>Mash</h2></div>
            <div className={styles.section__values}>
              <span>Strike with <strong>5.5 gal</strong> at <strong>160° F</strong></span>
              <span>Mash for <strong>90 min</strong></span>
              <span>Mash at <strong>149° F</strong></span>
              <span>Sparge with <strong>8.3 gal</strong> at <strong>168° F</strong></span>
            </div>
          </div>
          <div className={styles.brew__section}>
            <div className={styles.brew__header}><h2>Boil</h2></div>
            <div className={styles.section__values}>
              <span>Boil Time: <strong>60 min</strong></span>
              <span>Boil Size: <strong>7.5 gal</strong></span>
              <div></div>
              <div className={styles.section__stats}>
                <div className={styles.brew__stat}>
                  <span className={styles.value}>1.061</span>
                  <label className={styles.label}>PRE</label>
                </div>
                <span className={styles.arrow}></span>
                <div className={styles.brew__stat}>
                  <span className={styles.value}>1.076</span>
                  <label className={styles.label}>OG</label>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.brew__section}>
            <div className={styles.brew__header}><h2>Fermentation</h2></div>
            <div className={styles.section__values}>
              <div>
                <span>Length: <strong>14 days</strong></span>
              </div>
              <div>
                <span>Temp: <strong>65° F</strong></span>
              </div>
              <div></div>
              <div className={styles.section__stats}>
                <div className={styles.brew__stat}>
                  <span className={styles.value}>1.076</span>
                  <label className={styles.label}>OG</label>
                </div>
                <span className={styles.arrow}></span>
                <div className={styles.brew__stat}>
                  <span className={styles.value}>1.015</span>
                  <label className={styles.label}>FG</label>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.brew__section}>
            <div className={styles.brew__header}><h2>Packaging</h2></div>
            <div className={styles.section__values}>
              <span><strong>Kegged/Forced</strong></span>
              <span>CO2 Vol: <strong>2.3</strong></span>
              <span>Temp: <strong>34° F</strong></span>
              <span>Pressure: <strong>7.26 psi</strong></span>
            </div>
          </div>
          <div className={styles.brew__header}><h2>Notes</h2></div>
          <div className={styles.brew__notes}>
            <p>Space Needle Kidd Valley Burgers Pike Brewing Flatstick Pub Green Lake Burke-Gilman Trail Macklemore. Mariners Theo Chocolate Caffe Ladro Sounder light rail rain, rain, and more rain Pike Market Columbia City taking the monorail to avoid parking downtown Centurylink Field Pioneer Square Sounders.</p>
          </div>
        </Card>
        <button
          type="submit"
          className={`button button--large ${styles.saveButton}`}
        >
          Save &amp; Get Brewing!
        </button>
      </section>
    );
  }
}

export default Brew;
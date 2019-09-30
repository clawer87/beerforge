import React, { ReactElement, useState } from 'react';

import styles from './FormHandler.module.scss';
import BrewSettingsForm from '../../../components/Forms/BrewSettingsForm';
import AddFermentableForm from '../../../components/Forms/AddFermentableForm';
import AddHopForm from '../../../components/Forms/AddHopForm';
import AddYeastForm from '../../../components/Forms/AddYeastForm';
import AddAdjunctForm from '../../../components/Forms/AddAdjunctForm';
import MashForm from '../../../components/Forms/MashForm';
import BoilForm from '../../../components/Forms/BoilForm';
import FermentationForm from '../../../components/Forms/FermentationForm';
import PackagingForm from '../../../components/Forms/PackagingForm';
import NotesForm from '../../../components/Forms/NotesForm';
import { BrewInterface } from '../../../Store/BrewContext';
import { useBrew } from '../../../Store/BrewContext';

interface Props {
  form: string;
  nextForm: any;
  editingData: any;
  closeSidebar: any;
  deleteBrew: Function;
  updateBrew: Function;
}

function FormHandler({
  form,
  nextForm,
  editingData,
  closeSidebar,
  updateBrew,
  deleteBrew,
}: Props) {

  let title: string,
      component: ReactElement | null,
      submitText: string;
  // eslint-disable-next-line
  const [brew, brewDispatch] = useBrew();
  const [formData, setFormData] = useState<BrewInterface | null>(null);

  // Stuff that isn't supposed to be part of the brew
  const [optionData, setOptionData] = useState<any | null>({});

  const setData = (data: any, options: any = null) => {
    setFormData(data);
    setOptionData(options);
  };

  const saveData = () => {
    if (optionData && optionData.secondary === false && formData) {
      delete formData.secondaryLength;
      delete formData.secondaryTemp;
    }
    updateBrew({...formData});
  };

  const handleNext = () => {
    if (formData !== null) {
      updateBrew({...formData});
    }
    nextForm();
  };

  const handleDelete = () => {
    // @ts-ignore-line
    let ingredientArray = [...formData[form]];
    let dataToSet: any = [];
    const index = ingredientArray.findIndex(ingredient => ingredient === editingData);

    if (index > -1) {
      dataToSet = ingredientArray;
      dataToSet.splice(index, 1);
    } else {
      dataToSet = [...ingredientArray, formData];
    }

    setFormData({...brew, [form]: dataToSet});
    updateBrew({...formData, [form]: dataToSet});
  };

  switch (form) {
    case 'settings':
      title = 'Settings';
      component = <BrewSettingsForm brew={brew} dataUpdated={setData} delete={deleteBrew} />
      submitText = 'Submit';
      break;
    case 'fermentables':
      if (editingData) {
        title = 'Edit Fermentable';
        submitText = 'Edit';
      } else {
        title = 'Add Fermentable';
        submitText = '+ Add';
      }
      component = <AddFermentableForm brew={brew} editingData={editingData} dataUpdated={setData} />;
      break;
    case 'hops':
      if (editingData) {
        title = 'Edit Hop';
        submitText = 'Edit';
      } else {
        title = 'Add Hop';
        submitText = '+ Add';
      }
      component = <AddHopForm brew={brew} editingData={editingData} dataUpdated={setData} />;
      break;
    case 'yeast':
      if (editingData) {
        title = 'Edit Yeast';
        submitText = 'Edit';
      } else {
        title = 'Add Yeast';
        submitText = '+ Add';
      }
      component = <AddYeastForm brew={brew} editingData={editingData} dataUpdated={setData} />;
      break;
    case 'adjuncts':
      if (editingData) {
        title = 'Edit Adjunct';
        submitText = 'Edit';
      } else {
        title = 'Add Adjunct';
        submitText = '+ Add';
      }
      component = <AddAdjunctForm brew={brew} editingData={editingData} dataUpdated={setData} />;
      break;
    case 'mash':
      title = 'Mash';
      component = <MashForm brew={brew} dataUpdated={setData} />;
      submitText = 'Submit';
      break;
    case 'boil':
      title = 'Boil';
      component = <BoilForm brew={brew} dataUpdated={setData} />;
      submitText = 'Submit';
      break;
    case 'fermentation':
      title = 'Fermentation';
      component = <FermentationForm brew={brew} dataUpdated={setData} />;
      submitText = 'Submit';
      break;
    case 'packaging':
      title = 'Packaging';
      component = <PackagingForm brew={brew} dataUpdated={setData} />;
      submitText = 'Submit';
      break;
    case 'notes':
      title = 'Notes';
      component = <NotesForm brew={brew} dataUpdated={setData} />;
      submitText = 'Submit';
      break;
    default:
      title = '';
      component = null;
      submitText = '';
      break;
  }

  return(
    <div className={styles.formContainer}>
      {title.length > 0 ? <h2>{title}</h2> : null}
      <button
        className={`button button--link ${styles.sideBarClose}`}
        onClick={closeSidebar}
      >Done</button>
      {component}
      <div className={styles.formContainer__footer}>
        <button
          className="button button--green button--no-shadow"
          onClick={saveData}
        >{submitText}</button>
        <button
          className="button button--brown button--no-shadow"
          onClick={closeSidebar}
        >Cancel</button>
        {form !== 'notes' && editingData === null
          ? <button
              className="button button--no-shadow"
              onClick={handleNext}
            >Next</button>
          : <br />}
        {editingData !== null
          ? <button
              className="button button--error button--no-shadow"
              onClick={handleDelete}
            >Delete</button>
          : null}
      </div>
    </div>
  );
};

export default FormHandler;
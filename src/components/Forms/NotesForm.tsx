import React, { useState, useEffect } from 'react';

import styles from "./Forms.module.scss"
import { BrewInterface } from '../../Store/BrewProvider';
import Textarea from '../Textarea/Textarea';

interface Props {
  data: BrewInterface;
  dataUpdated: Function;
}

function NotesForm(props: Props) {
  const textInput = React.createRef<HTMLTextAreaElement>();
  const [formData, setFormData] = useState(props.data);

  const dataChanged = (data: string) => {
    setFormData({...formData, ['notes']: data});
  };

  useEffect(() => {
    props.dataUpdated(formData);
  });

  return(
    <>
      <Textarea
        data={props.data.notes}
        valueUpdated={dataChanged}
      />
    </>
  );
};

export default NotesForm;
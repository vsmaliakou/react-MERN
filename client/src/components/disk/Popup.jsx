import React, { useState } from 'react';
import Input from '../../utils/input/Input';
import { useDispatch, useSelector } from 'react-redux';
import { setPopupDisplay } from '../../reducers/fileReducer';
import { createDir } from '../../actions/file';

const Popup = () => {
  const [dirName, setDirName] = useState('');
  const popupDisplay = useSelector((state) => state.files.popupDisplay);
  const currentDir = useSelector((state) => state.files.currentDir);
  const dispatch = useDispatch();

  function createDirHandler() {
    dispatch(createDir(currentDir, dirName));
    setDirName('');
    dispatch(setPopupDisplay('none'));
  };

  return (
    <div className="popup" style={{ display: popupDisplay }} onClick={() => dispatch(setPopupDisplay('none'))}>
      <div className="popup__content" onClick={(e) => e.stopPropagation()}>
        <div className="popup__header">
          <div className="popup__title">Создать новую папку</div>
          <button className="popup__close" onClick={() => dispatch(setPopupDisplay('none'))}>X</button>
        </div>
        <Input
          type="text"
          placeholder="Введите название папки..."
          value={dirName}
          setValue={setDirName}
        />
        <button className="popup__create" onClick={createDirHandler}>Создать</button>
      </div>
    </div>
  );
};

export default Popup;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFiles, uploadFile } from '../../actions/file';
import FileList from './fileList/FileList';
import './disk.css';
import Popup from './Popup';
import { setCurrentDir, setFileView, setPopupDisplay } from '../../reducers/fileReducer';
import Uploader from './uploader/Uploader';

const Disk = () => {
  const dispatch = useDispatch();
  const currentDir = useSelector((state) => state.files.currentDir);
  const diskStack = useSelector((state) => state.files.diskStack);
  const loader = useSelector((state) => state.app.loader);
  const [dragEnter, setDragEnter] = useState(false);
  const [sort, setSort] = useState('type');

  function showPopupHandler() {
    dispatch(setPopupDisplay('flex'));
  };

  function backClickHandler() {
    const backDirId = diskStack.pop();
    dispatch(setCurrentDir(backDirId));
  }

  function fileUploadHandler(event) {
    const files = [...event.target.files];

    files.forEach((file) => dispatch(uploadFile(file, currentDir)));
  }

  function dragEnterHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragEnter(true);
  }

  function dragLeaveHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragEnter(false);
  }

  function dropHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    const files = [...event.dataTransfer.files];

    files.forEach((file) => dispatch(uploadFile(file, currentDir)));
    setDragEnter(false);
  }

  useEffect(() => {
    dispatch(getFiles(currentDir, sort));
  }, [currentDir, sort]);

  if (loader) {
    return (
      <div className="loader">
        <div className="lds-dual-ring"></div>
      </div>
    );
  }

  return !dragEnter ? (
    <div
      className="disk"
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDragOver={dragEnterHandler}
    >
      <div className="disk__btns">
        <button className="disk__back" onClick={backClickHandler}>Назад</button>
        <button className="disk__create" onClick={showPopupHandler}>Создать папку</button>
        <div className="disk__upload">
          <label htmlFor="disk__upload-input" className="disk__upload-label">Загрузить файл</label>
          <input
            type="file"
            id="disk__upload-input"
            className="disk__upload-input"
            multiple={true}
            onChange={fileUploadHandler}
          />
        </div>
        <select
          className="disk__select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="name">По имени</option>
          <option value="type">По типу</option>
          <option value="date">По дате</option>
        </select>
        <button className="disk__plate" onClick={() => dispatch(setFileView('plate'))} />
        <button className="disk__list" onClick={() => dispatch(setFileView('list'))} />
      </div>
      <FileList />
      <Popup />
      <Uploader />
    </div>
  ) : (
    <div
      className="drop-area"
      onDrop={dropHandler}
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDragOver={dragEnterHandler}
    >
      Перетащите файлы сюда
    </div>
  );
};

export default Disk;

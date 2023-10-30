import React, { useState } from 'react';
import "@logseq/libs"
import './Viewer.css'

const Viewer: React.FC<{ srcLink: string}> = ({ srcLink}) => {

  return (
    <>
    <ButtonContainer srcLink={srcLink}/>
    <iframe title="epub" className="iframe" src={srcLink} allowFullScreen></iframe>
    </>
  );
}


const ButtonContainer: React.FC<{ srcLink: string}> = ({ srcLink}) => {

  const hide = () => {
    logseq.provideStyle({
      // key: 'content-widen-mode', // Not providing key would reset style
      style: `
      #app-container {
        width: 100% ;
      }
      `,
    })
    logseq.hideMainUI()
}

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
    ;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - startPosition.x;
    const newY = e.clientY - startPosition.y;

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      title="Drag to Move"
      className={`button-container ${isDragging ? 'dragging' : ''}`}
      style={{ left: '50%',
      top: '50%',
      transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
      position: 'absolute'}}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >  
      {/* */}
      <div className="drag-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9.71 6.29a1 1 0 0 0-1.42 0l-5 5a1 1 0 0 0 0 1.42l5 5a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42L5.41 12l4.3-4.29a1 1 0 0 0 0-1.42Zm11 5l-5-5a1 1 0 0 0-1.42 1.42l4.3 4.29l-4.3 4.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l5-5a1 1 0 0 0 0-1.42Z"/></svg>
      </div>

      <a title="Annotations block (Not yet working)" className="button"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M18 13V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3l3 3l3-3h3a2 2 0 0 0 2-2ZM5 7a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Zm1 3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2H6Z" clip-rule="evenodd"/></svg></a>

      <a title="Open in browser" className="button" href={srcLink} target="_blank"><svg xmlns="http://www.w3.org/2000/svg" className="icon" width="18" height="18" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><rect x="3" y="16" width="5" height="5" rx="1"></rect><path d="M4 12v-6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-6"></path><path d="M12 8h4v4"></path><path d="M16 8l-5 5"></path></svg></a>

      <a title="Settings" className="button" ><svg fill="none" width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" className="icon" onClick={() => logseq.showSettingsUI()}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg></a>

      <a className="button" type="button" title="Close Viewer" onClick={() => hide()} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 7l10 10M7 17L17 7"/></svg></a>

    </div>
  );
}




export default Viewer




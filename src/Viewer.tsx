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
      className={`button-container ${isDragging ? 'dragging' : ''}`}
      style={{ left: '50%',
      top: '50%',
      transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
      position: 'absolute'}}
      >  
      {/* */}
      <div className="drag-button"
            title="Drag to Move"

            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="currentColor" fill-rule="evenodd" stroke-width="4" d="M16.1924 5.65683C16.5829 5.2663 16.5829 4.63314 16.1924 4.24261L13.364 1.41419C12.5829 0.633139 11.3166 0.633137 10.5355 1.41419L7.70711 4.24261C7.31658 4.63314 7.31658 5.2663 7.70711 5.65683C8.09763 6.04735 8.73079 6.04735 9.12132 5.65683L11 3.77812V11.0503H3.72784L5.60655 9.17157C5.99707 8.78104 5.99707 8.14788 5.60655 7.75735C5.21602 7.36683 4.58286 7.36683 4.19234 7.75735L1.36391 10.5858C0.582863 11.3668 0.582859 12.6332 1.36391 13.4142L4.19234 16.2426C4.58286 16.6332 5.21603 16.6332 5.60655 16.2426C5.99707 15.8521 5.99707 15.219 5.60655 14.8284L3.8284 13.0503H11V20.2219L9.12132 18.3432C8.73079 17.9526 8.09763 17.9526 7.7071 18.3432C7.31658 18.7337 7.31658 19.3669 7.7071 19.7574L10.5355 22.5858C11.3166 23.3669 12.5829 23.3669 13.364 22.5858L16.1924 19.7574C16.5829 19.3669 16.5829 18.7337 16.1924 18.3432C15.8019 17.9526 15.1687 17.9526 14.7782 18.3432L13 20.1213V13.0503H20.071L18.2929 14.8284C17.9024 15.219 17.9024 15.8521 18.2929 16.2426C18.6834 16.6332 19.3166 16.6332 19.7071 16.2426L22.5355 13.4142C23.3166 12.6332 23.3166 11.3668 22.5355 10.5858L19.7071 7.75735C19.3166 7.36683 18.6834 7.36683 18.2929 7.75735C17.9024 8.14788 17.9024 8.78104 18.2929 9.17157L20.1716 11.0503H13V3.87867L14.7782 5.65683C15.1687 6.04735 15.8019 6.04735 16.1924 5.65683Z"></path> </g></svg>
      </div>

      <a title="Annotations block (Not yet working)" className="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M18 13V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3l3 3l3-3h3a2 2 0 0 0 2-2ZM5 7a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Zm1 3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2H6Z" clip-rule="evenodd"/></svg></a>

      <a title="Open in browser" className="button" href={srcLink} target="_blank"><svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><rect x="3" y="16" width="5" height="5" rx="1"></rect><path d="M4 12v-6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-6"></path><path d="M12 8h4v4"></path><path d="M16 8l-5 5"></path></svg></a>

      <a title="Settings" className="button" ><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="icon" onClick={() => logseq.showSettingsUI()}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg></a>

      <a className="button" type="button" title="Close Viewer" onClick={() => hide()} ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="m7 7l10 10M7 17L17 7"/></svg></a>

    </div>
  );
}

export default Viewer




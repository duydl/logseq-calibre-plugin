import React from 'react'
import "@logseq/libs"
import './Viewer.css'

const Viewer: React.FC<{ srcLink: string}> = ({ srcLink}) => {

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

  return (
    <>
    <div>
      <button type="button" title="Close Viewer" className="close-viewer-button" onClick={() => hide()} ></button>

      <iframe title="epub" className="iframe" src={srcLink} allowFullScreen></iframe>
    </div>
    </>
  );
}

export default Viewer

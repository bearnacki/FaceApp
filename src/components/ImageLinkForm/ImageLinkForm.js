import React from 'react';
import "./ImageLinkForm.css";

const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {
    return (
        <div>
            <p className="f3 dark shadow fw7">
                {'This Magic Brain will detect faces in your pictures'}
            </p>
            <div className="center">
                <div className="form pa4 ma2 br3 shadow-5 light">
                    <input className="f4 pa2 w-70 center" type="text" placeholder="Insert URL" onChange={onInputChange} />
                    <button className="w-30 grow f3 fw5 link ph3 pv2 dib white br4 ba bw2 b--lightest-blue ma2 shadow-5" onClick={onButtonSubmit}>Detect</button>
                </div>
             </div>
        </div>
    );
}


export default ImageLinkForm;
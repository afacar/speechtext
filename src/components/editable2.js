import React, { PureComponent } from 'react';


class Editable2 extends PureComponent {
    render = () => {
        console.log('Editable Rendering...')
        const { index, transcript } = this.props;
        return (
            <span className='editable-content-wrapper' contentEditable='false' suppressContentEditableWarning='true'>
                <span
                    id={'editable-content-' + index}
                    contentEditable='true'
                    suppressContentEditableWarning='true'
                    spellCheck='false'
                    tabIndex={index}
                    ref={(input) => { this.editableRef = input; }}
                >
                    {transcript}
                </span>
            </span>
        )
    }

    componentDidUpdate() {          
    }

}

export default Editable2;
import React, { Component } from 'react';

import Dropzone from '../components/dropzone';
import File from '../components/file';

class FileList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: []
        }
    }
    
    onFileAdded = (file) => {
        this.setState({
            files: [file, ...this.state.files]
        })
    }

    deleteFile = (index) => {
        var { files } = this.state;
        files = files.filter((file, fileIndex) => {
            return fileIndex !== index
        });
        this.setState({
            files
        });
    }

    render() {
        return (
            <div>
                <Dropzone onFileAdded={ this.onFileAdded } />
                <div className='file-list-container'>
                    {
                        this.state.files.map((file, index) => {
                            return (
                                <File
                                    key={ index }
                                    file={{
                                        index,
                                        name: file.name,
                                        size: file.size,
                                        type: file.type
                                    }}
                                    deleteFile={ this.deleteFile }
                                />
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default FileList;
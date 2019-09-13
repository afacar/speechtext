import React, { Component } from 'react';
import { connect } from 'react-redux';

import firebase from '../utils/firebase';
import { getFileList } from '../actions';
import Dropzone from '../components/dropzone';
import File from '../components/file';

class FileList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: []
        }
    }
    
    componentWillReceiveProps({ files }) {
        this.setState({
            files
        })
    }

    onFileAdded = async (file) => {
        var that = this;
        var { name, size, type } = file;
        type = type.split('/')[0];
        var fileObj = {
            name,
            size,
            type
        }
    
        fileObj.createDate = new Date();
        const { id } = await firebase.firestore().collection('userfiles').doc(this.props.user.uid).collection('files')
        .add(fileObj);
        fileObj.file = file;
        fileObj.id = id;
        that.setState({
            files: [fileObj, ...that.state.files]
        });
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
                                    file={ file }
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

const mapStateToProps = ({ user, userFiles }) => {
    return {
        user,
        files: userFiles
    }
}

export default connect(mapStateToProps, { getFileList })(FileList);
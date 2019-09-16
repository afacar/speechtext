import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import firebase from '../utils/firebase';
import { getFileList, setFileToUpload, setSelectedFile } from '../actions';
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
        });
    }

    onFileAdded = async (file) => {
        var { name, size, type } = file;
        var fileObj = {
            originalFile: {
                name,
                size,
                createDate: new Date()
            },
            options: {
                type
            },
            name,
            status: 'INITIAL'
        }

        const { id } = await firebase.firestore().collection('userfiles').doc(this.props.user.uid).collection('files').doc();
        fileObj.file = file;
        fileObj.id = id;

        this.props.setFileToUpload(fileObj);
        this.props.setSelectedFile(fileObj);
    }

    deleteFile = (index) => {
        var { files } = this.state;
        // files = files.filter((file, fileIndex) => {
        //     return fileIndex !== index
        // });
        // this.setState({
        //     files
        // });
    }

    // deleteFile = (index) => {
    //     var { files } = this.props;
    //     files = files.filter((file, fileIndex) => {
    //         return fileIndex !== index
    //     });
    //     this.setState({
    //         files
    //     });
    // }

    onFileSelected = (index) => {
        const { files } = this.state;
        const selectedFile = files[index];
        this.props.setSelectedFile(selectedFile);
    }

    render() {
        return (
            <div>
                <Dropzone onFileAdded={ this.onFileAdded } />
                <div className='file-list-container'>
                    {
                        this.props.files.map((file, index) => {
                            var isSelected = !_.isEmpty(this.props.selectedFile) ? this.props.selectedFile.id === file.id : false;
                            return (
                                <div onClick={ () => { this.onFileSelected(index) } } key={ file.id }>
                                    <File
                                        key={ file.id }
                                        file={ file }
                                        index={ index }
                                        deleteFile={ this.deleteFile }
                                        onSelected={ this.onFileSelected }
                                        isSelected={ isSelected }
                                    />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ user, userFiles, selectedFile }) => {
    return {
        user,
        files: userFiles,
        selectedFile
    }
}

export default connect(mapStateToProps, { getFileList, setFileToUpload, setSelectedFile })(FileList);
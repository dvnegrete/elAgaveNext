'use client';

import { postFormData } from '@/service/fetchAPI';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function CsvUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
        onDrop: (acceptedFiles) => {
            setFile(acceptedFiles[0]);
            setMessage('');
        },
    });

    const uploadFile = async () => {
        if (!file) {
            setMessage('Por favor, selecciona un archivo XLSX primero.');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        console.log(file)
        try {
            const response = postFormData('/api/upload', formData);
            console.log("response =>", response)
        } catch (error) {
            setMessage('Error al subir el archivo');
        }
        setUploading(false);
    };

    return (
        <div className="p-4 border rounded-lg max-w-md mx-auto">
            <div {...getRootProps()} className="p-6 border-2 border-dashed cursor-pointer text-center">
                <input {...getInputProps()} />
                <p>Arrastra y suelta un archivo CSV aquí, o haz clic para seleccionarlo.</p>
            </div>
            {file && <p className="mt-2">Archivo seleccionado: {file.name}</p>}
            <button
                onClick={uploadFile}
                disabled={uploading}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
                {uploading ? 'Subiendo...' : 'Subir Archivo'}
            </button>
            {message && <p className="mt-2 text-red-500">{message}</p>}
        </div>
    );
}